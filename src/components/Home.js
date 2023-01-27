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


const firestore = getFirestore(app); 

let fakeArray = [{title: "hola mundo"}];

export function Home(){

    const { user, logout, loading } = useAuth();

    const [userDoc, setuserDoc] = useState(null);

    const [artistName, setartistName] = useState(null);

    const [cvurl, setcvUrl] = useState(null);
    
    const [semblanceurl, setsemblanceUrl] = useState(null);

    const [projecturl, setprojectUrl] = useState(null);

    const [arrayArtworks, setarrayArtworks] = useState(null);

    const [totalArtworks, setTotalArtworks] = useState([]);

    const [email, setEmail] = useState(null);

    const [showuploadButton, setshowuploadButton] =  useState(true);

    const [iscurator, setisCurator] = useState([{name: "Tobias Ostrander", email: "tobiasostrander@gmail.com"}, {name: "Emmanuel Martínez", email: "vela.freelancer@gmail.com"}, {name: "Oscar Ascencio", email:"oscarascencioc@hotmail.com"}]);

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
        
         arrayAllArtworks.push({ artistname : docInfo.artistname, artworks: docInfo.artworks, email: docInfo.email, cv: docInfo.cvUrl, semblance: docInfo.semblanzaUrl, project: docInfo.projectUrl });
    
        }
      })
    
      return arrayAllArtworks;
       
    }

    const getArray = async(userMail)=>{

      if(userMail === iscurator[0].email || userMail === iscurator[1].email){
  
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

    

    if (loading) return <h1>Loading</h1>

    console.log("Artworks final", totalArtworks);

    return (
    
    <div className="flex flex-row flex-nowrap pt-12">

{/* w-3/5 flex flex-col justify-between*/}

      <div id="side-bar"className="flex flex-col justify-between h-full p-8 pl-16 basis-96">
          <nav className="w-[18vw]">
          <div className="pb-6 w-8/12">
              <Logo />
          </div>

          {artistName ? 
          <div className="mt-24">
          <h1 class="text-5xl font-bold pb-8 ">Hola <br />{ artistName }</h1>
          <h1 className="pb-2 pt-4 text-teal-400 text-xl tracking-[.25em]">DASHBOARD</h1>
          
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
        

          <div className="pb-5 pt-5">
            <h1 className="pb-2 text-teal-400 font-bold text-2xl tracking-[.25em]">{ curatorview ? "Obras" : "Obras subidas"}</h1>
            
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
          <div className="mt-5">
          <Link to="/profile">
             <h1 class="text-xl hover:text-gray-500 pb-2 tracking-[.25em]">PROFILE</h1>
          </Link>
          </div>

          <hr style={{
            backgroundColor: "#33E0D0",
            height: 1,
            borderStyle: "none"
          }} />

          <GiPlainCircle className="mt-2 ml-auto"/>

          
                <div className="flex flex-col">

                    <div className="flex flex-row">
                    <p className="text-teal-400 pt-3 pl-1 text-sm tracking-[.25em] uppercase">CV</p>
                    <a href={ cvurl } rel="noreferrer" target="_blank"><BsDownload  className="pl-1 pt-3 text-3xl" /></a> 
                    </div>

                    <div className="flex flex-row">
                    <p className="text-teal-400  pt-3 pl-1 text-sm tracking-[.25em] uppercase">Semblanza</p>
                    <a href={ semblanceurl } rel="noreferrer" target="_blank"><BsDownload  className="pl-1 pt-3 text-3xl" /></a> 
                    </div>

                    <div className="flex flex-row">
                    <p className="text-teal-400 pt-3 pl-1 text-sm tracking-[.25em] uppercase">Projecto</p>
                    <a href={ projecturl } rel="noreferrer" target="_blank"><BsDownload  className="pl-1 pt-3 text-3xl" /></a>   
                    </div>
                </div>

          </>

          }

          </nav>

          <div className="flex items-center gap-4 hover:text-gray-500">
            <button onClick={ handleLogout }>
            Logout
            </button> 
          </div>

      </div>

      
      <main className="pt-32 w-[75vw] h-full">
          

        <div className="border-2 border-black rounded-2xl w-11/12 h-full p-8 mt-2 flex justify-items-center space-x-7">




        

              {/* CARDS */}


            {
            curatorview ?  
            
             ( userDoc ? <div className="flex flex-row flex-nowrap absolute bottom-0 h-full w-fit pb-20 pt-44 gap-x-4"><Obras obras={ totalArtworks } artistname={ artistName } email={ email } iscurator={ true } /> </div>: null )
              
            :

              (userDoc ? <div className="grid grid-rows-1 grid-cols-3 auto-cols-min gap-6 h-full w-screen pb-20"><Obras obras={ arrayArtworks  } artistname={ artistName } email={ email } cvURL={cvurl} semblanceURL={ semblanceurl } projectURL={ projecturl } iscurator={ false }/> </div> : null )


            }
            




      </div>

      </main>


    </div>
    )
}
