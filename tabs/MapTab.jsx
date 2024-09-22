import RenderBottomSheet from "../Components/RenderBottomSheet";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import Map from "../Components/map";
import {SafeAreaProvider} from 'react-native-safe-area-context';
import CurrentDriverProvider from "../Context/CurrentDriverProvider";
0
const MapTab = () => {
    return (
        <CurrentDriverProvider>
            <SafeAreaProvider>
                <GestureHandlerRootView>
                    <Map/>
                    <RenderBottomSheet/>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </CurrentDriverProvider>

    );
};
export default MapTab;
