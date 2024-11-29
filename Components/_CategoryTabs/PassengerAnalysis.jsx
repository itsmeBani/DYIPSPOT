import React, {useEffect, useRef, useState} from 'react';
import {ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl} from 'react-native';

import {Dimensions} from 'react-native';
import ModalDatePicker from "../ModalDatePicker";
import {BarChart, LineChart} from "react-native-gifted-charts";
import {getUserDocRefById} from "../../CustomHooks/CustomFunctions/ReusableFunctions";
import {collection, getDocs, orderBy, query} from "firebase/firestore";
import {db} from "../../api/firebase-config";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function PassengerAnalysis({PassengersData,getTableDataFromOneTable}) {
 const CurrentDate=new Date()
    const fullMonthName = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(CurrentDate);
 const fullYear = CurrentDate.getFullYear().toString()

    console.log(fullYear)
    const [duration, setDuration] = useState(null)
    const [activeMonth, setActiveMonth] = useState(fullMonthName);
    const [activeYear, setActiveYear] = useState(fullYear);
const [PassengerCount,setPassengerCount]=useState([])
const [refresh,setRefresh]=useState(false)
    const fetchDailyPassengers = async () => {

    try {
        const passengRef = await getUserDocRefById(PassengersData?.id, "drivers");
        const DailyPassenger = collection(db, 'drivers', passengRef?.id, "DailyPassenger");
        const orderedQuery = query(DailyPassenger, orderBy("Date", 'asc'));
        const querySnapshot = await getDocs(orderedQuery);
        const Data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        const timeout = setTimeout(() => {
            setDuration(2000)

        }, 30);
        setPassengerCount(Data)
        setRefresh(false)
        return () => clearTimeout(timeout);


    }catch (e) {
        console.log(e)
    }
    };







    const groupByMonthYear = (records) => {
        return records.reduce((grouped, record) => {
            const dateParts = record.Date.split(' ');
            const month = months.indexOf(dateParts[0].slice(0, 3));
            const year = dateParts[2];
            if (!grouped[year]) {
                grouped[year] = {};
            }
            if (!grouped[year][months[month]]) {
                grouped[year][months[month]] = [];
            }
            grouped[year][months[month]].push(record);
            return grouped;
        }, {});
    };

    const filterRecords = (year, month) => {
        const groupedRecords = groupByMonthYear(PassengerCount);
        return groupedRecords[year] && groupedRecords[year][month] ? groupedRecords[year][month] : [];
    };

    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const years = ['2024', '2025', '2026'];
    const filteredRecords = filterRecords(activeYear, activeMonth);
    const aggregatedData = filteredRecords.reduce((acc, record) => {
        const date = record.Date.split(' at ')[0];
        if (acc[date]) {
            acc[date].Passengers += record?.NoOfPassengers;
        } else {
            acc[date] = { Date: date, Passengers: record?.NoOfPassengers };
        }

        return acc;
    }, {});


    const result = Object.values(aggregatedData);



    const PassengersDatas =result?.map((value, index    , array)=>{
        const [month, day, year] = value?.Date.split(/[\s,]+/);
        return (
            {
                day: index, value:value?.Passengers, dataPointLabelComponent: () =>

                    <View
                        style={{
                            elevation:4,
                            backgroundColor: "white",
                            borderRadius:100,
                            display:"flex",
                            alignItems: "center",
                            justifyContent: "center",
                            borderWidth:1,
                            borderColor:"#3083FF"
                        }}
                    >
                        <Text style={{
                            color: '#3083FF',
                            fontSize: 10,
                            paddingHorizontal:15,

                            fontFamily: "PlusJakartaSans-Medium",
                        }}>{value?.Passengers}</Text>

                    </View>,label:activeMonth +" "+ day
            }
        )
    })

    const scrollViewRef = useRef(null);

    const scrollToMonth = (index) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: index * screenWidth, animated: true });

        }
    };

    useEffect(() => {
        setRefresh(true)
        fetchDailyPassengers().then();
        scrollToMonth(months.indexOf(activeMonth))
    }, [PassengersData]);
    return (
     <ScrollView   refreshControl={
         <RefreshControl refreshing={refresh} onRefresh={fetchDailyPassengers} colors={['#3083FF']}/>
     }>
         <View style={{flex: 1}}>
             <View style={{gap: 3}}>
                 <ScrollView style={{paddingBottom: 3}} contentContainerStyle={{gap: 5}} horizontal
                             showsHorizontalScrollIndicator={false}>
                     {years.map((year, index) => (
                         <TouchableOpacity activeOpacity={1} onPress={() =>{ setActiveYear(year)
                         }}

                                           key={index}
                                           style={[styles.box, {backgroundColor: activeYear === year ? "#3083FF" : "white"}]}>
                             <Text
                                 style={[styles.text, {color: activeYear === year ? "white" : "#3083FF"}]}>{year}</Text>
                         </TouchableOpacity>
                     ))}
                 </ScrollView>

             </View>
             <View style={{
                 display: "flex",
                 flexDirection: "row",
                 alignItems: "center",
                 gap: 4,
                 marginTop:5,
                 marginBottom:10,
                 justifyContent: "center",
             }}>
                 <View style={{
                     width: 15,
                     height: 15,
                     borderRadius: 100,

                     backgroundColor: "#3083FF"
                 }}/>
                 <Text style={{

                     color: '#3083FF',
                     fontSize: 13,
                     fontFamily: "PlusJakartaSans-Medium",
                 }}>Daily Passenger</Text>
             </View>

             {duration &&


                 <LineChart
                     curved={true}
                     areaChart={true}
                     noOfSections={5}
                     maxValue={100}
                     height={screenHeight/5}
                     rulesColor={"rgba(48,131,255,0.44)"}
                     rulesType={"dashed"}
                     verticalLinesColor={"rgba(48,131,255,0.44)"}
                     showVerticalLines={true}
                     verticalLinesStrokeDashArray={[3]}
                     width={screenWidth - 100}
                     rulesThickness={1}
                     capColor={'rgba(78, 0, 142)'}
                     capThickness={4}
                   isAnimated={true}
                     startFillColor="rgba(48, 131, 255,0.2)"
                     startOpacity={0.7}
                     endFillColor="rgba(48, 131, 255,0.4)"
                     endOpacity={0.4}
                     color={'#177AD5'}

                     yAxisColor={"transparent"}
                     xAxisColor={"transparent"}
                     initialSpacing={25}
                     xAxisLabelTextStyle={{
                         color: "#3083FF",
                         textTransform: "capitalize",
                         fontFamily: "PlusJakartaSans-Medium",
                         fontSize: 10
                     }}
                     yAxisTextStyle={{color: "#3083FF", fontFamily: "PlusJakartaSans-Medium", fontSize: 10}}
                     data={PassengersDatas} dashGap={6} dashWidth={3} barBorderRadius={4}
                     showGradient
                     barBorderTopRightRadius={10}
                     barBorderTopLeftRadius={10}
                     gradientColor={'#3083FF'}
                     frontColor={'#3083FF'}

                 />
             }

             <ScrollView  ref={scrollViewRef} horizontal style={{paddingBottom: 3}} contentContainerStyle={{gap: 5}}
                         showsHorizontalScrollIndicator={false}>
                 {months.map((month, index) => (
                     <TouchableOpacity activeOpacity={1} onPress={() =>setActiveMonth(month)}
                                       key={index}
                                       style={[styles.box, {backgroundColor: activeMonth === month ? "#3083FF" : "white"}]}>
                         <Text
                             style={[styles.text, {color: activeMonth === month ? "white" : "#3083FF"}]}>{month}</Text>
                     </TouchableOpacity>
                 ))}
             </ScrollView>
         </View>
     </ScrollView>
    );
}

export default PassengerAnalysis;

const styles = StyleSheet.create({
    box: {
        backgroundColor: 'white', // Background of each box
        borderRadius: 30, // Full rounded corners
        paddingHorizontal: 15,
        paddingVertical: 5,
        elevation: 1,
        marginBottom: 3,

        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#3083FF',
        fontSize: 13,
        fontFamily: "PlusJakartaSans-Medium",
    },
})
