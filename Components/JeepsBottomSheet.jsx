import React, {useContext, useState} from 'react';
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {View, StyleSheet, Text, ImageBackground, Image, TouchableOpacity} from "react-native";
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

function JeepsBottomSheet(props) {
    const [userLocationData] = useFetchLocation("users");
    const [driverLocationData] = useFetchLocation("drivers");
    const {OpenBottomSheet} = useContext(CurrentUserContext)
    const {JeepStatus, setJeepStatus, jeepid, setJeepid} = useContext(JeepStatusContext)
    const { translateY, closeAnimatedModal, openModal, setIsPassenger, setIsJeeps, hideRouteline, sethideRouteline}=useContext(JeepStatusContext)


    const setJeepStatusAndLocation =async (lon, lat, id, heading) => {

        await setJeepid(id)
        await OpenBottomSheet(lon, lat, heading)
        sethideRouteline(true)
        setIsJeeps(true)
      setIsPassenger(false)
        await openModal()
    }
    return (
        <>

            <BottomSheet
                snapPoints={['22%']}
                enableOverDrag={false}
                handleIndicatorStyle={{backgroundColor: "transparent"}}
                backgroundStyle={{borderRadius: 30, elevation: 0, backgroundColor: "transparent"}}
            >
                <BottomSheetScrollView showsHorizontalScrollIndicator={false} horizontal={true}
                                       contentContainerStyle={JeepsBottomSheetStyle.contentContainer}>

                    <View
                        style={JeepsBottomSheetStyle.JeeContainer}>

                        {driverLocationData?.map(async (driver) => {



                            return (


                                <TouchableOpacity activeOpacity={1}
                                                  onPress={() => setJeepStatusAndLocation(driver?.longitude, driver?.latitude, driver?.id, driver?.heading)}
                                                  key={driver?.id}>

                                    <View style={JeepsBottomSheetStyle.box}>
                                        <Image source={{uri:driver?.imageUrl}} style={JeepsBottomSheetStyle.jeepImage}/>
                                        <View style={JeepsBottomSheetStyle.Gradient}>


                                            <View style={JeepsBottomSheetStyle.JeepTxtCon}>

                                                <Text style={JeepsBottomSheetStyle.boldtext}>{driver?.name}</Text>



                                                <Text style={JeepsBottomSheetStyle.meduimtext}>Alilem Ilocus Sur </Text>


                                            </View>


                                            <View style={JeepsBottomSheetStyle.icontrack}>
                                                <View style={[JeepsBottomSheetStyle.statusJeep,{backgroundColor:driver?.status==="operate"?"#f0f9f0":"#ffbaba"}]}>
                                                    <MaterialIcons name="check-circle-outline" size={14} color={driver?.status==="operate"?"#5dc63e":"#ff5252"} /><Text style={[JeepsBottomSheetStyle.statustxt,{color:driver?.status==="operate"?"#5dc63e":"#ff5252"}]}>{driver?.status}</Text>
                                                </View>
                                                <FontAwesome6 name="location-crosshairs" size={24}
                                                                     color="#3083FF"/>
                                            </View>


                                        </View>
                                    </View>
                                </TouchableOpacity>

                            )


                        })


                        }
                    </View>


                </BottomSheetScrollView>
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

        gap: 5,
        width: "auto",
    },
    JeeContainer: {

        display: "flex",
        width: "100%",
        paddingHorizontal: 10, paddingBottom: 10,
        flexDirection: "row",
        height: "100%",
        gap: 10,


    },
    box: {

        height: "100%",
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


gap:5,
        justifyContent: "space-between",

    }, jeepImage: {
        width: 80,
        borderRadius: 10,
        height: 80
    }, statusJeep: {
        padding: 5,
display:"flex",
        flexDirection:"row",
alignItems: "center",
        backgroundColor: "#f0f9f0",
        borderRadius: 5,
        gap:2,
    }, statustxt: {
textTransform:"capitalize",
        color: "#5dc63e",
        fontSize: 10,
        fontFamily: "PlusJakartaSans-Bold",
    }
})