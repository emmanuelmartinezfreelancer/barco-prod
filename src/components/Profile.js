import {React, useState, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext"
import { app } from '../firebase'
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"

const firestore = getFirestore(app); 

export function Profile() {

  
  const { user, logout, loading } = useAuth();

  const [userDoc, setuserDoc] = useState(null);

  const [artistName, setartistName] = useState(null);

  const [artworkImage, setartworkImage] = useState(null);

  const [arrayArtworks, setarrayArtworks] = useState(null);

  let slashbirth = " / ";

  const searchOrCreateDocument = async(idDocumento)=>{

    //Crear referencia al documento
    const docuRef = doc(firestore, `users/${idDocumento}`)
     
    const query = await getDoc(docuRef);
  
    const infoDocu = query.data();
  
    return infoDocu;

  
  }

  console.log("Profile", userDoc);

  useEffect(()=>{

    async function fetchFirebase(){

      const userDocReference = await searchOrCreateDocument(user.email);

      setuserDoc(userDocReference);

      setartistName(userDocReference.artistname);       

      setarrayArtworks(userDocReference.artworks)

    }

    fetchFirebase();      

  },[])

    return (

      

          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-2 border-black rounded-lg shadow-lg relative flex flex-col w-full bg-teal-400  outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-black rounded-t ">
{/*                 <button
                    className="bg-transparent text-black float-right"
                    onClick={() => setShowModal(false)}
                    >
                    <p className="text-black opacity-7 h-6 w-6 text-xl block border-2 border-black py-0 rounded-full">
                      
                    </p>
                  </button> */}
                  <h3 className="text-xl font=semibold text-black">PROFILE</h3>
                  </div>
               
               { userDoc &&
               <>
                <div className="relative w-full p-6 flex-auto text-black">
         

                <h3 className="text-xl">Nombre de usuario</h3>
                <p className="mt-2 pt-1 pb-2">{ userDoc.artistname }</p>

                <h3 className="text-xl mt-2">Correo electrónico</h3>
                <p className="mt-2 pt-1 pb-2">{ userDoc.email }</p>

                <h3 className="text-xl mt-2">Dirección</h3>
                <p className="mt-2 pt-1 pb-2">{ userDoc.address }</p>

                <h3 className="text-xl mt-2">Fecha de Nacimiento</h3>
                <p className="mt-2 pt-1 pb-2">{ userDoc.birth.day ? userDoc.birth.day + slashbirth + userDoc.birth.month + slashbirth + userDoc.birth.year : userDoc.birth }</p>

                <h3 className="text-xl mt-2">Teléfono</h3>
                <p className="mt-2 pt-1 pb-2">{ userDoc.phone }</p>

                <h3 className="text-xl mt-2">Disciplina</h3>
                <p className="mt-2 pt-1 pb-2">{ userDoc.discipline }</p>
{/*                 <h3 className="text-xl mt-2">CV</h3>
                <a href={userDoc.cvUrl}><p className="mt-2 pt-1 pb-2">Click para descargar</p></a> */}
                </div>

                </>
       
              }




                
                <div className="flex items-center justify-end p-6 border-t border-solid border-black rounded-b">

                  <Link to="/">
                  <button
                    className="border-2 border-black  text-black hover:text-white hover:bg-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ml-48"
                    type="button"                 
                  >
                    Close
                  </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
 
        
    );
  }

  