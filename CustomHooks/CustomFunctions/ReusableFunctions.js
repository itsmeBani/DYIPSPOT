import {collection, doc, getDocs, query, where} from "firebase/firestore";
import {db} from "../../api/firebase-config";

export async function getUserDocRefById(id, tableName) {
    const docRef = collection(db, tableName);
    const querySnapshot = await getDocs(query(docRef, where("id", "==", id)));
    if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        return doc(db, tableName, docId);
    } else {
        return  false
    }
}


export  async  function ConvertServerTimeStampToDate(RawDate){

    const hours = RawDate.getHours();
    const minutes = RawDate.getMinutes();
    const day=RawDate.getDate()
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;


    return {day,ampm ,formattedHours,formattedMinutes}

}