import {ActivityIndicator, Image, Linking, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import React, {useContext, useEffect, useState} from "react";
import passengers from "../assets/users-alt (1).png"
import Octicons from '@expo/vector-icons/Octicons';
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {JeepStatusContext} from "../Context/JeepStatus";
import {db} from "../api/firebase-config";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Timeline from "./Timeline";
import Ionicons from '@expo/vector-icons/Ionicons';
import PopUpModal from "./PopUpModal";
import {getRoute} from "../api/DirectionApi";
import {IconStatusBox} from "./IconStatusBox";

const UserBottomSheet = () => {
    const {BottomSheetRef,camera} = useContext(CurrentUserContext)
    const {
        jeepid,
        setJeepStatusModal,
        openModal,
        FallowDriverLocation,
        closeAnimatedModal,
    } = useContext(JeepStatusContext)
    const [jeepData, setJeepData] = useState();
    const [loading, setLoading] = useState(true)
    const fetchDriverData = () => {
        setLoading(true);
        try {

            const driverRef = collection(db, "drivers");
            const driverQuery = query(driverRef, where("id", "==", jeepid));

            return onSnapshot(driverQuery, async (snapshot) => {
                if (!snapshot.empty) {
                    const driver = snapshot.docs[0].data();
                    console.log("Fetching data for jeep ID: ", jeepid);

                  await  setJeepStatusModal({
                        speed: driver?.speed,
                        currentLocation: [driver?.latitude, driver?.longitude],
                        destination: driver?.endpoint,
                        LastUpdated: driver?.LastUpdated,
                        distance: driver?.endpoint && Object.keys(driver?.endpoint).length > 0
                            ? await getRoute([driver?.longitude, driver?.latitude], driver?.endpoint)
                            : null,
                    });

                   await FallowDriverLocation(driver?.longitude, driver?.latitude,driver?.heading)
                     setJeepData(driver);
                    setLoading(false);
                    openModal();

                }
            });
        } catch (error) {
            console.error("Error fetching driver data: ", error);
        }
    };

    useEffect(() => {
        if (!jeepid) return;
        const unsubscribe = fetchDriverData();
        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [jeepid]);


    return (
        <>


            <PopUpModal/>
            <BottomSheet
                ref={BottomSheetRef}
                snapPoints={['40%', '40%', '50%']}
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

                                        {jeepData?.imageUrl &&
                                            <Image style={UserBottomStyle.AvatarImage}
                                                   source={{uri: jeepData?.imageUrl}}/>}


                                    </View>
                                    <View style={UserBottomStyle.drivernameLabel}>
                                        <Text style={UserBottomStyle.drivernameLabeltext}> Driver</Text>
                                        <Text
                                            style={UserBottomStyle.drivername} >{jeepData?.name ? jeepData?.name : "..Loading"}</Text>

                                    </View>

                                </View>
                                <View style={UserBottomStyle.contactbtns}>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        Linking.openURL(`sms:${jeepData?.phoneNumber} `);
                                    }}>
                                        <View style={UserBottomStyle.callbox}>
                                            <Ionicons name="chatbubble-ellipses-sharp" size={18} color="#fff"/>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity activeOpacity={1} onPress={() => {
                                        Linking.openURL(`tel:${jeepData?.phoneNumber}`);
                                    }}>
                                        <View style={UserBottomStyle.callbox}>
                                            <FontAwesome6 name="phone" size={18} color="#fff"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>


                            {jeepData?.endpoint !== null && jeepData?.startpoint !== null ?
                                <View style={UserBottomStyle.timelinecon}>
                                    <Timeline Startpoint={jeepData?.startpoint} Destination={jeepData?.endpoint}/>
                                </View> : null}

                            <View style={UserBottomStyle.StatusContainer}>
                                <IconStatusBox icon={passengers} customStyle={{
                                    container: {
                                        paddingHorizontal: 32,
                                        paddingBottom: 15
                                    },
                                }} label={"No of Passengers"} txthighlight={jeepData?.passengers || 0}
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

                        </View> : <ActivityIndicator color={"#3083FF"} size={30}/>
                    }
                </BottomSheetScrollView>
            </BottomSheet>
        </>
    )
}


export default UserBottomSheet;


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
        width:150,
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
    StatusChildContainer: {
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