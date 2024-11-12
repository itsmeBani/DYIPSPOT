import React, {useContext, useEffect, useRef, useState} from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, setDoc, where} from "firebase/firestore";
import {db} from "../api/firebase-config";
import useFetchLocation from "../CustomHooks/useFetchLocation";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {
    View,
    Text, Image,
    StyleSheet, ScrollView, AppState, Button, SafeAreaView, Dimensions, TouchableOpacity,

} from 'react-native';
import {MapboxPlacesAutocomplete} from "../Components/MapboxPlacesAutocomplete";
import JeepCategoryAnalysis from "../Components/JeepCategoryAnalysis";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Jeep from "../assets/jeep.png"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Carousel from 'react-native-reanimated-carousel';
import {LinearGradient} from "expo-linear-gradient";
import {PermissionAndTaskManagerContext} from "../Context/PermissionAndTaskManagerProvider";
import useFetchDriversOnce from "../CustomHooks/useFetchDriversOnce";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions"
import Ionicons from '@expo/vector-icons/Ionicons';
import {CarouselSkeleton} from "../Components/Loaders";
function HomeTab(props) {

    const {CurrentUser} = useContext(CurrentUserContext)
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const {LocationData, loading, error} = useFetchDriversOnce();


    async function getTableDataFromOneTable(id, tableNAME, OrderBy) {
        const DriverDocRef = await getUserDocRefById(id, "drivers");
        const travelHistoryRef = collection(db, 'drivers', DriverDocRef?.id, tableNAME);
        const orderedQuery = query(travelHistoryRef, orderBy(OrderBy, 'desc'));
        const querySnapshot = await getDocs(orderedQuery);
        const Data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

        return {Data}
    }


    const mappedDrivers = LocationData?.map((driver) => ({
        id: driver?.id,
        name: driver?.name,
        latitude: driver?.latitude,
        longitude: driver?.longitude,
        status: driver?.status,
        address: driver?.address,
        imageUrl: driver?.imageUrl,
        speed: driver?.speed,
        jeepName: driver?.jeepName,
        heading: driver?.heading,
        forHire: driver?.forHire,
        estimatedArrival: driver?.estimatedarrivaltime,
        passengers: driver?.passengers,
        phoneNumber: driver?.phoneNumber,
        JeepImages: driver?.jeepImages,
    })) || []

    const [activeIndex, setActiveIndex] = useState(0);

    return (

        <View style={{flex:1}}>


            <View style={HomeTabStyle.ParentStyle}>
                <View style={HomeTabStyle.GreetingsconTxt}>
                    <Text style={HomeTabStyle.GreetingsTxt}>Hi {CurrentUser?.name}, </Text>
                    <Text
                        style={HomeTabStyle.Greetingspline}>{CurrentUser.role === "passenger" ? "Let’s track your ride!" : "Track your passengers, stay on route!"} </Text>
                </View>

                {loading ? <CarouselSkeleton/> :


                    <Carousel
                        loop

                        mode={"parallax"}
                        width={width}
                        autoPlay={false}
                        overscrollEnabled={true}
                        pagingEnabled={true}
                        data={mappedDrivers}
                        snapEnabled

                        onSnapToItem={(index) =>{
                            setActiveIndex(index)

                        }}

                        renderItem={({item, index}) => (
                            <View style={{
                                borderRadius: 20,
                                flex:1,
                                marginHorizontal: 6
                            }}>
                                <LinearGradient
                                    colors={['#48B2FC', '#3297FF', '#1C7FFF']}
                                    start={[0, 0]}
                                    end={[0, 0.9]}

                                    style={{
                                        flex:1,
                                        borderRadius: 20,
                                        overflow: 'hidden',
                                        padding: 20,
                                        display: "flex",
                                        flexDirection: "column",


                                    }}
                                >


                                        <View>
                                            <View
                                                style={{flexDirection:"row",gap:20}}>

                                                <Image source={{uri:item?.imageUrl}} style={{height: 90, width: 90 ,borderRadius:20,borderWidth:5, borderColor:"white"}}/>


                                                <View style={{alignItems:"flex-start"}}>

                                                    <Text style={HomeTabStyle.name}>{item?.name}</Text>
                                                    <Text style={HomeTabStyle.txt}>Jeepney Driver</Text>
                                                    <Text  style={[HomeTabStyle.txt]}>{item?.forHire ? "for Hire" : "not for hire"}</Text>
                                                </View>
                                            </View>
                                            <View  style={{paddingTop:10,gap:3}}>
                                                <View style={{flexDirection:"row",gap:6}}><Ionicons name="home-outline" size={20} color="white" /><Text style={HomeTabStyle.txt2}>{item?.address}</Text></View>
                                                <View style={{flexDirection:"row",gap:6}}><SimpleLineIcons name="phone" size={20} color="white" /><Text style={HomeTabStyle.txt2}>{item?.phoneNumber}</Text></View>
                                                <View style={{flexDirection:"row",gap:6}}><MaterialCommunityIcons name="jeepney" size={20} color="white" /><Text style={HomeTabStyle.txt2}>{item?.jeepName}</Text></View>

                                            </View>
                                        </View>

                                    






                                </LinearGradient>

                            </View>


                        )}
                    />

                }
            </View>
            <JeepCategoryAnalysis getTableDataFromOneTable={getTableDataFromOneTable}
                                  data={mappedDrivers[activeIndex]}/>


        </View>

    );
}

export default HomeTab;
const HomeTabStyle = StyleSheet.create({
    ParentStyle: {
        backgroundColor: "white",
        flex: 1,


    },
    GreetingsTxt: {

        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 20,
        color: "rgba(0,0,0,0.72)"
    }, GreetingsconTxt: {
        paddingHorizontal: 15,
        paddingVertical: 10,

    }, Greetingspline: {
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 13,
        color: "rgba(0,0,0,0.68)"
    }, itemname: {

        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 20,
        color: "rgb(255,255,255)"
    },
    JeepBox: {
        flex: 1,
        backgroundColor: "white"
    },name:{
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 20,
        color: "rgb(255,255,255)"

    },txt: {

        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "rgb(255,255,255)"

    },txt2:{

        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 15,
        color: "rgb(255,255,255)"
    }
})

