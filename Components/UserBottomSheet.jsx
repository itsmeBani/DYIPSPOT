import {ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BottomSheet, {BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";
import {CurrentDriverContext} from "../Context/CurrentDriverProvider";
import React, {useContext, useEffect, useRef, useState} from "react";
import time from "../assets/time-fast.png"
import passengers from "../assets/users-alt (1).png"
import km from "../assets/tachometer-fastest.png"
import CurrentlocImage from "../assets/map-marker.png"
import Octicons from '@expo/vector-icons/Octicons';
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {JeepStatusContext} from "../Context/JeepStatus";
import {db} from "../api/firebase-config";
import {collection, getDocs, onSnapshot, query, where} from "firebase/firestore";
import CachedImage from "react-native-expo-cached-image";
import useReverseGeoCoding from "../CustomHooks/useReverseGeoCoding";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Timeline from "./Timeline";
import Ionicons from '@expo/vector-icons/Ionicons';
import {useSharedValue, withTiming} from "react-native-reanimated";

const UserBottomSheet = () => {
    const {BottomSheetRef} = useContext(CurrentUserContext)
    const [isOpen, setIsOpen] = useState(false)
    const {jeepid, JeepStatusModal, setJeepStatusModal, closeAnimatedModal,} = useContext(JeepStatusContext)
    const [jeepData, setJeepData] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const {Address} = useReverseGeoCoding(longitude, latitude);

    const [loading, setLoading] = useState(true)
    useEffect(() => {

        const fetchDriverData = () => {

            setLoading(true)

            try {
                const driverRef = collection(db, "drivers");
                const driverQuery = query(driverRef, where("id", "==", jeepid));
                const unsubscribe = onSnapshot(driverQuery, async (snapshot) => {
                    if (!snapshot.empty) {
                        const driver = snapshot.docs[0].data();
                        await setLongitude(driver?.longitude);
                        await setLatitude(driver?.latitude);

                        await setJeepStatusModal({
                                speed: driver.speed,
                                currentLocation: [driver?.longitude, driver?.latitude],
                                destination: driver?.endpoint,
                                distance: 0,
                                EstimavetedArrivalTime: 0,
                            }
                        )

                        setJeepData(driver);
                        setLoading(false)
                    } else {
                        setJeepData(null);
                    }
                });
                return () => unsubscribe();
            } catch (error) {
                console.error("Error fetching driver data: ", error);
            } finally {
            }
        };

        if (jeepid) {
            fetchDriverData();
        }
    }, [jeepid]);


    return (
        <>
            <BottomSheet
                ref={BottomSheetRef}
                snapPoints={['30%', '40%', '50%']}
                enableOverDrag={false}

                index={-1}
                enablePanDownToClose={true}
                onClose={() => closeAnimatedModal()}
                handleIndicatorStyle={{backgroundColor: "#3083FF"}}
                backgroundStyle={{borderRadius: 30, elevation: 10}}>
                <BottomSheetScrollView contentContainerStyle={UserBottomStyle.contentContainer}>
                    {!loading ?

                        <View style={UserBottomStyle.gradientContainer}>
                            <View style={UserBottomStyle.parentdrivercon}>

                                <View style={{display: "flex", flexDirection: "row", gap: 10}}>
                                    <View style={UserBottomStyle.driverAvatar}>

                                        {jeepData?.imageUrl && <CachedImage style={UserBottomStyle.AvatarImage}
                                                                            source={{uri: jeepData?.imageUrl}}/>}
                                    </View>
                                    <View style={UserBottomStyle.drivernameLabel}>
                                        <Text style={UserBottomStyle.drivernameLabeltext}> Driver</Text>
                                        <Text
                                            style={UserBottomStyle.drivername}>{jeepData?.name ? jeepData?.name : "..Loading"}</Text>

                                    </View>

                                </View>
                                <View style={UserBottomStyle.contactbtns}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        Linking.openURL('sms:09193758933');
                                    }}>
                                        <View style={UserBottomStyle.callbox}>
                                            <Ionicons name="chatbubble-ellipses-sharp" size={18} color="#fff"/>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        Linking.openURL('tel:09193758933');
                                    }}>
                                        <View style={UserBottomStyle.callbox}>
                                            <FontAwesome6 name="phone" size={18} color="#fff"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>


                            {jeepData?.endpoint !==null && jeepData?.startpoint !==null?
                                <View style={UserBottomStyle.timelinecon}>
                                    <Timeline Startpoint={jeepData?.startpoint} Destination={jeepData?.endpoint}/>
                                </View> : null}

                            <View style={UserBottomStyle.StatusContainer}>
                                <IconStatusBox icon={passengers} label={"No of Passengers"} txthighlight={10}
                                               txt={"/22"}/>
                            </View>

                            <View style={UserBottomStyle.WarningContainer}>
                                <View style={UserBottomStyle.ChildWarningContainer}>

                                    <View style={UserBottomStyle.warningtitle}>

                                        <Octicons name="info" size={15} color="#1E3FAE"/><Text
                                        style={UserBottomStyle.warningtext}>Seat Capacity Alert</Text></View>
                                    <View><Text style={UserBottomStyle.warningmessage}>If a larger passenger boards,
                                        please
                                        be aware that the seating capacity may be affected.</Text></View>
                                </View>

                            </View>

                        </View>: <ActivityIndicator color={"#3083FF"} size={30}/>
                    }
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    )
}


