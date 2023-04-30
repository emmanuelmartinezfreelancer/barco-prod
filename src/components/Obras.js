import { React, useState, useEffect } from 'react'
import Modal from './Modal';
import QualificationModal from './QualificationModal';
import { useAuth } from "../context/authContext"
import { app } from '../firebase'
import { getFirestore, doc, getDocs, collection } from "firebase/firestore"
import { getStorage, ref, getMetadata, child } from "firebase/storage";

const firestore = getFirestore(app); 

export default function Obras({obras, artistname, email, iscurator, cvURL, semblanceURL, projectURL, artistex, searchtext, scoresearch, sliderorsearch}) {

const [isShown, setIsShown] = useState(true);
const [userMail, setuserMail] = useState(email);
const [totalArtworks, setTotalArtworks] = useState([]);
const [curatorview, setcuratorView] = useState(iscurator);
/* console.log("Email desde Obras", userMail); */

const [obrasVisualizacion, setobrasVisualizacion] = useState([]);



 //console.log("Obras desde componente <Obras>", obras);

 const getArtworks = async () => {

  let arrayFinal = [];
 
  for(let i = 0; i < obras.length; i++){

    let fileType = await getFileType(obras[i]);

    console.log("fileType", fileType);

    if (fileType === "image"){

      arrayFinal.push({...obras[i], isvideo: false, isimage: true});

    } else if (fileType === "video"){

      arrayFinal.push({...obras[i], isvideo: true, isimage: false});

    } 
  
  }

  return arrayFinal;

}

useEffect(()=>{

 
  getArtworks().then((arrayFinal)=>{

    setobrasVisualizacion(arrayFinal)

  })

  
},[obrasVisualizacion.length])



function getMediaElement(obra, url, contentType) {

    return(
  
      <>
      <div className="shadow overflow-hidden"
      style={{ 
        backgroundImage: `url("${ obra.imgurl }")` 
      }}
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      >  { isShown &&             
          <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-28">
            {/*  */}
            
            <div className="z-10 flex flex-col pt-56 tablet:pt-28 hd:pt-9 lg:pt-64 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] lg:h-[1000px] bg-opacity-60">

              <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ obra.title }</p>
              <p className="text-white text-right uppercase pr-6 text-lg tablet:text-sm hd:text-base lg:text-lg">{ artistname }</p>
              <Modal className="ml-auto" artwork ={ obra.title } artworkinfo={ obra } artistex= { artistex } description={ obra.description } artistName= { artistname } imgurl= { obra.imgurl } dimensions={ obra.widtheight} peso={ obra.weight } artistcv={ cvURL } artistsemblance={ semblanceURL } projectdescription={ projectURL } onMouseEnter={() => setIsShown(false)} />
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

      

      </>)
/* else if (isVideo(contentType)) {
    return (
      <video src={url} controls>
        Your browser does not support the video tag.
      </video>
    );
  } else {
    return <div>Unsupported file type</div>;
  } */
}

const [mediaElement, setMediaElement] = useState(null);

const getFileType = async (obra) => {

  let fileType;

  //const storageRef = getStorage(app);
  const storage = getStorage(app);

  const storageRef = ref(storage, obra.imgurl);

/*   const storageRef = ref(storage);
  const childRef = child(storageRef, obra.imgurl);   */

  await getMetadata(storageRef)
  .then((metadata) => {
    // Check if the file is an image or video
    if (metadata.contentType.startsWith("image/")) {

      fileType = "image"


    } else if(metadata.contentType.startsWith("video/")){

      fileType = "video"


    } else{
      
      console.warn("Unsupported file type:", metadata.contentType);

    }
  })
  .catch((error) => {
    console.error("Error getting metadata:", error);
  });

  return fileType;
  
}



const arrayArtworks = obras.map((artista)=>{return artista.artworks}).flat()

const finalArtworksFiltered = arrayArtworks.filter((obra)=>{

  if (obra !== "\"\""){

    return obra

  }

})

//console.log("slideorsearch <Home>", sliderorsearch)

let filterArtworks;

if(sliderorsearch === "search"){

  filterArtworks = finalArtworksFiltered.filter((obra) => {

    if (searchtext === '') {
        return obra;
    }
  
    else if(obra.title.toLowerCase().includes(searchtext.toLowerCase())){  

      return obra;

  } })

}

else if(sliderorsearch === "slider") {

  filterArtworks = finalArtworksFiltered.filter((obra) => {

    if (scoresearch === 0) {

        return obra;
    }
  
    else if(obra.score === scoresearch){  
      
      return obra;

    } })

}

  console.log("Filtered Data <Obras/>", filterArtworks);
/*
  console.log("Obras array en <Obras/>", finalArtworksFiltered);

  console.log("Search Text <Obras/>", searchtext); */

  return (   
            <> 
            
        { iscurator ? 

          filterArtworks &&

            filterArtworks.map((obra)=>{
                  return(
  
                      <>
                      <div className="shadow overflow-hidden md:w-[50px] tablet:w-[410px] h-full bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url("${ obra.imgurl }")` 
                      }}
                      onMouseEnter={() => setIsShown(true)}
                      onMouseLeave={() => setIsShown(false)}
                      >  { isShown &&             
                        <div className="h-screen pt-72">
                            
                        <div className="z-10 flex flex-col pt-56 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] bg-opacity-50">

                          <p className="text-white font-bold text-right pr-6 uppercase text-xl">{ obra.title }</p>
                          <p className="text-white text-right uppercase pr-6 text-lg">{ "artista.artistname" }</p>
                          <QualificationModal className="ml-auto" 
                                  artwork ={ obra.title }
                                  description={ obra.description }
                                  dimensions={ obra.widtheight}
                                  peso={ obra.weight }
                                  artistName= { "artista.artistname" }
                                  imgurl= {obra.imgurl }
                                  email= {"artista.email"}
                                  scoreFirebase={ obra.score }
                                  artistcv={ "artista.cv" }
                                  artistsemblance={ "artista.semblance" }
                                  projectdescription={ "artista.project" }
                                  artistex= { "artista.exhibitions" }
                                  technique = { obra.technique }
                                  edition = { obra.edition }
                                  year = { obra.year }
                                  value = { obra.value }
                                  
                                  onMouseEnter={() => setIsShown(false)} />
                                  <hr style={{
                                        backgroundColor: "white",
                                        height: 1,
                                        borderStyle: "none"
                                  }} 
                                  className="mr-6 ml-6 mt-1"
                                  />
                          <p className="ml-6 mt-1 text-white text-left pr-6 text-lg"><span className="font-bold">Score</span> { "obra.score" }</p>
                          </div>
                          </div>
                          }
                      </div>
  
                      
  
                      </>
                  )})

            :

                obrasVisualizacion.map((obra) =>{

                  if(obra.isimage){

                  return(
  
                    <>
                    <div className="shadow overflow-hidden"
                    style={{ 
                      backgroundImage: `url("${ obra.imgurl }")` 
                    }}
/*                     onMouseEnter={() => setIsShown(true)}
                    onMouseLeave={() => setIsShown(false)} */
                    >  { isShown &&             
                        <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-28">
                          {/*  */}
                          
                          <div className="z-10 flex flex-col pt-56 tablet:pt-28 hd:pt-9 lg:pt-64 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] lg:h-[1000px] bg-opacity-60">
              
                            <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ obra.title }</p>
                            <p className="text-white text-right uppercase pr-6 text-lg tablet:text-sm hd:text-base lg:text-lg">{ artistname }</p>
                            <Modal className="ml-auto" artwork ={ obra.title } artworkinfo={ obra } artistex= { artistex } description={ obra.description } artistName= { artistname } imgurl= { obra.imgurl } dimensions={ obra.widtheight} peso={ obra.weight } artistcv={ cvURL } artistsemblance={ semblanceURL } projectdescription={ projectURL } contenttype={ "image" } onMouseEnter={() => setIsShown(false)} />
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
              
                    
              
                    </>)

                  } else if(obra.isvideo){

                    return(
                      
                      <div className="shadow overflow-hidden"
/* 
                      onMouseEnter={() => setIsShown(true)}
                      onMouseLeave={() => setIsShown(false)} */
                      >
                      <div className="relative">
                      <video className="absolute" autoPlay loop muted src={obra.imgurl} />
                      </div>
                      { isShown &&             
                          <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-28 bg-transparent z-50">
                            {/*  */}
                            
                            <div className="z-10 flex flex-col pt-56 tablet:pt-28 hd:pt-9 lg:pt-64 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] lg:h-[1000px] bg-opacity-60">
                
                              <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ obra.title }</p>
                              <p className="text-white text-right uppercase pr-6 text-lg tablet:text-sm hd:text-base lg:text-lg">{ artistname }</p>
                              <Modal className="ml-auto" artwork ={ obra.title } artworkinfo={ obra } artistex= { artistex } description={ obra.description } artistName= { artistname } imgurl= { obra.imgurl } dimensions={ obra.widtheight} peso={ obra.weight } artistcv={ cvURL } artistsemblance={ semblanceURL } projectdescription={ projectURL } contenttype={ "video" } onMouseEnter={() => setIsShown(false)} />
                                      <hr style={{
                                            backgroundColor: "white",
                                            height: 1,
                                            borderStyle: "none"
                                      }} 
                                      className="mr-6 ml-6 mt-1"
                                      />
                              </div>
                
                          </div>
                          }
                      </div>

                    )

                  }
                /* console.log("Obra", obra);*/

                //let fileType = getFileType(obra);

/*                 return(
                  {
                  mediaElement
                  }

                ) */


                //console.log(`Media Type ${obra.title}`, mediaElement);

/*                 if (mediaType.includes("image/")) {
                  return <img src={`${obra.imgurl}`}></img>
                } else if (mediaType.includes("video/")) {
                  return <video src={`${obra.imgurl}`} controls>
                  Your browser does not support the video tag.
                </video>
                } else {
                  return <div>Unsupported file type</div>;
                } */
                
               })

              }

              </>
        )
}
