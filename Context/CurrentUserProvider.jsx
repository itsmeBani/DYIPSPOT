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


    //States for the StatusModal




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
        getLocalUserCredentials().then()
    }, [refresh]);


    const OpenBottomSheet = (lon,lat,heading) => {



        BottomSheetRef.current.snapToIndex(0)
        camera.current?.setCamera({
                centerCoordinate: [lon, lat],
                pitch: 60,
            heading:heading,
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
                token, settoken, refresh, CurrentUser,setCurrentUser,
            }}>
            {children}
        </CurrentUserContext.Provider>
    );
}

export default CurrentUserProvider;