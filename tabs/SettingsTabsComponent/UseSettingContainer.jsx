import {Text, View,StyleSheet} from "react-native";
import React from "react";

const UseSettingContainer = ({label, children}) => {

    return (

        <View style={SetingsSectionStyle.SetiingsSection}>
            <View style={SetingsSectionStyle.subSetiingsSection}>
                <Text style={SetingsSectionStyle.SetiingsSectiontxtBold}>{label}</Text>
            </View>
            <View style={SetingsSectionStyle.childrcon}>
                {children}


            </View>

        </View>
    )
}
export  default  UseSettingContainer

const SetingsSectionStyle=StyleSheet.create({


    SetiingsSection: {},
    subSetiingsSection: {
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
    }

})