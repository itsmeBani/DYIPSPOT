import React, {useEffect, useState} from 'react';
import axios from "axios";

function useReverseGeoCoding(longitude, latitude) {
    const [Address, setAddress] = useState(null)

    async function Reverse() {
        if (!longitude && !latitude) {
            return
        }
        try {
            const response = await axios.get(`https://api.mapbox.com/search/geocode/v6/reverse?longitude=${longitude}&latitude=${latitude}&access_token=pk.eyJ1IjoiamlvdmFuaTEyMyIsImEiOiJjbHl6bWE1Ymkxb2o5MmtzYngxaGJuMWljIn0.olBgfruAbty0QZdtvASqoQ`).catch((err) => console.log(err))
            setAddress(response)
        } catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {

            Reverse().then()

    }, [longitude, latitude])


    return {Address, setAddress}
}

export default useReverseGeoCoding;

