import RenderBottomSheet from "../Components/RenderBottomSheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Map from "../Components/map";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CurrentDriverProvider from "../Context/CurrentDriverProvider";
import {StatusBar, Text, View} from "react-native";
import JeepStatusProvider  from "../Context/JeepStatus";
import CategoryButton from "../Components/CategoryButton";
import SetStatus from "../Components/SetUserStatus";
import DirectionButton from "../Components/DirectionButton";
import React, {useContext, useState} from "react";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import WeatherIndicator from "../Components/WeatherIndicator";
import RouteInfoBox from "../Components/RouteInfoBox";

const MapTab = () => {
    const [Mylocation,setMylocation]=useState(false)
    const {CurrentUser} =useContext(CurrentUserContext)
    return (
        <CurrentDriverProvider>
            <SafeAreaProvider>
                <GestureHandlerRootView>
                    <JeepStatusProvider>
                        <Map Mylocation={Mylocation}/>

                      <CategoryButton  Mylocation={Mylocation} setMylocation={setMylocation}
                      />

                        {CurrentUser.role === "driver" &&
                            <View style={{ position: 'absolute',
                                bottom:10,
                                backgroundColor:"pink",
                                right: 0,
                                width:"100%",
                                alignItems:"flex-end",
                                gap:10,
                            }}>


                                <SetStatus/>
                            <View style={{flex:1,backgroundColor:"blue", flexDirection:"row",width:"100%"}}>
                                <View style={{flex:1 ,backgroundColor:"green"}} ><Text>hjaja</Text></View>
                                <DirectionButton/>
                            </View>
                            </View>
                        }






                        <RenderBottomSheet/>
                    </JeepStatusProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </CurrentDriverProvider>

    );
};
export default MapTab;
