import React, {useContext, useState} from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
import {CurrentUserContext} from "../../Context/CurrentUserProvider";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {addDoc, collection, deleteDoc, getDocs, query, serverTimestamp, where} from "firebase/firestore";
import {db} from "../../api/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {PermissionAndTaskManagerContext} from "../../Context/PermissionAndTaskManagerProvider";
import * as Location from 'expo-location';
function PendingOrApproved({status = null, Applicant}) {
    const {CurrentUser, setCurrentUser} = useContext(CurrentUserContext)
    const [loading,setloading]=useState(false)
    const {
        stopBackgroundLocationTask,
        refreshSettings, setrefreshSettings, stopWatchingLocation
    } = useContext(PermissionAndTaskManagerContext)
    const handlePress = async () => {
        if (status.trim().toLowerCase() === "pending" || status === "cancelled") {
            await CancelRequest();
        }

        if (status.trim().toLowerCase() === "approved") {
            await LoginAsDriver()
        }
    };


    const CancelRequest = async () => {
        setloading(true)
        try {
            await deleteDocumentsById(db, "Request", CurrentUser.id);

        } catch (err) {
            console.error("Error cancelling request: ", err);
            setloading(false);
        }finally {
            setloading(false);
        }
    };

    async function deleteDocumentsById(db, tableName, id) {
        try {
            const docRef = collection(db, tableName);
            const q = query(docRef, where("id", "==", id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const deletePromises = querySnapshot.docs.map((doc) => deleteDoc(doc.ref));
                await Promise.all(deletePromises);
                console.log(`Documents from table "${tableName}" with id "${id}" deleted successfully.`);
            } else {
                console.log(`No matching documents found in table "${tableName}" for id "${id}".`);
            }
        } catch (err) {
            console.error(`Error deleting documents from table "${tableName}" for id "${id}":`, err);
        }
    }


    const LoginAsDriver = async () => {
         setloading(true)
        try {
             await stopBackgroundLocationTask()
            await AddNewDriverTracking()
            await deleteDocumentsById(db, "users", CurrentUser?.id)
            await AsyncStorage.removeItem("UserCredentials");
            setCurrentUser(null)
            setloading(false)
            return true;
        } catch (exception) {
            return false;
        }finally {
            setloading(false)
        }
    }


    const AddNewDriverTracking = async () => {
        try {
            const ref = collection(db, "drivers");
            const loc= await Location.getLastKnownPositionAsync()

            const NewDriverData = {
                id: CurrentUser?.id,
                LastUpdated: serverTimestamp(),
                endpoint: {},
                estimatedarrivaltime: "",
                heading: 0,
                address: Applicant?.address,
                imageUrl: Applicant?.profilePictureUrl[0],
                jeepImages: Applicant?.jeepImages,
                latitude: loc?.coords?.latitude,
                jeepName:Applicant?.JeepName,
                longitude:  loc?.coords?.longitude,
                name: Applicant?.firstName + " " + Applicant?.lastName,
                passengers: "",
                phoneNumber: Applicant?.phoneNumber,
                speed: 0,
                forHire:Applicant?.forHire,
                starpoint:{},
                status: "offline",

            }
            console.log(NewDriverData, "s")
            await addDoc(ref, NewDriverData);
            console.log("New Driver added ");
        } catch (e) {
            console.log(e)
        }
    }


    const normalizeStatus = (status) => status?.trim().toLowerCase() || "";

    const getStatusColor = () => {
        switch (normalizeStatus(status)) {
            case "approved":
                return "#F0F9F0FF";
            case "pending":
                return "#fff8e6";
            case "cancelled":
                return "#ffe6e6";
            default:
                return "#fff";
        }
    };

    const getStatusIcon = () => {
        const styles = PendingOrApprovedStyle.icon;
        switch (normalizeStatus(status)) {
            case "approved":
                return <MaterialCommunityIcons style={styles} name="check-decagram" size={20} color="#08c552" />;
            case "pending":
                return <MaterialCommunityIcons style={styles} name="clock-time-five" size={20} color="#FECA5BFF" />;
            case "cancelled":
                return <MaterialCommunityIcons style={styles} name="cancel" size={20} color="#FF5252FF" />;
            default:
                return null;
        }
    };

    const getHighlightColor = () => {
        switch (normalizeStatus(status)) {
            case "approved":
                return "rgba(8,197,82,0.76)";
            case "pending":
                return "#FECA5BFF";
            case "cancelled":
                return "#FF5252FF";
            default:
                return "#feca5b";
        }
    };

    const getStatusText = () => {
        switch (normalizeStatus(status)) {
            case "approved":
                return "approved";
            case "pending":
                return "pending...";
            case "cancelled":
                return "cancelled";
            default:
                return "";
        }
    };

    const getButtonText = () => {
        if (status.trim().toLowerCase() === "approved") return "Login as driver";
        if (status.trim().toLowerCase() === "pending") return "Cancel";
        if (status.trim().toLowerCase() === "cancelled") return "Reapply";
        return "";
    };

    return (
        <View>
            <View style={[PendingOrApprovedStyle.container, {backgroundColor: getStatusColor()}]}>
                <View style={{
                    position: "absolute",
                    width: 7,
                    left: 0,
                    height: 100,
                    backgroundColor: getHighlightColor()
                }}/>
                {getStatusIcon()}
                <View style={{flexDirection: "row", alignItems: "center", gap: 7}}>
                    <View>

                        <Image source={{uri: Applicant?.profilePictureUrl[0]}} style={PendingOrApprovedStyle.avatar}/>
                    </View>
                    <View style={PendingOrApprovedStyle.status}>
                        <Text style={PendingOrApprovedStyle.text}>
                            {(Applicant?.firstName + " " + Applicant?.lastName).length > 17
                                ? (Applicant?.firstName + " " + Applicant?.lastName).slice(0, 17) + "..."
                                : Applicant?.firstName + " " + Applicant?.lastName}
                        </Text>

                        <Text style={[PendingOrApprovedStyle.text, {fontSize: 10}]}>Applying for Jeep tracking</Text>
                        <View style={[PendingOrApprovedStyle.highlight, {backgroundColor: getHighlightColor()}]}>
                            <Text style={PendingOrApprovedStyle.highlighttxt}>{getStatusText()}</Text>
                        </View>
                    </View>
                </View>
                <View style={{display: "flex"}}>
                    <TouchableOpacity disabled={loading} onPress={handlePress}
                                      style={status.trim().toLowerCase() === "approved" ? PendingOrApprovedStyle.approved : PendingOrApprovedStyle.cancel}>
                        {loading ? <ActivityIndicator size="small" color={getHighlightColor()}/>:
                            <Text
                                style={status.trim().toLowerCase() === "approved" ? PendingOrApprovedStyle.approvedtxt : PendingOrApprovedStyle.canceltxt}>{getButtonText()}</Text>


                        }


                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default PendingOrApproved;

const PendingOrApprovedStyle = StyleSheet.create({
    container: {
        overflow: "hidden",
        padding: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        backgroundColor: "#F0F9F0FF",
        elevation: 1,
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 10
    },
    status: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column"
    },
    text: {
        color: "#555a6a",
        fontSize: 12,
        fontFamily: "PlusJakartaSans-Medium",
    },
    highlight: {
        marginTop: 2,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 100,
    },
    highlighttxt: {
        fontSize: 10,
        color: "#ffffff",
        fontFamily: "PlusJakartaSans-Medium",
    },
    cancel: {
        borderWidth: 1.5,
        display: "flex",
        borderColor: "#FF5252FF",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 100,
    },
    canceltxt: {
        fontFamily: "PlusJakartaSans-Medium",
        color: "#FF5252FF",
        fontSize: 10,
    },
    approved: {
        borderWidth: 1.5,
        display: "flex",
        borderColor: "rgba(8,197,82,0.76)",
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 100,
    },
    approvedtxt: {
        fontFamily: "PlusJakartaSans-Medium",
        color: "rgba(8,197,82,0.76)",
        fontSize: 11,
    },
    icon: {
        position: "absolute",
        top: 5,
        right: 5
    }
});
