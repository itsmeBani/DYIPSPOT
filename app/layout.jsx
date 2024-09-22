import React, {useEffect} from 'react';
import IndexTab from "../tabs/indexTab";
import WelcomePage from "../Components/WelcomePage";

import  {CurrentUserContext} from "../Context/CurrentUserProvider";
import {useContext} from "react";
import MapTab from "../tabs/MapTab";
import {useFonts} from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import PermissionAndTaskManagerProvider from "../Context/PermissionAndTaskManagerProvider";

function Layout(props) {
    const {token,CurrentUser,}=useContext(CurrentUserContext)
    const [loaded, error] = useFonts({
        'PlusJakartaSans-Bold': require('../assets/fonts/PlusJakartaSans-ExtraBold.ttf'),
        'PlusJakartaSans-BoldItalic': require('../assets/fonts/PlusJakartaSans-BoldItalic.ttf'),
        'PlusJakartaSans-Medium': require('../assets/fonts/PlusJakartaSans-Medium.ttf'),
        'PlusJakartaSans-SemiBold': require('../assets/fonts/PlusJakartaSans-SemiBold.ttf'),
        'PlusJakartaSans-Light': require('../assets/fonts/PlusJakartaSans-Light.ttf'),
        'PlusJakartaSans-Regular': require('../assets/fonts/PlusJakartaSans-Regular.ttf'),
        'Barlow-ExtraBoldItalic': require('../assets/fonts/Barlow-ExtraBoldItalic.ttf'),
    });


    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }
    return (
       <>
           {CurrentUser?<IndexTab/>:<WelcomePage/>}
       </>
    );
}

export default Layout;

