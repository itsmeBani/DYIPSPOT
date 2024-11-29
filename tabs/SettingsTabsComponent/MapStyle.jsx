import React, {useContext} from 'react';
import {Image, TouchableOpacity, View, Text} from "react-native";
import streetLayer from "../../assets/layer1.png"
import satelite from "../../assets/layer2.jpg"
import UseSettingContainer from "./UseSettingContainer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "../../Context/CurrentUserProvider";

function MapStyle(props) {
    const {CurrentUser, setCurrentUser,setRefresh,refresh,mapStyle} = useContext(CurrentUserContext)
    const STREET_LAYER="mapbox://styles/mapbox/streets-v12"
    const SATELLITE_LAYER="mapbox://styles/mapbox/satellite-streets-v12"
    const handleMapStyleChange = async (style) => {
        try {
            await AsyncStorage.setItem('mapStyle', style);
            setRefresh(!refresh)
        } catch (error) {
            console.error("Error saving map style to AsyncStorage:", error);
        }
    };


    return (
        <UseSettingContainer label={"Map Style"}>
            <View style={{gap: 10, height: 80, padding: 5, display: "flex", flexDirection: "row"}}>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>handleMapStyleChange(SATELLITE_LAYER)}>
                    <View style={{flex: 1,elevation:3, width: 75, borderRadius: 10, overflow: "hidden"
                        ,borderWidth:mapStyle === SATELLITE_LAYER ? 4 :0,

                        borderColor:mapStyle === SATELLITE_LAYER?"#3083ff":"white"}}>
                        <Image style={{flex: 1, width: 80}} source={satelite}/>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} onPress={()=>handleMapStyleChange(STREET_LAYER)}>
                    <View style={{flex: 1, elevation:3, width: 75, borderRadius: 10
                        ,borderWidth:mapStyle===STREET_LAYER ? 4 :0,
                        borderColor:mapStyle===STREET_LAYER?"#3083ff":"white",
                        overflow: "hidden"}}>
                        <Image style={{flex: 1, width: 80}} source={streetLayer}/>
                    </View>
                </TouchableOpacity>

            </View>
        </UseSettingContainer>
    );
}

export default MapStyle;