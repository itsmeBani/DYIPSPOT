import React, {useContext, useEffect, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, StatusBar, View, Text, Image, Button, Alert, ActivityIndicator} from 'react-native';
import MapboxGL, {LocationPuck, MarkerView, RasterLayer, RasterSource} from '@rnmapbox/maps';
import pin from '../assets/passengericon.png';
import pin1 from '../assets/jeepLogoPin.png';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {getRoute} from "../api/DirectionApi";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);
import {UserLocation, Camera} from "@rnmapbox/maps";

import CategoryButton from "./CategoryButton";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import useFetchLocation from "../CustomHooks/useFetchLocation";
import DirectionButton from "./DirectionButton";
import {JeepStatusContext} from "../Context/JeepStatus";
import PopUpModal from "./PopUpModal";


const Map = () => {
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const {camera, CurrentUser} = useContext(CurrentUserContext)
    const [isMapLoaded, setIsMapLoaded] = useState(false)

    const [userLocationData] = useFetchLocation("users");
    const {JeepStatusModal, setJeepStatusModal,isPassenger, isJeeps, line,   hideRouteline, sethideRouteline, setline} = useContext(JeepStatusContext)
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
                   icon: 'pin1',  // Use ImageUrl directly for the icon
                id: user?.id,
                name: user?.name,
                startpoint: user?.startpoint,
                endpoint: user?.endpoint
            },
            geometry: {
                type: 'Point',
                coordinates: [user?.longitude, user?.latitude], // [longitude, latitude]
            },
        })),
    };





  const  [EstimatedArrivalTime,setEstimatedArrivalTime]=useState()
  const [Distance,setDistance] = useState()

    useEffect(() => {
        async function RenderRoute() {
            const startPoint = JeepStatusModal?.currentLocation || [0,0]
            const endPoint = JeepStatusModal?.destination || [0,0]
            try {
                const response = await getRoute(startPoint, endPoint)


              await  setEstimatedArrivalTime(response.routes[0].duration)
               await setDistance(response.routes[0].distance)
                await setline(response.routes[0].geometry.coordinates)


            } catch (e) {
                await setline(null)

            }
        }
        if (!setJeepStatusModal?.currentLocation && setJeepStatusModal?.endpoint) {
            setJeepStatusModal({})
            return
        }
        RenderRoute().then()
    },[JeepStatusModal])


    const onPointPressPassnger = () => {
        setline(null)
    }
    const handleMapFullyRendered = () => {
        console.log("Map has fully rendered!");
        setIsMapLoaded(true); // You can use this to hide any loading indicator
    };

    const CustomMarker = ({coordinate, iconUrl}) => {
        return (
            <MapboxGL.MarkerView coordinate={coordinate} anchor={{x: 0.5, y: 1}}>
                <MapboxGL.Images source={{uri: iconUrl}} style={{width: 30, height: 30}}/>
            </MapboxGL.MarkerView>
        );
    };



    return (
        <GestureHandlerRootView style={styles.container}>

            <MapboxGL.MapView
                projection={"globe"}
                style={styles.map}
                styleURL={"mapbox://styles/mapbox/streets-v12"}
                pitchEnabled={true}
                onDidFinishRenderingMapFully={() => {
                    alert("")
                }}
                userLocationVisible={hasLocationPermission}
                scaleBarEnabled={false}
                attributionEnabled={false}
                logoEnabled={true}
                logoPosition={{top: 10, right: 10}}

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
                {driverLocationData && isJeeps ?
                    <MapboxGL.ShapeSource id="drivermarkerSource" cluster={true}
                                          shape={DriverLocationMarker}>
                        <MapboxGL.Images images={{pin1}}/>

                        <MapboxGL.SymbolLayer

                            id="drivermarkerSymbolLayer"
                            layerIndex={200}

                            style={{
                                iconImage: ['get', 'icon'],
                                iconSize: 0.25,
                                textSize: 16,
                                iconAllowOverlap: true,
                                iconAnchor: 'bottom',

                                // iconPitchAlignment: 'map',

                            }}
                            onPress={(e) => console.log(e.features[0])}
                        />

                        <MapboxGL.CircleLayer
                            id="driveclusteredPoints"
                            layerIndex={200}
                            filter={['has', 'point_count']}
                            style={{
                                circleColor: '#83a9ff',
                                circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                                circleStrokeWidth: 10,
                                circleStrokeColor: 'rgba(164,195,255,0.5)',

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

                    </MapboxGL.ShapeSource> : null}
                {userLocationData && isPassenger ?
                    <MapboxGL.ShapeSource id="passengermarkerSource" cluster={true} onPress={onPointPressPassnger}
                                          shape={PassengerLocationMarker}>
                        <MapboxGL.Images images={{pin}}/>
                        <MapboxGL.SymbolLayer
                            id="passengermarkerSymbolLayer"
                            layerIndex={300}
                            style={{
                                iconImage: ['get', 'icon'],
                                iconSize: 0.3,
                                textSize: 16,
                                symbolAvoidEdges: true,
                                iconIgnorePlacement: true,
                                iconAllowOverlap: true,
                                iconAnchor: 'bottom',
                            }}
                            onPress={(e) => console.log(e.features[0])}
                        />
                        <MapboxGL.CircleLayer
                            id="passengerclusteredPoints"
                            layerIndex={300}
                            filter={['has', 'point_count']}
                            style={{

                                circleColor: '#3083FF',
                                circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
                                circleStrokeWidth: 10,
                                circleStrokeColor: 'rgba(48,131,255,0.38)',
                            }}
                        />
                        <MapboxGL.SymbolLayer
                            id="passengerclusteredCount"
                            filter={['has', 'point_count']}
                            style={{
                                textField: '{point_count_abbreviated}',
                                textSize: 12,
                                textPadding: 5,
                                textColor: '#ffffff',
                                textIgnorePlacement: true,
                                textAllowOverlap: true,
                            }}
                        />
                    </MapboxGL.ShapeSource> : null}


                { hideRouteline  && line ?
                    <MapboxGL.ShapeSource

                        id="routeSource"
                        lineMetrics
                        shape={{
                            properties: {},
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: line,
                            },
                        }}>
                        <MapboxGL.LineLayer
                            layerIndex={100}
                            slot="bottom"
                            id="exampleLineLayer"
                            style={styles1.lineLayer}
                        />
                    </MapboxGL.ShapeSource>:null
                }


            </MapboxGL.MapView>


            <CategoryButton
            />


            {CurrentUser.role === "driver" && <DirectionButton/>}


                                              <PopUpModal     data={JeepStatusModal}
                                              EstimatedArrivalTime={EstimatedArrivalTime}
                                              Distance={Distance}/>





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

        lineColor: '#3083FF',
        lineCap: 'square',
        lineJoin: 'round',
        lineWidth: 7,

        // lineGradient: [
        //     'interpolate',
        //     ['linear'],
        //     ['line-progress'],
        //
        //     0,
        //     'blue',
        //     0.1,
        //     'royalblue',
        //     0.3,
        //     'cyan',
        //     0.5,
        //     'lime',
        //     0.7,
        //     'yellow',
        //     1,
        //     'red',
        // ],
    },
};