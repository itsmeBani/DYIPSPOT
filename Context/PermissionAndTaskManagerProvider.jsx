import React, {createContext, useContext, useEffect, useRef, useState,} from 'react';
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {CurrentUserContext} from "./CurrentUserProvider";
import {collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db} from "../api/firebase-config";
import {Linking} from "react-native";
import {promptForEnableLocationIfNeeded} from "react-native-android-location-enabler";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const PermissionAndTaskManagerContext = createContext({});
const LOCATION_TASK_NAME = 'background-location-task';

function PermissionAndTaskManagerProvider({children}) {
    const locationSubscription = useRef(null);
    const {CurrentUser} = useContext(CurrentUserContext)
    const defaultLocationref = useRef(null);

    const [LocationSettings, setLocationSettings] = useState(null)
    const [refreshSettings, setrefreshSettings] = useState(false)
    const updateUserLocation = async (locations) => {
        if (CurrentUser && locations) {
            const {id, role} = CurrentUser;

            const updateData = {
                latitude: locations[0]?.coords?.latitude,
                longitude: locations[0]?.coords?.longitude,
            };

            if (role === "passenger") {
                const PassengerDocRef = await getUserDocRefById(id, "users");
                try {
                    await updateDoc(PassengerDocRef, updateData);
                    console.log("foreground Passenger document updated with ID: ", id);
                } catch (e) {
                    console.error("Error updating passenger document: ", e);
                }
            }

            if (role === "driver") {
                const DriverDocRef = await getUserDocRefById(id, "drivers");
                try {
                    const driverUpdateData = {
                        ...updateData,
                        speed: locations[0]?.coords?.speed,
                        heading: locations[0]?.coords?.heading,
                    };
                    await updateDoc(DriverDocRef, driverUpdateData);
                    console.log("Driver document updated with ID: ", id);
                } catch (e) {
                    console.error("Error updating driver document: ", e);
                }
            }
        }
    };


    useEffect(() => {
        TaskManager.defineTask(LOCATION_TASK_NAME, async ({data, error}) => {
            if (error) {
                console.log('Error in background location task :', error.message);
                return;
            }
            if (data) {
                const {locations} = data;
                console.log('Background location data:', locations[0].coords);
                await updateUserLocation(locations)

            }
        });
    }, [])

    async function BackgroundTasking() {

        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
            showsBackgroundLocationIndicator: true,
            activityType: Location.ActivityType.AutomotiveNavigation,
            pausesUpdatesAutomatically: true,
            timeInterval: 3000,
            distanceInterval: 1.5,
            mayShowUserSettingsDialog: true,
            foregroundService: {
                notificationTitle: 'Tracking location',
                notificationBody: 'Tracking your location in the background',
                notificationColor: '#3083FF',
            },
        });
    }

    const StartDefaultLocation = async () => {
        defaultLocationref.current = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                timeInterval: 3000,
                distanceInterval: 1.5,
            },
            (newLocation) => {
                updateUserLocation([newLocation])
            }
        )
    }


    useEffect(() => {
        (async () => {


            try {
                await promptForEnableLocationIfNeeded()
            } catch (e) {
            }


            const {status: foregroundStatus} = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                console.log('Foreground location permission denied.');
                alert('Please enable location services for this app.');
                await Linking.openSettings();
                return;

            }

            const {status: backgroundStatus} = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                console.log('Background location permission denied.');
                alert('Please enable background location services for this app.');
                await Linking.openSettings();
                return;
            }


            AsyncStorage.getItem("isBackgroundLocationEnabled").then(async data => {
                if (JSON.parse(data)) {
                    console.log("foreground is not enabled")
                    await stopWatchingLocation
                    return await BackgroundTasking()
                } else {
                    console.log("Background is not enabled")
                    await stopBackgroundLocationTask()
                    return await StartDefaultLocation()
                }
            }).catch(async error => {
                console.error("Error fetching token:", error);

            });

        })();

        return () => {
            if (locationSubscription.current) {
                locationSubscription.current.remove();

            }
            if (defaultLocationref.current) {
                defaultLocationref.current.remove(); // Stop watching the position

            }

        };
    }, [refreshSettings]);

    const stopBackgroundLocationTask = async () => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (hasStarted) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            console.log("Background location tracking stopped.");
        }
    };
    const stopWatchingLocation = async () => {
        if (defaultLocationref.current) {
            await defaultLocationref.current.remove(); // Stop watching the position
            defaultLocationref.current = null; // Clear the reference
        }
    };

    async function getUserDocRefById(id, tableName) {
        const docRef = collection(db, tableName);
        const querySnapshot = await getDocs(query(docRef, where("id", "==", id)));
        if (!querySnapshot.empty) {
            const docId = querySnapshot.docs[0].id;
            return doc(db, tableName, docId);
        } else {
            throw new Error("User not found");
        }
    }


    return (
        <PermissionAndTaskManagerContext.Provider
            value={{
                stopBackgroundLocationTask,
                LocationSettings,
                setLocationSettings,
                refreshSettings,
                setrefreshSettings
            }}>
            {children}
        </PermissionAndTaskManagerContext.Provider>
    );
}

export default PermissionAndTaskManagerProvider;