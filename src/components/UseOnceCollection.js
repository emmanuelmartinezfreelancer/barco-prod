import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore"
import { app } from '../firebase'


const firestore = getFirestore(app); 


export function UseOnceCollection(collectionName) {

  const [collectionData, setCollectionData] = useState([]);

  useEffect(() => {

    const collectionRef = collection(firestore, collectionName);

    async function fetchCollectionData() {
      const querySnapshot = await getDocs(collectionRef);
      const data = querySnapshot.docs.map((doc) => ({...doc.data()}));
      setCollectionData(data);
    }

    fetchCollectionData();

  }, [collectionName, firestore]);

  return collectionData;
}