export default UserBottomSheet;


export const IconStatusBox = ({icon, label, txthighlight, txt, customStyle = {}}) => {
    return (
        <View style={[UserBottomStyle.StatusChildContainer, customStyle.container]}>
            {icon && (
                <Image
                    style={[UserBottomStyle.statusIcon, customStyle.icon]}
                    source={icon}
                />
            )}
            <View>
                <Text style={[UserBottomStyle.drivernameLabeltext, customStyle.label]}>{label}</Text>
                <View style={customStyle.margintxt}>
                    <Text
                        style={[
                            UserBottomStyle.drivername,
                            {
                                fontSize: customStyle?.fontSize ?? UserBottomStyle.drivername.fontSize,
                                fontFamily: customStyle?.fontFamily ?? UserBottomStyle.drivername.fontFamily,
                                color: customStyle?.color ?? UserBottomStyle.drivername.color,
                            },
                            customStyle.text
                        ]}><Text style={[UserBottomStyle.txthighlight, customStyle.highlight]}>{txthighlight}</Text>
                     {txt ?? "loading..."}</Text>

                </View>
            </View>
        </View>
    );
};

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

        position: "relative",
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

        fontFamily: "PlusJakartaSans-Medium",
    }, drivername: {
        color: "rgba(88,87,87,0.88)",
        fontSize: 13,
        fontFamily: "PlusJakartaSans-Bold",
    },
    txthighlight: {
        fontFamily: "PlusJakartaSans-Bold",
        color: "#3083FF",
    },
    parentdrivercon: {

        alignItems: "center",
        display: 'flex',
        padding: 10,

        borderStyle: "solid",
        borderColor: "rgba(0,0,0,0.21)",
        borderRadius: 15,

        paddingHorizontal: 20,
        width: "100%",
        justifyContent: "space-between",
        flexDirection: "row",

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
        width: 45,
        borderRadius: 100,
        height: 45,
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
        borderWidth: 1,
        flex: 1,
        width: "100%",
        padding: 14,
        borderRadius: 10,
        height: "auto",
        backgroundColor: "#DCEBFE"
    }, warningtitle: {

        display: "flex",
        flexDirection: "row",
        gap: 6,
        alignItems: "center"
    }, warningtext: {
        lineHeight: 21,
        color: "#1E3FAE",
        letterSpacing: 0.2,
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 13,
    }, warningmessage: {
        lineHeight: 21,
        fontSize: 12,
        color: "#1E3FAE",
        letterSpacing: 0.3,
        fontFamily: "PlusJakartaSans-Medium",
        paddingHorizontal: 20,
    }, callbox: {

        elevation: 4,
        backgroundColor: "#3083FF",

        padding: 8,
        borderRadius: 100
    }, timelinecon: {

        paddingHorizontal: 30,

        display: "flex",


        justifyContent: "center",

    }, contactbtns: {

        display: "flex",
        flexDirection: "row",
        gap: 5
    }
});