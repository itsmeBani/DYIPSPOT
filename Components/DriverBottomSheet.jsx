import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, TextInput, Button, FlatList, TouchableOpacity, Alert, ScrollView} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {CurrentDriverContext} from '../Context/CurrentDriverProvider';

import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import {collection, getDocs, updateDoc, query, where, doc, addDoc, serverTimestamp} from "firebase/firestore";
import {db} from "../api/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {MapboxPlacesAutocomplete} from "./MapboxPlacesAutocomplete";
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";


function DriverBottomSheet(props) {
    const [startPoint, setStartPoint] = useState(null);
    const [destination, setDestination] = useState([]);
    const {BottomSheetRef} = useContext(CurrentDriverContext);

    const {camera, CurrentUser} = useContext(CurrentUserContext)

    const [isLoading,setIsLoading]=useState(false)
    const HandleSubmitRoute = async () => {

        const {id, role} = CurrentUser;

        const driverRef = await getUserDocRefById(CurrentUser?.id, "drivers")
        const DriverDocRef = await getUserDocRefById(id, "drivers");
        const travelHistoryRef = collection(db, 'drivers', DriverDocRef.id, 'Trips');

       if (startPoint === null || destination === null){
           alert("invalid")
           return
       }

        try {
            console.log(startPoint)
            await updateDoc(driverRef, {

                startpoint: {
                    latitude: startPoint.startPoint[1],
                    longitude: startPoint.startPoint[0]
                },
                endpoint: {
                    latitude: destination.EndPoint[1],
                    longitude: destination.EndPoint[0]
                },

            })

            const Trips={
                startpoint: {
                    latitude: startPoint.startPoint[1],
                    longitude: startPoint.startPoint[0]
                },
                endpoint: {
                    latitude: destination.EndPoint[1],
                    longitude: destination.EndPoint[0]
                },
                StartPointAddress:{
                    Locality:startPoint.Locality,
                    Region:startPoint.Region,
                    PlaceName:  startPoint.PlaceName
                },
               EndPointAddress:{
                   Locality:destination.Locality,
                   Region:destination.Region,
                   PlaceName:  destination.PlaceName
               },
                date:serverTimestamp(),
                id:CurrentUser.id
            }

            try {
                await addDoc(travelHistoryRef, Trips);
                console.log('Travel history added successfully!');
            } catch (error) {
                console.error('Error updating driver document: ', error);
            }

           alert("done updating driver document: ");
            setStartPoint(null)
            setDestination(null)
        } catch (e) {
           alert(e)
            console.error("Error updating driver document: ", e);
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
                                setStartPoint({
                                    startPoint: data?.center,
                                    Locality:data?.text,
                                    Region: data?.context[1]?.text,
                                    PlaceName:  data?.context[0]?.text
                                })
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
                                setDestination({
                                    EndPoint: data?.center,
                                    Locality:data?.text,
                                    Region: data?.context[1]?.text,
                                    PlaceName:  data?.context[0]?.text
                                })
                            }}
                            onClearInput={({id}) => {
                            }}
                            containerStyle={{}}
                        />


                        <Text style={DriverBottomSheetStyle.h}>Suggested place:</Text>

                    </View>
                    <SuggestedPlace/>
                    <View style={{paddingHorizontal: 20, paddingTop: 10,}}>
                        <TouchableOpacity activeOpacity={0.8} onPress={HandleSubmitRoute} disabled={isLoading}
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

