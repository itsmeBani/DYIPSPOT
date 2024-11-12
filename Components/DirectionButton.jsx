import React, {useContext} from 'react';
import {TouchableOpacity, Text, View, StyleSheet} from "react-native";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {CurrentDriverContext} from "../Context/CurrentDriverProvider";
import {MotiView} from "moti";
import {Easing} from "react-native-reanimated";
function DirectionButton(props) {
    const {OpenBottomSheet,view}=useContext(CurrentDriverContext)
    return (
        <View style={btnStyle.directionBtnStyle}>
            <TouchableOpacity activeOpacity={1} style={btnStyle.btnmain} onPress={OpenBottomSheet}>
                <FontAwesome5 name="route" size={24} color="#fff"  />
            </TouchableOpacity>

        </View>
    );
}

export default DirectionButton;
const btnStyle = StyleSheet.create({

    directionBtnStyle: {
alignItems:"center"
    },btnmain:{

        backgroundColor:"#3083FF",
padding:16,
        borderRadius:13,
        elevation:3 ,
    }
})