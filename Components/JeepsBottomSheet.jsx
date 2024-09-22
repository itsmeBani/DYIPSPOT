import React, {useContext} from 'react';
import BottomSheet, {BottomSheetScrollView, BottomSheetView} from "@gorhom/bottom-sheet";
import {View, StyleSheet, Text, ImageBackground, Image, TouchableOpacity} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import JeepImage from "../assets/jeepbox.jpg"
import {LinearGradient} from "expo-linear-gradient";
import {Images} from "@rnmapbox/maps";
import currentloc from "../assets/map-marker (4).png"
import tracklocation from "../assets/location-crosshairs.png"
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
function JeepsBottomSheet(props) {

    const  {OpenBottomSheet}=useContext(CurrentUserContext)

    return (
        <>

            <BottomSheet
                snapPoints={['22%']}
                enableOverDrag={false}
                handleIndicatorStyle={{backgroundColor: "transparent"}}
                backgroundStyle={{borderRadius: 30, elevation: 0, backgroundColor: "transparent"}}
            >
                <BottomSheetScrollView showsHorizontalScrollIndicator={false} horizontal={true}
                                       contentContainerStyle={JeepsBottomSheetStyle.contentContainer}>


                    <View
                                    style={JeepsBottomSheetStyle.JeeContainer}>
                        <TouchableOpacity activeOpacity={1} onPress={OpenBottomSheet}>

                            <ImageBackground source={JeepImage} resizeMode="cover" style={JeepsBottomSheetStyle.box}>
                            <View

                                    style={JeepsBottomSheetStyle.Gradient}>


                                    <View style={JeepsBottomSheetStyle.JeepTxtCon}>

                                        <Text style={JeepsBottomSheetStyle.boldtext}>Ankel Bani</Text>

                                        <View style={JeepsBottomSheetStyle.iconTxt}>
                                            <Image source={currentloc} style={JeepsBottomSheetStyle.icon}/>
                                            <Text style={JeepsBottomSheetStyle.meduimtext}>Alilem Ilocos sur</Text>
                                        </View>
                                    </View>


                                    <View style={JeepsBottomSheetStyle.icontrack}>
                                        <FontAwesome6 name="location-crosshairs" size={24} color="#3083FF" />
                                    </View>


                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={OpenBottomSheet}>

                            <ImageBackground source={JeepImage} resizeMode="cover" style={JeepsBottomSheetStyle.box}>
                                <View

                                    style={JeepsBottomSheetStyle.Gradient}>


                                    <View style={JeepsBottomSheetStyle.JeepTxtCon}>
                                        <Text style={JeepsBottomSheetStyle.boldtext}>Ankel Bani</Text>

                                        <View style={JeepsBottomSheetStyle.iconTxt}>
                                            <Image source={currentloc} style={JeepsBottomSheetStyle.icon}/>
                                            <Text style={JeepsBottomSheetStyle.meduimtext}>Alilem Ilocos sur</Text>
                                        </View>
                                    </View>


                                    <View style={JeepsBottomSheetStyle.icontrack}>
                                        <FontAwesome6 name="location-crosshairs" size={24} color="#3083FF" />
                                    </View>


                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={1} onPress={OpenBottomSheet}>

                            <ImageBackground source={JeepImage} resizeMode="cover" style={JeepsBottomSheetStyle.box}>
                                <View

                                    style={JeepsBottomSheetStyle.Gradient}>


                                    <View style={JeepsBottomSheetStyle.JeepTxtCon}>
                                        <Text style={JeepsBottomSheetStyle.boldtext}>Ankel Bani</Text>

                                        <View style={JeepsBottomSheetStyle.iconTxt}>
                                            <Image source={currentloc} style={JeepsBottomSheetStyle.icon}/>
                                            <Text style={JeepsBottomSheetStyle.meduimtext}>Alilem Ilocos sur</Text>
                                        </View>
                                    </View>


                                    <View style={JeepsBottomSheetStyle.icontrack}>
                                        <FontAwesome6 name="location-crosshairs" size={24} color="#3083FF" />
                                    </View>


                                </View>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>

                </BottomSheetScrollView>
            </BottomSheet>
        </>
    );
}

export default JeepsBottomSheet;

const JeepsBottomSheetStyle = StyleSheet.create({
    contentContainer: {

        position: "relative",
        alignItems: 'center',
        display: "flex",

        gap: 5,
        width: "auto",
    },
    JeeContainer: {

        display: "flex",
        width: "100%",
        paddingHorizontal: 10, paddingBottom: 10,
        flexDirection: "row",
        height: "100%",
        gap: 10,


    },
    box: {
        width: 185,
        height: "100%",
        overflow: "hidden",
        backgroundColor: "white",
        borderRadius: 15,
        elevation: 3,
        display: "flex",
        justifyContent: "flex-end",

    }, Gradient: {
        width: '100%',

     backgroundColor:"white",

        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    iconTxt: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
    }, boldtext: {
        color: '#605f5f',
        fontSize: 14,
        fontFamily: "PlusJakartaSans-Bold",


    },
    meduimtext: {

        color: '#605f5f',
        fontSize: 12,
        fontFamily: "PlusJakartaSans-Medium",

    },
    icon: {
        width: 18,
        height: 18,
    },

    JeepTxtCon: {
        paddingHorizontal:15,
        paddingVertical:10,
        gap: 3,
        backgroundColor: "white",
    },
    icontrack:{

        padding:10    }
})