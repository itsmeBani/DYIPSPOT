import RenderBottomSheet from "../Components/RenderBottomSheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Map from "../Components/map";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CurrentDriverProvider from "../Context/CurrentDriverProvider";
import {StatusBar} from "react-native";
import JeepStatusProvider  from "../Context/JeepStatus";

const MapTab = () => {
    return (
        <CurrentDriverProvider>
            <SafeAreaProvider>
                <GestureHandlerRootView>
                    <JeepStatusProvider>
                        <Map/>
                        <RenderBottomSheet/>
                    </JeepStatusProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </CurrentDriverProvider>

    );
};
export default MapTab;
