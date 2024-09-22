import { useState, useEffect } from "react";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "../api/firebase-config";

const useFetchLocation = (tablename) => {
    const [LocationData, setLocationData] = useState(null);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, tablename), (snapshot) => {
            const Data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setLocationData(Data);
        });

        return () => unsubscribe();
    }, []);
    return [LocationData];
};

export default useFetchLocation;