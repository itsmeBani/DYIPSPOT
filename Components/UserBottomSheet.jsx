import {Image, ScrollView, StyleSheet, Text, View} from "react-native";
import BottomSheet, {BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {CurrentDriverContext} from "../Context/CurrentDriverProvider";
import React, {useContext, useEffect, useRef, useState} from "react";
import Jeeper from "../assets/dyip.png";
import time from "../assets/time-fast.png"
import passengers from "../assets/users-alt (1).png"
import km from "../assets/tachometer-fastest.png"
import  CurrentlocImage from "../assets/map-marker.png"
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Octicons from '@expo/vector-icons/Octicons';
import {CurrentUserContext} from "../Context/CurrentUserProvider";
const UserBottomSheet = () => {

    const {test} = useContext(CurrentDriverContext)
    const  {BottomSheetRef}=useContext(CurrentUserContext)
    const  [isOpen, setIsOpen] = useState(false)
    return (
        <BottomSheet
            ref={BottomSheetRef}
            snapPoints={['30%', '50%', '60%']}
            enableOverDrag={false}
            index={-1}
            enablePanDownToClose={true}
            onClose={()=>isOpen}
            handleIndicatorStyle={{backgroundColor: "#3083FF"}}
            backgroundStyle={{borderRadius: 30, elevation: 10}}>
            <BottomSheetScrollView contentContainerStyle={UserBottomStyle.contentContainer}>
                <View style={UserBottomStyle.gradientContainer}>

                    <View style={UserBottomStyle.parentdrivercon}>

                        <View style={{display: "flex", flexDirection: "row", gap: 10}}>
                            <View style={UserBottomStyle.driverAvatar}>
                                <Image
                                    style={UserBottomStyle.AvatarImage}
                                    source={Jeeper}
                                />


                            </View>
                            <View style={UserBottomStyle.drivernameLabel}>
                                <Text style={UserBottomStyle.drivernameLabeltext}> Driver</Text>
                                <Text style={UserBottomStyle.drivername}>{test}</Text>

                            </View>

                        </View>

                        <View><Text></Text></View>
                    </View>

                    <View style={UserBottomStyle.StatusContainer}>
                        <IconStatusBox icon={CurrentlocImage}  label={"Current Location"}  txt={"Tagudin Ilocos Sur"} />
                        <IconStatusBox icon={time}  label={"Estimated Arrival Time"} txthighlight={17} txt={"mins"} />
                        <IconStatusBox icon={km}  label={"Speed"} txthighlight={30} txt={"km/h"} />
                        <IconStatusBox icon={passengers}  label={"No of Passengers"} txthighlight={10} txt={"/22"} />
                    </View>

                    <View style={UserBottomStyle.WarningContainer}>
                        <View style={UserBottomStyle.ChildWarningContainer}>

                            <View style={UserBottomStyle.warningtitle}>

                                <Octicons name="info" size={15} color="#1E3FAE" /><Text style={UserBottomStyle.warningtext}>Seat Capacity Alert</Text></View>
                            <View><Text style={UserBottomStyle.warningmessage}>If a larger passenger boards, please be aware that the seating capacity may be affected.</Text></View>
                        </View>

                    </View>

                </View>


            </BottomSheetScrollView>
        </BottomSheet>
    )
}


export default UserBottomSheet;


export  const  IconStatusBox=({icon,label,txthighlight,txt})=>{
    return (
        <View style={UserBottomStyle.StatusChildContainer}>
            <Image
                style={UserBottomStyle.statusIcon}
                source={icon}
            />
            <View>
                <Text style={UserBottomStyle.drivernameLabeltext}>{label}</Text>
                <Text style={UserBottomStyle.drivername}><Text style={UserBottomStyle.txthighlight}>{txthighlight}</Text>{txt}</Text>
            </View>

        </View>
    )
}
const UserBottomStyle = StyleSheet.create({
    contentContainer: {

        position: "relative",
        alignItems: 'center',
        padding: 10,
        display: "flex",
        gap: 5,

    },
    gradientContainer: {
        width: '100%',
        backgroundColor: "#ffffff",
        borderRadius: 10,
        elevation: 0.5,

    },
    driverInfoCard: {
        flex: 0.25,
        height: '100%',
        display: 'flex',
        flexDirection: "row",
        paddingBottom: 5,
        width: '100%',

        justifyContent: "space-between",
        gap: 10,
        paddingHorizontal: 10,
    },
    secondCardcon: {
        flex: 1,
        width: '100%',
        height: '100%',

        backgroundColor: '#fff',
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30
    }
    ,
    driverAvatar: {
        width: 45,
        height: 45,

        borderRadius: 100
    },
    drivernameLabel: {

        display: "flex",
        justifyContent: "center"
    },
    drivernameLabeltext: {

        color: "#555a6a",

        fontSize: 13,

        fontFamily:"PlusJakartaSans-Bold",
    }, drivername: {
        color: "#959595",
        fontSize: 11,
        fontFamily:"PlusJakartaSans-Medium",
        lineHeight: 14,
    },
    txthighlight:{
        fontFamily:"PlusJakartaSans-Bold",
        color: "#3083FF",
    },
    parentdrivercon: {

        alignItems: "center",
        display: 'flex',
        padding: 10,
        paddingHorizontal: 15,
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",
        gap: 8,
    }, drivercontact: {
        fontSize: 11,
        color: "#959595",
    },
    IconCon: {
        flexDirection: "row",
        gap: 8,
        alignItems: "top",
        display: 'flex',
    }, AvatarImage: {
        width: 50,
        height: 50,
    }, ParentstatusLabel: {
        display: 'flex',
        flexDirection: "row",
        gap: 15,
        justifyContent: "center",
        width: "auto"
    }, statusLabel: {}, statusLabelTexttint: {
        color: "#3083FF",
        fontSize: 14,
        fontWeight: "medium",
    }, statusLabelText: {
        color: "#959595",
        fontSize: 14,
        fontWeight: "medium",
    },
    StatusContainer: {

        paddingHorizontal: 32,
        paddingBottom: 15,
        display: "flex",
        gap: 15,
    }, StatusChildContainer: {
        display: "flex",
        flexDirection: "row",
        gap: 10,

        alignItems: "center",
    },
    statusIcon: {
        width: 25,
        height: 25,


    }, WarningContainer: {
        paddingHorizontal: 20,
        paddingBottom: 15,
        display: "flex",


    }, ChildWarningContainer: {
        borderStyle: "solid",
        borderColor: "#1E3FAE",
        borderWidth:1,
        flex: 1,
        width: "100%",
        padding:14,
        borderRadius:10,
        height: "auto",
        backgroundColor: "#DCEBFE"
    },warningtitle:{

        display: "flex",
        flexDirection:"row",
        gap:6,
        alignItems: "center"
    },warningtext:{
        lineHeight:21,
        color:"#1E3FAE",
        letterSpacing:0.2,
        fontFamily:"PlusJakartaSans-Medium",
        fontSize:13,
    },warningmessage:{
        lineHeight:21,
        fontSize:12,
        color:"#1E3FAE",
        letterSpacing:0.3,
        fontFamily:"PlusJakartaSans-Medium",
        paddingHorizontal: 20,
    }
});