import React, {createContext, useContext, useState} from "react";
import {View} from "react-native";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

export const JeepStatusContext = createContext({});

function JeepStatusProvider({children}) {
    const [jeepid, setJeepid] = useState(null);
    const [JeepStatus, setJeepStatus] = useState(null);
    const [JeepStatusModal, setJeepStatusModal] = useState({});

    const [isPassenger, setIsPassenger] = useState(false)
    const [isJeeps, setIsJeeps] = useState(true)
    const [line, setline] = useState()

    const [hideRouteline, sethideRouteline] = useState(false)
    const translateY = useSharedValue(-300);
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}],
        };
    });
    const openModal = () => {
        translateY.value = withTiming(0, {duration: 600});
    };
    const closeAnimatedModal =async () => {

        translateY.value = withTiming(-300, {duration: 300});
    };



    return (
        <JeepStatusContext.Provider value={{
            translateY, closeAnimatedModal, openModal, animatedStyle,
            JeepStatus, setJeepStatus, jeepid, setJeepid, JeepStatusModal, setJeepStatusModal,
            isPassenger, setIsPassenger,
            isJeeps, setIsJeeps,
            line, setline,
            hideRouteline, sethideRouteline
        }}>
            {children}
        </JeepStatusContext.Provider>
    );
}

export default JeepStatusProvider;
