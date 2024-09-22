import React, {createContext, useEffect, useRef, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CurrentUserContext = createContext({});

function CurrentUserProvider({children}) {
    const [View, setView] = useState("50%")
    const [CurrentUser, setCurrentUser] = useState(null)
    const [token, settoken] = useState("")
    const [refresh, setRefresh] = useState  (false)
    const BottomSheetRef = useRef()
    const camera = useRef(null)

    async function getLocalUserCredentials() {
        AsyncStorage.getItem("UserCredentials").then(async userdata => {
            if (userdata) {
               setCurrentUser(JSON.parse(userdata));

            }
        }).catch(async error => {
            console.error("Error fetching token:", error);
            setCurrentUser(null)
        });
    }

    useEffect(() => {
        // SetUser().then()
        getLocalUserCredentials().then()
    }, [refresh]);


    const OpenBottomSheet = () => {
        BottomSheetRef.current.expand()
        camera.current?.setCamera({
                centerCoordinate: [120.448687, 16.933407],
                pitch: 60,
                zoomLevel: 16,
                animationMode: "flyTo"
            }
        )
    }
    return (
        <CurrentUserContext.Provider value={
            {
                setView,
                View,
                BottomSheetRef,
                OpenBottomSheet,
                setRefresh,
                camera,
                token, settoken, refresh, CurrentUser,setCurrentUser
            }}>
            {children}
        </CurrentUserContext.Provider>
    );
}

export default CurrentUserProvider;