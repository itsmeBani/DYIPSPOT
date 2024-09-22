import React, {createContext, useEffect, useState} from "react";
import {View} from "react-native";
export const CurrentDriverContext = createContext({});

function CurrentDriverProvider({children}) {
    const  [test,settext]=useState("ANKEL BANI")


    return (
        <CurrentDriverContext.Provider value={{test}}>
            {children}
        </CurrentDriverContext.Provider>
    );
}

export default CurrentDriverProvider;