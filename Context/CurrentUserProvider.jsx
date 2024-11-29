import React, {createContext, useEffect, useRef, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const CurrentUserContext = createContext({});

function CurrentUserProvider({children}) {
    const [View, setView] = useState("50%")
    const [CurrentUser, setCurrentUser] = useState(null)
    const [mapStyle, setMapStyle] = useState(null)
    const [token, settoken] = useState("")
    const [refresh, setRefresh] = useState  (false)
    const BottomSheetRef = useRef()
    const camera = useRef(null)


    //States for the StatusModal



    // mapStyle
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
    async function getPreferMapStyle() {
        AsyncStorage.getItem("mapStyle").then(async style => {
            if (style) {
                setMapStyle(style);

            }
        }).catch(async error => {
            console.error("Error fetching style:", error);
            setCurrentUser(null)
        });
    }

    useEffect(() => {
        getLocalUserCredentials().then()
        getPreferMapStyle().then()

    }, [refresh]);


    const OpenBottomSheet = () => {



        BottomSheetRef.current.snapToIndex(0)



    }




    return (
        <CurrentUserContext.Provider value={
            {
                setView,
                View,
                BottomSheetRef,
                OpenBottomSheet,
                setRefresh,mapStyle,
                token, settoken, refresh, CurrentUser,setCurrentUser,
            }}>
            {children}
        </CurrentUserContext.Provider>
    );
}

export default CurrentUserProvider;