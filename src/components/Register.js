import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Alert } from "./Alert";
import Tooltip from '@mui/material/Tooltip';
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import { AiOutlineQuestionCircle } from "react-icons/ai"

import { app } from '../firebase'
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

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

const addressText = `
Calle, Número, Colonia, Delegación, Municipio, Estado, País, C.P.
`;

const phoneText = `
Teléfono(s) celular, casa o estudio
`;

const cvText = `
Currículum actualizado no mayor a una cuartilla en formato de Word. El título del archivo
deberá tener el nombre completo del artista. Ejemplo: Nombre del artista_CURRICULUM.
`;

const semblanzaText = `
Semblanza no mayor a media cuartilla en formato word. El título del archivo deberá tener el
nombre completo del artista. Ejemplo: Nombre del artista_SEMBLANZA.
`;

const comprobantesText = `
4 comprobantes de exposiciones; Invitaciones digitalizadas en formato JPG
`;

const descriptionProjectText = `
Para las obras que intervengan directamente en el espacio de exhibición, los participantes deberán
enviar una descripción de sus proyectos, no mayor a una cuartilla, así como planos, bocetos,
maquetas, dibujos, ilustraciones, videos o cualquier otro material de apoyo en PDF.
`;

const imgArtworkText = `
Imagen digital de la obras en formato JPG a 1024 x 768 pixeles. El título del archivo
digital deberá corresponder al título de la obra. Es Importante: utilizar solamente caracteres
alfanuméricos sin acentos. En el caso de las obras tridimensionales o que así lo requieran, deberán
incluir tres ángulos tomados fotográficamente que permitan una mejor apreciación de la obra.

En caso de obras en video. Los participantes deberán subir la obra completa en formato .mpeg, .wmv o .avi, a un tamaño de 320 x 240 pixeles como mínimo

`

let URLArtwork;
let URLCV;
let URLSemblanza;
let URLsExposiciones = [];
let URLProject;



