import React, {useContext, useEffect, useState} from 'react';
import {
    SafeAreaView,
    Image,
    Text,
    StyleSheet,
    View,
    TouchableOpacity, ActivityIndicator, StatusBar
} from "react-native";
import {} from "@expo-google-fonts/inter"
import Jeeper from "../assets/dyip.png"
import Dyipspot from "../assets/SpeedLoc (1).png"
import * as Google from 'expo-auth-session/providers/google'
import {makeRedirectUri} from "expo-auth-session";

const GOOGLE_ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID
import SpeedImage from "../assets/speed.png"
import passengers from "../assets/passenger.png"
import arrivaltime from "../assets/arrivaltime.png"

import {collection, addDoc, updateDoc, query,setDoc, where, doc, getDocs} from "firebase/firestore";
import {db} from "../api/firebase-config"
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "../Context/CurrentUserProvider";

function WelcomePage(props) {
    const {setRefresh, refresh} = useContext(CurrentUserContext)
    const [isLoading, setisLoading] = useState(false)
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: GOOGLE_ANDROID_CLIENT_ID,
        redirectUri: makeRedirectUri({useProxy: true})
    });





    useEffect(() => {

        handleSignInWithGoogle();
    }, [response])

    const handleSignInWithGoogle = async () => {

        try {

            if (response?.type === "success") {
                setisLoading(true)
                await getUserInfo(response.authentication.accessToken);
                await setisLoading(false)
                setRefresh(!refresh)

            }
        } catch (error) {
            console.error("Error retrieving user data from AsyncStorage:", error);
            await setisLoading(false)
            console.log("try checking your connection")
        }
    }
















    const getUserInfo = async (token) => {
        try {
            const response = await fetch(process.env.EXPO_PUBLIC_GOOGLE_AUTH, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const user = await response.json();
            if (user?.id) {
                const userRef = collection(db, "users");
                const driverRef = collection(db, "drivers");
                const driverQuery = query(driverRef, where("id", "==", user.id));
                const driverSnapshot = await getDocs(driverQuery);

                if (!driverSnapshot.empty) {
                    const docId = driverSnapshot.docs[0].id;
                    try {
                        user.role = "driver";
                        await AsyncStorage.setItem("UserCredentials", JSON.stringify(user));
                        console.log("Driver document updated with ID: ", docId);
                    } catch (e) {
                        console.error("Error updating driver document: ", e);
                    }
                } else {
                    const passengerQuery = query(userRef, where("id", "==", user?.id));
                    const passengerSnapshot = await getDocs(passengerQuery);
                    if (!passengerSnapshot.empty) {
                        const docId = passengerSnapshot.docs[0].id;
                        console.log("Passenger document updated with ID: ", docId);
                        user.role = "passenger";
                        await AsyncStorage.setItem("UserCredentials", JSON.stringify(user));

                    } else {
                       await addDoc(userRef, {
                            id: user?.id,
                            first: user.name,
                            ImageUrl: user.picture,
                            last: user?.given_name,
                            role: "passenger",
                            latitude: null,
                            longitude: null
                        });
                        console.log("Passenger document written with ID: ");
                        user.role = "passenger";
                        await AsyncStorage.setItem("UserCredentials", JSON.stringify(user));

                    }
                }





            }
        } catch (e) {
            console.log("Error:", e);
        }
    };

    return (


        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"}/>
            <View style={styles.Dyipspotlogo}>
                <Image
                    style={styles.Dyipspot}
                    source={Dyipspot}
                />
            </View>
            <View style={styles.JeepImage}>
                <Image
                    style={styles.image}
                    source={Jeeper}
                />
                <Image
                    style={styles.SpeedImage}
                    source={SpeedImage}
                />
                <Image
                    style={styles.passengers}
                    source={passengers}
                />
                <Image
                    style={styles.arrivaltime}
                    source={arrivaltime}
                />

            </View>
            <View style={styles.ContainerCard}>
                <View style={styles.CompanyText}>

                    <Text style={[styles.CompanyName]}>
                        Welcome to <Text style={styles.highlighttext}>DyipSpot</Text>
                    </Text>

                    <Text style={styles.CompanyLine}>
                        Track Your Jeepneys in Real-Time, See Passenger Counts, and Get Instant Vehicle Updates.

                    </Text>

                </View>
                <View style={styles.ContainerButton}>
                    <TouchableOpacity style={styles.Googlebutton} disabled={isLoading} onPress={() => {
                        promptAsync().then()
                    }} activeOpacity={0.7}>

                        {isLoading ? <ActivityIndicator size="small" color="#fff"/> :
                            <Text style={styles.GooglebuttonText}>Let's Get Started</Text>}
                    </TouchableOpacity>
                    <View  style={styles.areyoudrivercon}>
                        <Text style={styles.areyoudriver}>Are you a driver?</Text>
                        <TouchableOpacity activeOpacity={1 }  >
                        <Text style={styles.areyoudriverhighlight}>Apply now</Text>
                        </TouchableOpacity>
                    </View>
                </View>



            </View>


        </SafeAreaView>


    );
}

export default WelcomePage;


const styles = StyleSheet.create({

    container: {
        display: "flex",
        width: "100%",
        gap: 40,
        height: "100%",
        backgroundColor: "#fff"

    },

    JeepImage: {
        height: "50%",
        // borderBottomLeftRadius: 50,
        // borderBottomEndRadius: 50,

        position: "relative",
        justifyContent: "flex-start"
    },

    image: {
        width: "100%",
        height: "100%",

        position: "absolute",
        left: "15%",
        bottom: -100

    },
    ContainerCard: {

        height: "auto",

        display: "flex",
        gap: 30,
        justifyContent: "flex-start",

    },

    ContainerButton: {
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        gap:5,
        paddingHorizontal: 15,
        borderRadius: 10,

    },
    Googlebutton: {
        backgroundColor: '#3083FF', // Google Blue
        padding: 7,
        elevation: 2,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        height: "100%",
        width: "100%",
        paddingHorizontal: 20,
        gap: 0,
        flexDirection: 'row',

    },
    GooglebuttonText: {
        color: '#fff',
        fontSize: 15,
        fontFamily: "PlusJakartaSans-Medium",

    },
    Googleicon: {

        borderRadius: 6,
        width: 50,
        height: "100%",
        objectFit: "contain"
    },


    CompanyText: {
        display: "flex",
        gap: 14,
        paddingHorizontal: 18
    },
    CompanyName: {

        textAlign: "center",
        fontSize: 25,
        fontFamily: 'PlusJakartaSans-Bold',

        color: "rgb(60,60,60)"

    }, CompanyLine: {
        textAlign: "center",

        fontFamily: 'PlusJakartaSans-Medium',
        color: "rgba(60,60,60,0.78)"

    }, Dyipspotlogo: {

        height: 90,

    }, Dyipspot: {
        width: "100%",
        height: "100%",
        objectFit: "contain"
    },
    highlighttext: {
        color: "#3083FF"
    },
    SpeedImage: {

        width: 120,
        height: 120,
        right: 20,
        position: "absolute",
        top: 100,
        objectFit: "contain"
    }, passengers: {
        width: 170,
        height: 170,
        right: 70,
        position: "absolute",
        top: -10,
        zIndex: -30,
        objectFit: "contain"

    }, arrivaltime: {
        width: 110,
        height: 110,
        left: 60,
        position: "absolute",
        bottom: 160,
        objectFit: "contain"
    },areyoudriver:{
        textAlign: "center",
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',

        color: "rgb(81,81,81)"


    },areyoudriverhighlight:{

        display:"flex",
        justifyContent:"flex-end",
        alignItems: "flex-end",
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
        textAlign: "center",
        color: "#3083FF",
        textDecorationLine:"underline"
    },areyoudrivercon:{
display:"flex",
        flexDirection:"row",
gap:2

}})