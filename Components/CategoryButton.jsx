import React from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Passengers from "../assets/user-alt2.png"
import * as Location from "expo-location";

function CategoryButton(props) {


    const CategoryButtonTemplate = ({label, children}) => {
        return (

            <TouchableOpacity activeOpacity={0.8} style={CategoryButtonStyle.buttonStyle} onPress={async () => {
                const {status: newBackgroundStatus} = await Location.requestBackgroundPermissionsAsync();
            }}>


                {children}
                <Text style={CategoryButtonStyle.buttonlabel}>{label}</Text>
            </TouchableOpacity>
        )

    }

    return (
        <View style={CategoryButtonStyle.buttonContainer}>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                        contentContainerStyle={CategoryButtonStyle.ScrollBtnContainer}>
                <CategoryButtonTemplate label={"Passengers"}>

                    {/*<MaterialCommunityIcons name="jeepney" size={20} color="#3083FF"/>*/}
                    <Image source={Passengers} style={CategoryButtonStyle.buttonicon}/>
                </CategoryButtonTemplate>
                <CategoryButtonTemplate label={"Jeeps"}>

                    <MaterialCommunityIcons name="jeepney"   size={20} color="#3083FF"/>

                </CategoryButtonTemplate>

            </ScrollView>

        </View>
    );
}

export default CategoryButton;

const CategoryButtonStyle = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: 5,
        display: 'flex',
        gap: 5,

        flexDirection: 'row',
    },
    buttonStyle: {
        display: 'flex',
        flexDirection: "row",
        backgroundColor: "white",
        paddingHorizontal: 14,
        paddingVertical: 7,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        borderRadius: 18,
        elevation: 3,
    }, buttonlabel: {
        display: 'flex',
        fontFamily: "PlusJakartaSans-Medium",
        justifyContent: "center",
        paddingBottom: 1,
        color:"rgba(0,0,0,0.74)"
    },

    ScrollBtnContainer: {
        backgroundColor: "transparent",
        padding: 10,
        display: "flex",
        gap: 7
    },
    buttonicon: {

        width: 15,
        height: 15 ,
    }

})