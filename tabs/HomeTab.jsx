import React, {useContext, useEffect} from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {collection, doc, onSnapshot} from "firebase/firestore";
import {db} from "../api/firebase-config";
import useFetchLocation from "../CustomHooks/useFetchLocation";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {
    View,
    Text,
    StyleSheet, ScrollView,

} from 'react-native';
import {MapboxPlacesAutocomplete} from "../Components/MapboxPlacesAutocomplete";


function HomeTab(props) {
    const {CurrentUser} = useContext(CurrentUserContext)
    return (
        <>
            <View style={HomeTabStyle.ParentStyle}>
                <View style={HomeTabStyle.GreetingsconTxt}>
                    <Text style={HomeTabStyle.GreetingsTxt}>Hi {CurrentUser?.name}, </Text>
                    <Text
                        style={HomeTabStyle.Greetingspline}>{CurrentUser.role === "passenger" ? "Let’s track your ride!" : "Track your passengers, stay on route!"} </Text>
                </View>

                <ScrollView bounces={true} horizontal={true} showsVerticalScrollIndicator={false}
                            contentContainerStyle={HomeTabStyle.JeepBox}>

                    {/*<View style={HomeTabStyle.subJeepBox}>*/}
                    {/*    <View style={HomeTabStyle.subJeepBoxChild}>*/}
                    {/*        <View style={HomeTabStyle.driverName}><Text style={HomeTabStyle.driverNameheading}>Guillermo Sabado</Text></View>*/}

                    {/*        <View style={HomeTabStyle.jeepdescription}><Text>test</Text></View>*/}

                    {/*    </View>*/}


                    {/*</View>*/}

                    {/*<View style={HomeTabStyle.subJeepBox}>*/}
                    {/*    <View style={HomeTabStyle.subJeepBoxChild}>*/}
                    {/*        <View style={HomeTabStyle.driverName}><Text style={HomeTabStyle.driverNameheading}>Guillermo Sabado</Text></View>*/}

                    {/*        <View style={HomeTabStyle.jeepdescription}><Text>test</Text></View>*/}

                    {/*    </View>*/}


                    {/*</View>*/}

                </ScrollView>


            </View>
        </>
    );
}

export default HomeTab;
const HomeTabStyle = StyleSheet.create({
    ParentStyle: {
        backgroundColor: "white",
        flex: 1,
        gap: 20,

        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    GreetingsTxt: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 20,
        color: "rgba(0,0,0,0.72)"
    }, GreetingsconTxt: {}, Greetingspline: {
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 13,
        color: "rgba(0,0,0,0.68)"
    }, JeepBox: {
        display: "flex",
        gap: 40,
        padding: 2,

    }, subJeepBox: {



        borderRadius: 15,
        backgroundColor: "#3083FF",


    },
    subJeepBoxChild: {

        display: "flex",
        position: "relative",
        flex: 2

    }, jeepdescription: {
        backgroundColor: "white",
        borderTopRightRadius: 15,
        height: "100%",
        borderTopLeftRadius: 15,

    }, driverName: {

        overflow: "hidden",
        paddingHorizontal: 20,
        paddingVertical: 15,
    }, driverNameheading: {

        color: "white",
        letterSpacing: 0.5,
        fontFamily: "PlusJakartaSans-Bold",
    }, test: {

        color: "#6b2cd4"
    }
})

