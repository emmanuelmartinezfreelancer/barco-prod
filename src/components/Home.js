import {React, useState, useEffect} from "react";
import { useAuth } from "../context/authContext"
import { ReactComponent as Logo } from '../assets/logoBarcoHome.svg';
import { Link, useNavigate } from "react-router-dom";
import Obras from './Obras.js'
import UploadArtwork from "./UploadArtwork";
import { app } from '../firebase'
import { getFirestore, doc, getDoc, setDoc,getDocs, collection } from "firebase/firestore"
import { GiPlainCircle } from "react-icons/gi"
import { BsDownload } from "react-icons/bs"
import { GrDocumentDownload } from "react-icons/gr"
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";

const firestore = getFirestore(app); 

let fakeArray = [{title: "hola mundo"}];

function DescriptionCard({artworktitle}){

  return(     

       <p className="w-full"><span className="font-bold">{ artworktitle }</span> no tiene descripción</p>  
    )  

}

const colorBlack = "#33e0d0";
const CustomSlider = styled(Slider)(({ theme }) => ({
  color: colorBlack, //color of the slider between thumbs
  "& .MuiSlider-thumb": {
    backgroundColor: colorBlack //color of thumbs
  },
  "& .MuiSlider-rail": {
    color: colorBlack ////color of the slider outside  teh area between thumbs
  }
}));


