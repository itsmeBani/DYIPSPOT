import {Image, Text, TouchableOpacity, View,StyleSheet} from "react-native";
import Jeep from "../../assets/jeep.png";
import {LinearGradient} from "expo-linear-gradient";

import React, {useRef} from 'react';
import FormDriverTrackingBottomSheet from "./FormDriverTrckingBottomSheet";

function ApplyNow({RequestBottomSheet,OpenRequestBottomSheet}) {


    return (
<>


    <View style={{ display: "flex", paddingHorizontal: 20, gap: 10,}}>


        <LinearGradient style={ApplyNowStyle.ApplyCard}  colors={['#48B2FC', '#3297FF', '#1C7FFF']}
                        start={[0, 0]}
                        end={[0, 0.9]}>
            <Text style={ApplyNowStyle.ApplyCardtxt}>Start your journey now by becoming a driver who can monitor your jeep's real-time location at all times</Text>

            <View>
                <TouchableOpacity activeOpacity={0.9} onPress={OpenRequestBottomSheet} style={ApplyNowStyle.ApplyCardBtn}>
                    <Text style={ApplyNowStyle.ApplyBtnTxt}>Apply Now!</Text>
                    <Image source={Jeep} style={{height:70, width:50,position:"absolute",right:0}} />
                </TouchableOpacity>
            </View>
        </LinearGradient>

    </View>
    <FormDriverTrackingBottomSheet RequestBottomSheet={RequestBottomSheet} DriverInformation={null}  action={"request"} title={"Request Driver Tracking"} />

</>
    );
}

export default ApplyNow;

const ApplyNowStyle=StyleSheet.create({

    ApplyCard:{
        padding:20,


        borderRadius:10,
        display:"flex",
        gap:12,
        width:"100%",
        elevation:5
    },ApplyCardtxt:{
        fontSize:12,
        color:"white",
        fontFamily:"PlusJakartaSans-Medium"
    },ApplyCardBtn:{
        backgroundColor:"#fff",
        height:40,
        display: "flex",
        elevation:10,
        flexDirection:"row",
        overflow:"hidden",
        borderRadius:50,
        alignItems: "center",
        justifyContent:"center",
    },ApplyBtnTxt:{
        fontFamily:"PlusJakartaSans-Medium",
        color:"#3083FF",
        fontSize:12,
    }

})