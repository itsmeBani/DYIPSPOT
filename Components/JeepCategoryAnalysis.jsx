import * as React from 'react';
import {
    Animated,
    View,
    TouchableOpacity,
    StyleSheet,
    StatusBar, Text
} from 'react-native';
import {BarChart, LineChart, PieChart} from "react-native-gifted-charts"

import {TabView, SceneMap} from 'react-native-tab-view';

import Timeline from 'react-native-timeline-flatlist'
import TravelHistoryRoute from "./_CategoryTabs/TravelHistoryRoute";
import RecentTrips from "./_CategoryTabs/RecentTrips";
import PassengerAnalysis from "./_CategoryTabs/PassengerAnalysis";



export default function JeepCategoryAnalysis({data=null,getTableDataFromOneTable}) {


    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        {key: 'first', title: 'Daily Passengers'},
        {key: 'second', title: 'Travel History'},
        {key: 'third', title: 'Recent Trips'},
    ]);
    const handleIndexChange = (index) => setIndex(index);

    const renderTabBar = (props) => {
        const inputRange = props.navigationState.routes.map((x, i) => i);
        return (
            <View style={styles.tabBar}>
                {props.navigationState.routes.map((route, i) => {
                    const opacity = props.position.interpolate({
                        inputRange,
                        outputRange: inputRange.map((inputIndex) =>
                            inputIndex === i ? 1 : 0.8
                        ),
                    });
                    const color = props.navigationState.index === i ? '#3083FF' : '#959595'; // Change text color based on index
                    const fontFamily = props.navigationState.index === i ? 'PlusJakartaSans-Bold' : 'PlusJakartaSans-Medium'; // Change text color based on index
                    const isActive = props.navigationState.index === i; // Change text color based on index

                    return (
                        <TouchableOpacity

                            key={i}
                            style={styles.tabItem}
                            onPress={() => handleIndexChange(i)}>
                            <Animated.Text
                                style={[styles.tabtext, {opacity, color, fontFamily}]}>{route.title}</Animated.Text>
                            {isActive && <Animated.View
                                style={[
                                    styles.activeunderline]}
                            />}
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    const renderScene = ({route}) => {
        switch (route.key) {
            case 'first':
                return <PassengerAnalysis PassengersData={data} getTableDataFromOneTable={getTableDataFromOneTable} />;
            case 'second':
                return <TravelHistoryRoute  JeepHistoryData={data} getTableDataFromOneTable={getTableDataFromOneTable} />;
            case 'third':
                return <RecentTrips  RecentTrips={data} getTableDataFromOneTable={getTableDataFromOneTable}/>
            default:
                return null;
        }
    };

    return (
        <TabView
            swipeEnabled={true}
            sceneContainerStyle={{backgroundColor: "white",paddingHorizontal:30,justifyContent: "center"}}
            navigationState={{index, routes}}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={handleIndexChange}
        />
    );

}

const styles = StyleSheet.create({
    container: {
        flex: 1,


    },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: "white",

        paddingHorizontal: 20,
    },
    tabItem: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        alignItems: 'flex-start',
    }, tabtext: {
        paddingBottom: 3,
        color: "#959595",
        fontSize: 12,
        fontFamily: "PlusJakartaSans-Medium",
    }, activeunderline: {
        width: "70%",
        height: 2,
        borderRadius: 20,
        top: 0,
        backgroundColor: "#3083FF"
    },title:{
        color: "#3083FF",
        fontWeight:undefined,
        fontSize: 13,
        fontFamily:"PlusJakartaSans-Medium"
    }
});