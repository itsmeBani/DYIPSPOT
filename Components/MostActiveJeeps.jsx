import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ModalDatePicker from "./ModalDatePicker";
import {BarChart} from "react-native-gifted-charts"; // Import BarChart from react-native-chart-kit
const screenWidth = Dimensions.get("window").width;
const MostActiveJeeps = ({getTableDataFromOneTable, mappedDrivers,setrefresh,refresh}) => {
    const [date, setDate] = useState(null);
    const [data, setData] = useState()
      const [activecardId,setActiveCardId] = useState()
    const [travelHistoryCount, setTravelHistoryCount]=useState()
    const [MaxValueTrips, setMaxValueTrips] = useState(60)
    const [MaxValueTravel, setMaxValueTravel] = useState(60)
    const CountDataFromTables = async (jeepId,tableName,OrderBy) => {
        try {
            const {Data} = await getTableDataFromOneTable(jeepId, tableName,OrderBy);
            return Data
        } catch (e) {
            console.log(e)
        }
    }
    const TRIPS = async (tableName,OrderBy) => {

        return await Promise.all(mappedDrivers?.map(async (driver) => {
            const count = await CountDataFromTables(driver?.id,tableName,OrderBy);
            const travelCount=await  CountDataFromTables(driver?.id,"travelHistory","Date");
            return {
                value: count.length,
                id: driver?.id,
                name: driver?.name,
                travelCount:travelCount.length,
                imageUrl: driver?.imageUrl,
                label: driver?.jeepName,
                jeepImages: driver?.jeepImages[0],
                topLabelComponent: () => (
                <View style={{position:"relative"}}>
                    <Image
                        style={{
                            height: 30,
                            width: 30,
                            borderWidth: 3,
                            borderColor: tableName === "travelHistory" ? "#7677ff" :"#3083FF",
                            marginBottom: 4,
                            borderRadius: 100,
                        }}
                        source={{uri: driver?.jeepImages[0]}}
                    />

                    <View style={{ position: "absolute", right: -15, top: -10 }}>
                        <Text
                            style={{
                                backgroundColor: "white",
                                borderRadius: 100,
                                paddingHorizontal: 10,
                                elevation: 3,

                                whiteSpace: "nowrap",
                                color:  tableName !== "Trips" ? '#7677ff' : "#3083FF",
                                fontSize: 10,
                                fontFamily: 'PlusJakartaSans-Medium',
                            }}
                            numberOfLines={3}
                            ellipsizeMode="tail"
                        >
                            {tableName === "Trips" ? count.length : travelCount.length}
                        </Text>
                    </View>
                </View>
                ),
            };
        })) || [];
    };

function _render() {
    setrefresh(true)
    TRIPS("Trips","date").then(data => {
        const maxValue = Math.max(...data.map(item => item.value));
        setMaxValueTrips(maxValue)
        setData(data);
        setrefresh(false)

    });
    TRIPS("travelHistory","Date").then(data => {
        const maxValue = Math.max(...data.map(item => item.value));
        setMaxValueTravel(maxValue)
        setTravelHistoryCount(data);
        setrefresh(false)
    });
}
    useEffect(() => {
        _render()


    }, [])



    return (
        <View style={styles.container}>
            <View style={{

                width: "100%",
                paddingHorizontal: 20,
                justifyContent: "flex-start",
                alignItems: "flex-start"
            }}>
                <Text style={{
                    fontSize: 20,
                    lineHeight: 22,
                    fontFamily: "PlusJakartaSans-Bold",
                    color: "#3083FF",

                }}>
                    Top Operating Jeeps
                </Text>
            </View>

            <ScrollView  refreshControl={
                <RefreshControl refreshing={refresh} onRefresh={_render} colors={['#3083FF']}/>
            } horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{gap:5,paddingHorizontal:15}} style={{gap: 10,height:110}}>

                        <View style={{
                            backgroundColor: "rgb(214,234,252)",
                            overflow: "hidden",
                            marginTop: 10,

                            borderRadius: 20,
                            padding: 10
                        }}>
                            <View style={{paddingHorizontal:20,paddingTop:10}}>
                                <Text style={{
                                    fontSize: 23,

                                    lineHeight:22,
                                    fontFamily: "PlusJakartaSans-Bold",
                                    color: "#3083FF"
                                }}>Trips</Text>
                                <Text style={{
                                    fontSize: 10,
                                    lineHeight:12,
                                    paddingLeft:3,

                                    fontFamily: "PlusJakartaSans-Medium",
                                    color: "#3083FF"
                                }} >Visualization of vehicle trips shows total trips </Text>
                            </View>
                            <BarChart
                                barWidth={40}
                                noOfSections={5}
                                maxValue={MaxValueTrips+60}
                                rulesColor={"#3083FF"}
                                rulesType={"dashed"}
                                width={screenWidth - 100}
                                rulesThickness={1}
                                capColor={'rgba(78, 0, 142)'}
                                capThickness={4}
                                isAnimated={true}
                                onPress={(e)=>{setActiveCardId(e.id)}}
                                yAxisColor={"transparent"}
                                xAxisColor={"transparent"}
                                initialSpacing={10}
                                xAxisLabelTextStyle={{
                                    color: "#3083FF",
                                    textTransform: "capitalize",
                                    fontFamily: "PlusJakartaSans-Medium",
                                    fontSize: 10
                                }}
                                yAxisTextStyle={{color: "#3083FF", fontFamily: "PlusJakartaSans-Medium", fontSize: 10}}
                                data={data} dashGap={6} dashWidth={3} barBorderRadius={4}
                                showGradient
                                barBorderTopRightRadius={10}
                                barBorderTopLeftRadius={10}
                                gradientColor={'#3083FF'}
                                frontColor={'#3083FF'}/>

                        </View>
                <View style={{
                    backgroundColor: "#E4E1FE",
                    overflow: "hidden",
                    marginTop: 10,

                    borderRadius: 20,
                    padding: 10
                }}>
                    <View style={{paddingHorizontal: 20, paddingTop: 10}}>
                        <Text style={{
                            fontSize: 23,
                            lineHeight: 22,
                            fontFamily: "PlusJakartaSans-Bold",
                            color: "#7677ff"
                        }}>
                            Travel History
                        </Text>
                        <Text style={{
                            fontSize: 10,
                            width:screenWidth-100,
                            lineHeight: 12,
                            paddingLeft: 3,
                            fontFamily: "PlusJakartaSans-Medium",
                            color: "#7677ff"
                        }}>
                            Travel history  Shows the count of places the jeep has visited.
                        </Text>
                    </View>

                    <BarChart
                        barWidth={40}
                        noOfSections={5}

                        maxValue={MaxValueTravel+60}
                        rulesColor={"#7677ff"}
                        rulesType={"dashed"}
                        width={screenWidth - 100}
                        rulesThickness={1}
                        capColor={'rgba(78, 0, 142)'}
                        capThickness={4}
                        isAnimated={true}
                        yAxisColor={"transparent"}
                        xAxisColor={"transparent"}

                        initialSpacing={10}
                        xAxisLabelTextStyle={{
                            color: "#7677ff",
                            textTransform: "lowercase",
                            fontFamily: "PlusJakartaSans-Medium",
                            fontSize: 10
                        }}
                        yAxisTextStyle={{color: "#7677ff", fontFamily: "PlusJakartaSans-Medium", fontSize: 10}}
                        data={travelHistoryCount} dashGap={6} dashWidth={3} barBorderRadius={4}
                        showGradient
                        barBorderTopRightRadius={10}
                        barBorderTopLeftRadius={10}
                        gradientColor={'#7677ff'}
                        frontColor={'#7677ff'}/>

                </View>

            </ScrollView>

            <ScrollView

                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, padding: 40, paddingTop: 20 }}
                style={styles.jeepcon}
            >
                {data &&  data?.sort((a, b) => {
                        const sumA = (a.value || 0) + (a.travelCount || 0);
                        const sumB = (b.value || 0) + (b.travelCount || 0);
                        return sumB - sumA;
                    }).map((jeep, index) => {
                            return (
                         <TouchableOpacity     key={jeep?.id} activeOpacity={1} onPress={()=>setActiveCardId(jeep?.id)}>
                             <View

                                 id={jeep?.id}
                                 style={{
                                     elevation: 1,
                                     flexDirection: "row",
                                     paddingVertical: 5,
                                     backgroundColor: activecardId === jeep.id? "#3083FF": "white",
                                     justifyContent: "space-between",
                                     paddingHorizontal: 10,
                                     borderRadius: 10,
                                     width: "100%",
                                     gap: 10,
                                 }}

                             >
                                 <View
                                     style={{
                                         height: 50,
                                         width: 50,
                                         backgroundColor: "grey",
                                         borderRadius: 10,

                                         overflow: "hidden",

                                     }}
                                 >
                                     <Image style={{ flex: 1 }} source={{ uri: jeep?.jeepImages }} />
                                 </View>

                                 <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                     <View>
                                         <Text style={[styles.label,{color: activecardId === jeep.id? "white" :"#605f5f"}]}>Total Trips</Text>
                                         <Text style={[styles.ranking,{color: activecardId === jeep.id? "white" :"#3083FF"}]}>{jeep?.value}</Text>
                                     </View>
                                     <View
                                         style={{
                                             height: "90%",
                                             width: 2,
                                             backgroundColor: activecardId === jeep.id ? "white" :"#605f5f",
                                             borderRadius: 100,
                                             opacity: 0.3,
                                         }}
                                     />

                                     <View>
                                         <Text style={[styles.label,{color: activecardId === jeep.id? "white" :"#605f5f"}]}>Travels</Text>
                                         <Text style={[styles.ranking,{color: activecardId === jeep.id? "white" :"#3083FF"}]}>{jeep?.travelCount}</Text>
                                     </View>
                                     <View
                                         style={{
                                             height: "90%",
                                             width: 2,
                                             backgroundColor: activecardId === jeep.id ? "white" :"#605f5f",
                                             borderRadius: 100,
                                             opacity: 0.3,
                                         }}
                                     />
                                     <View style={{paddingHorizontal:14}}>
                                         <Text style={[styles.label,{color: activecardId === jeep.id? "white" :"#605f5f"}]}>Top</Text>
                                         <Text style={[styles.ranking,{color: activecardId === jeep.id? "white" :"#3083FF"}]}>{index+1}</Text>
                                     </View>

                                 </View>
                             </View>
                         </TouchableOpacity>
                        );
                    })}
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 10,
        gap: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    chart: {}, jeepcon: {
        flex: 1,
        gap: 5,

    }, count: {
        fontSize: 23,
        lineHeight: 26,
        // color: '#3083FF',
        color: '#605f5f',
        fontFamily: 'PlusJakartaSans-Bold',
        textAlign: "center"
    }, label: {
        // color: '#605f5f',
        color: '#605f5f',
        fontSize: 10,
        fontFamily: 'PlusJakartaSans-Medium',
        textAlign: "center",
        textTransform: "capitalize"
    },ranking:{
        lineHeight: 26,
        color: '#3083FF',
        fontSize: 23,
        fontFamily: 'PlusJakartaSans-Bold',
        textAlign: "center",
        textTransform: "capitalize"
    }
});

export default MostActiveJeeps;
