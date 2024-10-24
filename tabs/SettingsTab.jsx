import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import React, {useContext, useEffect, useState} from "react";
import CachedImage from "react-native-expo-cached-image";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Settings_ToggleBackgroundTasking from "./SettingsTabsComponent/Settings_ToggleBackgroundTasking";
import LogoutButton from "./SettingsTabsComponent/LogoutButton";
import ApplyNow from "./SettingsTabsComponent/ApplyNow";
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../api/firebase-config";
import PendingOrApproved from "./SettingsTabsComponent/PendingOrApproved";
import PlaceholderCard from "./SettingsTabsComponent/PlaceholderCard";

export const SettingsTab = (props) => {
    const {CurrentUser, setCurrentUser} = useContext(CurrentUserContext)
    const [AlreadyApply, setAlreadyApply] = useState(false)
    const [isLoading, setLoading] = useState(true)
    const [Applicant, setApplicant] = useState(null); // State to hold fetched user data

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
                return <PendingOrApproved Applicant={Applicant} status={Applicant?.status} />;
            case CurrentUser?.role === "passenger" && !AlreadyApply:
                return <ApplyNow />;
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
                <Settings_ToggleBackgroundTasking/>
                {
                    CurrentUser.role === "passenger" && (
                        <>
                            {isLoading ? <PlaceholderCard /> : renderContent()}
                        </>
                    )
                }

                <LogoutButton/>
            </View>
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
        gap: 10,

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

    }, permissionAndLocation: {}
})