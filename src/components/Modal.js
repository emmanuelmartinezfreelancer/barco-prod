import React, { useState, useEffect } from "react";
import imgArt from "../img/M1.jpg"
import { useAuth } from "../context/authContext"
import { AiOutlineEye } from "react-icons/ai"
import { HiExternalLink } from "react-icons/hi"
import { app } from '../firebase'
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom";


const firestore = getFirestore(app); 
const Modal = ({ artwork, artistName, imgurl }) => {
  
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const [userDoc, setuserDoc] = useState(null);

  const [arrayArtworks, setarrayArtworks] = useState(null);

  const navigate = useNavigate();


  const searchOrCreateDocument = async(idDocumento)=>{
  
    //Crear referencia al documento
    const docuRef = doc(firestore, `users/${idDocumento}`)
     
    const query = await getDoc(docuRef);
  
    const infoDocu = query.data();
  
    return infoDocu;
  
  }
  
  useEffect(()=>{

    async function fetchFirebase(){

      const userDocReference = await searchOrCreateDocument(user.email);

      setuserDoc(userDocReference);

      setarrayArtworks(userDocReference.artworks)

      /* console.log("Number of artworks", userDocReference.artworks.length); */

    }

    fetchFirebase();      

  },[])

  const deleteArtwork = async()=>{

    const artworksRef = doc(firestore, `users/${user.email}`);

    var val = artwork;

    var index = -1;

    arrayArtworks.find(function(item, i){
      if(item.title === val){
        index = i;
        arrayArtworks.splice(index, 1)
      return i;
       }
      });

      console.log("Artworks", arrayArtworks);

      

    await updateDoc(artworksRef, { artworks: arrayArtworks })

    console.log("Artwork borrado", index);

    window.location.reload(false);

  }


  return (
    <>
    <div className="flex flex-col">
      <button
        className="ml-auto pr-6 text-3xl bg-transparent text-white font-bold outline-none focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <AiOutlineEye className="mt-6" />

      </button>

      </div>
      {showModal ? (
        <>
        <div className="">
          
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full h-full bg-black bg-opacity-90">
            <div className="relative w-auto my-6 mx-auto max-w-md">
              <div className="border-2 border-black rounded-lg shadow-lg relative flex flex-col w-full bg-teal-400 outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-black rounded-t">

                  <h3 className="text-3xl text-black font-semibold">{ artwork }</h3>
                  <h2 className="text-xl text-black">{ artistName }</h2>

                </div>
                
                <div className="relative w-full p-6 flex-auto">

                <div className="overflow-hidden"
                    style={{ 
                      backgroundImage: `url("${ imgurl }")`,
                      height: "200px",
                      borderRadius: "5rem 0",
                    }}
                ></div>
                <a href={ imgurl } rel="noreferrer" target="_blank">
                <HiExternalLink className="text-black pt-3 text-3xl" />
                </a>
                <h3 className="mt-3 text-black tracking-[.25em]">DESCRIPTION</h3>
                <p className="text-black">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use.</p>
                <h3 className="mt-6 text-black tracking-[.25em]">TYPE</h3>
                <p className="text-black">IMG/JPG</p>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-black rounded-b">

                <button
                    className="text-red-700 hover:text-white bg-transparent font-bold pl-6 pb-4 py-2 text-sm outline-none focus:outline-none mr-4 mb-1"
                    type="button"
                    onClick={ deleteArtwork }
                  >
                   Delete artwork
                  </button>

                  <button
                    className="text-white hover:text-gray-400 bg-black font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
{/*                   <button
                    className="border-2 border-black  text-teal-400 hover:text-white hover:bg-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save changes
                  </button> */}
                </div>
              </div>
            </div>
          </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
