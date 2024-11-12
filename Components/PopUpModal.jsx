import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, Button, View} from "react-native";
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {JeepStatusContext} from "../Context/JeepStatus";

import km from "../assets/tachometer-fastest.png"
import CurrentlocImage from "../assets/currentloc.png"
import useReverseGeoCoding from "../CustomHooks/useReverseGeoCoding";

import Octicons from "@expo/vector-icons/Octicons";
import {LinearGradient} from "expo-linear-gradient";
import {IconStatusBox} from "./IconStatusBox";
import axios from "axios";
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";
import {CurrentUserContext} from "../Context/CurrentUserProvider";

function PopUpModal() {

    const {CurrentUser} = useContext(CurrentUserContext)
    const {JeepStatusModal, animatedStyle, jeepid} = useContext(JeepStatusContext)

    const [predictAddress, setPredictAddress] = useState(null)
    const ConvertedEstimatedArrivalTime = Math.floor(JeepStatusModal?.distance?.routes[0]?.duration / 60) || 0;
    const ConvertedDistance = Math.floor(JeepStatusModal?.distance?.routes[0]?.distance / 1000) || 0;
    const currentLocation = JeepStatusModal?.currentLocation || [0, 0];
    const {Address, setCoordinates} = useReverseGeoCoding();
    const ConvertedLatestDate = new Date((JeepStatusModal?.LastUpdated?.seconds * 1000 + Math.floor(JeepStatusModal?.LastUpdated?.nanoseconds / 1000000)))
    const MonthDay = ConvertedLatestDate.toLocaleString('en-US', {month: 'short', day: 'numeric'}); // Example: "Oct 25"
    const hours = ConvertedLatestDate.getHours();
    const minutes = ConvertedLatestDate.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const today = new Date();
    const TodayArray = [today.getMonth(), today.getDate(), today.getFullYear()]
    const DriverLatUpdated = [ConvertedLatestDate.getMonth(), ConvertedLatestDate.getDate(), ConvertedLatestDate.getFullYear()]
    const PresentDateFormat = formattedHours + ":" + formattedMinutes + " " + ampm
    const PastDateFormat = MonthDay + ",  " + formattedHours + " " + ":" + formattedMinutes + " " + ampm

    let checkifPresent = {
        today: 0,
        past: 0
    }
    for (let i = 0; i <= DriverLatUpdated.length - 1; i++) {
        if (DriverLatUpdated[i] > TodayArray[i]) {
            checkifPresent.today += 1
        } else if (TodayArray[i] > DriverLatUpdated[i]) {
            checkifPresent.past += 1
        }
    }

    const PredictDestination = async () => {
        try {
            const doc = await getUserDocRefById(jeepid, "drivers");
                const response = await axios.get(`https://predictdestination-2z3l.onrender.com/predict/${doc.id}`);
            setPredictAddress(response.data)
        } catch (error) {
            if (error.response) {
                if (error.response.status === 500) {
                    setPredictAddress(null)


                }
            }
        }
    }

    useEffect(() => {
        if (CurrentUser.role === "passenger"){
            PredictDestination().then()
        }

        setCoordinates({longitude: currentLocation[1], latitude: currentLocation[0]});
    }, [JeepStatusModal])


    return (

        <>

            <Animated.View style={[ModalStyle.ModalContainer, animatedStyle]}>
                <LinearGradient


                    colors={['#48B2FC', '#3297FF', '#1C7FFF']}
                    start={[0, 0]}
                    end={[0, 0.9]}
                    style={ModalStyle.subModalcontainer}>
                    <View style={ModalStyle.StatusCon}>


                        <View style={ModalStyle.box}>

                            <IconStatusBox
                                txthighlight={JeepStatusModal?.destination && !Object.keys(JeepStatusModal?.destination).length <= 0 && ConvertedEstimatedArrivalTime ? ConvertedEstimatedArrivalTime : 0}

                                customStyle={{
                                    label: {color: "white"},
                                    fontFamily: "PlusJakartaSans-ExtraBold",
                                    highlight: {fontSize: 25, lineHeight: 30, color: "white"},
                                    margintxt: {marginLeft: 10},
                                    color: "white"
                                }}
                                label={"Arrival time"} txt={"  min"}/>

                            <View style={ModalStyle.verticalLine}/>
                        </View>
                        <View style={ModalStyle.box}>
                            <IconStatusBox
                                customStyle={{
                                    label: {color: "white"},
                                    fontFamily: "PlusJakartaSans-ExtraBold",
                                    highlight: {fontSize: 25, lineHeight: 30, color: "white"},
                                    margintxt: {marginLeft: 10},
                                    color: "white"
                                }}
                                txthighlight={parseInt(JeepStatusModal?.speed)}
                                label={"Speed"}
                                txt={"  m/s"}/>

                            <View style={ModalStyle.verticalLine}/>
                        </View>

                        <View style={ModalStyle.box}>
                            <IconStatusBox
                                customStyle={{
                                    label: {color: "white"},
                                    fontFamily: "PlusJakartaSans-ExtraBold",
                                    highlight: {fontSize: 25, lineHeight: 30, color: "white"},
                                    margintxt: {marginLeft: 10},
                                    color: "white"
                                }}
                                txthighlight={JeepStatusModal?.destination && !Object.keys(JeepStatusModal?.destination).length <= 0 && ConvertedDistance ? ConvertedDistance : 0}
                                label={"Distance"} txt={"  km"}/>


                        </View>


                    </View>

                    {JeepStatusModal?.destination && Object.keys(JeepStatusModal?.destination).length <= 0 &&
                        <View style={ModalStyle.box}>
                            <View style={ModalStyle.noteCon}>
                                <View style={{flexDirection: "row", gap: 5}}>
                                    <Octicons name="info" size={17} color="#FFAA33"/>
                                    <View style={{paddingRight:10}}>
                                        <Text style={[ModalStyle.noteConTxt,{color: "#FFAA33"}]}>Driver has not set a destination</Text>
                                        <View style={{flexDirection: "row", gap: 5,display:"flex"}}>

                                            {/*<Text style={ModalStyle.noteConTxt}>{!Object.keys(predictAddress).length <= 0 && predictAddress[0]?.startpoint_address?.brgy }</Text>*/}
                                            <Text style={ModalStyle.noteConTxt}>Predicted Destination:  {predictAddress ? predictAddress[1]?.endpoint_address?.brgy + ", " +
                                                predictAddress[1]?.endpoint_address?.city + ", " +
                                                predictAddress[1]?.endpoint_address?.province : "unknown destination "}

                                                </Text>
                                        </View>
                                    </View>
                                </View>

                            </View>

                        </View>
                    }

                    <View style={{display: "flex", flexDirection: "row", gap: 10, justifyContent: "space-between"}}>

                        <IconStatusBox
                            customStyle={{
                                label: {color: "white", fontSize: 11,},
                                margintxt: {color: '#ff'},
                                highlight: {fontSize: 12, lineHeight: 15, color: "white"},
                                fontFamily: "PlusJakartaSans-Medium",
                                fontSize: 11,
                                color: "white"
                            }}
                            icon={CurrentlocImage} label={"Current Location"}
                            txt={Address?.data?.features[0]?.properties?.context?.locality?.name + ", " +
                                "" + Address?.data?.features[0]?.properties?.context?.place?.name + ", " +
                                "" + Address?.data?.features[0]?.properties?.context?.region?.name}/>

                        <IconStatusBox
                            customStyle={{
                                label: {color: "white", fontSize: 11,},
                                margintxt: {color: '#ff'},
                                highlight: {fontSize: 12, lineHeight: 15, color: "white"},
                                fontFamily: "PlusJakartaSans-Medium",
                                fontSize: 11,
                                color: "white"
                            }}
                            label={"Last Updated"}
                            txt={checkifPresent.today > checkifPresent.past ?
                                PresentDateFormat
                                : checkifPresent.today < checkifPresent.past ?
                                    PastDateFormat
                                    : PresentDateFormat}/>
                    </View>

                </LinearGradient>

            </Animated.View>
        </>
    );
}

