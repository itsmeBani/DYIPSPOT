

import CurrentUserProvider, {CurrentUserContext} from "../Context/CurrentUserProvider";
import Layout from "./layout";
import {StatusBar} from "react-native";
import PermissionAndTaskManagerProvider from "../Context/PermissionAndTaskManagerProvider";

function Index() {


    return (

        <CurrentUserProvider>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"}/>

            <Layout/>
        </CurrentUserProvider>

    );
}

export default Index;
