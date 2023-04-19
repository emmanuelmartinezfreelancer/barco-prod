import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore"
import { app } from '../firebase'


const firestore = getFirestore(app); 


export function GetDocument(collectionName, docId) {

  const [docData, setdocData] = useState("");

  useEffect(() => {

    const docuRef = doc(firestore, `${collectionName}/${docId}/`)

    async function fetchDocData() {

      const docSnap = await getDoc(docuRef);

      const data = docSnap.data();

      setdocData(data);
    }
    
    fetchDocData();

  }, [collectionName, firestore, docId]);

  return docData;
}


/* 


const getData = async () => {
        
  

  let docInfo;

  const docSnap = await getDoc(docuRef);

  docInfo = docSnap.data();

  let currentValue = docInfo.current;

  return currentValue;

}

const currentNumber = getData();

return currentNumber */