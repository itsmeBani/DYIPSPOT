import React, {useEffect} from 'react';
import {View, Text} from "react-native";
import {collection, doc, onSnapshot} from "firebase/firestore";
import {db} from "../api/firebase-config";
import useFetchLocation from "../CustomHooks/useFetchLocation";


function HomeTab(props) {
    // const [LocationData] = useFetchLocation("users")


    return (
        <View style={{backgroundColor: "#fff", flex: 1}}>

            {/*<Text>{JSON.stringify(LocationData)}</Text>*/}

        </View>
    );
}

export default HomeTab;