import {React, useState} from "react";
import { useAuth } from "../context/authContext"
import { ReactComponent as Logo } from '../assets/logoBarco.svg';
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import QualificationModal from "./QualificationModal";


export function HomeJuez(){

    const { user, logout, loading } = useAuth();

    const [isShown, setIsShown] = useState(false);

    console.log("User", user);
    
    const handleLogout = async() =>{
        try{
        await logout()

      }catch(error){

        console.error(error);

      }

    }

    if (loading) return <h1>Loading</h1>


    return (
    
    <div>

      <div id="side-bar"className="fixed left-0 top-0 w-72 h-full p-8 flex flex-col justify-between">
          <nav>
          <div className="w-24 mb-5">
              <Logo />
          </div>
          <h1 className="pb-2 text-black">DASHBOARD JUEZ</h1>
          <hr style={{
            backgroundColor: "black",
            height: 2
          }} />

          {/* NAV */} 
          


          <div className="pb-5 pt-5">
            <h1>OBRAS</h1>
            <h1 className="text-black hover:text-gray-500">Sin calificar</h1>
            <h1 className="text-black hover:text-gray-500">Calificadas</h1>
          </div>

          <hr style={{
            backgroundColor: "black",
            height: 2
          }} />

          <div className="mt-5">
          <Link to="/profile">
             <h1 class="text-xl font-bold hover:text-gray-500">PROFILE</h1>
          </Link>
          </div>

          </nav>

          <div className="flex items-center gap-4 hover:text-gray-500">
            <button onClick={ handleLogout }>
            Logout
            </button> 
          </div>

      </div>

      
      <main className="pl-80 pt-32 w-screen">
        
        {/* Header */}

        <header>
         
          <div className="mt-5">
             <h1 class="text-xl font-bold underline">Hola { user.displayName || user.email}</h1>
          </div>

        </header>

        {/* Content */}

        <div className="border-2 border-black rounded-2xl w-11/12 h-full p-8 mt-2 flex justify-items-center space-x-7">



      <div className="flex justify-center">
      <div className="px-4" style={{ maxWidth: '1600px' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">

              {/* CARDS */}

              <div className="bg-[url('/img/M1.jpg')] border shadow rounded-xl overflow-hidden"
                    onMouseEnter={() => setIsShown(true)}
                    onMouseLeave={() => setIsShown(false)}
                    >
                

                      
                <div className="h-64 w-64 h-full">

                {isShown &&
                <>
                    <div className="pt-2 pl-14 fixed mx-auto text-white">
                    <p className="text-xl">OVERALL SCORE</p>
                    <h1 className="text-3xl text-center">8.3</h1>
                    </div>

                    <div className="pt-20 h-5 w-64 bg-black opacity-100"> 
                    

                    <p className="text-white text-center bg-black">Artwork title #1</p>
                    <p className="text-white text-center bg-black pb-8">Artist name</p>
                    <QualificationModal onMouseEnter={() => setIsShown(false)} />
                  </div>

                  </>
                 }
                  </div>
              
              </div>

              


        </div>
      </div>
    </div>


      </div>

      </main>


    </div>
    )
}
