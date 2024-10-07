import React, {useContext} from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Button, StatusBar, Text, View} from 'react-native';
import MapTab from "./MapTab"
import {SafeAreaProvider} from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Foundation from '@expo/vector-icons/Foundation';
import WelcomePage from "../Components/WelcomePage";
import  Header from "../Components/Header";
import {NavigationContainer} from "@react-navigation/native";
import SettingsTab from "./SettingsTab";
import PermissionAndTaskManagerProvider, {
    PermissionAndTaskManagerContext
} from "../Context/PermissionAndTaskManagerProvider";
import HomeTab from "./HomeTab";


function IndexTab(props) {
    const Tab = createBottomTabNavigator();

    const TabStyle = {


        tabBarLabelStyle: {
            fontSize: 9,
            gap: 20,
            position:"absolute",

            bottom:-2,
            fontFamily:"PlusJakartaSans-Medium",// Adjust this value to change the label font size
            paddingBottom: 1, // Adjust this value to change the padding between the icon and text
        },

        tabBarStyle: {
            shadowColor: 'black',
            paddingTop:2,
            height:55,
            display: 'flex',
            paddingBottom:10,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            // Adjust this value to change the padding inside the tab bar
        },

        tabBarActiveTintColor: '#3083FF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,

        headerStyle: {
            backgroundColor: "#fff",
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
            shadowColor: 'black',
        },

    }

    return (

        <PermissionAndTaskManagerProvider>
            <StatusBar backgroundColor={"white"} barStyle={"dark-content"}/>
            <SafeAreaProvider>
                <NavigationContainer independent={true}>
                  <Tab.Navigator screenOptions={({route}) => ({
                      tabBarIcon: ({focused, color, size}) => {
                              if (route.name === 'Home') {
                              return <Foundation name="home" size={20} color={color}/>

                          } else if (route.name === 'Settings') {
                              return <Ionicons name="settings" size={20} color={color} />
                          } else if (route.name === 'Track') {
                              return <MaterialCommunityIcons name="jeepney" size={20} color={color}/>
                          }
                      }, ...TabStyle,
                  })}
                  >
                      <Tab.Screen name="Home" component={HomeTab}
                                  options={{
                                      headerTitle: () => <Header/>,
                                      headerStyle: {
                                          backgroundColor: '#fff',
                                          shadowColor: 'black',
                                          shadowRadius: 30,
                                          elevation: 5

                                      },
                                      tabBarLabelPosition:"below-icon",
                                      headerShown: true,
                                      headerTintColor: '#333'
                                  }}



                      />
                      <Tab.Screen name="Track"
                                  options={{
                                      headerTitle: () => <Header/>,
                                      headerStyle: {
                                          backgroundColor: '#fff',
                                          shadowColor: 'black',
                                          shadowRadius:30,
                                          elevation:10

                                      },
                                      tabBarLabelPosition:"below-icon",
                                      headerShown: true,
                                      headerTintColor: '#333'
                                  }} component={MapTab}/>


                      <Tab.Screen name="Settings" component={SettingsTab}/>
                  </Tab.Navigator>
              </NavigationContainer>
            </SafeAreaProvider>
        </PermissionAndTaskManagerProvider>
    );
}

export default IndexTab;
