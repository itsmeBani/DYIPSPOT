

import CurrentUserProvider, {CurrentUserContext} from "../Context/CurrentUserProvider";
import Layout from "./layout";
import {StatusBar} from "react-native";

function Index() {


    return (

        <CurrentUserProvider>

            <Layout/>
        </CurrentUserProvider>

    );
}

export default Index;
