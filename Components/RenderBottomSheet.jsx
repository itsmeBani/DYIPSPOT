
import UserBottomSheet from "./UserBottomSheet";
import DriverBottomSheet from "./DriverBottomSheet";
import JeepsBottomSheet from "./JeepsBottomSheet";
import CurrentUserProvider, {CurrentUserContext} from "../Context/CurrentUserProvider";
import {useContext} from "react";

const RenderBottomSheet = () => {
    const {CurrentUser} = useContext(CurrentUserContext)
    const {role}=CurrentUser
    return (
            <>
            {role === "passenger"?
                <>

                    <JeepsBottomSheet/>
                    <UserBottomSheet/>
                </>
                :
                <DriverBottomSheet/>

            }
            </>

    );
};

export default RenderBottomSheet;