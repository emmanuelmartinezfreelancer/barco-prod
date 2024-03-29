import React, { useState, useEffect } from "react";
import imgArt from "../img/M1.jpg"
import { useAuth } from "../context/authContext"
import { AiOutlineEye } from "react-icons/ai"
import { HiExternalLink } from "react-icons/hi"
import { BsDownload } from "react-icons/bs"
import { GrDocumentDownload } from "react-icons/gr"

import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { app } from '../firebase'
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom";

import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const firestore = getFirestore(app); 

const colorBlack = "black";

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: colorBlack, //color of the slider between thumbs
  "& .MuiSlider-thumb": {
    backgroundColor: colorBlack //color of thumbs
  },
  "& .MuiSlider-rail": {
    color: colorBlack ////color of the slider outside  teh area between thumbs
  }
}));



const QualificationModal = ({ artwork, artistName, imgurl, description, dimensions, peso,  technique, edition, year, value, email, scoreFirebase, artistcv, artistsemblance, projectdescription, artistex, title, address, estado }) => {

  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const [userDoc, setuserDoc] = useState(null);

  const [arrayArtworks, setarrayArtworks] = useState(null);

  const navigate = useNavigate();


  const [score, setScore] = useState(0);

  const [ techArtwork, settechArtwork] = useState(true);

  const [ fileFinalType, setfileFinalType] = useState('');

  const searchOrCreateDocument = async(idDocumento)=>{
  
    //Crear referencia al documento
    const docuRef = doc(firestore, `users/${idDocumento}`)
     
    const query = await getDoc(docuRef);
  
    const infoDocu = query.data();
  
    return infoDocu;
  
  }

  //console.log("Artist CV", artistcv )

  useEffect(()=>{

    async function fetchFirebase(){

      const userDocReference = await searchOrCreateDocument(email);

      setuserDoc(userDocReference);

      setarrayArtworks(userDocReference.artworks)
      

      //console.log("Descriptions", description);

    }

    if(scoreFirebase){

      setScore(scoreFirebase)

    } else if (!scoreFirebase){

      setScore(0)

    }

    fetchFirebase();      


  },[])

  const getFileType = async (obra) => {

    let fileType;
  
    const response = await fetch(obra);
    const blob = await response.blob();
    const blobType = blob.type;

    console.log("Blob", blob)
  
    if (blobType.startsWith("image/")) {
      fileType = "image";
    } else if (blobType.startsWith("video/")) {
      fileType = "video";
    } else {
      fileType="unknown"
    }
  
    return fileType;
    
  }
  

  //console.log("score from <Qualification />", score)

/*   const updateScore = async()=>{

    const artworksRef = doc(firestore, `users/${email}`);

    console.log("artwork", artwork)

    var val = artwork;

    let artworks = arrayArtworks;

    arrayArtworks.find(async function(item, i){

      if(item.title === val){

        artworks[i] = { ...artworks, score: score}

        console.log("Nuevo score del artwork", artworks[i]);

        setarrayArtworks(artworks);

        return i;

       }
      });

      await updateDoc(artworksRef, { artworks: arrayArtworks} )
      
      window.location.reload(false);

  } */

  const handleSlider = (e)=>{

    setScore(e.target.value)
    //console.log("Value", score);

  }

  const handleZipDownload = async () => {

    var zip = new JSZip();
    
    // block.packages is an array of items from the CMS
    const remoteZips = artistex.map(async (pack) => {

      let counter = 0;

      console.log("Pack", pack)     

      // pack is the URL for the .zip hosted on the CMS
      let response =await fetch(pack)
      .catch((err) => { 
        console.log("ErrPromise", err)
      }); 


      const data = await response.blob()
      
      zip.file(`${counter++}.jpg`, data);

      return data

    })

    Promise.all(remoteZips).then(() => {
      zip.generateAsync({ type: "blob" }).then((content) => {
        saveAs(content, `exhibitions.zip`);
      })
    })
  }

  const updateScore = async () => {

    
    const artworksRef = doc(firestore, `users/${email}`);
    //const querySnapshot = await getDocs(artworksRef);
    const userDoc = await getDoc(artworksRef); // Assuming there is only one document


    if (!userDoc.exists()) {
      console.log(`Document with email "${email}" does not exist`);
    } else {
      const data = userDoc.data();
      console.log("userDoc", data);

      const updatedArtworks = data.artworks.map(artwork => {
        if (artwork.title === title) {
          console.log(`El titulo ${artwork.title} es igual a `, title)
          return {
            ...artwork,
            score: score
          };
        } else {
          return artwork;
        }
      });

      await updateDoc(artworksRef, { artworks: updatedArtworks });

      setScore(0)

      window.location.reload(false);
      

    }
    
  };


  return (
    <>
    <div className="flex flex-col">

      <button
        className="ml-auto pr-6 text-3xl bg-transparent text-white font-bold outline-none focus:outline-none"
        type="button"
        onClick={async() => {

          setShowModal(true)
          let fileType = await getFileType(imgurl);
          setfileFinalType(fileType);    
          console.log("FileType asset", fileType)
        }}
      >
        <AiOutlineEye className="mt-6" />
      </button>

      </div>

      {showModal ? (
        <>
          <div className="flex flex-row w-full h-full bg-black bg-opacity-90 overflow-x-hidden overflow-y-auto fixed inset-0 z-50">
          <div className="flex justify-center items-center  outline-none focus:outline-none w-1/2 ">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-2 border-black rounded-lg shadow-lg relative flex flex-col w-full bg-teal-400 outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-black rounded-t ">

                <h3 className="text-3xl text-black font-semibold">{ title }</h3>
                  <h2 className="text-xl text-black">{ artistName }</h2>
                  <h2 className="text-base text-black">{ email }</h2>

                </div>

                <div className="relative w-full p-6 flex-auto">


                <div className="h-full w-full border-b border-solid border-black pb-4" >    
                    
                    <div className="flex flex-col text-black">

                      <p className=" my-auto"><span className="font-bold uppercase">Técnica</span> { technique }</p>

                      <p className=" my-auto"><span className="font-bold uppercase">Ediciones</span> { edition }</p>

                      <p className=" my-auto"><span className="font-bold uppercase">Año </span> { year }</p>

                      <p className=" my-auto"><span className="font-bold uppercase">Valor </span> { value }</p>
                    
                    </div>
                
                </div>

                <div className="flex flex-row gap-2">

                    <p className="text-black font-bold pt-3 text-sm">Artist's Docs:</p>

                    <a className="text-black pt-3 pl-2 text-sm hover:text-gray-400" href={ imgurl } rel="noreferrer" target="_blank">{/* <BsDownload className="text-black pt-3 text-3xl hover:text-gray-400" /> */"Artwork"}</a>

                    <p className="text-black pt-3 text-sm">|</p>

                    <a className="text-black pt-3 text-sm hover:text-gray-400" href={ artistcv } rel="noreferrer" target="_blank">{/* <GrDocumentDownload  className="text-black pt-3 text-3xl hover:text-gray-400" /> */}CV</a> 

                    <p className="text-black pt-3 text-sm">|</p>

                    <a className="text-black pt-3 text-sm hover:text-gray-400" href={ artistsemblance } rel="noreferrer" target="_blank">{/* <GrDocumentDownload  className="text-black pt-3 text-3xl hover:text-gray-400" /> */}Semblance</a> 

                    <p className="text-black pt-3 text-sm">|</p>

                    <a className="text-black pt-3 text-sm hover:text-gray-400" href={ projectdescription } rel="noreferrer" target="_blank">{/* <GrDocumentDownload  className="text-black pt-3 text-3xl hover:text-gray-400" /> */}Project</a>   
                    

                    {/* <GrDocumentDownload  onClick={handleZipDownload} className="text-black pt-3 text-3xl cursor-pointer" /> */}

                </div>

                { artistex && 

                <div className="flex flex-row flex-wrap gap-2">
                <p className="text-black pt-3 text-sm">Exhibitions</p>

                {
                artistex.map((obra, i)=>{

                  return <a className="text-black pt-3 text-sm hover:text-gray-400" href={ obra } rel="noreferrer" target="_blank">{i + 1}</a>

                })

              }
                </div>
                
                
                }
                


                <h3 className="mt-3 text-black tracking-[.25em]">DESCRIPTION</h3>
                <p className="text-black pt-3 overflow-auto h-28">{ description }</p>
                  <div className="flex flex-row">
                      <div className="flex flex-col">
                      <h3 className="mt-6 text-black tracking-[.25em]"><span className="font-bold">TYPE</span> {fileFinalType}</h3>
                  
                        <p className="text-black"><span className="font-bold">Dimensions: </span>{ dimensions} <span className="font-bold">Weight</span> {peso}</p>
                      </div>

                      <div className="ml-auto flex flex-col">
                        <p className="mt-6 text-black font-bold text-6xl text-center ">{ scoreFirebase }</p>
                  
                        <p className="text-black text-center tracking-[.25em]">score</p>
                      </div>

                  </div>

                <CustomSlider onChange={ handleSlider } min={0.00} max={10.00} defaultValue={ score } aria-label="Default" valueLabelDisplay="auto" />

                <h3 className="mt-6 text-xl text-black"><span className="font-bold">New score</span> { score }</h3>
                
                </div>
                
                <div className="flex items-center justify-end p-6 border-t border-solid border-black rounded-b">
                           <button
                    className="border-2 border-black text-black hover:text-white hover:bg-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => { console.log(`Artworks ${ artistName }`, arrayArtworks); updateScore() } }
                  >
                    Save score
                  </button> 

                  <button
                    className="text-white hover:text-gray-400 bg-black font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2 h-full p-14 flex justify-center align-center">
          
          { fileFinalType === '' &&
          
          <p className="font-bold text-center my-auto align-center">Reviewing the file type, if the file is very large (for example, a video in High Quality) or you're downloading all the resources from the app and takes a long time, you can download it directly by clicking on Artwork in Artist's Docs.</p>                
          
          }
          
          { fileFinalType === 'image' &&
          
          <img src={`${imgurl}`} alt={`${imgurl}`} className="h-full w-full object-cover"/>

          }

          { fileFinalType === 'video' &&
          
          <video controls>
          <source src={`${imgurl}`} />
          Your browser does not support the video tag.
          </video>

          }

          { fileFinalType === 'unknown' &&
          
          <p className="font-bold text-center my-auto">File type not image or video, please download it directly by clicking on Artwork in Artist's Docs.</p>                


          }


          



            
          </div>

          </div>
        </>
      ) : null}
    </>
  );
};

export default QualificationModal;
