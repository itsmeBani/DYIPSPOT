import React, {useEffect, useState} from 'react';
import axios from "axios";

function useReverseGeoCoding() {

    const [Coordinates,setCoordinates]=useState({
        latitude:null,
        longitude:null

    })
    const [Address, setAddress] = useState(null)



    async function Reverse() {
        if (!Coordinates.longitude && !Coordinates.latitude) {
            return
        }
        try {
            const response = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${Coordinates.longitude}&latitude=${Coordinates.latitude}&access_token=pk.eyJ1IjoiamlvdmFuaTEyMyIsImEiOiJjbHl6bWE1Ymkxb2o5MmtzYngxaGJuMWljIn0.olBgfruAbty0QZdtvASqoQ`).catch((err) => console.log(err))
            setAddress(response)
        } catch (e) {
            console.log(e)
        }
    }






    useEffect(() => {

            Reverse().then()

    }, [Coordinates])


    return {Address, setCoordinates}
}

export default useReverseGeoCoding;

