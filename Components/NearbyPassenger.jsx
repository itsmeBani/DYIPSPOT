import React, {useContext, useEffect, useState} from 'react';
import {LinearGradient} from "expo-linear-gradient";
import {Image, Text, TouchableOpacity, View} from "react-native";
import NearbyPassenger from "../assets/nearbyPassenger.png"
import {JeepStatusContext} from "../Context/JeepStatus";
import useFetchLocation from "../CustomHooks/useFetchLocation";
import * as geolib from "geolib";
import {getRoute} from "../api/DirectionApi";
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";
import {getDoc} from "firebase/firestore";
import {CurrentUserContext} from "../Context/CurrentUserProvider";

function NearbyPassengers(props) {
    const {camera, GotoNearestPassenger,setFallowCurrentUser} = useContext(JeepStatusContext)
    const [userLocationData] = useFetchLocation("users");
    const [driverLocationData] = useFetchLocation("drivers");
    const [PassengerDistance, setPassengerDistance] = useState()
    const FilterCurrentUser = userLocationData?.filter(user => user?.status === "waiting");
    const {CurrentUser} = useContext(CurrentUserContext)

    const [DriverCoordinates, setDriverCoordinates] = useState(null)

    async function NearestPassenger() {
        const users = FilterCurrentUser?.map(user => ({
            latitude: user?.latitude || 0.0,
            longitude: user?.longitude || 0.0,
        })) || [];
        if (users.length === 0) {
            return null;
        }
        const distantUsers = users.filter(user => {
            const distance = geolib.getDistance({latitude: DriverCoordinates?.latitude, longitude: DriverCoordinates?.longitude}, user);
            return distance >= 600;
        });



        return geolib.findNearest(
            {latitude: DriverCoordinates?.latitude, longitude: DriverCoordinates?.longitude},
            distantUsers
        );
    }

    const GetCurrentDriverLocation = async () => {
        try {
            const DriverUserdocRef = await getUserDocRefById(CurrentUser.id, "drivers");
            if (DriverUserdocRef) {
                const userDocSnap = await getDoc(DriverUserdocRef);
                if (userDocSnap.exists()) {
                    setDriverCoordinates({
                        latitude:userDocSnap?.data().latitude,
                        longitude:userDocSnap?.data().longitude
                    });
                }
            }
        } catch (err) {
            console.error('Error fetching user data:', err);

        }
    }

    const HandleNearestPassenger = async () => {
        setFallowCurrentUser(false)
        const nearestPassenger = await NearestPassenger();

      await  GotoNearestPassenger(nearestPassenger.longitude, nearestPassenger.latitude)
    }

    const fetchNearestPassenger = async () => {
        try {
            const nearestPassenger = await NearestPassenger();
            if (!nearestPassenger) {
                return;
            }

            const response = await getRoute(
                [DriverCoordinates?.longitude, DriverCoordinates?.latitude],
                {
                    latitude: nearestPassenger.latitude,
                    longitude: nearestPassenger.longitude,
                }
            );

            if (response?.routes?.[0]?.distance != null) {
                const distance = response.routes[0].distance;

console.log(distance)
                setPassengerDistance(distance);
            } else {
                console.log("Route response does not contain a valid distance.");
            }
        } catch (error) {
            console.log("Error finding nearest passenger:", error);
        }
    };

    useEffect(() => {
        if (userLocationData && driverLocationData) {
            GetCurrentDriverLocation().then()
            fetchNearestPassenger().then();
        }
    }, [userLocationData, driverLocationData]);


    return (
        <TouchableOpacity activeOpacity={0.9} onPress={HandleNearestPassenger}>
            <LinearGradient

                style={{
                    elevation: 7,
                    flexDirection: "row",
                    paddingVertical: 10,
                    alignItems: "center",
                    paddingHorizontal: 15,
                    borderRadius: 10,
                    gap: 10,
                }}
                colors={['#48B2FC', '#3297FF', '#1C7FFF']}
                start={[0, 2]}
                end={[0, 0.1]}
            >
                <Image style={{height: 30, width: 30, objectFit: "contain"}} source={NearbyPassenger}/>
                <View>
                    <View>
                        <Text style={{color: "white", fontSize: 12, fontFamily: "PlusJakartaSans-Medium"}}>
                            Passengers
                            nearby
                        </Text>
                    </View>
                    <View>
                        <Text style={{
                            color: "white",
                            fontFamily: "PlusJakartaSans-ExtraBold",
                            textTransform: "uppercase"
                        }}>
                            <Text style={{
                                fontSize: 17,
                                textTransform: "uppercase",
                                lineHeight: 18,
                            }}>{PassengerDistance ? PassengerDistance > 1000 ? (PassengerDistance / 1000).toFixed(1)   : PassengerDistance?.toFixed(1)

                                : 0}  </Text>{PassengerDistance &&  PassengerDistance > 1000 ? "KM"   : "M"} </Text>
                    </View>

                </View>
                <View>

                </View>

            </LinearGradient>
        </TouchableOpacity>
    );
}

export default NearbyPassengers;