export default PopUpModal;

const ModalStyle = StyleSheet.create({
    ModalContainer: {
        padding: 5,
        position: 'absolute',
        top: 0,
        display: 'flex',
        gap: 5,

        borderRadius: 15,

        width: "100%",
        flexDirection: 'column',
    }, subModalcontainer: {
        backgroundColor: "#3083FF",
        borderRadius: 10,
        width: "100%",
        gap: 8,
        padding: 15,
        elevation: 4,
        display: "flex",
        flex: 1,

    }, triangle: {
        width: 0,
        height: 0,
        borderLeftWidth: 20,
        borderRightWidth: 20,
        position: "absolute",
        top: 10,
        borderTopWidth: 25,
        borderRightColorColor: "white",
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'blue', // Change the color here
    }, trianglecon: {

        width: "100%",
        backgroundColor: "pink",
        height: 10,
        display: "flex",
        alignItems: 'center',
        justifyContent: 'center',
    }, StatusCon: {

        width: "100%",
        flex: 1,
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between"
    }, box: {

        display: "flex",
        flexDirection: "row",
        alignItems: 'center',

        flex: 1,
        width: "auto",
        position: "relative"


    }, curLoc: {},
    verticalLine: {
        width: 2,  // Set the width of the vertical line
        height: 38,  // Adjust height as needed, '100%' makes it full height of the parent
        backgroundColor: 'rgba(255,255,255,0.68)',  // You can change the color as needed
        // Optional: Add spacing around the line
        alignItems: "flex-end",
        borderRadius: 10,
        position: "absolute",
        right: 0
    }, noteCon: {
        borderStyle: "solid",
        borderColor: "white",
        borderWidth: 1,
        flex: 1,

        width: "100%",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        height: "auto",
        flexDirection: "column",
        gap: 1,
        backgroundColor: "white"


    }, noteConTxt: {
        fontFamily: "PlusJakartaSans-Medium",
        color: "#3083FF",
        fontSize: 11,


    }
});

