import {React, useState, useEffect} from "react";
import { useAuth } from "../context/authContext"
import { ReactComponent as Logo } from '../assets/logoBarcoHome.svg';
import { Link, useNavigate } from "react-router-dom";
import Obras from './Obras.js'
import UploadArtwork from "./UploadArtwork";
import { app } from '../firebase'
import { getFirestore, doc, getDoc, getDocs, collection } from "firebase/firestore"
import { GiPlainCircle } from "react-icons/gi"
import { BsDownload } from "react-icons/bs"
import { GrDocumentDownload } from "react-icons/gr"
import JSZip from 'jszip';
import { saveAs } from 'file-saver';


const firestore = getFirestore(app); 

let fakeArray = [{title: "hola mundo"}];


function SearchBar(){

  return(     
    <div className="flex flex-row fixed w-full h-[30px] mt-16">
       <button className="w-1/2 m-auto"></button>
      <button className="rounded-xl border-teal-400 border-2 w-1/2 ml-24 pl-6 mr-8 text-right pr-8">Search by title or artist name...</button>
      
    </div>
    )

}


export function Home(){

    const { user, logout, loading } = useAuth();

    const [userDoc, setuserDoc] = useState(null);

    const [artistName, setartistName] = useState(null);

    const [cvurl, setcvUrl] = useState(null);
    
    const [semblanceurl, setsemblanceUrl] = useState(null);

    const [projecturl, setprojectUrl] = useState(null);

    const [artistex, setartistex] = useState(null);

    const [arrayArtworks, setarrayArtworks] = useState(null);

    const [totalArtworks, setTotalArtworks] = useState([]);

    const [email, setEmail] = useState(null);

    const [showuploadButton, setshowuploadButton] =  useState(true);

    const [iscurator, setisCurator] = useState([{name: "Tobias Ostrander", email: "tobiasostrander@gmail.com"}, {name: "Emmanuel Martínez", email: "vel.freelancer@gmail.com"}, {name: "Oscar Ascencio", email:"oscarascencioc@hotmail.com"}]);

    const [curatorview, setcuratorView] = useState(false);


    const searchOrCreateDocument = async(idDocumento)=>{

      //Crear referencia al documento
      const docuRef = doc(firestore, `users/${idDocumento}`)
       
      const query = await getDoc(docuRef);
    
      const infoDocu = query.data();
    
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
        
         arrayAllArtworks.push({ artistname : docInfo.artistname, artworks: docInfo.artworks, email: docInfo.email, cv: docInfo.cvUrl, semblance: docInfo.semblanzaUrl, project: docInfo.projectUrl, exhibitions: docInfo.exposicionesUrls });
    
        }
      })
    
      return arrayAllArtworks;
       
    }

    const getArray = async(userMail)=>{

      if(userMail === iscurator[0].email || userMail === iscurator[1].email || userMail === iscurator[2].email){
  
        setTotalArtworks(await searchAllUsers())

      
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

        if(userDocReference.artworks.length >= 3){

          setshowuploadButton(false);

        } else {

          setshowuploadButton(true);

        }

        await searchCurator()
        .then(async(curator)=>{

          console.log("Curators from useEffect", curator);

          await getArray(userDocReference.email);
        })

        

        

      }

      fetchFirebase();      

      console.log("User", user);

      console.log("Artworks final <Home>", totalArtworks);

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


    if (loading) return <h1>Loading</h1>

    console.log("Artworks final", totalArtworks);

    return (

      <>

      {curatorview &&
      <SearchBar/>
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
            <h1 className="pb-2 text-teal-400 font-bold md:text-xl tablet:text-lg lg:text-2xl tracking-[.15em]">{ curatorview ? "Obras" : "Obras subidas"}</h1>
            
            { curatorview ?
            <>
            <h1 class="text-lg hover:text-gray-500 pb-2">Sin calificar</h1>
            <h1 class="text-lg hover:text-gray-500 pb-2">Calificadas</h1>
            </>

            :

            showuploadButton && <Link to="/upload"><h1 class="text-lg hover:text-gray-500 pb-2">Subir obra</h1></Link>

            }
          </div>
          

          { curatorview ?

          null

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

          
                <div className="flex flex-col">

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
            
             ( userDoc ? <div className="flex flex-row flex-nowrap absolute bottom-0 h-full w-fit pb-20 pt-44 gap-x-4"><Obras obras={ totalArtworks } artistname={ artistName } email={ email } iscurator={ true } /> </div>: null )
              
            :

              (userDoc ? <div className="grid sm:grid-rows-2 md:grid-rows-1 sm:grid-cols md:grid-cols-3 gap-6 sm:h-[1600px] md:h-full sm:w-full md:w-screen sm:pb-10 md:pb-10 lg:pb-20 px-auto"><Obras obras={ arrayArtworks  } artistex= { artistex } artistname={ artistName } email={ email } cvURL={cvurl} semblanceURL={ semblanceurl } projectURL={ projecturl } iscurator={ false }/> </div> : null )


            }
            




      </div>

      </main>


    </div>

    </>

    )
}
