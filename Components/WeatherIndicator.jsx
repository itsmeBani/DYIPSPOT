import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import axios from 'axios';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from '@expo/vector-icons/Entypo';
import Octicons from '@expo/vector-icons/Octicons';
const WeatherIndicator = () => {
    const [temperature, setTemperature] = useState(null);
    const [weatherCondition, setWeatherCondition] = useState(null);
    const [loading, setLoading] = useState(true);
    const fetchWeather = async () => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=Alilem,PH&units=metric&appid=385d1ca69f63972d08204be0ac485242`
            );
            const temp = response.data.main.temp;
            console.log(temp)
            const condition = response.data.weather[0].main;
            setTemperature(temp);
            setWeatherCondition(condition);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchWeather().then();
    }, []);
    const getWeatherIcon = () => {
        switch (weatherCondition) {
            case "Clear":
                return<Octicons name="sun" size={24} color="#0099ff"/>;
            case "Clouds":
                return <MaterialCommunityIcons name="weather-cloudy" size={24} color="#0099ff"/>;
            case "Rain":
                return <Ionicons name="rainy-outline" size={24} color="#0099ff"/>;
            case "Thunderstorm":
                return <MaterialCommunityIcons name="weather-lightning-rainy" size={24} color="#0099ff"/>;
            default:
                return <MaterialCommunityIcons name="weather-cloudy" size={24} color="#0099ff"/>;
        }
    };

    return (
        <View style={{flexDirection: "row", gap: 10,}}>

            <View style={Weatherstyle.weather}>
                {getWeatherIcon()}
                <Text style={Weatherstyle.weathertxt}>
                    {loading ? "Loading..." : `${temperature}°`}
                </Text>
            </View>

            <View style={{ position:"relative"}}>
                {weatherCondition === "Thunderstorm" || weatherCondition === "Thunderstorm"

                    ? (
                        <View  style={{position:"absolute", backgroundColor: "#FFF3C6FF",borderRadius: 10, alignItems: "center", flexDirection: "row", flex: 1, gap: 5, padding: 10}}>
                            <Entypo name="warning" size={20} color="#FFCC00FF"/>
                            <Text style={Weatherstyle.warningtxt}>
                                Due to rainy conditions,
                                some drivers may not operate.</Text>

                        </View>
                    ) : ""

                }
            </View>

        </View>
    );
};

export default WeatherIndicator;
const Weatherstyle = StyleSheet.create({

    weather: {

        backgroundColor: "#fff",
        paddingVertical: 7,
        display: "flex",
        flexDirection: "row",
        elevation: 3,
        borderRadius: 10,
        gap: 6,
        paddingHorizontal: 9,
        alignItems: "center",
    }, weathertxt: {
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 10,

        height: "100%",
        color: "#605f5f"
    },

    warningtxt: {
        width: 150,
        display: "flex",
        fontFamily: "PlusJakartaSans-Medium",
        fontSize: 10,
        color: "#605f5f"
    }
})

