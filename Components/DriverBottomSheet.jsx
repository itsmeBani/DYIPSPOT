import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert, ScrollView} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {CurrentDriverContext} from '../Context/CurrentDriverProvider';

import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import {collection, getDocs, updateDoc, query, where, doc} from "firebase/firestore";
import {db} from "../api/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {MapboxPlacesAutocomplete} from "./MapboxPlacesAutocomplete";


function DriverBottomSheet(props) {
    const [startPoint, setStartPoint] = useState(null);
    const [destination, setDestination] = useState(null);
    const {BottomSheetRef} = useContext(CurrentDriverContext);

    const {camera, CurrentUser} = useContext(CurrentUserContext)


    const HandleSubmitRoute = async () => {
        if (startPoint && destination) {
            const driverRef = collection(db, "drivers");
            const driverQuery = query(driverRef, where("id", "==", CurrentUser?.id));
            const driverSnapshot = await getDocs(driverQuery);
            if (!driverSnapshot.empty) {
                const docId = driverSnapshot.docs[0].id;
                try {
                    await updateDoc(doc(db, "drivers", docId), {
                        startpoint: startPoint?.features[0]?.properties?.coordinates,
                        endpoint: destination?.features[0]?.properties?.coordinates,
                    })
                } catch (e) {
                    console.error("Error updating driver document: ", e);
                } finally {
                    setStartPoint(null)
                    setDestination(null)
                }

            }
        } else {
            alert("invalid")
        }
    }



    //temporary suggested  =====> convert this to analysis
    const SuggestedPlace = () => {
        return (
            <ScrollView horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={DriverBottomSheetStyle.suggestionList}>
                <TouchableOpacity activeOpacity={1} style={DriverBottomSheetStyle.suggestionCon}>
                    <SimpleLineIcons name="location-pin" size={15} color="#605f5f"/>
                    <Text style={DriverBottomSheetStyle.placetxt}>Alilem, Ilocos Sur</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={1} style={DriverBottomSheetStyle.suggestionCon}>
                    <SimpleLineIcons name="location-pin" size={15} color="#605f5f"/>
                    <Text style={DriverBottomSheetStyle.placetxt}>Tagudin, Ilocos Sur</Text>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={1} style={DriverBottomSheetStyle.suggestionCon}>
                    <SimpleLineIcons name="location-pin" size={15} color="#605f5f"/>
                    <Text style={DriverBottomSheetStyle.placetxt}>Sudipen, La Union</Text>
                </TouchableOpacity>
            </ScrollView>
        )
    }
    return (
        <BottomSheet
            snapPoints={['90%']}
            enableOverDrag={false}
            enableContentPanningGesture={false}
            index={-1}
            enableHandlePanningGesture={true}
            ref={BottomSheetRef}
            enablePanDownToClose={true}
            handleIndicatorStyle={{backgroundColor: '#3083FF'}}
            backgroundStyle={{borderRadius: 30, elevation: 0, backgroundColor: '#fff'}}>
            <ScrollView showsHorizontalScrollIndicator={false} style={DriverBottomSheetStyle.contentContainer}>

                <Text style={DriverBottomSheetStyle.headerText}>Set Route</Text>
                <View style={DriverBottomSheetStyle.inputContainer}>
                    <View style={{paddingHorizontal: 20}}>
                        <Text style={DriverBottomSheetStyle.label}>Start Point</Text>

                        <MapboxPlacesAutocomplete
                            id="origin"
                            placeholder="My location"
                            onPlaceSelect={(data) => {
                                console.log(data)
                            }}
                            onClearInput={({id}) => {
                            }}
                            containerStyle={{}}
                        />

                        <Text style={DriverBottomSheetStyle.h}>Suggested place:</Text>

                    </View>
                    <SuggestedPlace/>

                    <View style={{paddingHorizontal: 20}}>
                        <Text style={DriverBottomSheetStyle.label}>Destination Point</Text>

                        <MapboxPlacesAutocomplete
                            id="Destination"
                            placeholder="Destination"
                            onPlaceSelect={(data) => {
                                console.log(data)
                            }}
                            onClearInput={({id}) => {
                            }}
                            containerStyle={{}}
                        />


                        <Text style={DriverBottomSheetStyle.h}>Suggested place:</Text>

                    </View>
                    <SuggestedPlace/>
                    <View style={{paddingHorizontal: 20, paddingTop: 10,}}>
                        <TouchableOpacity activeOpacity={1}
                                          style={DriverBottomSheetStyle.btn}><Text
                            style={DriverBottomSheetStyle.btntxt}>Set Route</Text></TouchableOpacity>
                    </View>

                </View>


            </ScrollView>


        </BottomSheet>
    );
}

export default DriverBottomSheet;

const DriverBottomSheetStyle = StyleSheet.create({
    contentContainer: {
        display: 'flex',


    },
    headerText: {
        fontSize: 16,
        color: '#605f5f',
        fontFamily: 'PlusJakartaSans-Bold',
        marginBottom: 10,
        paddingVertical: 5,
        paddingHorizontal: 20,
    },
    inputContainer: {
        display: 'flex',
        flexDirection: "column",
        flex: 1,



    },
    label: {
        fontSize: 14,
        color: '#3083FF',
        marginBottom: 7,
        fontFamily: 'PlusJakartaSans-Medium',
    },
    suggestionList: {


        height: "auto",

        paddingVertical: 10,
        paddingHorizontal: 20,
        gap: 7,

    },

    suggestionCon: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 9,
        paddingVertical: 7,
        backgroundColor: "white",
        borderRadius: 20,
        elevation: 2,
    },

    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    inputbox: {


        alignItems: "center",
        justifyContent: "flex-start",
        gap: 5,
        display: "flex",
        flexDirection: "row",


    },
    textInput: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        color: '#605f5f',
        display: "flex",
        width: "100%",
        fontFamily: 'PlusJakartaSans-Medium',
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#ffffff',
    }, btn: {
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        gap: 1,

        borderRadius: 10,
        backgroundColor: "#3083FF",


    }, btntxt: {
        color: '#fff',
        fontSize: 12,
        fontFamily: "PlusJakartaSans-Medium",

    },


    placetxt: {

        margin: 0,
        fontSize: 11,
        fontFamily: "PlusJakartaSans-Medium",
        color: '#605f5f',
    }, h: {
        marginTop: 6,
        fontSize: 12,
        fontFamily: "PlusJakartaSans-Medium",
        color: '#605f5f',
    }
});

