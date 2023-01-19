import {React, useState, useEffect} from "react";
import { useAuth } from "../context/authContext"
import { ReactComponent as Logo } from '../assets/logoBarcoHome.svg';
import { Link, useNavigate } from "react-router-dom";
import Obras from './Obras.js'
import UploadArtwork from "./UploadArtwork";
import { app } from '../firebase'
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore"
import { GiPlainCircle } from "react-icons/gi"


const firestore = getFirestore(app); 

let fakeArray = [{title: "hola mundo"}];



export function HomeJuez(){

    const { user, logout, loading } = useAuth();

    const [userDoc, setuserDoc] = useState(null);

    const [artistName, setartistName] = useState(null);

    const [artworkImage, setartworkImage] = useState(null);

    const [arrayArtworks, setarrayArtworks] = useState(null);

    const [showuploadButton, setshowuploadButton] =  useState(true);

    const searchOrCreateDocument = async(idDocumento)=>{

      //Crear referencia al documento
      const docuRef = doc(firestore, `users/${idDocumento}`)
       
      const query = await getDoc(docuRef);
    
      const infoDocu = query.data();
    
      return infoDocu;
  
    
    }

    console.log("User", user);

    useEffect(()=>{

      async function fetchFirebase(){

        const userDocReference = await searchOrCreateDocument(user.email);

        setuserDoc(userDocReference);

        setartistName(userDocReference.artistname);       

        setarrayArtworks(userDocReference.artworks)

        if(userDocReference.artworks.length >= 3){

          setshowuploadButton(false);

        } else {

          setshowuploadButton(true);

        }
        

      }

      fetchFirebase();      

    },[])

    useEffect(()=>{
      

    },[showuploadButton])
    
    const handleLogout = async() =>{
        try{
        await logout()

      }catch(error){

        console.error(error);

      }

    }

    if (loading) return <h1>Loading</h1>

    

    return (
    
    <div className="container flex pl-12 pt-12">

      <div id="side-bar"className="w-3/5 left-0 top-0 h-full p-8 flex flex-col justify-between">
          <nav>
          <div className="mb-5 w-2/4">
              <Logo />
          </div>

          {artistName ? 
          <div className="mt-24">
          <h1 class="text-4xl font-bold pb-8 ">Hola <br />{ artistName }</h1>
          <h1 className="pb-2 pt-4 text-teal-400 text-lg tracking-[.25em]">DASHBOARD</h1>
          
          <hr style={{
            backgroundColor: "#33E0D0",
            height: 1,
            borderStyle: "none"
          }} />
          <GiPlainCircle className="mt-2 ml-auto"/>
          </div>

          :

          <div className="mt-24">
          <h1 class="text-4xl font-bold pb-8">Hola <br />{ user.email }</h1>
          <h1 className="pb-2 pt-4 text-teal-400 text-lg tracking-[.25em]">DASHBOARD</h1>
          <hr style={{
            backgroundColor: "#33E0D0",
            height: 1,
            borderStyle: "none"
          }} />
          </div>

          }

          {/* NAV */} 
        

          <div className="pb-5 pt-5">
            <h1 className="pb-2 text-teal-400 font-bold text-xl tracking-[.25em]">Obras subidas</h1>
            {/* <h1 className="text-teal-400 hover:text-gray-500 text-lg">Subidas</h1> */}
            { showuploadButton && 

                <Link to="/upload">
                <h1 class="text-lg hover:text-gray-500 pb-2">Subir obra</h1>
             </Link>
            }
          </div>

          <div className="mt-5">
          <Link to="/profile">
             <h1 class="text-lg hover:text-gray-500 pb-2 tracking-[.25em]">PROFILE</h1>
          </Link>
          </div>

          <hr style={{
            backgroundColor: "#33E0D0",
            height: 1,
            borderStyle: "none"
          }} />

          <GiPlainCircle className="mt-2 ml-auto"/>

          </nav>

          <div className="flex items-center gap-4 hover:text-gray-500">
            <button onClick={ handleLogout }>
            Logout
            </button> 
          </div>

      </div>

      
      <main className="pt-32 w-screen h-full">
          

        <div className="border-2 border-black rounded-2xl w-11/12 h-full p-8 mt-2 flex justify-items-center space-x-7">



      <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-20 pt-44 absolute bottom-0 h-full w-4/5 m-0">

              {/* CARDS */}
            { userDoc ? 
            <Obras obras={ arrayArtworks } artistname={ artistName }/>
            : null         
            }
            
              


        </div>
      </div>
    </div>


      </div>

      </main>


    </div>
    )
}
