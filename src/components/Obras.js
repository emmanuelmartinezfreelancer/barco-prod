import { React, useState, useEffect } from 'react'
import Modal from './Modal';
import QualificationModal from './QualificationModal';
import { useAuth } from "../context/authContext"
import { app } from '../firebase'
import { getFirestore, doc, getDocs, collection } from "firebase/firestore"

const firestore = getFirestore(app); 

export default function Obras({obras, artistname, email, iscurator, cvURL, semblanceURL, projectURL}) {

const [isShown, setIsShown] = useState(false);
const [userMail, setuserMail] = useState(email);
const [totalArtworks, setTotalArtworks] = useState([]);
const [curatorview, setcuratorView] = useState(iscurator);
/* console.log("Email desde Obras", userMail); */

let artworksToShow = [];

/* console.log("Obras desde componente <Obras>", obras) */

useEffect(()=>{

  /* setcuratorView(true); */

  
},[])

/* console.log("Curatow view desde <Obras>", iscurator) */



/* const searchAllUsers = async()=>{
  
  //Crear referencia al documento
  const docuRef = await getDocs(collection(firestore, "users"));

  let arrayAllArtworks = [];

  docuRef.forEach((doc)=>{

    let docInfo;

    docInfo = doc.data();

    /* console.log(doc.id, " => ", doc.data()); */

/*     if(!docInfo.artistname || !docInfo.artworks){

    arrayAllArtworks.push({artistname : "", artworks: [""]});
    
  } else {
    
     arrayAllArtworks.push({ artistname : docInfo.artistname, artworks: docInfo.artworks });

    }
  })

  return arrayAllArtworks; 
   
} */

/* const fetchArtworks = async()=>{

  await searchAllUsers().then((users)=>{

  setTotalArtworks(users);

  });    } */



/* useEffect(()=>{ 

  const getArray = async()=>{

    if(userMail === "vela.freelancer@gmail.com"){

      await fetchArtworks()
      
      console.log("Artworks final", totalArtworks);
    
      setcuratorView(true);
    
      } else {
    
      console.log("Regular user")
    }
  }

  getArray();

},[]) */

  /* console.log("Artworks final afuera de Use Effect", totalArtworks[0]); */
  

  return (   
            <> 
            
        { iscurator ? 

             
          obras.map((artista) =>{

            return(
            <>
            {
              artista.artworks.map((artwork)=>{

                  return(

                      <>
                      <div className="shadow overflow-hidden w-[410px] h-full"
                      style={{ 
                        backgroundImage: `url("${ artwork.imgurl }")` 
                      }}
                      onMouseEnter={() => setIsShown(true)}
                      onMouseLeave={() => setIsShown(false)}
                      >  { isShown &&             
                          <div className="h-screen pt-72">
                            
                            <div className="z-10 flex flex-col pt-56 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] bg-opacity-50">
  
                              <p className="text-white font-bold text-right pr-6 uppercase text-xl">{ artwork.title }</p>
                              <p className="text-white text-right uppercase pr-6 text-lg">{ artista.artistname }</p>
                              <QualificationModal className="ml-auto" artwork ={ artwork.title }  description={ artwork.description } artistName= { artista.artistname } imgurl= {artwork.imgurl } email= {artista.email} scoreFirebase={ artwork.score } artistcv={ artista.cv } artistsemblance={ artista.semblance } projectdescription={ artista.project } onMouseEnter={() => setIsShown(false)} />
                                      <hr style={{
                                            backgroundColor: "white",
                                            height: 1,
                                            borderStyle: "none"
                                      }} 
                                      className="mr-6 ml-6 mt-1"
                                      />
                              <p className="ml-6 mt-1 text-white text-left pr-6 text-lg"><span className="font-bold">Score</span> { artwork.score }</p>
                              </div>
  {/*                         <div style={{
                                    width: "475px",
                                    height: "1000px",
                                    borderRadius: "15rem 0",
                                    backgroundColor: "#26A7A3",
                          }}
                          className="opacity-100 ml-auto mt-4"
                          ></div> */}
  
                          </div>
                          }
                      </div>
  
                      
  
                      </>




                  )

              })


            }
            </>

            )

          }) 


              :

              obras.map((obra) =>{

                /* console.log("Obra", obra);*/
                
                  return(
  
                      <>
                      <div className="shadow overflow-hidden"
                      style={{ 
                        backgroundImage: `url("${ obra.imgurl }")` 
                      }}
                      onMouseEnter={() => setIsShown(true)}
                      onMouseLeave={() => setIsShown(false)}
                      >  { isShown &&             
                          <div className="h-screen pt-72">
                            
                            <div className="z-10 flex flex-col pt-56 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] bg-opacity-50">
  
                              <p className="text-white font-bold text-right pr-6 uppercase text-xl">{ obra.title }</p>
                              <p className="text-white text-right uppercase pr-6 text-lg">{ artistname }</p>
                              <Modal className="ml-auto" artwork ={ obra.title } description={ obra.description } artistName= { artistname } imgurl= { obra.imgurl } artistcv={ cvURL } artistsemblance={ semblanceURL } projectdescription={ projectURL } onMouseEnter={() => setIsShown(false)} />
                                      <hr style={{
                                            backgroundColor: "white",
                                            height: 1,
                                            borderStyle: "none"
                                      }} 
                                      className="mr-6 ml-6 mt-1"
                                      />
                              </div>
  {/*                         <div style={{
                                    width: "475px",
                                    height: "1000px",
                                    borderRadius: "15rem 0",
                                    backgroundColor: "#26A7A3",
                          }}
                          className="opacity-100 ml-auto mt-4"
                          ></div> */}
  
                          </div>
                          }
                      </div>
  
                      
  
                      </>
                  )})

              }

              </>
        )
}
