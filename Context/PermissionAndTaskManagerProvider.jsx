import React, {createContext, useContext, useEffect, useRef, useState,} from 'react';
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import {CurrentUserContext} from "./CurrentUserProvider";
import {addDoc, collection, doc, getDocs, query, serverTimestamp, updateDoc, where} from "firebase/firestore";
import {db} from "../api/firebase-config";
import {Linking} from "react-native";
import {promptForEnableLocationIfNeeded} from "react-native-android-location-enabler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useReverseGeoCoding from "../CustomHooks/useReverseGeoCoding";

export const PermissionAndTaskManagerContext = createContext({});
const LOCATION_TASK_NAME = 'background-location-task';
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";

function PermissionAndTaskManagerProvider({children}) {
    const locationSubscription = useRef(null);
    const {CurrentUser} = useContext(CurrentUserContext)
    const defaultLocationref = useRef(null);
    const [LocationSettings, setLocationSettings] = useState(null)
    const [refreshSettings, setrefreshSettings] = useState(false)

    const {Address, setCoordinates} = useReverseGeoCoding()

    const [placeName, setplaceName] = useState()

    useEffect(() => {
        if (!Address) {
            return
        }
        const COORDINATE_CURRENT_POSITION = {
            latitude: Address?.data?.features[0]?.properties?.coordinates?.latitude,
            longitude: Address?.data?.features[0]?.properties?.coordinates?.longitude,
        }
        const CURRENT_FULLADDRESS =
            Address?.data?.features[0]?.properties?.context?.locality?.name + ", " +
            Address?.data?.features[0]?.properties?.context?.place?.name + ", "
            + Address?.data?.features[0]?.properties?.context?.region?.name

        CheckIfDriverEnteredNewPlace(Address?.data?.features[0]?.properties?.context?.locality?.name, COORDINATE_CURRENT_POSITION, CURRENT_FULLADDRESS)
        }, [Address, placeName]);
    const CheckIfDriverEnteredNewPlace = (CurrentAddress, COORDINATE_CURRENT_POSITION, CURRENT_FULLADDRESS) => {
        if (CurrentUser.role !== "driver") {
            return
        }

        AsyncStorage.getItem("RECENT_ADDRESS").then(async RECENT_ADDRESS => {
            const CURRENT_ADDRESS = CurrentAddress

            if (!RECENT_ADDRESS) {
                await AsyncStorage.setItem("RECENT_ADDRESS", CURRENT_ADDRESS)
                return
            }
            if (CURRENT_ADDRESS === RECENT_ADDRESS) {
                return
            }
            if (CURRENT_ADDRESS !== RECENT_ADDRESS) {
                console.log("entered new location")
                console.log(RECENT_ADDRESS, "---", CURRENT_ADDRESS)
                const DriverDocRef = await getUserDocRefById(CurrentUser?.id, "drivers");
                const travelHistoryRef = collection(db, 'drivers', DriverDocRef.id, 'travelHistory');
                const TravelHistory = {
                    LocalityName: CURRENT_ADDRESS,
                    Date: serverTimestamp(),
                    coordinates: COORDINATE_CURRENT_POSITION,
                    address: CURRENT_FULLADDRESS
                };
                try {

                    await addDoc(travelHistoryRef, TravelHistory);
                    console.log('Travel history added successfully!');
                    await AsyncStorage.setItem("RECENT_ADDRESS", CURRENT_ADDRESS)
                } catch (error) {
                    console.error('Error updating driver document: ', error);
                }


            }

        }).catch(err => {
                console.log(err)
            }
        )
    };


    const updateUserLocation = async (locations) => {
        if (CurrentUser && locations) {
            const {id, role} = CurrentUser;


            await setCoordinates({
                latitude: locations[0]?.coords?.latitude,
                longitude: locations[0]?.coords?.longitude,

            })

            //
            // console.log(await RecentAddress ,"cureent address")

            const PassengerData = {
                latitude: locations[0]?.coords?.latitude,
                longitude: locations[0]?.coords?.longitude,

            };
            const DriverData = {
                latitude: locations[0]?.coords?.latitude,
                longitude: locations[0]?.coords?.longitude,
            };


            if (role === "passenger") {
                const PassengerDocRef = await getUserDocRefById(id, "users");
                try {
                    await updateDoc(PassengerDocRef, PassengerData);
                    console.log("Passenger document updated with ID: ", id);
                } catch (e) {
                    console.error("Error updating passenger document: ", e);
                }
            }

            if (role === "driver") {
                const DriverDocRef = await getUserDocRefById(id, "drivers");
                try {
                    const driverUpdateData = {
                        ...DriverData,
                        speed: locations[0]?.coords?.speed,
                        heading: locations[0]?.coords?.heading,
                        LastUpdated: serverTimestamp(),
                    };
                    await updateDoc(DriverDocRef, driverUpdateData);
                    // CheckIfDriverEnteredNewPlace()
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
            pausesUpdatesAutomatically: false,
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
                console.log(newLocation)
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




    return (
        <PermissionAndTaskManagerContext.Provider
            value={{
                stopBackgroundLocationTask,
                stopWatchingLocation,
                LocationSettings,
                setLocationSettings,
                refreshSettings,
                setrefreshSettings,
            }}>
            {children}
        </PermissionAndTaskManagerContext.Provider>
    );
}

export default PermissionAndTaskManagerProvider;