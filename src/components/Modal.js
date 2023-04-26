import React, { useState, useEffect } from "react";
import imgArt from "../img/M1.jpg"
import { useAuth } from "../context/authContext"
import { AiOutlineEye, AiOutlineEdit } from "react-icons/ai"
import { HiExternalLink } from "react-icons/hi"
import { BsDownload } from "react-icons/bs"
import { GrDocumentDownload } from "react-icons/gr"
import { SlClose } from "react-icons/sl";
import { app } from '../firebase'
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import axios from 'axios';



const firestore = getFirestore(app); 
const Modal = ({ artwork, artworkinfo, artistName, imgurl, description, dimensions, peso, artistex, contenttype }) => {
  
  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const [userDoc, setuserDoc] = useState(null);

  const [editDescription, seteditDescription] = useState(false);

  const [descriptionText, setdescriptionText] = useState("")

  const [arrayArtworks, setarrayArtworks] = useState(null);

  const [ techArtwork, settechArtwork] = useState(false);

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

      //console.log("Description from <Modal/>", description);

      /* console.log("Number of artworks", userDocReference.artworks.length); */

    }

    fetchFirebase();      

  },[])

  //console.log("Exhibitions links", artistex)

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

    //console.log("Artwork borrado", index);

    window.location.reload(false);

  }


  const getDescription = async()=>{

    const artworksRef = doc(firestore, `users/${user.email}`);

    var val = artwork;

    let newArrayArtworks = arrayArtworks;


    newArrayArtworks.forEach(function(item, i){

      //console.log("Title " + item.title + " val " + val + " Artwork " + artwork)

      if(item.title == val){

        newArrayArtworks[i].description = descriptionText;

        console.log("Artworks from <Modal/>", arrayArtworks);

        console.log("Artworks new description from <Modal/>", newArrayArtworks);   

       }

      });

     


      //console.log("array2Update", newArrayArtworks )
      
      await updateDoc(artworksRef, { artworks: newArrayArtworks })

      window.location.reload(false);

      

/*     await updateDoc(artworksRef, { artworks: arrayArtworks })

    console.log("Artwork borrado", index);

    window.location.reload(false);
 */
  }



  return (
    <>
    <div className="flex flex-col">
      <button
        className="ml-auto pr-6 text-3xl bg-transparent text-white font-bold outline-none focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <AiOutlineEye className="mt-6 text-base tablet:text-2xl hd:text-2xl lg:text-3xl" />

      </button>

      </div>
      {showModal ? (
        <>
        <div className="">
          
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full h-full bg-black bg-opacity-90">
            <div className="relative w-auto my-6 mx-auto max-w-xl">
              <div className="border-2 border-black rounded-lg shadow-lg relative flex flex-col w-full bg-teal-400 outline-none focus:outline-none">
                
                <div className="flex flex-row">
                <div className="flex flex-col items-start justify-between px-5 pt-5 pb-2 border-b border-solid border-black rounded-t">

                  <h3 className="text-3xl text-black font-semibold">{ artwork }</h3>
                  <h2 className="text-xl text-black">{ artistName }</h2>

                </div>
                
                <SlClose className="text-3xl text-black ml-auto mt-7 mr-7"
                onClick={() => { setShowModal(false); seteditDescription(false); }}
                style={{cursor:'pointer'}}
                />

                </div>



                <div className="relative w-full p-6 flex-auto">
                
                {
                  contenttype === "image" &&

                  <div className="overflow-hidden"
                  onMouseOver={ ()=>{settechArtwork(true)} }
                  onMouseLeave={()=>{ settechArtwork(false)} }
                  style={{ 
                    backgroundImage: `url("${ imgurl }")`,
                    height: "200px",
                    borderRadius: "5rem 0",
                  }}
              >

              { techArtwork &&

              <div className="h-full w-full z-[999] bg-black p-10 bg-opacity-70" >    
                  
                  <div className="flex flex-col">

                    <p className="mx-auto my-auto"><span className="font-bold uppercase">Técnica</span> { artworkinfo.technique }</p>

                    <p className="mx-auto my-auto"><span className="font-bold uppercase">Ediciones</span> { artworkinfo.edition }</p>

                    <p className="mx-auto my-auto"><span className="font-bold uppercase">Año </span> { artworkinfo.year }</p>

                    <p className="mx-auto my-auto"><span className="font-bold uppercase">Valor </span> { artworkinfo.value }</p>

            
                  </div>
              
              </div>

              }                 


                  </div>

                }

                {

                  contenttype === "video" &&
                  <>
                  <div className="overflow-hidden"
                  onMouseOver={ ()=>{settechArtwork(true)} }
                  onMouseLeave={()=>{ settechArtwork(false)} }
                  style={{ 
                    height: "200px",
                    borderRadius: "5rem 0",
                  }}
              >
              <div className="relative">
                  <video className="absolute" autoPlay loop muted src={imgurl} />
              </div>

              </div>

              <div className="h-full w-full text-black" >    
                  
                  <div className="flex flex-col pt-4">

                    <p className=""><span className="font-bold uppercase">Técnica</span> { artworkinfo.technique }</p>
                    <p className=""><span className="font-bold uppercase">Año </span> { artworkinfo.year }</p>


            
                  </div>
              
              </div>
              </>
                }



|               
                { editDescription ? 
                null
                :
                <a href={ imgurl }
                rel="noreferrer" target="_blank">
                <HiExternalLink className="text-black text-xl" />
                </a>
                }

{/*                 <div className="flex flex-row">

                    <p className="text-black font-bold pt-3 text-sm">Artist's Docs:</p>

                    <p className="text-black pt-3 pl-2 text-sm">Artwork</p>
                    <a href={ imgurl } rel="noreferrer" target="_blank"><BsDownload className="text-black pt-3 text-3xl" /></a>

                    <p className="text-black pt-3 pl-1 text-sm">| CV</p>
                    <a href={ artistcv } rel="noreferrer" target="_blank"><GrDocumentDownload  className="text-black pt-3 text-3xl" /></a> 

                    <p className="text-black pt-3 pl-1 text-sm">| Semblance</p>
                    <a href={ artistsemblance } rel="noreferrer" target="_blank"><GrDocumentDownload  className="text-black pt-3 text-3xl" /></a> 

                    <p className="text-black pt-3 pl-1 text-sm">| Project</p>
                    <a href={ projectdescription } rel="noreferrer" target="_blank"><GrDocumentDownload  className="text-black pt-3 text-3xl" /></a>   

                </div> */}
                

                <h3 className="mt-3 mb-3 text-black tracking-[.25em]">DESCRIPTION</h3>

                

                  { editDescription ? 

                    <div className="rounded-t-lg dark:bg-gray-800 w-[510px] ">
                    <textarea
                    name = "description-text"
                    onChange={(e) => setdescriptionText(e.target.value)}
                    className="px-5 py-2 h-[200px] w-full text-sm text-black bg-white border-0 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 border-transparent focus:border-transparent focus:ring-0"
                    placeholder={ description }
                    
                     />
                     </div>
                    
                    : 
                    
                    <p className="text-black w-[510px]">{ description }</p>
                   
                  }

                
                { editDescription ? 

                null

                :
                
                <>
                <AiOutlineEdit className="text-3xl text-black absolute right-0 mr-8 mt-1"
                style={{cursor:'pointer'}}
                onClick={()=> seteditDescription(true)}
                />

                <h3 className="mt-6 text-black tracking-[.25em]"><span className="font-bold">TYPE</span> {` ${contenttype}`}</h3>
                <p className="text-black"><span className="font-bold">Dimensiones: </span>{ dimensions}{contenttype === "image" ?  <p><span className="font-bold">{" Peso"}</span> { peso }</p> : "" }</p>
                </>
                

                }
                </div>


                <div className="flex items-center justify-end p-6 border-t border-solid border-black rounded-b">



{/*                   <button
                    className="text-white hover:text-gray-400 bg-black font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button> */}

                  { editDescription ? 

                    <button
                      className="text-white hover:text-gray-400 bg-black font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-auto mb-1"
                      type="button"
                      onClick={()=> { getDescription(); seteditDescription(false) }}
                    >
                    Save changes
                    </button> 

                    :

                    <button
                    className="text-red-700 hover:text-white bg-transparent font-bold pl-6 pb-4 py-2 text-sm outline-none focus:outline-none mr-4 mb-1"
                    type="button"
                    onClick={ deleteArtwork }
                  >
                   Delete artwork
                  </button>

                  }
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
