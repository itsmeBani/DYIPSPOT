import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, Button, View} from "react-native";
import Animated, {useSharedValue, useAnimatedStyle, withTiming} from 'react-native-reanimated';
import {JeepStatusContext} from "../Context/JeepStatus";
import {IconStatusBox} from "./UserBottomSheet";
import km from "../assets/tachometer-fastest.png"
import CurrentlocImage from "../assets/currentloc.png"
import useReverseGeoCoding from "../CustomHooks/useReverseGeoCoding";
import {SkeletonLoader} from "./Loaders";
import Octicons from "@expo/vector-icons/Octicons";
import {LinearGradient} from "expo-linear-gradient";

function PopUpModal({data, EstimatedArrivalTime, Distance}) {
    const {translateY, closeAnimatedModal, openModal, animatedStyle} = useContext(JeepStatusContext)
    const ConvertedEstimatedArrivalTime = Math.floor(EstimatedArrivalTime / 60);
    const ConvertedDistance = Math.floor(Distance / 1000);
    const currentLocation = data?.currentLocation || [0, 0];
    const {Address} = useReverseGeoCoding(currentLocation[0], currentLocation[1]);
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
                                txthighlight={data?.destination && !Object.keys(data?.destination).length <= 0 && ConvertedEstimatedArrivalTime ? ConvertedEstimatedArrivalTime : 0}

                                customStyle={{
                                    label: {color: "white"},
                                    fontFamily: "PlusJakartaSans-Bold",
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
                                    fontFamily: "PlusJakartaSans-Bold",
                                    highlight: {fontSize: 25, lineHeight: 30, color: "white"},
                                    margintxt: {marginLeft: 10},
                                    color: "white"
                                }}
                                txthighlight={parseInt(data?.speed)}
                                label={"Speed"}
                                txt={"  m/s"}/>

                            <View style={ModalStyle.verticalLine}/>
                        </View>

                        <View style={ModalStyle.box}>
                            <IconStatusBox
                                customStyle={{
                                    label: {color: "white"},
                                    fontFamily: "PlusJakartaSans-Bold",
                                    highlight: {fontSize: 25, lineHeight: 30, color: "white"},
                                    margintxt: {marginLeft: 10},
                                    color: "white"
                                }}
                                txthighlight={data?.destination && !Object.keys(data?.destination).length <= 0 ? ConvertedDistance : 0}
                                label={"Distance"} txt={"  km"}/>


                        </View>


                    </View>

                    {data?.destination && Object.keys(data?.destination).length <= 0 &&
                        <View style={ModalStyle.box}>
                            <View style={ModalStyle.noteCon}>
                                <Octicons name="info" size={17} color="#3083FF"/>
                                <Text style={ModalStyle.noteConTxt}>Driver has not set a destination</Text>
                            </View>

                        </View>
                    }

                    <IconStatusBox
                        customStyle={{
                            label: {color: "white"},
                            margintxt: {color: '#ff'},
                            highlight: {fontSize: 18, lineHeight: 15, color: "white"},
                            fontFamily: "PlusJakartaSans-Medium",
                            fontSize: 12,
                            color: "white"
                        }}
                        icon={CurrentlocImage} label={"Current Location"}
                        txt={Address?.data?.features[0]?.properties?.context?.locality?.name + ", " +
                            "" + Address?.data?.features[0]?.properties?.context?.place?.name + ", " +
                            "" + Address?.data?.features[0]?.properties?.context?.region?.name}/>
                </LinearGradient>
                <Text>


                </Text>
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
        padding: 10,
        borderRadius: 10,
        height: "auto",
        flexDirection: "row",
        gap: 8,
        backgroundColor: "white"


    }, noteConTxt: {
        fontFamily: "PlusJakartaSans-Medium",
        color: "#3083FF",
        fontSize: 11,
    }
});
