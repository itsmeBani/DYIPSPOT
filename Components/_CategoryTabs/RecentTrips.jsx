import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, FlatList, RefreshControl, Modal, Pressable, TouchableOpacity} from "react-native";
import {ConvertServerTimeStampToDate} from "../../CustomHooks/CustomFunctions/ReusableFunctions";
import useReverseGeoCoding from "../../CustomHooks/useReverseGeoCoding";
import DateTimePicker from 'react-native-ui-datepicker';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import ModalDatePicker from "../ModalDatePicker";

function RecentTrips({RecentTrips, getTableDataFromOneTable}) {
    const {Address, setCoordinates} = useReverseGeoCoding();
    const [recentTrips, setRecentTrips] = useState([]);
    const [date, setDate] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const fetchRecentTrips = async () => {
        setRefresh(true);
        if (!RecentTrips?.id) {
            return;
        }
        try {
            const {Data} = await getTableDataFromOneTable(RecentTrips?.id, "Trips", "date");
            setRecentTrips(Data);
            setRefresh(false);
        } catch (error) {
            console.error('Error fetching travel history:', error);
        }
    };

    useEffect(() => {
        fetchRecentTrips();
    }, [RecentTrips]);

    const filterRecentTrips = recentTrips?.filter(trip => {
        const tripDate = trip?.date?.seconds ? new Date(trip.date.seconds * 1000) : null;

        if (!tripDate) return false;
        if (!date) {
            return true;
        }
        const selectedDateWithoutTime = new Date(date.setHours(0, 0, 0, 0)) ;
        const tripDateWithoutTime = new Date(tripDate.setHours(0, 0, 0, 0));
        return selectedDateWithoutTime.getTime() === tripDateWithoutTime.getTime();
    });

    const RecentTripsData = filterRecentTrips?.map((trips, index) => {
        const TripslatestTimestamp = trips?.date?.seconds ? new Date(trips.date.seconds * 1000) : null;

        const formattedDatetrips = TripslatestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            }).format(TripslatestTimestamp)
            : '';

        const formattedTime = TripslatestTimestamp
            ? new Intl.DateTimeFormat('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            }).format(TripslatestTimestamp)
            : '';

        return {
            EndPointAddress: trips?.EndPointAddress,
            StartPointAddress: trips?.StartPointAddress,
            date: formattedDatetrips,
            key: trips?.id,
            time: formattedTime,
            id: index,
        };
    }) || [];

    const renderItem = ({item, index}) => (
        <>
            <View style={RecenTripsStye.item}>
                <View>
                    <Text style={RecenTripsStye.date}>{item?.date}</Text>
                    <Text style={RecenTripsStye.time}>{item?.time}</Text>
                </View>
                <View style={RecenTripsStye.address}>
                    <View>
                        <Text style={RecenTripsStye.placeName}>
                            {item?.StartPointAddress?.Locality +
                                ' , ' +
                                item?.StartPointAddress?.PlaceName +
                                ' , ' +
                                item?.StartPointAddress?.Region}
                        </Text>
                        <Text style={RecenTripsStye.label}>Start point</Text>
                    </View>
                    <View>
                        <Text style={RecenTripsStye.placeName}>
                            {item?.EndPointAddress?.Locality +
                                ' , ' +
                                item?.EndPointAddress?.PlaceName +
                                ' , ' +
                                item?.EndPointAddress?.Region}
                        </Text>
                        <Text style={RecenTripsStye.label}>Destination</Text>
                    </View>
                </View>
            </View>
            {recentTrips.length - 1 > index && (
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.11)',
                        height: 2,
                        marginHorizontal: 20,
                        borderRadius: 10,
                    }}
                />
            )}
        </>
    );

    return (
        <View style={RecenTripsStye.container}>

          <ModalDatePicker date={date} setDate={setDate}/>
            <FlatList
                data={RecentTripsData}
                refreshControl={
                    <RefreshControl refreshing={refresh} onRefresh={fetchRecentTrips} colors={['#3083FF']}/>
                }
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

export default RecentTrips;

const RecenTripsStye = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },
    item: {
        gap: 30,
        padding: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        borderRadius: 10,
    },
    dateButton: {
        fontSize: 16,
        color: '#3083FF',
        textAlign: 'center',
        paddingVertical: 10,
        fontFamily: 'PlusJakartaSans-Bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',


    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 15,
        elevation: 4,
        padding: 20,
        width: '80%',

    },
    placeName: {
        fontSize: 13,
        color: '#3083FF',
        lineHeight: 15,
        textTransform: 'capitalize',
        fontFamily: 'PlusJakartaSans-Medium',
    },
    label: {
        color: 'rgba(85,90,106,0.63)',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
    },
    address: {
        flex: 1,
        gap: 10,
    },
    time: {
        color: 'rgba(85,90,106,0.63)',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
    },
    date: {
        color: 'rgba(85,90,106,0.63)',
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
    }, monthYearStyle: {
        fontFamily: 'PlusJakartaSans-Bold',
        fontWeight: undefined,
        fontSize: 12,
        color: '#3083FF',
    }, closebtn: {

        borderColor: "#3083FF",
        borderWidth: 1,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 5,


    }, closebtntxt: {
        fontFamily: 'PlusJakartaSans-Medium',
        color: '#3083FF',
        fontSize: 11,
        textAlign: "right"
    }, closebtncon: {
        alignItems: "flex-end"
    }, selectDate: {
        display: "flex",
        alignItems: "center",
        gap: 7,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderColor: "#3083FF",
        borderWidth: 1.5,
        flexDirection: "row",
        borderRadius: 14,
    }, curentdate: {


        borderRadius: 6,

        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',


        color: "#3083FF"
    }, filterbtncon: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
    }, filterbtn: {
        paddingHorizontal: 10,
        paddingVertical: 3,
        backgroundColor: "#3083FF",
        borderColor: "#3083FF",
        borderWidth: 1.5,
        borderRadius: 14,
    }, filterbtntxt: {
        fontSize: 12,
        fontFamily: 'PlusJakartaSans-Medium',
        color: "white",

    }
});