export function Register() {

  const { signup } = useAuth();

  const MAX_COUNT = 4;

  const [user, setUser] = useState({
    artistname: "",
    address: "",
    birth: "",
    phone: 0,
    web: "",
    discipline: "",
    email: "",
    password: "",
    artworks: [],
    cvUrl: "",
    semblanzaUrl: "",
    exposicionesUrls: [],
    projectUrl: ""

  });

  const [artwork, setArtwork] = useState({
    title: "",
    year: 0,
    technique: "",
    edition: "",
    widtheight: "",
    duration: "",
    weight: "",
    value: 0,
    imgurl: ""
    });


  const [error, setError] = useState("");
  const [firstWindow, setFirstWindow] = useState(true);
  const [artworkWindow, setArtworkWindow] = useState(false);
  const [registerWindow, setRegisterWindow] = useState(false);
  const [receiptsFiles, setReceiptsFiles] = useState([])
  const [fileLimit, setFileLimit] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [cvReady, setCVReady] = useState(false);
  const [semblanzaReady, setSemblanzaReady] = useState(false);
  const [projectReady, setProjectReady] = useState(false);
  const [comprobantesReady, setComprobanteReady] = useState(false);
  const [showRegisterButton, setRegisterButton] = useState(false);

  const navigate = useNavigate();

  const createDocument = async(idDocumento)=>{


    //Crear referencia al documento
    const docuRef = doc(firestore, `users/${idDocumento}`)
    
    let finalUser = {...user, password: "*******", cvUrl: URLCV, semblanzaUrl: URLSemblanza, projectUrl: URLProject};
    let finalArtwork = {...artwork, imgurl: URLArtwork};

    finalUser.artworks.push(finalArtwork);
    finalUser.exposicionesUrls = URLsExposiciones;
  
    console.log("Final User", finalUser);

    await setDoc(docuRef, finalUser);

    const query = await getDoc(docuRef);
  
    const infoDocu = query.data();

    return infoDocu;
  
  }

 const imgFileHandler = async(e)=>{

    const localFile = e.target.files[0];

    const fileRef = ref(storage, `artworks/${new Date()}_${localFile.name}`)

    await uploadBytes(fileRef, localFile);

    URLArtwork = await getDownloadURL(fileRef);

    console.log("URL Thumbnail", URLArtwork);

    setShowNextButton(true);

 }



 const cvFileHandler = async(e)=>{

  const localFile = e.target.files[0];

  const fileRef = ref(storage, `cv/${localFile.name}`)

  await uploadBytes(fileRef, localFile);

  URLCV = await getDownloadURL(fileRef);

  console.log("URL CV", URLCV);

  setCVReady(true);


}

const semblanzaFileHandler = async(e)=>{

  const localFile = e.target.files[0];

  const fileRef = ref(storage, `semblanzas/${localFile.name}`)

  await uploadBytes(fileRef, localFile);

  URLSemblanza = await getDownloadURL(fileRef);

  console.log("URL Semblanza", URLSemblanza);

  setSemblanzaReady(true);

}

const projectFileHandler = async(e)=>{

  const localFile = e.target.files[0];

  const fileRef = ref(storage, `proyectos/${localFile.name}`)

  await uploadBytes(fileRef, localFile);

  URLProject = await getDownloadURL(fileRef);

  console.log("URL Project", URLProject);

  setProjectReady(true);

}

  const handleUploadFiles = async files => {
    const uploaded = [...receiptsFiles];
    let limitExceeded = false;

    files.some((file) => {
        if (uploaded.findIndex((f) => f.name === file.name) === -1) {
            uploaded.push(file);
            if (uploaded.length === MAX_COUNT) setFileLimit(true);
            if (uploaded.length > MAX_COUNT) {
                alert(`You can only add a maximum of ${MAX_COUNT} files`);
                setFileLimit(false);
                limitExceeded = true;
                return true;
            }
        }
    })
    if (!limitExceeded) setReceiptsFiles(uploaded)

    const requests = uploaded.map(async(file)=>{

      const localFile = file;

      const fileRef = ref(storage, `comprobantes/${localFile.name}`)
    
      await uploadBytes(fileRef, localFile);
    
      let comprobanteURL = await getDownloadURL(fileRef);

      URLsExposiciones.push(comprobanteURL);

    })

      // Wait for all requests, and then setState
      return Promise.all(requests).then(() => {
        console.log("Comprobantes listos");
        setComprobanteReady(true);
      });
    }
  

  const handleFileEvent =  (e) => {
    
    const chosenFiles = Array.prototype.slice.call(e.target.files)
    handleUploadFiles(chosenFiles);
  
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if(!cvReady || !semblanzaReady || !projectReady || !comprobantesReady){

      setError("Upload of files not complete")
    }
    try {
      await signup(user.email, user.password);     
      const docFirebase = await createDocument(user.email);
      console.log("Doc user", docFirebase);
      navigate("/");
    } catch (error) {
        if (error.code === "auth/internal-error"){
                
            setError("Correo inválido / Introduce un password");

        } else if(error.code === "auth/weak-password" ) {

            setError("Password débil, al menos debe contener 6 caracteres")

        } else if(error.code === "auth/email-already-in-use") {
        
            setError("Correo en uso")
        }
    }
  };

  return (
    <div className="w-full max-w-xs m-auto text-black">
      {error && <Alert message={error} />}

      <form
        onSubmit={handleSubmit}
        className="shadow-md rounded px-8 pt-6 pb-6 mb-4">

{ firstWindow && 
          <>  
              <ThemeProvider theme={defaultTheme}>
                <ThemeProvider theme={theme}>
              <div className="mb-4">
              <label
                htmlFor="artist-name"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Nombre del Artista
              </label>
              <input
                name = "artist-name"
                type="text"
                onChange={(e) => setUser({ ...user, artistname: e.target.value })}
                className="font-helveticaL text-sm shadow appearance-none bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Artist Name"
              />
            </div>

            
            <div className="mb-4">
            
            <Tooltip title={ addressText } placement="right-start">
              <label
                htmlFor="address"
                className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2 "
              >
                Dirección Completa
                <AiOutlineQuestionCircle/>
              </label>    
            </Tooltip>
            
              <input
                name = "address"
                type="text"
                onChange={(e) => setUser({ ...user, address: e.target.value })}
                className="font-helveticaL text-sm bg-transparent border border-[#40E0D0] shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Address"
              />
            </div>
            

            <div className="mb-4">
              <label
                htmlFor="birth"
                className="font-helveticaL text-sm block text-teal-400 text-sm font-bold mb-2"
              >
                Fecha de nacimiento
              </label>
              <input
                name = "birth"
                type="text"
                onChange={(e) => setUser({ ...user, birth: e.target.value })}
                className="font-helveticaL text-sm bg-transparent border border-[#40E0D0] shadow appearance-none rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Birth Date"
              />
            </div>

            <div className="mb-4">
            <Tooltip title={ phoneText } placement="right-start">
              <label
                htmlFor="phone"
                className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Teléfono
                <AiOutlineQuestionCircle/>
              </label>
            </Tooltip>
              <input
                name = "phone"
                type="text"
                onChange={(e) => setUser({ ...user, phone: e.target.value })}
                className="shadow appearance-none font-helveticaL text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Phone"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="web"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Página web
              </label>
              <input
                name = "web"
                type="text"
                onChange={(e) => setUser({ ...user, web: e.target.value })}
                className="shadow appearance-none font-helveticaL text-sm bg-transparent border border-[#40E0D0]  rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Web page"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="discipline"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Disciplina
              </label>
              <input
                name = "discipline"
                type="text"
                onChange={(e) => setUser({ ...user, discipline: e.target.value })}
                className="shadow appearance-none font-helveticaL text-sm bg-transparent border border-[#40E0D0]  rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Discipline"
              />
            </div>
              </ThemeProvider>
            </ThemeProvider>
         </>
        }

        { artworkWindow &&

          <>
              <ThemeProvider theme={defaultTheme}>
                <ThemeProvider theme={theme}>
              <div className="mb-4">
              <label
                htmlFor="artwork-name"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Nombre de la obra
              </label>
              <input
                name = "artwork-name"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, title: e.target.value })}
                className="shadow appearance-none font-helveticaL text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Artwork Name"
              />
            </div>

            
            <div className="mb-4">
            
            
              <label
                htmlFor="year-realization"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Año de realización
                
              </label>    
            
            
              <input
                name = "year-realization"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, year: e.target.value }, console.log("E value", e.target.value))}
                className="shadow appearance-none font-helveticaL text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Year"
              />
            </div>
            

            <div className="mb-4">
            <Tooltip title="Para técnicas mixtas, describir los materiales" placement="right-start">
              <label
                htmlFor="technique"
                className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Técnica
                <AiOutlineQuestionCircle/>
              </label>
            </Tooltip>
              <input
                name = "technique"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, technique: e.target.value })}
                className="shadow appearance-none bfont-helveticaL text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Technique"
              />
            </div>

            <div className="mb-4">
            
              <label
                htmlFor="edition"
                className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Ediciones
                
              </label>
            
              <input
                name = "edition"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, edition: e.target.value })}
                className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Number of editions"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="widtheight"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Medidas
              </label>
              <input
                name = "widtheight"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, widtheight: e.target.value })}
                className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Width x height x depth"
              />
            </div>

            <div className="mb-4">
            <Tooltip 
              title="En caso de obras en video. Los participantes deberán subir la obra completa en formato .mpeg, .wmv o .avi, a un tamaño de 320 x 240 pixeles como mínimo"
              placement="right-start">
              <label
                htmlFor="duration"
                className="flex justify-between  block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Duración
                <AiOutlineQuestionCircle/>
              </label>

              </Tooltip>
              <input
                name = "duration"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, duration: e.target.value })}
                className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Duration"
              />
            </div>

            <div className="mb-4">
            
              <label
                htmlFor="weight"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Peso
                
              </label>
            
              <input
                name = "weight"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, weight: e.target.value })}
                className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Weight in Kg"
              />
            </div>


            <div className="mb-4">
              <label
                htmlFor="value-artwork"
                className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
              >
                Avalúo de la pieza
              </label>
              <input
                name = "value-artwork"
                type="text"
                onChange={(e) => setArtwork({ ...artwork, value: e.target.value })}
                className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Valuation of the artwork"
              />
            </div>

            <div className="mb-4">
                  <Tooltip title={ imgArtworkText } placement="right-start">
                  <label
                    htmlFor="artwork-image"
                    className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2"
                  >
                    Imagen / Video de la obra
                    <AiOutlineQuestionCircle/>
                  </label>          
                  
                  </Tooltip>
                  
                  <input
                    name = "artwork-image"
                    type="file"
                    onChange={ imgFileHandler }
                    className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                    accept="image/jpeg"
                  />
              </div>

              </ThemeProvider>
            </ThemeProvider>
        </>  

        }

        { registerWindow && 

          <>
                  <ThemeProvider theme={defaultTheme}>
                    <ThemeProvider theme={theme}>
                  <div className="mb-4">
                  <Tooltip title={ cvText } placement="right-start">
                  <label
                    htmlFor="cv"
                    className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2"
                  >
                    Curriculum
                    <AiOutlineQuestionCircle/>
                  </label>          
                  
                  </Tooltip>
                  
                  <input
                    name = "cv"
                    type="file"
                    onChange={cvFileHandler}
                    className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Curriculum Vitae"
                    accept=".doc,.docx"
                  />
                </div>
  
                <div className="mb-4">
                  <Tooltip title={ semblanzaText } placement="right-start">
                  <label
                    htmlFor="semblanza"
                    className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2"
                  >
                    Semblanza
                    <AiOutlineQuestionCircle/>
                  </label>          
                  
                  </Tooltip>
                  
                  <input
                    name = "semblanza"
                    type="file"
                    onChange={semblanzaFileHandler}
                    className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Semblanza"
                    accept=".doc,.docx"
                  />
                </div>
  
  
                <div className="mb-4">
                <Tooltip title={ comprobantesText } placement="right-start">
                <label
                className="flex justify-between block text-teal-400 text-sm font-bold mb-2"
                htmlFor='fileUpload'
                >
                
                <a  className={`btn btn-primary font-helveticaL text-sm ${!fileLimit ? '' : 'disabled' } `}>Comprobantes de exposiciones</a><AiOutlineQuestionCircle/>
                </label>
                </Tooltip>
                <input 
                id='fileUpload' 
                type='file'
                className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 font-helveticaL text-sm leading-tight focus:outline-none focus:shadow-outline"
                multiple
                accept='image/jpeg'
                onChange={handleFileEvent}
                disabled={fileLimit}
                />
  
                </div>
  
  
                <div className="mb-4">
                  <Tooltip title={ descriptionProjectText } placement="right-start">
                  <label
                    htmlFor="description-project"
                    className="flex justify-between block text-teal-400 font-helveticaL text-sm font-bold mb-2"
                  >
                    Descripción del proyecto
                    <AiOutlineQuestionCircle/>
                  </label>          
                  
                  </Tooltip>
                  
                  <input
                    name = "description-project"
                    type="file"
                    onChange={projectFileHandler}
                    className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                    accept="application/pdf"
                  />
                </div>
  
  
  
              <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="youremail@company.tld"
                  />
                </div>
          
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-teal-400 font-helveticaL text-sm font-bold mb-2"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    className="shadow appearance-none text-sm bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="*************"
                  />
                </div>
               
                  <button className="font-helveticaL text-sm text-teal-400 hover:text-gray-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                    Register
                  </button> 
              
            
                    </ThemeProvider>
                  </ThemeProvider>
            </>  
         
        }
        


      </form>

      { firstWindow && 

      <button onClick={()=>{ setFirstWindow(false); setArtworkWindow(true); console.log("Go to artwork"); console.log("User", user) }} className="bg-zinc-900 hover:bg-neutral-800 text-white font-bold py-2 px-4 rounded font-helveticaL text-sm">
          Add artwork
      </button>

      }

      { showNextButton && 

      <button onClick={()=>{ setArtworkWindow(false); setRegisterWindow(true); setShowNextButton(false); console.log("Go to finish register"); console.log("User", user); console.log("Artwork", artwork) }} className="bg-zinc-900 hover:bg-neutral-800 text-white font-bold py-2 px-4 rounded font-helveticaL text-sm">
          Next
      </button>
      }
      
      
      <p className="my-4 text-sm text-teal-400 flex justify-between px-3">
        Already have an Account?
        <Link to="/login" className="text-teal-400 hover:text-gray-500">
          Login
        </Link>
      </p>
    </div>
  );
}
