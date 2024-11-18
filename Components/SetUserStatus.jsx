import React, {useContext, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, TouchableWithoutFeedback, ActivityIndicator} from 'react-native';
import {MotiView} from 'moti';
import {Easing, useAnimatedStyle, useSharedValue, withTiming} from "react-native-reanimated";
import {CurrentUserContext} from "../Context/CurrentUserProvider";
import {getUserDocRefById} from "../CustomHooks/CustomFunctions/ReusableFunctions";
import {getDocs,getDoc, updateDoc} from "firebase/firestore";
import Pulse from "react-native-pulse";
import useFetchDriversOnce from "../CustomHooks/useFetchDriversOnce";

function SetStatus() {
    const translateY = useSharedValue(300);
    const {CurrentUser} = useContext(CurrentUserContext)
    const [isVisible, setIsVisible] = React.useState(false);
    const [loading, setloading] = useState(false)
    const  [refresh,setRefresh] = useState(false)
    const {setrefresh,refresh:refreshjeeps} = useFetchDriversOnce();


    const [currentStatus, setCurrentStatus] =useState(null)
    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: translateY.value}], // Animate the vertical position
            elevation: translateY.value === 0 ? 5 : 0, // Elevation to create depth effect
        };
    });

    const openModal = () => {
        setIsVisible(true); // Set visibility to true
        translateY.value = withTiming(0, {duration:200, easing: Easing.inOut(Easing.quad)}); // Slide in
    };

    const closeAnimatedModal = () => {
        translateY.value = withTiming(30, {duration: 300, easing: Easing.inOut(Easing.quad)}); // Slide out
        setIsVisible(false);
    };

    const handlePress = () => {
        if (isVisible) {
            closeAnimatedModal();
        } else {
            openModal();
        }
    };



    const setStatus = async (status) => {
        setloading(true)
        const CurrentUserdocRef = await getUserDocRefById(CurrentUser.id, CurrentUser?.role === "passenger" ? "users" : "drivers");

        try {
            await updateDoc(CurrentUserdocRef, {
                status: status
            });

            setIsVisible(false)
            setRefresh(!refresh)
            setloading(false)
            setrefresh(!refreshjeeps)
        } catch (e) {


        }

    }
    useEffect(() => {
        const getStatus = async () => {
            setloading(true)
            try {

                const CurrentUserdocRef = await getUserDocRefById(CurrentUser.id, CurrentUser?.role === "passenger" ? "users" : "drivers");
                if (CurrentUserdocRef) {
                    const userDocSnap = await getDoc(CurrentUserdocRef);
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
    }, [refresh]);

    const StatusIndicator = ({color, label, onPress, animationDuration}) => {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
                <MotiView
                    from={{opacity: 0, translateY: 20}} // Start with opacity 0 and translateY 20
                    animate={{opacity: 1, translateY: 0}} // Animate to opacity 1 and translateY 0
                    exit={{opacity: 0, translateY: 20}} // Reverse animation on exit
                    transition={{type: 'timing', duration: animationDuration}}
                    style={styles.statusbar}
                >
                    <View style={[styles.indicator, {backgroundColor: color}]}/>

                    <Text style={[styles.statustxt, {color}]}>{label}</Text>
                </MotiView>
            </TouchableOpacity>
        );
    };


    return (

        <View style={{alignItems: "center", gap: 25}}>
            {isVisible && (
            <View style={{height: CurrentUser?.role === "driver" ? 100: 65, width: 100}}>
                <View style={{position: "absolute", width: "100%", alignItems: "center", justifyContent: "center"}}>

                        <MotiView style={[styles.statusContainer, animatedStyle]}>
                            <StatusIndicator
                                color="#FFCC00"
                                label="Waiting"
                                onPress={() => setStatus("waiting")}
                                animationDuration={500}
                            />
                            <StatusIndicator
                                color="#34C759"
                                label={CurrentUser?.role=== "driver" ? "operate":"online"}
                                onPress={() => setStatus("online")}
                                animationDuration={300}
                            />
                            {CurrentUser?.role=== "driver" &&
                                <StatusIndicator
                                    color="#FF3B30"
                                    label="Offline"
                                    onPress={() => setStatus("offline")}
                                    animationDuration={100}
                                />


                            }
                        </MotiView>

                </View>
            </View>

                        )}
           <View style={{
                   width: 100}}>
               {currentStatus &&        <TouchableOpacity activeOpacity={0.9} style={{width:100,alignItems:"center"}} onPress={handlePress}>
                   <View style={{
                       width: 40,
                       padding: 8,
                       height: 40,
                       borderRadius: 100,
                       backgroundColor:currentStatus === "online" ? "rgba(52,199,89,0.64)"  : currentStatus === "waiting"?  "rgba(255,204,0,0.67)" :"rgba(255,59,48,0.74)",


                   }}>


                       <View style={{
                           flex: 1,
                           borderRadius: 100,
                           elevation: 4,
                           backgroundColor:currentStatus === "online" ? "#34C759"  : currentStatus === "waiting"?  "#FFCC00" :"#FF3B30",
                           alignItems: "center",
                           justifyContent: "center"
                       }}>

                           {loading && <ActivityIndicator color={"white"} size={15}/>}
                       </View>
                   </View>
               </TouchableOpacity>

               }
           </View>
        </View>

    );
}

export default SetStatus;

const styles = StyleSheet.create({
    toggleButton: {
        width: 50,
        height: 50,
        padding: 7,
        borderRadius: 100,
        backgroundColor: "#3083FF",
        elevation: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    innerButton: {
        flex: 1,
        borderRadius: 100,
        backgroundColor: "#34C759",
    },
    statusContainer: {
        display: "flex",
        gap: 10,
    },
    statusbar: {
        backgroundColor: "white",
        paddingHorizontal: 8,
        paddingVertical: 6,
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        elevation: 3,
        borderRadius: 15,
    },
    statustxt: {
        fontSize: 11,
        color: '#34C759',
        fontFamily: "PlusJakartaSans-Medium",
    },
    indicator: {
        width: 15,
        height: 15,
        borderRadius: 100,
    },
});
