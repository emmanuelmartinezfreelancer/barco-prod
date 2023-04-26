import React, { useState, useEffect } from "react";
import imgArt from "../img/uploadArtwork.jpg"

import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { AiOutlineQuestionCircle } from "react-icons/ai"

import { Link, useNavigate } from "react-router-dom";

import { app } from '../firebase'
import { getFirestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/authContext"

const firestore = getFirestore(app); 
const storage = getStorage(app);

const defaultTheme = createTheme();
const theme = createTheme({
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          fontSize: "13px",
          color: "white",
          backgroundColor: "black"
        }
      }
    }
  }
});

let URLArtwork;

const imgArtworkText = `
Imagen digital de la obras en formato JPG a 1024 x 768 pixeles. El título del archivo
digital deberá corresponder al título de la obra. Es Importante: utilizar solamente caracteres
alfanuméricos sin acentos. En el caso de las obras tridimensionales o que así lo requieran, deberán
incluir tres ángulos tomados fotográficamente que permitan una mejor apreciación de la obra.

En caso de obras en video. Los participantes deberán subir la obra completa en formato .mpeg, .wmv o .avi, a un tamaño de 320 x 240 pixeles como mínimo

`


export function NewUploadArtwork() {

  
    const { user, logout, loading } = useAuth();

    const [userDoc, setuserDoc] = useState(null);
  
    const [showModal, setShowModal] = useState(false);
  
    const [limitfileHander, setlimifileHandler] = useState(false);

    const [disableButton, setdisableButton] = useState(false);

    const navigate = useNavigate();
  
    const [artwork, setArtwork] = useState({
      title: "",
      year: 0,
      technique: "",
      edition: "",
      widtheight: "",
      duration: "",
      weight: "",
      value: 0,
      imgurl: "",
      description: "Para editar la descripción presiona el ícono del lápiz."
      });
  
  
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
  
        }
  
        fetchFirebase();      
  
      },[])
  
  
      const imgFileHandler = async(e)=>{
  

        setdisableButton(true);

        const localFile = e.target.files[0];
    
        const fileRef = ref(storage, `artworks/${user.email}${localFile.name}`)
    
        await uploadBytes(fileRef, localFile);
    
        URLArtwork = await getDownloadURL(fileRef);
  
        setArtwork({...artwork, imgurl : URLArtwork})

        setdisableButton(false);
    
        console.log("URL New Thumbnail", URLArtwork);
  
    
     }
  
     const handleUpload = async()=>{
  
        setdisableButton(true);
        const artworksRef = doc(firestore, `users/${user.email}`)
      
        await updateDoc(artworksRef, { artworks: [...userDoc.artworks, artwork]})

        setdisableButton(false);
    
        console.log("Doc actualizado");
  
        navigate("/");
  
     }

    return (

      

          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-2 border-black rounded-lg shadow-lg relative flex flex-col w-full bg-teal-400  outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-black rounded-t ">
                  <h3 className="text-xl font=semibold text-black">Upload Artwork</h3>
                  </div>
               
               { userDoc &&
               
        <>
        <ThemeProvider theme={defaultTheme}>
          <ThemeProvider theme={theme}>

        <div className="relative w-full py-6 px-16 mr-4 flex-auto text-black"> 

        <div className="mb-4">
        <label
          htmlFor="artwork-name"
          className="block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Nombre de la obra
        </label>
        <input
          name = "artwork-name"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, title: e.target.value })}
          className="shadow appearance-none font-helveticaL text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Artwork Name"
        />
      </div>

      
      <div className="mb-4">
      
      
        <label
          htmlFor="year-realization"
          className="block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Año de realización
          
        </label>    
      
      
        <input
          name = "year-realization"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, year: e.target.value }, console.log("E value", e.target.value))}
          className="shadow appearance-none font-helveticaL text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Year"
        />
      </div>
      

      <div className="mb-4">
      <Tooltip title="Para técnicas mixtas, describir los materiales" placement="right-start">
        <label
          htmlFor="technique"
          className="flex justify-between block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Técnica
          <AiOutlineQuestionCircle/>
        </label>
      </Tooltip>
        <input
          name = "technique"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, technique: e.target.value })}
          className="shadow appearance-none bfont-helveticaL text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Technique"
        />
      </div>

      <div className="mb-4">
      
        <label
          htmlFor="edition"
          className="flex justify-between block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Ediciones
          
        </label>
      
        <input
          name = "edition"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, edition: e.target.value })}
          className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Number of editions"
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="widtheight"
          className="block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Medidas
        </label>
        <input
          name = "widtheight"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, widtheight: e.target.value })}
          className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Width x height x depth"
        />
      </div>

      <div className="mb-4">
      <Tooltip 
        title="En caso de obras en video. Los participantes deberán subir la obra completa en formato .mpeg, .wmv o .avi, a un tamaño de 320 x 240 pixeles como mínimo"
        placement="right-start">
        <label
          htmlFor="duration"
          className="flex justify-between  block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Duración
          <AiOutlineQuestionCircle/>
        </label>

        </Tooltip>
        <input
          name = "duration"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, duration: e.target.value })}
          className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Duration"
        />
      </div>

      <div className="mb-4">
      
        <label
          htmlFor="weight"
          className="block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Peso
          
        </label>
      
        <input
          name = "weight"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, weight: e.target.value })}
          className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Weight in Kg"
        />
      </div>


      <div className="mb-4">
        <label
          htmlFor="value-artwork"
          className="block text-black font-helveticaL text-sm font-bold mb-2"
        >
          Avalúo de la pieza
        </label>
        <input
          name = "value-artwork"
          type="text"
          onChange={(e) => setArtwork({ ...artwork, value: e.target.value })}
          className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Valuation of the artwork"
        />
      </div>

      <div className="mb-4">
            <Tooltip title={ imgArtworkText } placement="right-start">
            <label
              htmlFor="artwork-image"
              className="flex justify-between block text-black font-helveticaL text-sm font-bold mb-2"
            >
              Imagen / Video de la obra
              <AiOutlineQuestionCircle/>
            </label>          
            
            </Tooltip>
            
            <input
              name = "artwork-image"
              type="file"
              onChange={ imgFileHandler }
              className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
              accept="image/jpeg, video/mpeg, video/mpg, video/wmv, video/avi, video/mp4"
            />

            <div className="flex items-center justify-end pt-6 border-t border-solid border-black rounded-b">
            <Link to="/">
            <button
              className="text-black hover:text-gray-400 bg-transparent font-bold uppercase px-6 py-2 rounded text-sm outline-none focus:outline-none mr-1 mb-1"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
            </Link>
            <button
              className={`font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ${disableButton ? "cursor-not-allowed bg-gray-200 text-gray-600" : "border-2 border-black text-black hover:text-white hover:bg-black"}`}
              type="button"
              onClick={ handleUpload }
            >
              Upload
            </button> 
          </div>
        </div>

        </div>

        </ThemeProvider>
      </ThemeProvider>
        </>  
       
              }
              </div>
            </div>
          </div>
 
        
    );
  }

  