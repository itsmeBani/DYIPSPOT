import React, {useContext} from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "../../Context/CurrentUserProvider";
import {PermissionAndTaskManagerContext} from "../../Context/PermissionAndTaskManagerProvider";
import UseSettingContainer from "./UseSettingContainer";
import {Text, TouchableOpacity,StyleSheet, View} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

function LogoutButton(props) {
    const {CurrentUser, setCurrentUser} = useContext(CurrentUserContext)
    const {
        stopBackgroundLocationTask,
        refreshSettings,setrefreshSettings
    } = useContext(PermissionAndTaskManagerContext)
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


    return (
     <View style={{ display: "flex", padding: 10, gap: 10,zIndex:-1}}>

         <UseSettingContainer label={"General"}>


             <View style={BtnLogoutStyele.logoutbtn}>

                 <TouchableOpacity style={BtnLogoutStyele.btncon} onPress={() => {
                     removeitem("UserCredentials").then(setCurrentUser(null))
                 }}>


                     <MaterialIcons name="logout" size={20} color="#f92e2e"/>
                     <Text style={BtnLogoutStyele.logoutbtntxt}>Log out</Text>
                 </TouchableOpacity>
             </View>


         </UseSettingContainer>
     </View>
    );
}

export default LogoutButton;


const BtnLogoutStyele=StyleSheet.create({
    logoutbtn: {

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

    },btncon: {
        display: "flex",
        flexDirection: "row",
        gap: 2
    },

})