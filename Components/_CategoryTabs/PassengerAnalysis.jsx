import React, {useState} from 'react';
import {ScrollView, Text, View} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import ModalDatePicker from "../ModalDatePicker";

const screenWidth = Dimensions.get('window').width;

function PassengerAnalysis({ PassengersData }) {

    const [date, setDate] = useState(null);
    const PassengersDatas = [
        { month: 'Jan', count: 40 },
        { month: 'Feb', count: 45 },
        { month: 'Mar', count: 28 },
        { month: 'Jan', count: 40 },
        { month: 'Feb', count: 45 },
        { month: 'Mar', count: 28 },
        { month: 'Jan', count: 40 },
        { month: 'Feb', count: 45 },


    ];
    const chartConfig = {
        backgroundGradientFrom: '#000000',
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: 'rgba(255,255,255,0)',
        backgroundGradientToOpacity: 0.,
        color: (opacity = 1) => `rgba(48, 131, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        elevation:2,
        useShadowColorFromDataset: true // optional
    };

    // Generate data for the chart based on the PassengersData prop
    const data = {
        labels: PassengersDatas.map(data => data.month), // Assuming your data has 'month' property
        datasets: [
            {
                data: PassengersDatas.map(data => data.count), // Assuming your data has 'count' property
                color: (opacity = 1) => `rgba(48, 131, 255, ${opacity})`, // optional
                strokeWidth: 2 // optional
            }
        ],
        legend: ['Passenger Count'] // optional
    };

    return (
        <View style={{ flex:1}}>
<ModalDatePicker date={date} setDate={setDate}/>
       <ScrollView horizontal={true} style={{paddingTop:20}} showsHorizontalScrollIndicator={false}>
           <LineChart
               data={data}
               width={screenWidth}
               height={200}
               style={{flex:1}}
               verticalLabelRotation={0}
               chartConfig={chartConfig}
               bezier
           />
       </ScrollView>
        </View>
    );
}

export default PassengerAnalysis;
