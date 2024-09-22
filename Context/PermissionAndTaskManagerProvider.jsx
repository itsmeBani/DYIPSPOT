import React, {createContext, useContext, useEffect, useRef, useState} from 'react';
import * as Location from "expo-location";
import {Alert} from "react-native";
import * as TaskManager from "expo-task-manager";
import {CurrentUserContext} from "./CurrentUserProvider";
import {collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db} from "../api/firebase-config";

export const PermissionAndTaskManagerContext = createContext({});

function PermissionAndTaskManagerProvider({children}) {
    const [location, setLocation] = useState(null);

    const locationSubscription = useRef(null);
    const {CurrentUser} = useContext(CurrentUserContext)
    const LOCATION_TASK_NAME = 'background-location-task';

    const startBackgroundLocationTask = async () => {
        TaskManager.defineTask(LOCATION_TASK_NAME, async ({data, error}) => {
            if (error) {
                console.log('Error in background location task :', error.message);
                return;
            }
            if (data) {
                const {locations} = data;
                console.log('Background location data:', locations[0].coords);
                setLocation(locations[0].coords);
                if (CurrentUser && locations) {
                    const {id, role} = CurrentUser
                    if (role === "passenger") {
                        const PassengerDocRef = await getUserDocRefById(id, "users");
                        try {

                            await updateDoc(PassengerDocRef, {
                                latitude: locations[0]?.coords?.latitude,
                                longitude: locations[0]?.coords?.longitude
                            });

                            console.log("passenger Document updated with ID: ", id);
                        } catch (e) {
                            console.error("Error updating document: ", e);
                        }
                    }
                    if (role === "driver") {
                        const DriverDocRef = await getUserDocRefById(id, "drivers");
                        try {

                            await updateDoc(DriverDocRef, {
                                latitude: locations[0]?.coords?.latitude,
                                longitude: locations[0]?.coords?.longitude
                            });

                            console.log("driver Document updated with ID: ", id);
                        } catch (e) {
                            console.error("Error updating document: ", e);
                        }
                    }


                }

            }
        });


        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
            accuracy: Location.Accuracy.BestForNavigation,
            showsBackgroundLocationIndicator: true,
            activityType: Location.ActivityType.AutomotiveNavigation,
            pausesUpdatesAutomatically: true,
            timeInterval: 3000,
            distanceInterval: 1.5,
            mayShowUserSettingsDialog: true,
            foregroundService: {
                notificationTitle: 'Title',
                notificationBody: 'Tracking your location in the background',
                notificationColor: '#FF00FF',
            },
        });
    };


    useEffect(() => {
        (async () => {
            const {status: foregroundStatus} = await Location.requestForegroundPermissionsAsync();
            if (foregroundStatus !== 'granted') {
                console.log('Foreground location permission not granted');
                return;
            }

            const {status: backgroundStatus} = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus !== 'granted') {
                console.log('Background location permission not granted');
                Alert.alert(
                    'Background Permission Required',
                    'This app needs background location access to function properly.',
                    [
                        {
                            text: 'Cancel',
                            onPress: () => console.log('Permission denied'),
                            style: 'cancel',
                        },
                        {
                            text: 'Grant Permission',
                            onPress: async () => {
                                const {status: newBackgroundStatus} = await Location.requestBackgroundPermissionsAsync();
                                if (newBackgroundStatus === 'granted') {
                                    await startBackgroundLocationTask(); // Start the background location task if granted
                                } else {
                                    console.log('Background location permission still not granted');
                                }
                            },
                        },
                    ],
                    {cancelable: false}
                );
                return;
            }
            await startBackgroundLocationTask();

        })();
        return () => {
            if (locationSubscription.current) {
                locationSubscription.current.remove();
            }
        };
    }, []);

    const stopBackgroundLocationTask = async () => {
        const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
        if (hasStarted) {
            await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
            console.log("Background location tracking stopped.");
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
        <PermissionAndTaskManagerContext.Provider value={{location, stopBackgroundLocationTask}}>
            {children}
        </PermissionAndTaskManagerContext.Provider>
    );
}

export default PermissionAndTaskManagerProvider;