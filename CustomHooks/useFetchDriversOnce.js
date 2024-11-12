import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../api/firebase-config';  // Make sure to point to your Firebase config

const useFetchDriversOnce = () => {

    const [LocationData, setLocationData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
       const [refresh,setrefresh]=useState(false)
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {

            try {
                const collectionRef = collection(db, "drivers");
                const querySnapshot = await getDocs(collectionRef);
                const Data = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setLocationData(Data);
                console.log("refresh")
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data: ", error);
                setError(error);

            }
        };

        fetchData().then();
    }, [refresh]);

    return { LocationData, loading, error ,setrefresh,refresh};
};

export default useFetchDriversOnce;
