import React, {useContext, useEffect, useState} from 'react';
import BottomSheet, {BottomSheetFlatList, BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {
    View,
    StyleSheet,
    Text,
    ImageBackground,
    Image,
    TouchableOpacity,
    Button,
    FlatList,
    RefreshControl
} from "react-native";
import JeepImage from "../assets/jeepbox.jpg"
import currentloc from "../assets/map-marker (4).png"
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import useFetchLocation from "../CustomHooks/useFetchLocation";
import * as Location from 'expo-location';
import {JeepStatusContext} from "../Context/JeepStatus";
import useReverseGeoCoding from "../CustomHooks/useReverseGeoCoding";
import SabadoJeep from "../assets/sabadojeep.jpg"
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../api/firebase-config";
import useFetchDriversOnce from "../CustomHooks/useFetchDriversOnce";
import SetStatus from "./SetUserStatus";

function JeepsBottomSheet(props) {

    const {OpenBottomSheet} = useContext(CurrentUserContext)

    const {LocationData: getDriverLocation} = useFetchLocation("drivers")

    const {
        JeepStatus, hideRouteline, sethideRouteline,
        setJeepStatus, jeepid, setJeepid, isPassenger, setIsPassenger,
        isJeeps, setIsJeeps, setFallowCurrentUser
    } = useContext(JeepStatusContext)


    const setJeepStatusAndLocation = async (lon, lat, id, heading) => {
        setFallowCurrentUser(false)
        await OpenBottomSheet()
        await setJeepid(id)
        sethideRouteline(false)
        setIsJeeps(true)
        setIsPassenger(false)
    }
    const refreshJeeps = () => {
        setrefresh(!refresh); // This triggers the fetch hook to reload data
    };

    const {LocationData, loading, error, setrefresh, refresh} = useFetchDriversOnce();
    const renderItem = ({item: driver}) => (
        <TouchableOpacity
            activeOpacity={1}
            onPress={() => setJeepStatusAndLocation(driver?.longitude, driver?.latitude, driver.id, driver?.heading)}
            key={driver?.id}
        >
            <View style={JeepsBottomSheetStyle.box}>
                <Image source={{uri: driver?.jeepImages ? driver?.jeepImages[0]: driver?.imageUrl}} style={JeepsBottomSheetStyle.jeepImage}/>
                <View style={JeepsBottomSheetStyle.Gradient}>
                    <View style={JeepsBottomSheetStyle.JeepTxtCon}>
                        <Text style={JeepsBottomSheetStyle.boldtext}>
                            {driver?.jeepName?.length > 13 ? driver.jeepName.slice(0, 13) + "..." : driver?.jeepName}
                        </Text>
                        <Text style={JeepsBottomSheetStyle.meduimtext}>

                            {driver?.address?.length > 13 ? driver.address.slice(0, 13) + "..." : driver?.address}
                        </Text>
                    </View>
                    <View style={JeepsBottomSheetStyle.icontrack}>
                        <View
                            style={[JeepsBottomSheetStyle.statusJeep, {
                                backgroundColor: driver?.status === "online" ? "#f0f9f0" : driver?.status === "waiting" ? "#fff3c6" : "#ffbaba"
                            }]}
                        >
                            <MaterialIcons name="check-circle-outline" size={14}
                                           color={driver?.status === "online" ? "#34C759" : driver?.status === "waiting" ? "#FFCC00" : "#FF3B30"}/>
                            <Text style={[JeepsBottomSheetStyle.statustxt, {
                                color: driver?.status === "online" ? "#34C759" : driver?.status === "waiting" ? "#FFCC00" : "#FF3B30",
                            }]}>
                                {driver?.status === "online" ? "operate" : driver?.status === "waiting" ? "waiting" : "offline"}
                            </Text>
                        </View>
                        <FontAwesome6 name="location-crosshairs" size={24} color="#3083FF"/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );


    return (
        <>
            <View style={{
                position: 'absolute',
                bottom: 130,
                right: 0,

                alignItems: "center",
                gap: 10,
            }}>
                <SetStatus/>


            </View>
            <BottomSheet
                snapPoints={['22%']}
                enableOverDrag={false}

                enableContentPanningGesture={false}
                handleIndicatorStyle={{backgroundColor: "transparent"}}
                backgroundStyle={{borderRadius: 30, elevation: 0, backgroundColor: "transparent"}}
            >


                <FlatList

                    data={LocationData}
                    renderItem={renderItem}
                    keyExtractor={(driver) => driver?.id}
                    horizontal
                    scrollToOverflowEnabled={true}
                    disableIntervalMomentum={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={JeepsBottomSheetStyle.JeeContainer}

                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refreshJeeps}
                            colors={['#3083FF']} // Change this color to your preferred one

                        />
                    }
                />

            </BottomSheet>


        </>
    );
}

export default JeepsBottomSheet;

const JeepsBottomSheetStyle = StyleSheet.create({
    contentContainer: {

        position: "relative",
        alignItems: 'center',
        display: "flex",
        flexDirection: "column",
        gap: 5,
        width: "auto",
    },
    JeeContainer: {


        paddingHorizontal: 10,
        paddingBottom: 10,
        flexDirection: "row",
        height: "auto",
        alignItems: "flex-end",
        gap: 10,


    },
    box: {


        gap: 10,
        overflow: "hidden",
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 3,
        display: "flex",

        flexDirection: "row",
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: "center",

    }, Gradient: {


        display: "flex",
        flexDirection: "column",

        alignItems: "flex-end",
    },
    iconTxt: {
        display: "flex",
        flexDirection: "row",

    }, boldtext: {
        color: 'rgba(0,0,0,0.79)',
        fontSize: 13,
        fontFamily: "PlusJakartaSans-Bold",


    },
    meduimtext: {

        color: '#605f5f',
        fontSize: 10,
        fontFamily: "PlusJakartaSans-Medium",

    },
    icon: {
        width: 18,
        height: 18,
    },

    JeepTxtCon: {

        paddingVertical: 10,


    },
    icontrack: {
        display: "flex",
        flexDirection: "row",


        gap: 5,
        justifyContent: "space-between",

    }, jeepImage: {
        width: 80,
        borderRadius: 10,
        height: 80
    }, statusJeep: {
        padding: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f0f9f0",
        borderRadius: 5,
        gap: 2,
    }, statustxt: {
        textTransform: "capitalize",
        color: "#5dc63e",
        fontSize: 10,
        fontFamily: "PlusJakartaSans-Bold",
    }
})