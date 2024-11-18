import React, {createContext, useContext, useEffect, useRef, useState} from "react";
import {View} from "react-native";
import {useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";

export const JeepStatusContext = createContext({});

function JeepStatusProvider({children}) {
    const [jeepid, setJeepid] = useState(null);
    const [JeepStatus, setJeepStatus] = useState(null);
    const [JeepStatusModal, setJeepStatusModal] = useState({});
    const [FallowCurrentUser,setFallowCurrentUser]=useState(false)
    const [isPassenger, setIsPassenger] = useState(true)
    const [isJeeps, setIsJeeps] = useState(false)
    const [line, setline] = useState()
    const [isClosed, setIsClosed] = useState(false)
    const [hideRouteline, sethideRouteline] = useState(false)
    const translateY = useSharedValue(-300);
    const camera = useRef(null)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}],
        };
    });
    const openModal = () => {
        translateY.value = withTiming(0, {duration: 600});
    };
    const closeAnimatedModal =async () => {
        translateY.value = withTiming(-300, {duration: 200});
        setJeepid(null)

    };

 const FallowDriverLocation= (lon,lat,heading)=>{


     camera.current?.setCamera({
             centerCoordinate: [lon, lat],
             pitch: 60,
             heading:heading,
             zoomLevel: 16,
             animationMode: "flyTo"

         }
     )

 }
    const  GotoNearestPassenger=async (lon,lat)=>{


      await  camera.current?.setCamera({
                centerCoordinate: [lon, lat],
                pitch: 60,

                zoomLevel: 16,
                animationMode: "flyTo"

            }
        )

    }



    return (
        <JeepStatusContext.Provider value={{
            translateY, closeAnimatedModal, animatedStyle,
            JeepStatus, setJeepStatus, jeepid,     openModal, setJeepid, JeepStatusModal, setJeepStatusModal,
            isPassenger, setIsPassenger,
            isJeeps, setIsJeeps,
            line, setline,camera,
            isClosed, setIsClosed,GotoNearestPassenger,
            hideRouteline, sethideRouteline,FallowDriverLocation,FallowCurrentUser,setFallowCurrentUser
        }}>

            {children}
        </JeepStatusContext.Provider>
    );
}

export default JeepStatusProvider;
