import React, {useContext, useEffect, useRef, useState} from 'react';
import {Image, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import CachedImage from "react-native-expo-cached-image";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {LinearGradient} from "expo-linear-gradient";
import Jeep from "../../assets/jeep.png";
import {CurrentUserContext} from "../../Context/CurrentUserProvider";
import {PermissionAndTaskManagerContext} from "../../Context/PermissionAndTaskManagerProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UseSettingContainer from "./UseSettingContainer"

function Settings_ToggleBackgroundTasking(props) {


    console.log("rendering Settings")
    const {CurrentUser, setCurrentUser} = useContext(CurrentUserContext)
    const {
        stopBackgroundLocationTask,
        refreshSettings, setrefreshSettings
    } = useContext(PermissionAndTaskManagerContext)


    const [isEnabled, setIsEnabled] = useState(false);


    const getBackgroundLocationEnabled = async () => {
        try {
            const value = await AsyncStorage.getItem("isBackgroundLocationEnabled");
            if (JSON.parse(value)) {
                setIsEnabled(true)
            } else {
                setIsEnabled(false)
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBackgroundLocationEnabled().then();
        console.log("rendering")
    }, [refreshSettings]);


    const toggleSwitch = async (value) => {
        try {
            await AsyncStorage.setItem("isBackgroundLocationEnabled", JSON.stringify(value));
            setrefreshSettings(!refreshSettings)

            console.log(value)
        } catch (e) {
            console.log(e)
        }
    }


    return (


        <View style={SettingsStyle.permissionAndLocation}>

            {CurrentUser?.role === "driver" && <UseSettingContainer label={"Profile"}>
                <TouchableOpacity style={SettingsStyle.logoutbtn}>

                    <MaterialIcons name="drive-file-rename-outline" size={20} color="#555a6a"/>

                    <Text> Personal Information</Text>
                </TouchableOpacity>


            </UseSettingContainer>}


            <UseSettingContainer label={"Personalization"}>
                <View style={SettingsStyle.switchcon}>
                    <Text style={SettingsStyle.switchcontxt}>
                        Enable background location tracking for real-time updates, even when the app is closed. For
                        drivers, this is required to ensure accurate tracking at all times.</Text>

                    <Switch
                        trackColor={{false: '#767577', true: '#3083FF'}}
                        thumbColor={'#f4f3f4'}
                        onValueChange={(value) => toggleSwitch(value)}
                        value={isEnabled}
                    />


                </View>


            </UseSettingContainer>


        </View>


    );
}

export default Settings_ToggleBackgroundTasking;

const SettingsStyle = StyleSheet.create({

    container: {

        display: "flex",
        backgroundColor: "white",
        flex: 1,
        padding: 10,
        gap: 15,

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

    }, permissionAndLocation: {


        display: "flex",
        padding: 10,
        gap: 10,

    }, SetiingsSection: {}, subSetiingsSection: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

    }, SetiingsSectiontxtBold: {
        color: "rgba(0,0,0,0.76)",

        fontSize: 15,
        textTransform: "capitalize",
        fontFamily: "PlusJakartaSans-Bold",

    }, childrcon: {
        paddingHorizontal: 17
    }, logoutbtn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",

        padding: 10,
        width: "auto",
        gap: 5,
    }, logoutbtntxt: {
        color: "#f92e2e",

        fontSize: 13,

        fontFamily: "PlusJakartaSans-Medium",

    }, switchcon: {

        alignItems: "center",
        flexDirection: "row",
        gap: 20,
        justifyContent: "space-between",
        display: "flex"
    }, switchcontxt: {
        fontSize: 13,
        fontFamily: "PlusJakartaSans-Medium",
        textAlign: "justify",
        flex: 1,
        letterSpacing: 0.01,
        color: "rgba(85,90,106,0.76)",
    }, btncon: {
        display: "flex",
        flexDirection: "row",
        gap: 2
    },

})