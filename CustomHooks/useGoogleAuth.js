import React, {useEffect, useState} from 'react';

function useGoogleAuth(token) {


    const [user, setUser] = useState(null);




    async  function  GoogleAuth () {

        const response = await fetch(process.env.EXPO_PUBLIC_GOOGLE_AUTH, {
            headers: {Authorization: `Bearer ${token}`}
        });

        const user = await response.json();
        setUser(user)
    }
    useEffect( ()=>{

          GoogleAuth.then()

    },[token])


    return {user}






}

export default useGoogleAuth;