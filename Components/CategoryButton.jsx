import React, {useContext, useEffect, useState} from 'react';
import {
    ActivityIndicator,
    AppState,
    Button,
    Image, Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Passengers from "../assets/user-alt2.png"
import * as Location from "expo-location";
import useFetchLocation from "../CustomHooks/useFetchLocation";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {promptForEnableLocationIfNeeded} from "react-native-android-location-enabler";

import {isLocationEnabled} from 'react-native-android-location-enabler';
import {JeepStatusContext} from "../Context/JeepStatus";
import {CurrentUserContext} from "../Context/CurrentUserProvider";


function CategoryButton({Mylocation, setMylocation}) {
    const {camera, setFallowCurrentUser} = useContext(JeepStatusContext)
    const {
        setIsPassenger,
        setIsJeeps,
        isPassenger,
        isJeeps,
        hideRouteline,
        sethideRouteline
    } = useContext(JeepStatusContext)

    function showPassenger() {
        setFallowCurrentUser(false)
        setMylocation(false)
        camera.current?.setCamera({

                centerCoordinate: [120.49737362993602, 16.91644986476775],
                pitch: 70,
                heading: 300,
                zoomLevel: 13,
                animationMode: "flyTo"

            }
        )
        sethideRouteline(true)
        setIsPassenger(true)
        setMylocation(false)
        setIsJeeps(false)
    }

    function showJeeps() {
        setFallowCurrentUser(false)
        setMylocation(false)
        camera.current?.setCamera({

                centerCoordinate: [120.49737362993602, 16.91644986476775],
                pitch: 70,
                heading: 300,
                zoomLevel: 13,
                animationMode: "flyTo"

            }
        )

        if (!isPassenger) {
            return
        }
        sethideRouteline(false)
        setIsJeeps(!isJeeps)
        setMylocation(false)
        setIsPassenger(false)
    }


    const [userLocationData] = useFetchLocation("users");


    const [driverLocationData] = useFetchLocation("drivers");
    const [islocationEnabled, setisLocationEnabled] = useState(false)
    const CategoryButtonTemplate = ({label, children, functionName}) => {
        return (

            <TouchableOpacity activeOpacity={1} onPress={functionName}
                              style={[CategoryButtonStyle.buttonStyle, {backgroundColor: isPassenger && label === "Passengers" ? "#3083FF" : isJeeps && label === "Jeeps" ? "#3083FF" : "white"}]}
            >


                {children}

                <Text
                    style={[CategoryButtonStyle.buttonlabel, {color: isPassenger && label === "Passengers" ? "white" : isJeeps && label === "Jeeps" ? "white" : "rgba(0,0,0,0.74)"}]}>{label}</Text>
            </TouchableOpacity>
        )

    }

    async function handleEnabledPressed() {

        if (Platform.OS === 'android') {
            try {
                const response = await CheckifUserEnabledGps()
                if (response) {
                    setMylocation(!Mylocation)
                 setFallowCurrentUser(true)

                }

            } catch (error) {
                if (error) {
                    console.log("denied")
                }
            }
        }
    }


    const CheckifUserEnabledGps = async () => {

            const enableResult = await promptForEnableLocationIfNeeded();

            if (enableResult === "enabled" || enableResult === "already-enabled") {
                return true
            }


    }


    async function handleCheckPressed() {
        if (Platform.OS === 'android') {
            const checkEnabled = await isLocationEnabled();
            setisLocationEnabled(checkEnabled)
        }
    }

    useEffect(() => {
        handleCheckPressed().then()
    }, [])


    return (
        <View style={CategoryButtonStyle.buttonContainer}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                        contentContainerStyle={CategoryButtonStyle.ScrollBtnContainer}>
                <CategoryButtonTemplate label={"Passengers"} functionName={showPassenger}>


                    <FontAwesome6 name="user-group" size={14} color={isPassenger ? "white" : "#3083FF"}/>
                    <View style={[CategoryButtonStyle.countBox, {backgroundColor: isPassenger ? "white" : "#3083FF"}]}>

                        <Text
                            style={[CategoryButtonStyle.count, {color: isPassenger ? "#3083FF" : "white"}]}>{userLocationData?.length ? userLocationData?.length :
                            <ActivityIndicator size={13} color={isPassenger ? "#3083FF" : "white"}/>}</Text>
                    </View>
                </CategoryButtonTemplate>


                <CategoryButtonTemplate label={"Jeeps"} functionName={showJeeps}>

                    <MaterialCommunityIcons name="jeepney" size={20} color={isJeeps ? "white" : "#3083FF"}/>
                    <View style={[CategoryButtonStyle.countBox, {backgroundColor: isJeeps ? "white" : "#3083FF"}]}>

                        <Text
                            style={[CategoryButtonStyle.count, {color: isJeeps ? "#3083FF" : "white"}]}>{driverLocationData?.length ? driverLocationData?.length :
                            <ActivityIndicator size={13} color={isJeeps ? "#3083FF" : "white"}/>}</Text>
                    </View>

                </CategoryButtonTemplate>

            </ScrollView>

            <View style={CategoryButtonStyle.statusLocation}>

                <TouchableOpacity activeOpacity={1} onPress={handleEnabledPressed}
                                  style={[CategoryButtonStyle.islocation, {backgroundColor: islocationEnabled && Mylocation ? "#3083FF" : "white"}]}>

                    {/*<MaterialIcons name="location-disabled" size={20} color="#605f5f" />*/}


                    {islocationEnabled  && Mylocation ?
                        <MaterialIcons name="my-location" size={20} color={islocationEnabled  && Mylocation?  "white" : "#605f5f"}/> :
                        <MaterialIcons name="location-disabled" size={20}
                                       color={islocationEnabled  && Mylocation ? "white" : "#605f5f"}/>}<Text style={{
                    color: islocationEnabled  && Mylocation? "white" : "#605f5f",
                    fontFamily: "PlusJakartaSans-Medium",
                    fontSize: 12
                }}></Text>

                </TouchableOpacity>


                <TouchableOpacity activeOpacity={1} style={CategoryButtonStyle.weather}>
                    <MaterialCommunityIcons name="weather-cloudy" size={20} color="#605f5f"/>
                    <Text style={CategoryButtonStyle.weathertxt}> 27°</Text>
                </TouchableOpacity>
            </View>

        </View>
    );
}

export default CategoryButton;


const CategoryButtonStyle = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: 5,
        display: 'flex',
        gap: 5,

        flexDirection: 'column',
    },
    buttonStyle: {
        display: 'flex',
        position: "relative",
        flexDirection: "row",
        backgroundColor: "white",
        paddingHorizontal: 14,
        paddingVertical: 7,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        borderRadius: 18,
        elevation: 3,
    }, buttonlabel: {
        display: 'flex',
        fontFamily: "PlusJakartaSans-Medium",
        justifyContent: "center",
        paddingBottom: 1,
        color: "rgba(0,0,0,0.74)"
    },

    ScrollBtnContainer: {
        backgroundColor: "transparent",
        padding: 10,
        display: "flex",
        gap: 7
    },
    buttonicon: {

        width: 15,
        height: 15,
    }, count: {
        fontSize: 10,
        color: "#fff",
        borderStyle: "solid",
        borderColor: "rgba(252,217,54,0.42)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        fontFamily: "PlusJakartaSans-Bold",

    }, countBox: {
        position: "absolute",
        top: -9,
        borderRadius: 100,

        right: -5,
        backgroundColor: "#3083FF",


    }, statusLocation: {
        paddingHorizontal: 12,
        display: "flex",
        flexDirection: "row",
        gap: 7
    }, islocation: {
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 7,
        elevation: 3,
        gap: 2,
        display: "flex",
        flexDirection: "row",
        borderRadius: 10,
        paddingHorizontal: 9,
    }
    , weather: {

        backgroundColor: "#fff",
        paddingVertical: 7,
        display: "flex",
        flexDirection: "row",
        elevation: 3,
        borderRadius: 10,
        gap: 2,
        paddingHorizontal: 9,
        alignItems: "center",
    }, weathertxt: {
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 10,
        color: "#605f5f"
    }
})