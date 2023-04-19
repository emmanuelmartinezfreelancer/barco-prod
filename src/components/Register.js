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
    state:"",
    birth: {
      day: "",
      month: "",
      year: "",
    },
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
    imgurl: "",
    description: "Para editar la descripción presiona el ícono del lápiz."
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
  
  const [daybirth, setdayBirth] = useState();
  const [monthbirth, setmonthBirth] = useState();
  const [yearbirth, setyearBirth] = useState();

  const [ registerFinishedView, setregisterfinishedView ] = useState(false)

  const [disabledFinalButton, setdisabledFinalButton] = useState(false);

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
    } else {

    try {
      setdisabledFinalButton(true);
      await signup(user.email, user.password);     
      const docFirebase = await createDocument(user.email);
      console.log("Doc user", docFirebase);
      await setFolioNumber(user.email)
      setregisterfinishedView(true);
      
    } catch (error) {
        if (error.code === "auth/internal-error"){
                
            setError("Correo inválido / Introduce un password");

        } else if(error.code === "auth/weak-password" ) {

            setError("Password débil, al menos debe contener 6 caracteres")

        } else if(error.code === "auth/email-already-in-use") {
        
            setError("Correo en uso")
        }
    }

    }

  };

  const goToDashboard = () => {

    setregisterfinishedView(false);
    
    navigate("/");
  }

  const searchFolioNumber = async()=>{

    let folioNumber;
    let folioUpdate;

    const docuRef = doc(firestore, `folio/currentnumber/`)
  
    let docInfo;
  
    const docSnap = await getDoc(docuRef);
  
    docInfo = docSnap.data();

    
  
    return docInfo.current;
  
  }



  const setFolioNumber = async(usermail)=>{

    //Crear referencia al documento

    const docuRef = doc(firestore, `mail/${usermail}`)

    const folioRef = doc(firestore, `folio/currentnumber/`)

/*       const docuRef = doc(firestore, `mail/${email}`)
*/       
    let currentFolioNumber = await searchFolioNumber()
  
    console.log("Folio Number to send", currentFolioNumber);

    const emailExample = {

      to: [`${usermail}`],
      message: {
      subject: 'Tu número de registro',
      text: '',
      html: `
      <p style="font-weight: bold; color: black">Muchas gracias por suscribirte a Barco Bienal, tu número de Folio es:</p>
      <p style="font-size:36px; color:green">${currentFolioNumber}</p>      
      `,
      }

    }

  
    await setDoc(docuRef, emailExample);

    let folioUpdate = { current: currentFolioNumber + 1}

    await setDoc(folioRef, folioUpdate);

/*       const query = await getDoc(docuRef);
  
    const infoDocu = query.data();
  
    return infoDocu; */

  }
  return (
    <>
    {
    
    registerFinishedView &&
      <>  
      <div className="bg-black w-full h-full fixed text-teal-400 text-center">
        
        <p className="pt-72 text-2xl tracking-[.25em] uppercase">Gracias por tu registro</p>
        <button onClick={()=>{ console.log("Go to dashboard"); goToDashboard(); }} className="bg-transparent border-teal-400 border-2 hover:bg-teal-300 hover:text-black text-teal-400 font-bold py-2 px-8 rounded font-helveticaL text-sm mt-4">
          { ":)" }
        </button>
        
        </div>

     </>


    }



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

            <label htmlFor="estados" className="block text-teal-400 font-helveticaL text-sm font-bold mb-2">Estado</label>

            <select id="estados" className="font-helveticaL text-sm border bg-black border-[#40E0D0] shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline w-full dark:border-[#40E0D0] dark:text-teal-400" onClick={ (e) => setUser({ ...user, state: e.target.value })}>
                <option selected>Selecciona tu estado...</option>
                <option value="Aguascalientes">Aguascalientes</option>
                <option value="Baja California">Baja California</option>
                <option value="Baja California Sur">Baja California Sur</option>
                <option value="Campeche">Campeche</option>
                <option value="Chiapas">Chiapas</option>
                <option value="Chihuahua">Chihuahua</option>
                <option value="CDMX">Ciudad de México</option>
                <option value="Coahuila">Coahuila</option>
                <option value="Colima">Colima</option>
                <option value="Durango">Durango</option>
                <option value="Estado de México">Estado de México</option>
                <option value="Guanajuato">Guanajuato</option>
                <option value="Guerrero">Guerrero</option>
                <option value="Hidalgo">Hidalgo</option>
                <option value="Jalisco">Jalisco</option>
                <option value="Michoacán">Michoacán</option>
                <option value="Morelos">Morelos</option>
                <option value="Nayarit">Nayarit</option>
                <option value="Nuevo León">Nuevo León</option>
                <option value="Oaxaca">Oaxaca</option>
                <option value="Puebla">Puebla</option>
                <option value="Querétaro">Querétaro</option>
                <option value="Quintana Roo">Quintana Roo</option>
                <option value="San Luis Potosí">San Luis Potosí</option>
                <option value="Sinaloa">Sinaloa</option>
                <option value="Sonora">Sonora</option>
                <option value="Tabasco">Tabasco</option>
                <option value="Tamaulipas">Tamaulipas</option>
                <option value="Tlaxcala">Tlaxcala</option>
                <option value="Veracruz">Veracruz</option>
                <option value="Yucatán">Yucatán</option>
                <option value="Zacatecas">Zacatecas</option>
            </select>
            
            </div>
            

            <div className="mb-4">
              <label
                htmlFor="birth"
                className="font-helveticaL text-sm block text-teal-400 text-sm font-bold mb-2"
              >
                Fecha de nacimiento
              </label>
            <div className="flex flex-row gap-3">
            <select id="dia" className="font-helveticaL text-sm border bg-black border-[#40E0D0] shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline w-full dark:border-[#40E0D0] dark:text-teal-400" onClick={ (e) => { setUser({ ...user, birth: { day: e.target.value, month: monthbirth, year: yearbirth }}); setdayBirth( e.target.value); } }>
                  <option defaultValue>Dia...</option>  
                  <option value="1">1</option> 
                  <option value="2">2</option> 
                  <option value="3">3</option> 
                  <option value="4">4</option> 
                  <option value="5">5</option> 
                  <option value="6">6</option> 
                  <option value="7">7</option> 
                  <option value="8">8</option> 
                  <option value="9">9</option> 
                  <option value="10">10</option> 
                  <option value="11">11</option> 
                  <option value="12">12</option> 
                  <option value="13">13</option> 
                  <option value="14">14</option> 
                  <option value="15">15</option> 
                  <option value="16">16</option> 
                  <option value="17">17</option> 
                  <option value="18">18</option> 
                  <option value="19">19</option> 
                  <option value="20">20</option> 
                  <option value="21">21</option> 
                  <option value="22">22</option> 
                  <option value="23">23</option> 
                  <option value="24">24</option> 
                  <option value="25">25</option> 
                  <option value="26">26</option> 
                  <option value="27">27</option> 
                  <option value="28">28</option> 
                  <option value="29">29</option> 
                  <option value="30">30</option> 
                  <option value="31">31</option>          
            </select>

            <select id="mes" className="font-helveticaL text-sm border bg-black border-[#40E0D0] shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline w-full dark:border-[#40E0D0] dark:text-teal-400" onClick={ (e) => { setUser({ ...user, birth: { day: daybirth, month: e.target.value, year: yearbirth }}); setmonthBirth( e.target.value ); } }>
                <option defaultValue>Mes...</option>  
                <option value="01">Enero</option> 
                <option value="02">Febrero</option> 
                <option value="03">Marzo</option> 
                <option value="04">Abril</option> 
                <option value="05">Mayo</option> 
                <option value="06">Junio</option> 
                <option value="07">Julio</option> 
                <option value="08">Agosto</option> 
                <option value="09">Septiembre</option> 
                <option value="10">Octubre</option> 
                <option value="11">Noviembre</option> 
                <option value="12">Diciembre</option>          
             </select>

            <select id="año" className="font-helveticaL text-sm border bg-black border-[#40E0D0] shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline w-full dark:border-[#40E0D0] dark:text-teal-400" onClick={ (e) => { setUser({ ...user, birth: { day: daybirth, month: monthbirth, year: e.target.value }}); setyearBirth( e.target.value ); } }>
                <option defaultValue>Año...</option>    
                <option value="2008">2008</option>
                <option value="2007">2007</option>
                <option value="2006">2006</option>
                <option value="2005">2005</option>
                <option value="2004">2004</option>
                <option value="2003">2003</option>
                <option value="2002">2002</option>
                <option value="2001">2001</option>
                <option value="2000">2000</option>
                <option value="1999">1999</option>
                <option value="1998">1998</option>
                <option value="1997">1997</option>
                <option value="1996">1996</option>
                <option value="1995">1995</option>
                <option value="1994">1994</option>
                <option value="1993">1993</option>
                <option value="1992">1992</option>
                <option value="1991">1991</option>
                <option value="1990">1990</option>
                <option value="1989">1989</option>
                <option value="1988">1988</option>
                <option value="1987">1987</option>
                <option value="1986">1986</option>
                <option value="1985">1985</option>
                <option value="1984">1984</option>
                <option value="1983">1983</option>
                <option value="1982">1982</option>
                <option value="1981">1981</option>
                <option value="1980">1980</option>
                <option value="1979">1979</option>
                <option value="1978">1978</option>
                <option value="1977">1977</option>
                <option value="1976">1976</option>
                <option value="1975">1975</option>
                <option value="1974">1974</option>
                <option value="1973">1973</option>
                <option value="1972">1972</option>
                <option value="1971">1971</option>
                <option value="1970">1970</option>
                <option value="1969">1969</option>
                <option value="1968">1968</option>
                <option value="1967">1967</option>
                <option value="1966">1966</option>
                <option value="1965">1965</option>
                <option value="1964">1964</option>
                <option value="1963">1963</option>
                <option value="1962">1962</option>
                <option value="1961">1961</option>
                <option value="1960">1960</option>
                <option value="1959">1959</option>
                <option value="1958">1958</option>
                <option value="1957">1957</option>
                <option value="1956">1956</option>
                <option value="1955">1955</option>
                <option value="1954">1954</option>
                <option value="1953">1953</option>
                <option value="1952">1952</option>
                <option value="1951">1951</option>
                <option value="1950">1950</option>       
            </select>
            </div>
              
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

            <div>

            <label htmlFor="disciplina" className="block text-teal-400 font-helveticaL text-sm font-bold mb-2">Disciplina</label>

            <select id="disciplina" className="font-helveticaL text-sm border bg-black border-[#40E0D0] shadow appearance-none border rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline w-full dark:border-[#40E0D0] dark:text-teal-400" onClick={ (e) => setUser({ ...user, discipline: e.target.value })}>
                <option selected>Selecciona tu disciplina artística...</option>           
                <option value="Dibujo">Dibujo</option>
                <option value="Escultura">Escultura</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Gráfica">Gráfica</option>
                <option value="Instalación">Instalación</option>
                <option value="Interdisciplinarix">Interdisciplinarix</option>  
                <option value="Pintura">Pintura</option>            
                <option value="Videoarte">Videoarte</option>
                <option value="Otro">Otro</option>
            </select>
            
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
               
                  <button 
                  disabled={disabledFinalButton}
                  className="font-helveticaL text-sm text-teal-400 hover:text-gray-500 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-200">
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
    </>
  );
}
