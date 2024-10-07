import {Alert, Button, Platform, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {PermissionAndTaskManagerContext} from "../Context/PermissionAndTaskManagerProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {useContext, useEffect, useState} from "react";
import CachedImage from "react-native-expo-cached-image";
import {StatusBar} from 'expo-status-bar';
import * as Location from 'expo-location';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {isLocationEnabled, promptForEnableLocationIfNeeded} from 'react-native-android-location-enabler';

const SettingsTab = (props) => {


    const {CurrentUser, setCurrentUser} = useContext(CurrentUserContext)
    const {
        stopBackgroundLocationTask,
     refreshSettings,setrefreshSettings
    } = useContext(PermissionAndTaskManagerContext)


    const [isEnabled, setIsEnabled] = useState(false);


    const getBackgroundLocationEnabled = async () => {
        try {
            const value = await AsyncStorage.getItem("isBackgroundLocationEnabled");
            if (JSON.parse(value)) {
                setIsEnabled(true)
            }else {
                setIsEnabled(false)
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getBackgroundLocationEnabled().then();
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




    const removeitem = async (key) => {
        await stopBackgroundLocationTask();

        try {

            await AsyncStorage.removeItem(key);
            console.log("remove")
            console.log(CurrentUser)
            setCurrentUser(null)

            return true;
        } catch (exception) {
            return false;
        }
    }

    const UseSettingContainer = ({label, children}) => {

        return (

            <View style={SettingsStyle.SetiingsSection}>
                <View style={SettingsStyle.subSetiingsSection}>
                    <Text style={SettingsStyle.SetiingsSectiontxtBold}>{label}</Text>
                </View>
                <View style={SettingsStyle.childrcon}>
                    {children}


                </View>

            </View>
        )
    }





    return (

        <View style={SettingsStyle.container}>


            <Text style={SettingsStyle.pagename}> Settings</Text>
            {/*<FontAwesome.Button name="home" backgroundColor="red" onPress={()=>{removeitem("UserCredentials").then(setCurrentUser(null))}}>*/}
            {/*    logout*/}
            {/*</FontAwesome.Button>*/}


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

                <UseSettingContainer label={"General"}>


                    <View style={SettingsStyle.logoutbtn}>

                        <TouchableOpacity style={SettingsStyle.btncon} onPress={() => {
                            removeitem("UserCredentials").then(setCurrentUser(null))
                        }}>


                            <MaterialIcons name="logout" size={20} color="#555a6a"/>
                            <Text style={SettingsStyle.logoutbtntxt}>Log out</Text>
                        </TouchableOpacity>
                    </View>


                </UseSettingContainer>
<Text>{isEnabled}</Text>
            </View>

        </View>
    );

};

export default SettingsTab;

const SettingsStyle = StyleSheet.create({

    container: {
        backgroundColor: "white",
        display: "flex",
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

        height: 200,
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
    }

})