import React, {useContext, useEffect, useState} from 'react';
import {RefreshControl, StyleSheet, View, Text} from "react-native";
import Timeline from "react-native-timeline-flatlist";
import {PermissionAndTaskManagerContext} from "../../Context/PermissionAndTaskManagerProvider";
import {collection, getDocs, query, orderBy} from "firebase/firestore";
import {db} from "../../api/firebase-config";
import ModalDatePicker from "../ModalDatePicker";

function TravelHistoryRoute({JeepHistoryData, getTableDataFromOneTable}) {

    const [travelHistory, setTravelHistory] = useState([]);
    const {getUserDocRefById} = useContext(PermissionAndTaskManagerContext)
    const [refreshing, setRefreshing] = useState(false);

    const [date, setDate] = useState(null);
    const fetchTravelHistory = async () => {
        setRefreshing(true)
        if (!JeepHistoryData?.id) {
            return
        }
        try {
            const {Data} = await getTableDataFromOneTable(JeepHistoryData?.id, "travelHistory", "Date")
            setTravelHistory(Data);
            setRefreshing(false)
        } catch (error) {
            console.error('Error fetching travel history:', error);
        }
    };


    useEffect(() => {
        fetchTravelHistory().then();
    }, [JeepHistoryData]);


    const filterTravelHistory = travelHistory?.filter(history => {
        const tripDate = history?.Date?.seconds ? new Date(history.Date.seconds * 1000) : null;
        if (!tripDate) return false;
        if (!date) {
            return true;
        }
        const selectedDateWithoutTime = new Date(date.setHours(0, 0, 0, 0));
        const tripDateWithoutTime = new Date(tripDate.setHours(0, 0, 0, 0));
        return selectedDateWithoutTime.getTime() === tripDateWithoutTime.getTime();
    });

    const TravelHistoryList = filterTravelHistory?.map((driver) => {
        const latestTimestamp = driver?.Date?.seconds ? new Date(driver.Date.seconds * 1000) : null;
        const formattedDate = latestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }).format(latestTimestamp)
            : '';
        const formattedTime = latestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(latestTimestamp)
            : '';
        return (
            {
                time: formattedTime,
                title: driver?.address || driver?.LocalityName,
                description: formattedDate,
                key: driver?.id && driver?.id
            })
    }) || []

    const renderitems = (rowData) => (
        <View style={{marginBottom: 10}}>
            <Text style={TravelHistoryRouteStyles.title}>{rowData?.title}</Text>
            <Text style={TravelHistoryRouteStyles.description}>{rowData?.description}</Text>
        </View>
    )


    return (
        <View style={[TravelHistoryRouteStyles.container]}>

            <ModalDatePicker date={date} setDate={setDate}/>
            <Timeline
                data={TravelHistoryList}
                innerCircle={'dot'}
                circleSize={15}
                style={{paddingTop: 10}}
                circleColor='#3083FF'
                lineColor='rgb(45,156,219)'
                titleStyle={TravelHistoryRouteStyles.title}
                timeStyle={{
                    color: '#959595',
                    borderRadius: 13,
                    fontFamily: "PlusJakartaSans-Medium",
                    fontSize: 12,
                }}

                descriptionStyle={{
                    color: 'gray',
                    fontFamily: "PlusJakartaSans-Medium",
                    fontSize: 12,


                }}
                renderDetail={renderitems}
                options={{
                    showsVerticalScrollIndicator: false,
                    refreshing: refreshing,
                    removeClippedSubviews: false,
                    onRefresh: fetchTravelHistory,

                    refreshControl: (
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={fetchTravelHistory}
                            colors={['#3083FF']}
                        />
                    ),
                }}
                timeContainerStyle={{minWidth: 72}}
                isUsingFlatlist={true}
            />

        </View>


    );
}

export default TravelHistoryRoute;


const TravelHistoryRouteStyles = StyleSheet.create({
    container: {
        flex: 1,

    }, title: {
        color: "#3083FF",
        fontWeight: undefined,
        fontSize: 13,
        fontFamily: "PlusJakartaSans-Medium",

    }, description: {
        color: 'gray',
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 12,

    }
});