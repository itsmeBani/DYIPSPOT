import React, {useContext, useState, useRef} from "react";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar, Text, View, TouchableWithoutFeedback, Image} from "react-native";
import {LinearGradient} from "expo-linear-gradient";

import RenderBottomSheet from "../Components/RenderBottomSheet";
import Map from "../Components/map";
import CurrentDriverProvider from "../Context/CurrentDriverProvider";
import JeepStatusProvider from "../Context/JeepStatus";
import CategoryButton from "../Components/CategoryButton";
import SetStatus from "../Components/SetUserStatus";
import DirectionButton from "../Components/DirectionButton";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import NearbyPassengers from "../Components/NearbyPassenger";


const MapTab = () => {
    const [Mylocation, setMylocation] = useState(false);
    const {CurrentUser} = useContext(CurrentUserContext);


    return (
        <CurrentDriverProvider>
            <SafeAreaProvider>
                <GestureHandlerRootView>
                    <JeepStatusProvider>
                        {/* Detect taps outside of SetStatus to hide it */}

                        <View style={{flex: 1}}>
                            <Map Mylocation={Mylocation}/>

                            <CategoryButton Mylocation={Mylocation} setMylocation={setMylocation}/>

                            {CurrentUser.role === "driver" && (
                                <View style={{
                                    position: 'absolute',
                                    bottom: 10,
                                    right: 0,
                                    width: "100%",
                                    alignItems: "flex-end",
                                    gap: 10,
                                }}>
                                    {/* Toggle SetStatus visibility */}
                                    <SetStatus/>


                                    <View style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        width: "100%",
                                        justifyContent:"flex-end",
                                        paddingLeft: 10,

                                    }}>
                                 <NearbyPassengers/>
                                        <View style={{width: 100}}>
                                            <DirectionButton/>
                                        </View>
                                    </View>
                                </View>
                            )}

                            <RenderBottomSheet/>
                        </View>

                    </JeepStatusProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </CurrentDriverProvider>
    );
};

export default MapTab;
