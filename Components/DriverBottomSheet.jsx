import React, {useContext, useEffect, useRef, useState} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Button,
    FlatList,
    TouchableOpacity,
    Alert,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import BottomSheet, {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {CurrentDriverContext} from '../Context/CurrentDriverProvider';

import * as Location from 'expo-location';

import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import {collection, getDocs, updateDoc, query, where, doc, addDoc, serverTimestamp} from "firebase/firestore";
import {db} from "../api/firebase-config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {MapboxPlacesAutocomplete} from "./MapboxPlacesAutocomplete";
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";
import useReverseGeoCoding from "../CustomHooks/useReverseGeoCoding";
import usePlacesAutocomplete from "../CustomHooks/usePlacesAutocomplete";
import axios from "axios";


function DriverBottomSheet(props) {
    const [startPoint, setStartPoint] = useState(null);
    const [destination, setDestination] = useState(null);
    const {BottomSheetRef} = useContext(CurrentDriverContext);
    const bottomSheetScrollViewRef = useRef(null);
    const {camera, CurrentUser} = useContext(CurrentUserContext)
    const [isLoading, setIsLoading] = useState(false)
    const {Address, setCoordinates} = useReverseGeoCoding()
    const [errorMsg,setErrorMsg]=useState(null)

    const [error,setError]=useState(null)
     const accessToken = process.env.EXPO_PUBLIC_MAPBOX_API_KEY
   const countryId = "ph"
    const StartplacesAutocomplete = usePlacesAutocomplete("", accessToken, countryId);
    const EndplacesAutocomplete = usePlacesAutocomplete("", accessToken, countryId);
const [suggestedStartPointPlace,setSuggestedStartPointPlace]=useState()
    const [suggestedEndPointPlace,setSuggestedEndPointPlace]=useState()
    const  getSuggestedPlace=async ()=>{

        try {
            const doc = await getUserDocRefById(CurrentUser?.id, "drivers");
            const response = await axios.get(`https://predictdestination-2z3l.onrender.com/suggestedPlace/${doc.id}`);
            await setSuggestedStartPointPlace(response?.data?.startPoints)
            await setSuggestedEndPointPlace(response?.data?.endPoints)



        } catch (error) {
            console.log(error)
        }
    }


    useEffect(()=>{
        InitialStartPoint().then()
        getSuggestedPlace().then()

    },[])


    const InitialStartPoint = async () => {
        try {
           await  Location.getLastKnownPositionAsync({
                mayShowUserSettingsDialog: true,
                accuracy: Location.Accuracy.BestForNavigation,
            }).then((loc)=>{

                setCoordinates({
                    latitude: loc?.coords?.latitude,
                    longitude: loc?.coords?.longitude
                })
             setStartPoint({
                    startPoint: [loc?.coords?.longitude, loc?.coords?.latitude],
                 Region: Address?.data?.features[0]?.properties?.context?.region?.name,
                 PlaceName: Address?.data.features[0].properties?.context?.place?.name ,
                    Locality: Address?.data?.features[0]?.properties?.context?.locality?.name  ,

                })
            })

            console.log(Address)
        } catch (e) {
            console.log(e)
        }
    }








    const HandleSubmitRoute = async () => {
        setIsLoading(true)
        const {id, role} = CurrentUser;
        const driverRef = await getUserDocRefById(CurrentUser?.id, "drivers")
        const DriverDocRef = await getUserDocRefById(id, "drivers");
        const travelHistoryRef = collection(db, 'drivers', DriverDocRef.id, 'Trips');
        if (startPoint === null) {
            await InitialStartPoint()
        }

        if (destination === null) {
            setErrorMsg("Destination is Required ")
            setIsLoading(false)
            return false
        }


        try {

            await updateDoc(driverRef, {
                status: "online",
                startpoint: {
                    latitude: startPoint?.startPoint[1],
                    longitude: startPoint?.startPoint[0]
                },
                endpoint: {
                    latitude: destination?.EndPoint[1],
                    longitude: destination?.EndPoint[0]
                },

            })

            const Trips = {
                startpoint: {
                    latitude: startPoint?.startPoint[1],
                    longitude: startPoint?.startPoint[0]
                },
                endpoint: {
                    latitude: destination?.EndPoint[1],
                    longitude: destination?.EndPoint[0]
                },
                StartPointAddress: {
                    Locality: startPoint?.Locality,
                    Region: startPoint?.Region,
                    PlaceName: startPoint?.PlaceName
                },
                EndPointAddress: {
                    Locality: destination?.Locality,
                    Region: destination?.Region,
                    PlaceName: destination?.PlaceName
                },
                date: serverTimestamp(),
                id: CurrentUser.id
            }

           await addDoc(travelHistoryRef, Trips);
            setErrorMsg(null)
            setError(null)
            StartplacesAutocomplete.setValue("")
            EndplacesAutocomplete.setValue("")
            setIsLoading(false)
            setStartPoint(null)
            setDestination(null)






        } catch (e) {
            setError("Something went wrong")
            setIsLoading(false)

            console.error("Error updating driver document: ", e);
        }


    }



    const SuggestedPlace = ({place}) => {
        return (
    <>
        <Text style={DriverBottomSheetStyle.h}>Suggested place:</Text>
        <BottomSheetScrollView horizontal={true}
                               showsHorizontalScrollIndicator={false}
                               contentContainerStyle={DriverBottomSheetStyle.suggestionList}>
            {place?.map((item,index)=>{
                return (

                    <TouchableOpacity activeOpacity={1} style={DriverBottomSheetStyle.suggestionCon} key={index}>
                        <SimpleLineIcons name="location-pin" size={15} color="#605f5f"/>
                        <Text style={DriverBottomSheetStyle.placetxt}>{item.latitude} {item.longitude} </Text>
                    </TouchableOpacity>
                )
            })}
        </BottomSheetScrollView>
    </>
        )
    }
    return (
        <BottomSheet
            snapPoints={['75%']}
            enableOverDrag={false}
            enableContentPanningGesture={false}
            index={-1}
            enableHandlePanningGesture={true}
            ref={BottomSheetRef}
            enablePanDownToClose={true}

            handleIndicatorStyle={{backgroundColor: '#3083FF'}}
            backgroundStyle={{borderRadius: 30, flex:1, elevation: 0, backgroundColor: '#fff'}}>
            <BottomSheetScrollView ref={bottomSheetScrollViewRef} showsVerticalScrollIndicator={false}
                                   style={DriverBottomSheetStyle.contentContainer}>

                <Text style={DriverBottomSheetStyle.headerText}>Set Route</Text>
            <View style={{flex:1, height:"100%"}}>
                <View style={{paddingHorizontal: 20, zIndex: 111}}>
                    <Text style={DriverBottomSheetStyle.label}>Start Point</Text>

                    <MapboxPlacesAutocomplete
                        PlaceholderTextcolor={"#3083ff"}
                        id="origin"
                        placesAutocomplete={StartplacesAutocomplete}
                        suggestedPlaceStyle={{backgroundColor: "white", zIndex: 100}}
                        bottomSheetScrollViewRef={bottomSheetScrollViewRef}
                        placeholder="My location"

                        onPlaceSelect={(data) => {

                            console.log(data)
                            setStartPoint({
                                startPoint: data?.center,
                                Locality: data?.text,
                                Region: data?.context[1]?.text,
                                PlaceName: data?.context[0]?.text
                            })
                        }}
                        onClearInput={({id}) => {

                        }}
                        containerStyle={{}}
                    />



                </View>

                {/*{suggestedStartPointPlace &&*/}
                {/*    <SuggestedPlace place={suggestedStartPointPlace}/>}*/}

                <View style={{paddingHorizontal: 20, flex: 1, overflow: "visible"}}>
                    <Text style={DriverBottomSheetStyle.label}>Destination Point</Text>

                    <MapboxPlacesAutocomplete
                        id="Destination"
                        suggestedPlaceStyle={{backgroundColor: "white", zIndex: 100}}
                        bottomSheetScrollViewRef={bottomSheetScrollViewRef}
                        placeholder="Destination"
                        placesAutocomplete={EndplacesAutocomplete}
                        onPlaceSelect={(data) => {
                            setDestination({
                                EndPoint: data?.center,
                                Locality: data?.text,
                                Region: data?.context[1]?.text,
                                PlaceName: data?.context[0]?.text
                            })
                        }}
                        onClearInput={({id}) => {

                        }}
                        containerStyle={{}}
                    />
                    {errorMsg   &&  <Text style={{
                        color: '#f56a6a',
                        fontSize: 10,
                        fontFamily: "PlusJakartaSans-Medium",
                    }}>
                        {errorMsg && errorMsg}
                    </Text>
                    }

                </View>
                {/*{suggestedEndPointPlace &&*/}
                {/*    <SuggestedPlace place={suggestedEndPointPlace}/>}*/}

                <View style={{paddingHorizontal: 20, paddingTop: 10,}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={HandleSubmitRoute} disabled={isLoading}
                                      style={DriverBottomSheetStyle.btn}>
                        {isLoading ? <ActivityIndicator size="small" color="#fff"/> :
                            <Text style={DriverBottomSheetStyle.btntxt}>Set Route</Text>}


                    </TouchableOpacity>
                    {error   &&  <Text style={{
                        color: '#f56a6a',
                        fontSize: 10,
                        textAlign:"center",
                        fontFamily: "PlusJakartaSans-Medium",
                    }}>
                        {error && error}
                    </Text>
                    }
                </View>

            </View>

            </BottomSheetScrollView>


        </BottomSheet>
    );
}

export default DriverBottomSheet;

const DriverBottomSheetStyle = StyleSheet.create({
    contentContainer:{
        flex:1
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


        backgroundColor: "pink",
        flex: 1,
        height: "100%"

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
zIndex:-1,
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
        paddingLeft: 20,
        marginTop: 6,
        fontSize: 12,
        fontFamily: "PlusJakartaSans-Medium",
        color: '#605f5f',
    }
});