export function Home(){

    const { user, logout, loading } = useAuth();

    const [userDoc, setuserDoc] = useState(null);

    const [artistName, setartistName] = useState(null);

    const [cvurl, setcvUrl] = useState(null);

    const [folio, setfolio] = useState(null);
    
    const [semblanceurl, setsemblanceUrl] = useState(null);

    const [projecturl, setprojectUrl] = useState(null);

    const [artistex, setartistex] = useState(null);

    const [arrayArtworks, setarrayArtworks] = useState(null);

    const [totalArtworks, setTotalArtworks] = useState([]);

    const [email, setEmail] = useState(null);

    const [showuploadButton, setshowuploadButton] =  useState(true);

    const [iscurator, setisCurator] = useState([{name: "Tobias Ostrander", email: "tobiasostrander@gmail.com"}, {name: "Emmanuel Martínez", email: "vel.freelancer@gmail.com"}, {name: "Oscar Ascencio", email:"oscarascencioc@hotmail.com"}]);

    const [curatorview, setcuratorView] = useState(false);

    const [defaultDescriptions,  setdefaultDescriptions] = useState("");

    const [descriptionAlert, setdescriptionAlert] = useState(false);

    const [search, setSearch] = useState("");

    const [scoreSearch, setScoreSearch] = useState(0);

    const [sliderorSearch, setsliderorSearch] = useState("search");

    let folioNumber;
    let folioUpdate;

    const searchFolioNumber = async()=>{

      const docuRef = doc(firestore, `folio/currentnumber/`)
    
      let docInfo;
    
      const docSnap = await getDoc(docuRef);
    
      docInfo = docSnap.data();

      folioNumber = docInfo;

      folioUpdate = { current: folioNumber + 1}
    
      return docInfo.current;
    
    }
    
    

    const searchOrCreateDocument = async(idDocumento)=>{

      //Crear referencia al documento
      const docuRef = doc(firestore, `users/${idDocumento}`)
       
      const query = await getDoc(docuRef);
    
      const infoDocu = query.data();

      console.log("infoDocu", infoDocu)
    
      return infoDocu;
  
    
    }

    const searchAllUsers = async()=>{
  
      //Crear referencia al documento
      const docuRef = await getDocs(collection(firestore, "users"));
    
      let arrayAllArtworks = [];
    
      docuRef.forEach((doc)=>{
    
        let docInfo;
    
        docInfo = doc.data();
    
        /* console.log(doc.id, " => ", doc.data()); */
    
        if(!docInfo.artistname || !docInfo.artworks){
    
        arrayAllArtworks.push({artistname : "", artworks: [""]});
        
      } else {
        
         arrayAllArtworks.push({ artistname : docInfo.artistname, artworks: docInfo.artworks, email: docInfo.email, cv: docInfo.cvUrl, semblance: docInfo.semblanzaUrl, project: docInfo.projectUrl, exhibitions: docInfo.exposicionesUrls, address: docInfo.address, folio: docInfo.folio });
    
        }
      })
    
      return arrayAllArtworks;
       
    }



    const getArray = async(userMail)=>{

      if(userMail === iscurator[0].email || userMail === iscurator[1].email || userMail === iscurator[2].email){
  
        setTotalArtworks(await searchAllUsers())

        let arrayAllUsers = await searchAllUsers();

       let arrayAllArtworks = arrayAllUsers.map((artwork)=>{

            return artwork.address;

        }) 
        
        //console.log("Total Users",arrayAllUsers)

        //console.log("Total User's artworks", arrayAllArtworks.flat()) 
        //console.log("Total User's address", arrayAllArtworks) 
      
        setcuratorView(true);
      
        } else {
      
        console.log("Regular user")
      }
    }


    const searchCurator = async()=>{
  
      //Crear referencia al documento
      const docuRef = await getDocs(collection(firestore, "curator"));

      let curators = [];
       
      docuRef.forEach((doc)=>{
    
        let docInfo;
    
        docInfo = doc.data();

        curators.push(docInfo);

      })
    
      setisCurator(curators);

      return iscurator;

    }
  
    const checkDescriptions = async(arrayArtworks)=>{

      let artworks2Return = [];

      const defaultDescription = "Para editar la descripción presiona el ícono del lápiz."

      console.log("Array Artworks fn(checkDescriptions)", arrayArtworks)

      await arrayArtworks.forEach((artwork)=>{
         
            if(artwork.description === defaultDescription){

            artworks2Return.push(artwork);

            }
                      
      })

      return artworks2Return;

    }

    const setFolioNumber = async()=>{

      //Crear referencia al documento

      const docuRef = doc(firestore, `mail/vela.freelancer@gmail.com`)

      //const folioRef = doc(firestore, `folio/currentnumber/`)

/*       const docuRef = doc(firestore, `mail/${email}`)
 */       
      //await searchFolioNumber()
    
      //console.log("Folio Number to send", folioNumber);

      const html = `
      <html>
      <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title></title>
          <meta name="description" content="">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
  
      <body style="width: 550px; padding: 0; margin: 0; overflow: hidden; background-color: #fff;">
  
          <div id="folioMain" style="width: 550px; background-color: #000000; margin: 0 auto; height: fit-content; display: flex; flex-direction: column; color: rgb(45 212 191); padding: 30px;">
                  <div id="logoBarco" style="color: black; z-index: 1; width: 210px">
                      <svg id="Capa_1" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 792 612">
                          <title>logoBarco</title>
                          <polygon points="273.19 63.62 273.19 292.58 472.16 292.58 273.19 63.62" />
                          <path d="M682.11,292.58,581.31,187.29A67.22,67.22,0,0,0,552.63,59.23H486.06v134.6H549.7v98.75Z" />
                          <path d="M249.78,434.86A118.14,118.14,0,0,0,367.92,553V316.72A118.14,118.14,0,0,0,249.78,434.86Z" />
                          <circle cx="585.18" cy="434.86" r="118.14" />
                          <path
                              d="M205.89,121.41A63.09,63.09,0,0,0,143,58.5H69.35V292.58H143a62.82,62.82,0,0,0,31.82-117A63,63,0,0,0,205.89,121.41Z" />
                      </svg>     
                  </div>
                  <div style="position: relative; width: 100%; height: 100%;">
                     <div style="border-radius: 9999px; width: 1050px; height: 1050px; background-color: rgb(45 212 191); position: absolute; transform:translate(-50%,-65%); overflow: hidden;"></div>
                 
                  </div>
                  
                  <h1 style="font-size: x-large; font-family: sans-serif; font-weight: lighter; text-transform: uppercase; z-index: 1; color: black; padding-top: 50px;">¡HOLA!</h1>
                  <p style="margin:0; font-family: sans-serif; font-weight: bold; font-size: xx-large; z-index: 1; color: black">Gracias por inscribirte<br>
                     te compartimos tu<br>
                     número de folio
                  </p>
                  <h3 style="padding-top: 250px; margin:0; font-family: sans-serif; text-transform: uppercase; font-weight: lighter;">FOLIO</h3>
                  <p style="margin: 0; padding-bottom: 15px; font-family: sans-serif; text-transform: uppercase; font-weight: bold; font-size: xx-large; padding-bottom: 60px;">BA012023</p>
                  <p style="font-family: sans-serif; font-weight: 600;">Solo te falta un último paso, verificar que tengas todas las descripciones de tu obras, solo tienes que entrar a tu perfil y revisarlo.</p>
  
                  <div style="position: relative; width: 100%; height: 100%;">
                  <div style="border-radius: 9999px; width: 350px; height: 350px;  border: 2px solid rgb(45 212 191); position: absolute; bottom:0; right:0; overflow: hidden; z-index: 1;"></div>
              </div>
          </div>
  
          <script src="" async defer></script>
      </body>
  </html>
    `;  

    const emailExample = {

        to: ['vela.freelancer@gmail.com'],
        message: {
        subject: 'Tu número de registro',
        text: '',
        html: html
        }

      }

/*       const emailExample = {

        to: ['vela.freelancer@gmail.com'],
        message: {
        subject: 'Tu número de registro',
        text: '',
        html: `
          <p>Hola</p>
        `,
        }

      } */

    
      await setDoc(docuRef, emailExample);

      //await setDoc(folioRef, folioUpdate);

/*       const query = await getDoc(docuRef);
    
      const infoDocu = query.data();
    
      return infoDocu; */

    }

    //setFolioNumber() 

/*     function SearchBar(){

      return(     

        )
    
    } */

    
    


    useEffect(()=>{

      async function fetchFirebase(){
    

        const userDocReference = await searchOrCreateDocument(user.email);

        setuserDoc(userDocReference);

        setartistName(userDocReference.artistname);       

        setarrayArtworks(userDocReference.artworks)

        setEmail(userDocReference.email);

        setcvUrl(userDocReference.cvUrl);

        setsemblanceUrl(userDocReference.semblanzaUrl)

        setprojectUrl(userDocReference.projectUrl)

        setartistex(userDocReference.exposicionesUrls);
        
        setfolio(userDocReference.folio)

        let artworksDescriptions = await checkDescriptions(userDocReference.artworks)

        if(artworksDescriptions.length > 0){
          setdefaultDescriptions(artworksDescriptions);
          setdescriptionAlert(true)

        };

        //console.log("Descripciones de artworks, resultado del array", artworksDescriptions);

        if(userDocReference.artworks.length >= 3){

          setshowuploadButton(false);

        } else {

          setshowuploadButton(true);

        }

        await searchCurator()
        .then(async(curator)=>{

          //console.log("Curators from useEffect", curator);

          await getArray(userDocReference.email);

          

         
        })



        

      }

      fetchFirebase();      


      //console.log("User", user);

      //console.log("Artworks final <Home>", totalArtworks);

      /* console.log("Artworks final", totalArtworks); */

    },[])

    
    const handleLogout = async() =>{
        try{
        await logout()

      }catch(error){

        console.error(error);

      }

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

    const handleSlider = (e)=>{

      setScoreSearch(e.target.value)
      //console.log("Value", score);
  
    }


    if (loading) return <h1>Loading</h1>

    //console.log("Artworks final", totalArtworks);

    //console.log("Obras del artista <Home/>", arrayArtworks);

    return (

      <>

  { descriptionAlert &&
      <div className="flex fixed flex-col w-full h-full bg-black justify-center align-center gap-4">

        <h1 className="text-xl uppercase text-center">¡Oh No! Nuestro sistema ha detectado que no has terminado de llenar los datos de las siguientes obras:</h1>

        
        {
          defaultDescriptions.map((artwork)=>{

          return(
            <>
            <div className="w-fit h-[50px] text-center border-2 border-teal-400 mx-auto py-3 px-6">
            
            <DescriptionCard artworktitle={ artwork.title }/>


            </div>
            </>
          )     
          })
        
        }

        <p className="text-center text-xl">Recuerda que es importante que todos los datos estén correctamente registrados para que la obra sea válida.</p>

        <button
        onClick={()=>{

          setdescriptionAlert(false);

        }}
        className="w-2/12 rounded-xl border-2 border-teal-400 px-3 py-2 mx-auto hover:bg-teal-400 hover:text-white mt-4">¡Entendido¡</button>
      </div>
      }

      {curatorview &&
              <div className="flex flex-row fixed w-full h-[30px] mt-16 z-50 ">

              <input onClick={()=>{setsliderorSearch("search")}} onChange={(e)=>{ setSearch(e.target.value); console.log("Search input", e.target.value)}} type="text" className="ml-auto rounded-xl border-teal-400 border-2 w-1/2 mr-8 text-right pr-8 bg-transparent" placeHolder="Search by artwork title..." />
             
           </div>
      }
    
    <div className="flex sm:flex-col md:flex-row md:flex-nowrap tablet:pt-3 lg:pt-12 w-full">


      <div id="side-bar"className="flex flex-col sm:justify-center md:justify-between h-full md:p-8 md:pl-16 md:basis-96">
          <nav className="sm:w-full md:w-[22vw] tablet:w-[18vw] lg:w-[18vw]">
          <div className="sm:pb-6 md:pb-4 tablet:pb-1 sm:pt-10 md:pt-5 tablet:pt-4 sm:w-6/12 md:w-9/12 tablet:w-10/12 lg:w-9/12 sm:mx-auto md:ml-0">
              <Logo />
          </div>

          {artistName ? 
          <div className="md:mt-20 lg:mt-24">
          <h1 class="sm:w-full sm:text-2xl md:text-3xl tablet:text-4xl lg:text-5xl font-bold tablet:pb-2 lg:pb-8 text-center md:text-left">Hola <br className="sm:hidden md:block"/>{ artistName }</h1>
          {folio ? <p className="text-xl text-center md:text-left sm:pb-4 md:pb-2" >Folio <span className="font-bold">{ folio }</span></p> : null }
          <h1 className="sm:pb-4 md:pb-2 pt-4 text-center md:text-left text-teal-400 sm:text-lg tablet:text-xl md:tracking-[.27em] tablet:tracking-[.25em]">DASHBOARD</h1>

          
          <hr style={{
            backgroundColor: "#33E0D0",
            height: 1,
            borderStyle: "none"
          }} />
          <GiPlainCircle className="mt-2 ml-auto"/>
          </div>

          :

          <div className="mt-24">
          <h1 class="text-5xl font-bold pb-8">Hola <br />{ user.email }</h1>
          {folio ? <p className="text-xl text-center md:text-left sm:pb-4 md:pb-2" >Folio <span className="font-bold">{ folio }</span></p> : null }
          <h1 className="pb-2 pt-4 text-teal-400 text-xl tracking-[.25em]">DASHBOARD</h1>
          <hr style={{
            backgroundColor: "#33E0D0",
            height: 1,
            borderStyle: "none"
          }} />
          </div>

          }

          {/* NAV */} 
        

          <div className="sm:hidden md:block pb-5 pt-5">
            <h1 className="pb-2 text-teal-400 font-bold md:text-xl tablet:text-lg lg:text-2xl tracking-[.15em]">{ curatorview ? "Artworks" : "Obras subidas"}</h1>
            
            { curatorview ?
            <>
{/*             <h1 class="text-lg hover:text-gray-500 pb-2">Not Qualified</h1>
            <h1 class="text-lg hover:text-gray-500 pb-2">Qualified</h1> */}
            </>

            :

            showuploadButton && <Link to="/upload"><h1 class="text-lg hover:text-gray-500 pb-2">Subir obra</h1></Link>

            }
          </div>
          

          { curatorview ?
          <>
          <h1 class="text-lg pb-2 font-bold">Order by score</h1>

          <CustomSlider onClick={()=>{setsliderorSearch("slider")}} onChange={ handleSlider } min={0.00} max={10.00} defaultValue={ scoreSearch } aria-label="Default" valueLabelDisplay="auto" />

          <h3 className="mt-6 text-xl"><span className="font-bold">Selected score {" "}</span> { scoreSearch }</h3>

          </>
          :

          <>
          <div className="tablet:mt-1 lg:mt-1">
          <Link to="/profile">
             <h1 class="text-center md:text-left text-xl hover:text-gray-500 sm:pb-5 md:pb-2 tracking-[.25em]">PROFILE</h1>
          </Link>
          </div>

          <hr style={{
            backgroundColor: "#33E0D0",
            height: 1,
            borderStyle: "none"
          }} />

          <GiPlainCircle className="mt-2 ml-auto"/>

          
                <div className="flex flex-col hd:-mt-5 lg:mt-0">

                    <div className="flex flex-row justify-center md:justify-start">
                    <p className="text-teal-400 pt-3 pl-1 sm:text-xl md:text-sm tracking-[.25em] uppercase">CV</p>
                    <a href={ cvurl } rel="noreferrer" target="_blank"><BsDownload  className="pl-1 pt-3 sm:text-4xl md:text-3xl" /></a> 
                    </div>

                    <div className="flex flex-row justify-center md:justify-start">
                    <p className="text-teal-400  pt-3 pl-1 sm:text-xl md:text-sm tracking-[.25em] uppercase">Semblanza</p>
                    <a href={ semblanceurl } rel="noreferrer" target="_blank"><BsDownload  className="pl-1 pt-3 sm:text-4xl md:text-3xl" /></a> 
                    </div>

                    <div className="flex flex-row justify-center md:justify-start">
                    <p className="text-teal-400 pt-3 pl-1 sm:text-xl md:text-sm tracking-[.25em] uppercase">Proyecto</p>
                    <a href={ projecturl } rel="noreferrer" target="_blank"><BsDownload  className="pl-1 pt-3 sm:text-4xl md:text-3xl" /></a>   
                    </div>

                    <div className="flex flex-row justify-center md:justify-start">
                    <p className="text-teal-400 pt-3 pl-1 sm:text-xl md:text-sm tracking-[.25em] uppercase">Exhibiciones</p>
                    <BsDownload  onClick={handleZipDownload} className="pl-1 pt-3 sm:text-4xl md:text-3xl cursor-pointer" />  
                    </div>
                </div>

          </>

          }

          </nav>

          <div className="flex justify-center md:justify-start sm:pt-6 md:pt-0 gap-4 hover:text-gray-500">
            <button onClick={ handleLogout }>
            Logout
            </button> 
          </div>

      </div>

      
      <main className="sm:pt-4 md:pt-32 sm:w-full md:w-[75vw] h-full">
          

        <div className="sm:w-full md:w-11/12 h-full md:pl-2 sm:px-4 md:px-0 md:py-8 md:pr-8 tablet:p-8 mt-2 flex justify-items-center space-x-7">




        

              {/* CARDS */}


            {
            curatorview ?  
            
              ( userDoc ? <div className="flex flex-row flex-nowrap absolute bottom-0 h-full w-fit pb-20 pt-44 gap-x-4"><Obras obras={ totalArtworks } artistname={ artistName } email={ email } iscurator={ true } searchtext={search} scoresearch={ scoreSearch } sliderorsearch={ sliderorSearch }/> </div>: null )
              
            :

              (userDoc ? <div className="grid sm:grid-rows-2 md:grid-rows-1 sm:grid-cols md:grid-cols-3 gap-6 sm:h-[1600px] md:h-full sm:w-full md:w-screen sm:pb-10 md:pb-10 lg:pb-20 px-auto"><Obras obras={ arrayArtworks  } artistex= { artistex } artistname={ artistName } email={ email } cvURL={cvurl} semblanceURL={ semblanceurl } projectURL={ projecturl } iscurator={ false }/> </div> : null )


            }
            




      </div>

      </main>


    </div>

    </>

    )
}
