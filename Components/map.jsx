import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import MapboxGL, {Camera, LocationPuck} from '@rnmapbox/maps';
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
    const { CurrentUser} = useContext(CurrentUserContext)
    const {FallowCurrentUser,setFallowCurrentUser}=useContext(JeepStatusContext)
    const {JeepStatusModal, setJeepStatusModal,isPassenger, isJeeps, line,camera,jeepid,   hideRouteline, sethideRouteline, setline} = useContext(JeepStatusContext)
    const [userLocationData] = useFetchLocation("users");

    const [driverLocationData] = useFetchLocation("drivers");
    const FilterCurrentUser = userLocationData?.filter(user => user?.status === "waiting");

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
    const FilterCurrentDriver = driverLocationData?.filter(user =>  user?.id !== CurrentUser?.id );

    const DriverLocationMarker = {
        type: 'FeatureCollection',
        features: FilterCurrentDriver?.map(user => ({
            type: 'Feature',
            properties: {
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
    const  [refresh,setRefresh] = useState(false)
    const {setrefresh,refresh:refreshjeeps} = useFetchDriversOnce();
    const [currentStatus, setCurrentStatus] =useState(null)


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
    }, [userLocationData,driverLocationData]);



    async function NearestPassenger() {
        return geolib.findNearest(
            { latitude: 120.47442912935381, longitude: 16.929432213580146 },
            [
                ...FilterCurrentUser?.map(user => ({
                    latitude: user?.latitude,
                    longitude: user?.longitude,
                })) || []
            ]
        );
    }
    const fetchNearestPassenger = async () => {
        try {
            const nearestPassenger = await NearestPassenger();
            //
            const response =await getRoute([120.47442912935381,16.929432213580146], { latitude: nearestPassenger?.latitude, longitude: nearestPassenger?.longitude })
               const distance= response.routes[0]?.distance
            const converteddistance =
                distance > 1000
                    ? `${(distance / 1000).toFixed(2)} km`
                    : `${distance} meters`;

            console.log(converteddistance)





        } catch (error) {
            console.error('Error finding nearest passenger:', error);
        }
    };
    useEffect(() => {


        fetchNearestPassenger().then();
    }, [userLocationData]);
    return (
        <GestureHandlerRootView style={styles.container}>

            <MapboxGL.MapView
                projection={"globe"}
                style={styles.map}
                styleURL={"mapbox://styles/mapbox/streets-v12"}
                pitchEnabled={true}
                onDidFinishRenderingMap={(e)=>{console.log(e)}}
                userLocationVisible={hasLocationPermission}
                scaleBarEnabled={false}
                attributionEnabled={false}
                logoEnabled={true}
                onCameraChanged={state => {
                    if (state.gestures.isGestureActive){
                        setFallowCurrentUser(false)
                    }
                }
                }
                logoPosition={{top: 10, right: 10}}
            >

                { Mylocation &&
                    <LocationPuck
                    scale={0.}

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
                    animationDuration={7000}
                    ref={camera}
                    centerCoordinate={[120.448687, 16.933407]}
                    pitch={60}
                    zoomLevel={16}
                    animationMode="flyTo"
                    followUserLocation={FallowCurrentUser}

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



                {JeepStatusModal?.distance && !hideRouteline  ?
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
                            layerIndex={100}
                            slot="bottom"
                            id="exampleLineLayer"
                            style={styles1.lineLayer}
                        />
                    </MapboxGL.ShapeSource>:null
                }

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