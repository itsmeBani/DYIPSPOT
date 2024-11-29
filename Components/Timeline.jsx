import {MaterialIcons} from "@expo/vector-icons";
import StepIndicator from "react-native-step-indicator";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import useReverseGeoCoding from "../CustomHooks/useReverseGeoCoding";
import {useContext, useEffect} from "react";
import {PermissionAndTaskManagerContext} from "../Context/PermissionAndTaskManagerProvider";

const {width, height} = Dimensions.get("screen");

function Timeline({Startpoint,Destination}) {
    const {Address: StartpointAdress,setCoordinates:setStartPointCoordinates} = useReverseGeoCoding(Startpoint?.longitude, Startpoint?.latitude);
    const {Address: DestinationAddress,setCoordinates:setDestinationPointCoordinates} = useReverseGeoCoding(Destination?.longitude, Destination?.latitude)
    useEffect(()=>{
        setStartPointCoordinates({ longitude: Startpoint?.longitude, latitude: Startpoint?.latitude });
        setDestinationPointCoordinates({ longitude: Destination?.longitude, latitude: Destination?.latitude });
    },[Startpoint,Destination])




    const getStepIndicatorIconConfig = ({position, stepStatus,}) => {
        const iconConfig = {
            name: 'feed',
            color: stepStatus === 'finished' ? '#555454' : '#ffffff',
            size: 15,
        };
        switch (position) {
            case 0: {
                iconConfig.name = 'location-on';
                break;
            }
            case 1: {
                iconConfig.name = 'location-on';
                break;
            }
        }
        return iconConfig;
    };
    const getStepLabels = ({position, stepStatus,}) => {

        const labelsConfig = {
            name: 'feed',
            color: stepStatus === 'finished' ? '#4f4f4f' : '#3083ff',
            size: 15,
        };
        switch (position) {
            case 0: {
                labelsConfig.name = StartpointAdress?.data.features[0].properties?.context?.locality?.name +", "+
                    StartpointAdress?.data.features[0].properties?.context?.region?.name
                ;
                break;
            }
            case 1: {
                labelsConfig.name =  DestinationAddress?.data.features[0].properties?.context?.locality?.name +", "+
                    DestinationAddress?.data.features[0].properties?.context?.region?.name;
                break;
            }
        }
        return (

            <View style={{paddingLeft: 10}}>

                <Text style={{ width: width - 130,
                    color: labelsConfig.color,

                    fontSize: 13,

                    fontFamily: "PlusJakartaSans-Bold",
                }} numberOfLines={1}>{labelsConfig.name}</Text>



                <Text style={TimelineStyle.textlabel}
                      numberOfLines={1}>{position === 0 ? "Start point" : "Destination"}</Text>


            </View>
        );
    };


    const renderStepIndicator = (params) => (
        <MaterialIcons {...getStepIndicatorIconConfig(params)} />
    );


    const labels = ["Alilem", "Tagudin"];
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 30,
        separatorStrokeWidth: 2,
        currentStepStrokeWidth: 3,
        stepStrokeCurrentColor: '#3083FF',
        stepStrokeWidth: 2,

        stepStrokeFinishedColor: '#aaaaaa',
        stepStrokeUnFinishedColor: '#3083FF',

        separatorFinishedColor: '#aaaaaa',
        separatorUnFinishedColor: '#3083FF',

        stepIndicatorFinishedColor: '#ffffff',
        stepIndicatorUnFinishedColor: '#fff',

        stepIndicatorCurrentColor: '#3083FF',


        stepIndicatorLabelFontSize: 13,
        currentStepIndicatorLabelFontSize: 13,


        stepIndicatorLabelCurrentColor: '#3083FF',
        stepIndicatorLabelFinishedColor: '#555a6a',
        stepIndicatorLabelUnFinishedColor: '#555a6a',
        labelColor: '#999999',
        labelSize: 13,

        currentStepLabelColor: '#3083FF'
    }

    return (
<>
    { Startpoint?.longitude  && Startpoint?.latitude && Destination.latitude  && Destination.longitude ?
        <View style={TimelineStyle.timlebox}>

            <StepIndicator
                stepCount={2}
                customStyles={customStyles}
                direction={"vertical"}
                currentPosition={1}
                renderStepIndicator={renderStepIndicator}
                labels={labels}
                renderLabel={getStepLabels}
            />

        </View>:null}
</>
    );
}

export default Timeline;

const TimelineStyle = StyleSheet.create({
    timlebox: {
        display: 'flex',
        height: "auto",
        padding: 10,
  

    }
    , textlabel: {
        width: width - 130,
        fontSize: 12,
        color:"#4f4f4f",
        lineHeight:13,
        fontFamily: "PlusJakartaSans-Medium",

    }, titlelabel: {
        width: width - 130,
        color: "#555a6a",

        fontSize: 13,

        fontFamily: "PlusJakartaSans-Bold",

    }

})