import React, {useContext, useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity, View, Text} from 'react-native';
import MapboxGL, {Camera, Images, LocationPuck} from '@rnmapbox/maps';
import pin from '../assets/passengericon.png';
import pin1 from '../assets/jeepLogoPin.png';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import useFetchLocation from "../CustomHooks/useFetchLocation";
import {JeepStatusContext} from "../Context/JeepStatus";
import useFetchDriversOnce from "../CustomHooks/useFetchDriversOnce";
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";
import {getDoc} from "firebase/firestore";

import * as geolib from 'geolib';
import {getRoute} from "../api/DirectionApi";

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_API_KEY);
const Map = ({Mylocation}) => {
    const [hasLocationPermission, setHasLocationPermission] = useState(false);
    const {CurrentUser, mapStyle} = useContext(CurrentUserContext)
    const {FallowCurrentUser, setFallowCurrentUser} = useContext(JeepStatusContext)
    const {
        JeepStatusModal,
        setJeepid,
        setIsPassenger,
        setIsJeeps,
        setJeepStatusModal,
        isPassenger,
        isJeeps,
        line,
        camera,
        jeepid,
        hideRouteline,
        sethideRouteline,
        setline
    } = useContext(JeepStatusContext)
    const [userLocationData] = useFetchLocation("users");

    const [driverLocationData] = useFetchLocation("drivers");
    const FilterCurrentUser = userLocationData?.filter(user => user?.id !== CurrentUser?.id && user?.status === "waiting");


    const {OpenBottomSheet} = useContext(CurrentUserContext)


    const setJeepStatusAndLocation = async (id) => {
        setFallowCurrentUser(false)
        await OpenBottomSheet()
        await setJeepid(id)
        sethideRouteline(false)
        setIsJeeps(true)
        setIsPassenger(false)
    }
    const HandleMarkerOnPress = async (event) => {
        await setJeepStatusAndLocation(event?.features[0]?.properties?.id)
    }

    const HandleMarkerWithImageOnPress = async (id) => {
        await setJeepStatusAndLocation(id)
    }
    const PassengerLocationMarker = {
        type: 'FeatureCollection',
        features: FilterCurrentUser?.map(user => ({
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
    const FilterCurrentDriver = driverLocationData?.filter(user => user?.id !== CurrentUser?.id);

    const DriverLocationMarker = {
        type: 'FeatureCollection',
        features: FilterCurrentDriver?.map(user => ({
            type: 'Feature',
            properties: {
                // icon: `image-${user?.id}`,
                icon: 'pin1',
                id: user?.id,
                name: user?.name,
                startpoint: user?.startpoint,
                endpoint: user?.endpoint
            },
            geometry: {
                type: 'Point',
                coordinates: [user?.longitude, user?.latitude],
            },
        })),
    };


    const [loading, setloading] = useState(false)
    const [currentStatus, setCurrentStatus] = useState(null)


    useEffect(() => {
        const getStatus = async () => {
            setloading(true)
            try {
                const DriverUserdocRef = await getUserDocRefById(CurrentUser.id, CurrentUser?.role === "passenger" ? "users" : "drivers");
                if (DriverUserdocRef) {
                    const userDocSnap = await getDoc(DriverUserdocRef);
                    if (userDocSnap.exists()) {
                        setCurrentStatus(userDocSnap.data().status);
                        setloading(false)
                    }
                }
            } catch (err) {
                console.error('Error fetching user data:', err);
            }
        };
        getStatus().then();
    }, [userLocationData, driverLocationData]);


    return (
        <GestureHandlerRootView style={styles.container}>

            <MapboxGL.MapView
                projection={"globe"}
                style={styles.map}
                styleURL={mapStyle ? mapStyle : "mapbox://styles/mapbox/streets-v12"}
                pitchEnabled={true}
                onDidFinishRenderingMap={(e) => {
                    console.log(e)
                }}
                userLocationVisible={hasLocationPermission}
                scaleBarEnabled={false}
                attributionEnabled={false}
                logoEnabled={true}

                onCameraChanged={state => {
                    if (state.gestures.isGestureActive) {
                        setFallowCurrentUser(false)
                    }
                }
                }
                logoPosition={{top: 10, right: 10}}
            >

                {Mylocation &&
                    <LocationPuck
                        puckBearingEnabled={true}

                        visible={true}
                        pulsing={{
                            isEnabled: true,
                            radius: 70,
                            color: currentStatus === "online" ? "#34C759"
                                : currentStatus === "waiting" ? "#FFCC00"
                                    : "#FF3B30"
                        }}
                    />


                }
                <Camera
                    heading={-50}
                    ref={camera}
                    zoomLevel={16}
                    followUserLocation={FallowCurrentUser}
                    centerCoordinate={[120.448687, 16.933407]}
                    pitch={40}

                    animationDuration={4000} animationMode={"flyTo"}

                    followZoomLevel={15.8}
                />
                {/*{driverLocationData && isJeeps ?*/}
                {/*    <MapboxGL.ShapeSource id="drivermarkerSource" cluster={true}*/}
                {/*                          shape={DriverLocationMarker} onPress={event => HandleMarkerOnPress(event)}>*/}
                {/*       */}

                {/*<MapboxGL.Images*/}
                {/*    images={FilterCurrentDriver.reduce((acc, user) => {*/}
                {/*        if (user?.imageUrl) {*/}
                {/*            // Use the user's image URL (make sure the URLs are correct and accessible)*/}
                {/*            acc[`image-${user?.id}`] = user?.jeepImages[0];*/}
                {/*        }*/}
                {/*        return acc;*/}
                {/*    }, {})}*/}
                {/*/>*/}

                {/*    <MapboxGL.Images images={{pin1}}/>*/}
                {/*    <MapboxGL.SymbolLayer*/}

                {/*        id="drivermarkerSymbolLayer"*/}
                {/*        layerIndex={200}*/}

                {/*        style={{*/}
                {/*            iconImage: ['get', 'icon'],*/}
                {/*            iconSize: 0.25,*/}
                {/*            textSize: 16,*/}
                {/*            iconAllowOverlap: true,*/}
                {/*            iconAnchor: 'bottom',*/}

                {/*            // iconPitchAlignment: 'map'*/}

                {/*        }}*/}
                {/*        onPress={(e) => console.log(e.features[0])}*/}
                {/*    />*/}

                {/*    <MapboxGL.CircleLayer*/}
                {/*        id="driveclusteredPoints"*/}
                {/*        layerIndex={200}*/}
                {/*        filter={['has', 'point_count']}*/}
                {/*        style={{*/}
                {/*            circleColor: '#83a9ff',*/}
                {/*            circleRadius: ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],*/}
                {/*            circleStrokeWidth: 10,*/}
                {/*            circleStrokeColor: 'rgba(164,195,255,0.5)',*/}

                {/*        }}*/}

                {/*    />*/}

                {/*    <MapboxGL.SymbolLayer*/}
                {/*        id="driverclusteredCount"*/}
                {/*        filter={['has', 'point_count']}*/}

                {/*        style={{*/}
                {/*            textField: '{point_count_abbreviated}',*/}
                {/*            textSize: 12,*/}
                {/*            textPadding: 10,*/}
                {/*            textColor: '#ffffff',*/}
                {/*            textIgnorePlacement: true,*/}
                {/*            textAllowOverlap: true,*/}

                {/*        }}*/}
                {/*    />*/}

                {/*</MapboxGL.ShapeSource> : null}*/}


                {userLocationData && isPassenger ?
                    <MapboxGL.ShapeSource id="passengermarkerSource" cluster={true}
                                          shape={PassengerLocationMarker}>
                        <MapboxGL.Images images={{pin}}/>
                        <MapboxGL.SymbolLayer
                            id="passengermarkerSymbolLayer"
                            layerIndex={300}
                            style={{
                                iconImage: ['get', 'icon'],
                                iconSize: 0.3,
                                textSize: 16,

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


                {JeepStatusModal?.distance && !hideRouteline ?
                    <MapboxGL.ShapeSource

                        id="routeSource"
                        lineMetrics
                        shape={{
                            properties: {},
                            type: 'Feature',
                            geometry: {
                                type: 'LineString',
                                coordinates: JeepStatusModal?.distance?.routes[0]?.geometry.coordinates
                            },
                        }}>
                        <MapboxGL.LineLayer
                            layerIndex={mapStyle === "mapbox://styles/mapbox/streets-v12" ? 100 : 10}
                            slot="bottom"
                            id="exampleLineLayer"
                            style={styles1.lineLayer}
                        />
                    </MapboxGL.ShapeSource> : null
                }


                {/*{FilterCurrentDriver?.map((marker) => (*/}
                {/*    <MapboxGL.PointAnnotation*/}
                {/*        onSelected={()=>HandleMarkerOnPress(marker?.id)}*/}

                {/*        key={marker.id}*/}
                {/*        id={marker.id}*/}

                {/*        coordinate={[marker.longitude, marker.latitude]}  // Set marker coordinates*/}
                {/*    >*/}
                {/*        <View style={{*/}
                {/*            borderRadius: 30,*/}
                {/*            borderWidth: 3,*/}

                {/*            borderColor: '#fff',*/}
                {/*            overflow: 'hidden',  // Ensures the image stays within the circular boundary*/}

                {/*        }}>*/}

                {/*            <Image*/}
                {/*                source={{uri: marker.jeepImages[0]}}  // Assuming jeepImages is an array of URLs*/}
                {/*                style={{*/}
                {/*                    width: 35,*/}
                {/*                    height: 35,*/}
                {/*                    zIndex:11111,*/}

                {/*                }*/}
                {/*                }*/}
                {/*            />*/}

                {/*        </View>*/}
                {/*    </MapboxGL.PointAnnotation>*/}
                {/*))}*/}


                {FilterCurrentDriver?.map((driver) => {


                    return (
                        <MapboxGL.MarkerView  key={driver.id}
                            allowOverlap={true}
                            coordinate={[driver?.longitude, driver?.latitude]}
                        >
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => HandleMarkerWithImageOnPress(driver?.id)}
                                style={{alignItems: "center"}} // Center text and image together
                            >
                                <View>

                                </View>
                                <Image
                                    key={driver.id}
                                    source={{uri: driver?.jeepImages[0]}} // Assuming jeepImages is an array of URLs
                                    style={{
                                        width: 35,
                                        height: 35,
                                        borderRadius: 100,
                                        borderWidth: 3,
                                        //     borderColor: driver?.status === "online" ? "#34C759" : driver?.status === "waiting" ? "#FFCC00" : "#FF3B30",
                                        borderColor: "white",


                                    }}
                                />
                            </TouchableOpacity>
                        </MapboxGL.MarkerView>

                    )
                })}
            </MapboxGL.MapView>


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