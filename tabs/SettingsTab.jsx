import {ActivityIndicator, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import React, {useContext, useEffect, useRef, useState} from "react";
import CachedImage from "react-native-expo-cached-image";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Settings_ToggleBackgroundTasking from "./SettingsTabsComponent/Settings_ToggleBackgroundTasking";
import LogoutButton from "./SettingsTabsComponent/LogoutButton";
import ApplyNow from "./SettingsTabsComponent/ApplyNow";
import {collection, getDoc, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../api/firebase-config";
import PendingOrApproved from "./SettingsTabsComponent/PendingOrApproved";
import PlaceholderCard from "./SettingsTabsComponent/PlaceholderCard";
import {MotiView} from "moti";
import {Easing} from "react-native-reanimated";
import SetUserStatus from "../Components/SetUserStatus";
import SetStatus from "../Components/SetUserStatus";
import UseSettingContainer from "./SettingsTabsComponent/UseSettingContainer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FormDriverTrackingBottomSheet from "./SettingsTabsComponent/FormDriverTrckingBottomSheet";
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";
import MapStyle from "./SettingsTabsComponent/MapStyle";

export const SettingsTab = (props) => {
    const {CurrentUser, setCurrentUser,setRefresh,refresh} = useContext(CurrentUserContext)
    const [AlreadyApply, setAlreadyApply] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [Applicant, setApplicant] = useState(null); // State to hold fetched user data
    const RequestBottomSheet = useRef()
    const [DriverInformation,setDriverInformation]=useState(null)
const [loading,setloading]=useState(false)

    const OpenRequestBottomSheet = () => {
        RequestBottomSheet.current.snapToIndex(0)
    }


console.log(CurrentUser)
    const EditBottomSheet = useRef()
    const OpenEditProfileBottomSheet = async () => {
        setloading(true)
        try {

            const CurrentUserdocRef = await getUserDocRefById(CurrentUser.id, "drivers");
            if (CurrentUserdocRef) {
                const userDocSnap = await getDoc(CurrentUserdocRef);
                if (userDocSnap.exists()) {
                    setDriverInformation(userDocSnap.data());
                    setloading(false)
                    EditBottomSheet.current.snapToIndex(0)
                }
            }
        } catch (err) {
            console.error('Error fetching user data:', err);
            setloading(false)
        }


    }


    useEffect(() => {
        setLoading(true)
        if (CurrentUser?.id) {
            const docRef = collection(db, "Request");
            const q = query(docRef, where("id", "==", CurrentUser.id));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                if (!querySnapshot.empty) {
                    setAlreadyApply(true);
                    const userDoc = querySnapshot.docs[0];
                    setApplicant(userDoc.data());
                } else {
                    setAlreadyApply(false);
                    setApplicant(null);
                }

                setLoading(false)
            });

            return () => unsubscribe();
        }
    }, []);







    const renderContent = () => {
        switch (true) {
            case CurrentUser?.role === "passenger" && AlreadyApply:
                return <PendingOrApproved Applicant={Applicant} status={Applicant?.status}/>;
            case CurrentUser?.role === "passenger" && !AlreadyApply:
                return <ApplyNow OpenRequestBottomSheet={OpenRequestBottomSheet}
                                 RequestBottomSheet={RequestBottomSheet}/>;
        }
    };

    return (

        <GestureHandlerRootView>
            <View style={SettingsStyle.container}>
                <Text style={SettingsStyle.pagename}> Settings</Text>

                <View style={SettingsStyle.profileCOn}>
                    {CurrentUser &&
                        <CachedImage style={SettingsStyle.image}
                                     source={{uri: CurrentUser.picture}}
                        />}

                    <View>
                        <Text style={SettingsStyle.name}>{CurrentUser?.name}</Text>
                        <Text style={SettingsStyle.email}>{CurrentUser?.email}</Text>
                        <Text style={SettingsStyle.role}>{CurrentUser?.role}</Text>
                    </View>

                </View>
               <View style={{paddingHorizontal:10}}>

                   {CurrentUser?.role === "driver" && <UseSettingContainer label={"Profile"}>

                       <TouchableOpacity style={SettingsStyle.edit} onPress={OpenEditProfileBottomSheet}>

                      <View style={{flexDirection:"row",gap:4}}>
                          <MaterialIcons name="drive-file-rename-outline" size={24} color="#555a6a"/>
                          <Text style={SettingsStyle.edittxt}> Personal Information</Text>
                      </View>
                           {loading &&  <ActivityIndicator size="small" color="#3083FF"/>}
                       </TouchableOpacity>

                   </UseSettingContainer>}
               </View>
                          <Settings_ToggleBackgroundTasking/>
                {
                    CurrentUser.role === "passenger" && (
                        <>
                            {isLoading ? <PlaceholderCard/> : renderContent()}
                        </>
                    )
                }
                <View style={{paddingHorizontal:10,paddingTop:4,zIndex:-1}}>
                    <MapStyle/>
                </View>
                <LogoutButton/>


                <View>


                </View>
            </View>
            {CurrentUser?.role === "driver" && <FormDriverTrackingBottomSheet RequestBottomSheet={EditBottomSheet} title={"Edit Driver Profile"} DriverInformation={DriverInformation} action={"update"}/>}
        </GestureHandlerRootView>
    );

};

export default SettingsTab;

const SettingsStyle = StyleSheet.create({

    container: {

        display: "flex",
        backgroundColor: "white",
        height: "100%",
        padding: 10,

    }, image: {

        width: 70,
        height: 70,
        borderRadius: 100

    }, pagename: {
        color: "#555a6a",

        fontSize: 20,

        fontFamily: "PlusJakartaSans-Bold",
    }, profileCOn: {
        padding: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 10,


    }, name: {
        color: "#555a6a",

        fontSize: 15,
        textTransform: "capitalize",
        fontFamily: "PlusJakartaSans-Bold",

    }, email: {
        color: "#555a6a",

        fontSize: 12,

        fontFamily: "PlusJakartaSans-Medium",

    }, role: {
        color: "#555a6a",

        fontSize: 11,
        textTransform: "capitalize",
        fontFamily: "PlusJakartaSans-Medium",

    }, permissionAndLocation: {},
    edit:{
        paddingTop:2,
        gap:3,
        justifyContent:"space-between",
        flexDirection:"row",

    },edittxt:{
        color: "#555a6a",

        fontSize: 13,
        textTransform: "capitalize",
        fontFamily: "PlusJakartaSans-Medium",

    }
})