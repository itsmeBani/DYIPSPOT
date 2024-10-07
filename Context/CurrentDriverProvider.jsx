import React, {createContext, useEffect, useRef, useState} from "react";
import {View} from "react-native";
export const CurrentDriverContext = createContext({});

function CurrentDriverProvider({children}) {
    const  [test,settext]=useState("ANKEL BANI")
    const [view, setView] = useState("90%")
    const BottomSheetRef = useRef()


    const OpenBottomSheet = () => {
        BottomSheetRef.current.expand()
    }
    return (
        <CurrentDriverContext.Provider value={{test,OpenBottomSheet,view,setView,BottomSheetRef}}>
            {children}
        </CurrentDriverContext.Provider>
    );
}

export default CurrentDriverProvider;