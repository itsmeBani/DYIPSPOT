import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View, Text, Image, Button, Alert, ActivityIndicator} from 'react-native';
import MapboxGL, {LocationPuck, MarkerView, RasterLayer, RasterSource} from '@rnmapbox/maps';

import * as Location from 'expo-location';
import pin from '../assets/passengericon.png';
import pin1 from '../assets/pin4.png';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getRoute} from "../api/DirectionApi";
// Set your Mapbox access token
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);
import {UserLocation, Camera} from "@rnmapbox/maps";
import {Marker} from "react-native-maps";
import CategoryButton from "./CategoryButton";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import ReactNativeForegroundService from "@supersami/rn-foreground-service";

import * as TaskManager from 'expo-task-manager';
import {PermissionAndTaskManagerContext} from "../Context/PermissionAndTaskManagerProvider";
import useFetchLocation from "../CustomHooks/useFetchLocation";


const lineLayerStyle = {
    lineColor: '#ff0000',
};

const Map = () => {
    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    const [CurrentUserlocation, setCurrentUserlocation] = useState({});
    const [Direction, setDirection] = useState()
    const  {camera}=useContext(CurrentUserContext)
    const  {location}=useContext(PermissionAndTaskManagerContext)
    const [isMapLoaded, setIsMapLoaded] = useState(false)


    const [userLocationData] = useFetchLocation("users");

    // Fetch data for "drivers" collection
    const [driverLocationData] = useFetchLocation("drivers");




    const PassengerLocationMarker = {
        type: 'FeatureCollection',
        features: userLocationData?.map(user => ({
            type: 'Feature',
            properties: {
                icon: 'pin', // Use ImageUrl directly for the icon
                id: user?.id,
                name: user?.first,
                role: user?.role,
            },
            geometry: {
                type: 'Point',
                coordinates: [user?.longitude, user?.latitude], // [longitude, latitude]
            },
        })),
    };

    const DriverLocationMarker = {
        type: 'FeatureCollection',
        features: driverLocationData?.map(user => ({
            type: 'Feature',
            properties: {
                icon: 'pin1', // Use ImageUrl directly for the icon
                id: user?.id,
               name: user?.name,
            },
            geometry: {
                type: 'Point',
                coordinates: [user?.longitude, user?.latitude], // [longitude, latitude]
            },
        })),
    };



    const origincurrentuser = [
        location?.longitude ?? 120.4479174,
        location?.latitude ?? 16.92616
    ];


    const destination = [120.448687, 16.933407];


    const lineString = {
        type: 'Feature',
        geometry: {
            type: 'LineString',
            coordinates: [
                [-77.044211, 38.852924],
                [-77.045659, 38.860158],
                [-77.044232, 38.862326],
                [-77.040879, 38.865454],
                [-77.039936, 38.867698],
                [-77.040338, 38.86943],
                [-77.04264, 38.872528],
                [-77.03696, 38.878424],
                [-77.032309, 38.87937],
                [-77.030056, 38.880945],
                [-77.027645, 38.881779],
                [-77.026946, 38.882645],
                [-77.026942, 38.885502],
                [-77.028054, 38.887449],
                [-77.02806, 38.892088],
                [-77.03364, 38.892108],
                [-77.033643, 38.899926],
            ],
        },
    };
    // useEffect(() => {
    //     try {
    //         if (CurrentUserlocation) {
    //             getRoute(origincurrentuser, destination)
    //                 .then(data => {
    //
    //                     setDirection(data.routes[0].geometry.coordinates);
    //                 })
    //                 .catch(error => {
    //                     console.error('Error fetching directions:', error);
    //                 });
    //         }
    //     } catch (e) {
    //         console.error('Error fetching directions:', e);
    //     }
    // }, [location]);


    const onPointPress = async (event) => {
        alert(event.features)
        alert(JSON.stringify(event.features[0].properties.name))
    };

    const handleMapFullyRendered = () => {
        console.log("Map has fully rendered!");
        setIsMapLoaded(true); // You can use this to hide any loading indicator
    };
    return (
        <GestureHandlerRootView style={styles.container}>

            <StatusBar backgroundColor={"white"} barStyle={"dark-content"}/>

                <MapboxGL.MapView
                    projection={"globe"}

                    style={styles.map}
                    styleURL={"mapbox://styles/mapbox/streets-v12"}
                    pitchEnabled={true}
                    userLocationVisible={hasLocationPermission}
                    scaleBarEnabled={false}
                    attributionEnabled={false}
                    logoEnabled={false}

                >
                    <Camera
                        heading={-50}
                        animationDuration={7000}
                        ref={camera}
                        centerCoordinate={[120.448687, 16.933407]}
                        pitch={60}
                        zoomLevel={16}
                        animationMode="flyTo"

                        followUserLocation={false}
                        followZoomLevel={16.8}
                    />


                    { userLocationData ? <MapboxGL.ShapeSource id="passengermarkerSource" cluster={true} onPress={onPointPress} shape={PassengerLocationMarker}>




                            <MapboxGL.Images   images={{pin}} />



                            <MapboxGL.SymbolLayer

                                id="passengermarkerSymbolLayer"
                                style={{
                                    iconImage: ['get', 'icon'],
                                    iconSize: 0.3,
                                    textSize: 16,
                                    iconAllowOverlap: true,
                                    iconAnchor: 'bottom',

                                }}
                                onPress={(e) => console.log(e.features[0])}
                            />

                            <MapboxGL.CircleLayer
                                id="passengerclusteredPoints"
                                filter={['has', 'point_count']}
                                style={{
                                    circleColor: '#3083FF',
                                    circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                                    circleStrokeWidth: 3,
                                    circleStrokeColor: '#fff',
                                }}

                            />
                            <MapboxGL.SymbolLayer
                                id="passengerclusteredCount"
                                filter={['has', 'point_count']}
                                style={{
                                    textField: '{point_count_abbreviated}',
                                    textSize: 12,
                                    textPadding: 10,
                                    textColor: '#ffffff',
                                    textIgnorePlacement: true,
                                    textAllowOverlap: true,
                                }}
                            />

                        </MapboxGL.ShapeSource>:null  }


                    { driverLocationData ? <MapboxGL.ShapeSource id="drivermarkerSource" cluster={true} onPress={onPointPress} shape={DriverLocationMarker}>




                        <MapboxGL.Images  images={{pin1}} />



                        <MapboxGL.SymbolLayer

                            id="drivermarkerSymbolLayer"
                            style={{
                                iconImage: ['get', 'icon'],
                                iconSize: 0.3,
                                textSize: 16,
                                iconAllowOverlap: true,
                                iconAnchor: 'bottom',

                            }}
                            onPress={(e) => console.log(e.features[0])}
                        />

                        <MapboxGL.CircleLayer
                            id="driveclusteredPoints"
                            filter={['has', 'point_count']}
                            style={{
                                circleColor: '#3083FF',
                                circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                                circleStrokeWidth: 3,
                                circleStrokeColor: '#fff',
                            }}

                        />
                        <MapboxGL.SymbolLayer
                            id="driverclusteredCount"
                            filter={['has', 'point_count']}
                            style={{
                                textField: '{point_count_abbreviated}',
                                textSize: 12,
                                textPadding: 10,
                                textColor: '#ffffff',
                                textIgnorePlacement: true,
                                textAllowOverlap: true,
                            }}
                        />

                    </MapboxGL.ShapeSource>:null  }




                    {/*{origincurrentuser &&*/}
                    {/*    <MapboxGL.ShapeSource*/}
                    {/*        id="routeSource"*/}
                    {/*        lineMetrics*/}
                    {/*        shape={{*/}
                    {/*            properties: {},*/}
                    {/*            type: 'Feature',*/}
                    {/*            geometry: {*/}
                    {/*                type: 'LineString',*/}
                    {/*                coordinates: Direction,*/}
                    {/*            },*/}
                    {/*        }}>*/}
                    {/*        <MapboxGL.LineLayer*/}
                    {/*            id="exampleLineLayer"*/}
                    {/*            style={{*/}
                    {/*                lineColor: '#3083FF',*/}
                    {/*                lineCap: 'square',*/}
                    {/*                lineJoin: 'round',*/}
                    {/*                lineWidth: 5,*/}
                    {/*            }}*/}
                    {/*        />*/}
                    {/*    </MapboxGL.ShapeSource>*/}
                    {/*}*/}
                    {/*<MapboxGL.ShapeSource id="line-source" lineMetrics={true} shape={lineString}>*/}
                    {/*    <MapboxGL.LineLayer id="line-layer" style={styles1.lineLayer} />*/}
                    {/*</MapboxGL.ShapeSource>*/}

                </MapboxGL.MapView>
                <CategoryButton/>


        </GestureHandlerRootView>
    );
};

export default Map;
const styles = StyleSheet.create({

    container: {
        display: 'flex',
        height: '100%',
        width: '100%',
        backgroundColor: 'transparent',
    },
    map: {

        flex: 1,
        height: '100%',
    },
    annotationContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    markerImage: {
        opacity: 1,
        width: 34,
        height: 34,
    },
    calloutContainer: {
        width: 140,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calloutText: {
        color: 'black',
        fontSize: 14,
    },
});
const styles1 = {
    matchParent: {
        flex: 1,
    },

    lineLayer: {
        lineColor: 'red',
        lineCap: 'round',
        lineJoin: 'round',
        lineWidth: 6,
        lineGradient: [
            'interpolate',
            ['linear'],
            ['line-progress'],
            
            0,
            'blue',
            0.1,
            'royalblue',
            0.3,
            'cyan',
            0.5,
            'lime',
            0.7,
            'yellow',
            1,
            'red',
        ],
    },
};