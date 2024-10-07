import React, {useContext} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity} from "react-native";
import logo from "../assets/SpeedLoc (2).png"
import UserImg from "../assets/userimg.png"
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import CachedImage from 'react-native-expo-cached-image';
import {useNavigation} from "expo-router";

function Header(props) {
    const navigation = useNavigation();

    const goToSettings = () => {
        navigation.navigate('Settings');
    };

    const {CurrentUser} = useContext(CurrentUserContext)
    return (
        <View style={HeaderStyle.headerContainer}>
            <View>
                <Image source={logo} style={HeaderStyle.logo}/>


            </View>

            <TouchableOpacity onPress={goToSettings} >
                {CurrentUser &&
                    <CachedImage style={HeaderStyle.userImage}
                        source={{ uri: CurrentUser.picture }}
                    />}
            </TouchableOpacity>


        </View>
    );
}

export default Header;
const HeaderStyle = StyleSheet.create({


    headerContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: "row",
        justifyContent: "space-between",
        height: 'auto',
        alignItems: 'center',
        position: "relative"
    },
    logo: {
        height: 15,
        width: 80,
        objectFit: "fill",

    }, userImage: {

        height: 35,
        width: 35,
        objectFit: "fill",
        borderStyle:"solid",
            borderColor:"rgba(54,54,54,0.52)",
            borderWidth:2,
        borderRadius: 30
    },round:{
        borderRadius: 30

    }
})