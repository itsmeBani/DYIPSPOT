import React, {useContext, useEffect, useRef, useState} from 'react';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import {addDoc, collection, doc, getDocs, onSnapshot, orderBy, query, setDoc, where} from "firebase/firestore";
import {db} from "../api/firebase-config";
import useFetchLocation from "../CustomHooks/useFetchLocation";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {
    View,
    Text, Image,
    StyleSheet, ScrollView, AppState, Button, SafeAreaView, Dimensions, TouchableOpacity, RefreshControl,

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
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MostActiveJeeps from "../Components/MostActiveJeeps";

function HomeTab(props) {

    const {CurrentUser} = useContext(CurrentUserContext)
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;

    const {LocationData, loading, error,setrefresh,refresh} = useFetchDriversOnce();
    const [isRankingPage,setIsRankingPage]=useState(false)
     console.log("render home")
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

        <View style={{flex: 1}}>

            <View style={HomeTabStyle.ParentStyle}>
                <View style={HomeTabStyle.GreetingsconTxt}>
                    <Text style={HomeTabStyle.GreetingsTxt}>Hi {CurrentUser?.name}, </Text>
                    <Text
                        style={HomeTabStyle.Greetingspline}>{CurrentUser.role === "passenger" ? "Let’s track your ride!" : "Track your passengers, stay on route!"} </Text>
                </View>
                <View style={HomeTabStyle.tab}>
                    <TouchableOpacity onPress={()=>{setIsRankingPage(false)}}>
                        <FontAwesome5 name="user-circle" size={20} color={!isRankingPage ? "#3083FF" : "rgba(149,149,149,0.73)"} />
                        <View style={{width:"100%" ,marginTop:2, borderRadius:100, backgroundColor:"#3083FF",height:3,opacity:!isRankingPage ? 1 : 0}}/>

                    </TouchableOpacity>
             <TouchableOpacity onPress={()=>{setIsRankingPage(true)}}>
                    <FontAwesome6 name="chart-simple" size={20} color={!isRankingPage ? "rgba(149,149,149,0.73)" : "#3083FF"}/>
                 <View style={{width:"100%" ,marginTop:2, borderRadius:100, backgroundColor:"#3083FF",height:3,opacity:!isRankingPage ? 0 : 1}}/>

             </TouchableOpacity>



                </View>

                {!isRankingPage ?
                    < ScrollView refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={()=>setrefresh(!refresh)} colors={['#3083FF']}/>
                }  contentContainerStyle={{flex:1}}>

                    {
                        loading ? <CarouselSkeleton/> :


                            <Carousel
                                loop

                                mode={"parallax"}
                                width={width}
                                autoPlay={false}
                                overscrollEnabled={true}
                                pagingEnabled={true}
                                data={mappedDrivers}
                                snapEnabled
                                onSnapToItem={(index) => {
                                    setActiveIndex(index)

                                }}

                                style={{flex: 1}}
                                renderItem={({item, index}) => (
                                    <View style={{
                                        borderRadius: 20,
                                        flex: 1,
                                        marginHorizontal: 6
                                    }}>
                                        <LinearGradient
                                            colors={['#48B2FC', '#3297FF', '#1C7FFF']}
                                            start={[0, 0]}
                                            end={[0, 0.9]}

                                            style={{
                                                flex: 1,
                                                borderRadius: 20,
                                                overflow: 'hidden',
                                                padding: 20,
                                                display: "flex",
                                                flexDirection: "column",


                                            }}
                                        >


                                            <View>
                                                <View
                                                    style={{flexDirection: "row", gap: 20}}>

                                                    <Image source={{uri: item?.imageUrl}} style={{
                                                        height: 90,
                                                        width: 90,
                                                        borderRadius: 20,
                                                        borderWidth: 5,
                                                        borderColor: "white"
                                                    }}/>


                                                    <View style={{alignItems: "flex-start"}}>

                                                        <Text style={HomeTabStyle.name}>{item?.name}</Text>
                                                        <Text style={HomeTabStyle.txt}>Jeepney Driver</Text>
                                                        <Text
                                                            style={[HomeTabStyle.txt]}>{item?.forHire ? "for Hire" : "not for hire"}</Text>
                                                    </View>
                                                </View>
                                                <View style={{paddingTop: 10, gap: 3}}>
                                                    <View style={{flexDirection: "row", gap: 6}}><Ionicons name="home-outline"
                                                                                                           size={20}
                                                                                                           color="white"/><Text
                                                        style={HomeTabStyle.txt2}>{item?.address}</Text></View>
                                                    <View style={{flexDirection: "row", gap: 6}}><SimpleLineIcons name="phone"
                                                                                                                  size={20}
                                                                                                                  color="white"/><Text
                                                        style={HomeTabStyle.txt2}>{item?.phoneNumber}</Text></View>
                                                    <View style={{flexDirection: "row", gap: 6}}><MaterialCommunityIcons
                                                        name="jeepney" size={20} color="white"/><Text
                                                        style={HomeTabStyle.txt2}>{item?.jeepName}</Text></View>

                                                </View>
                                            </View>


                                        </LinearGradient>

                                    </View>


                                )}
                            />

                    }
                </ScrollView> : <MostActiveJeeps setrefresh={setrefresh} refresh={refresh} mappedDrivers={LocationData} getTableDataFromOneTable={getTableDataFromOneTable}/>}

            </View>



            {!isRankingPage &&    <JeepCategoryAnalysis getTableDataFromOneTable={getTableDataFromOneTable}
                                      data={mappedDrivers[activeIndex]}/> }
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
        paddingVertical: 1,

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
    }, name: {
        fontFamily: "PlusJakartaSans-Bold",
        fontSize: 20,
        color: "rgb(255,255,255)"

    }, txt: {

        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 13,
        color: "rgb(255,255,255)"

    }, txt2: {

        fontFamily: "PlusJakartaSans-Regular",
        fontSize: 15,
        color: "rgb(255,255,255)"
    }, tab: {
        width: "100%",
        flexDirection: "row",
        gap: 8,
        paddingTop: 10,

        justifyContent: "center",
        alignItems: "center"
    }
})

