import { getFirestore, doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore"
import { app } from '../firebase'

const firestore = getFirestore(app); 

export async function UpdateDocument(collectionName, docId, updatedData) {

  const collectionRef = collection(firestore, collectionName);
  const docRef = doc(collectionRef, docId);

  async function updateData() {

    await updateDoc(docRef, updatedData);

  }

  await updateData();
}