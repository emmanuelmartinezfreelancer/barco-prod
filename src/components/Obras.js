import { React, useState, useEffect } from 'react'
import Modal from './Modal';
import QualificationModal from './QualificationModal';
import { useAuth } from "../context/authContext"
import { app } from '../firebase'
import { getFirestore, doc, getDocs, collection } from "firebase/firestore"
import { getStorage, ref, getMetadata, child } from "firebase/storage";

const firestore = getFirestore(app); 

export default function Obras({obras, artistname, email, iscurator, cvURL, semblanceURL, projectURL, artistex, searchtext, scoresearch, sliderorsearch, setnumeroObras, setnumeroObrasFilt }) {

const [isShown, setIsShown] = useState(true);
const [userMail, setuserMail] = useState(email);
const [totalArtworks, setTotalArtworks] = useState([]);
const [curatorview, setcuratorView] = useState(iscurator);
/* console.log("Email desde Obras", userMail); */

const [obrasVisualizacion, setobrasVisualizacion] = useState([]);

 //console.log("Obras desde componente <Obras>", obrasVisualizacion);

 const getArtworks = async () => {

  let arrayFinal = [];
 
  for(let i = 0; i < obras.length; i++){

    let fileType = await getFileType(obras[i]);

    //console.log("fileType", fileType);

    if (fileType === "image"){

      arrayFinal.push({...obras[i], isvideo: false, isimage: true, unknown: false});

    } else if (fileType === "video"){

      arrayFinal.push({...obras[i], isvideo: true, isimage: false, unknown: false});

    } else if (fileType === "unknown"){

      arrayFinal.push({...obras[i], isvideo: false, isimage: false, unknown: true});

    } 
  
  }

  return arrayFinal;

}

useEffect(()=>{

 
  getArtworks().then((arrayFinal)=>{

    setobrasVisualizacion(arrayFinal)

  })

  
},[obrasVisualizacion.length, sliderorsearch])



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
              <Modal className="ml-auto" artwork ={ obra.title } artworkinfo={ obra } artistex= { artistex } description={ obra.description } artistName= { artistname } imgurl= { obra.imgurl } dimensions={ obra.widtheight} peso={ obra.weight } artistcv={ cvURL } artistsemblance={ semblanceURL } projectdescription={ projectURL } />
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

  const response = await fetch(obra.imgurl);
  const blob = await response.blob();
  const blobType = blob.type;

  if (blobType.startsWith("image/")) {
    fileType = "image";
  } else if (blobType.startsWith("video/")) {
    fileType = "video";
  } else {
    fileType="unknown"
  }

  return fileType;
  
}

const arrayArtworks = obras.map((artista)=>{

  //console.log("Artista from arrayArtworks <Obras/>", artista);

  if(artista.artworks !== undefined){  
    return artista 
  
  } else {

      console.log("Artista from arrayArtworks <Obras/>", artista.artistname, "No tiene obras")

  }


 
/*   artista.artworks.filter((obra)=>{

    if (obra !== "\"\""){
  
      return artista
  
    }
  
  }) */
  
  //return artista.artworks

})
//.flat()


const [obrasFiltradas, setObrasFiltradas] = useState(arrayArtworks);

console.log("obrasFiltradas <Obras/>", obrasFiltradas)

const filterArtworksBySearch = () => {

  let obrasFilter = []; 

  setnumeroObrasFilt(obrasFiltradas.length);

  if(sliderorsearch === "search"){
    
    //console.log("search")

    arrayArtworks.map((artista)=>{
  
       return artista.artworks.map((obra) => {
  
        if(obra.title !== undefined){
  
          if (searchtext === '') {

            obrasFilter = [];
           
            return artista;
          }
        
          else if(obra.title.toLowerCase().includes(searchtext.toLowerCase())){  
  
            //console.log("artista from arrayArtworks <Obras/>", artista.artistname, "Obra encontrada");
  
            //console.log("obrasFiltradas <Obras/>", obrasFilter)

  
            obrasFilter.push({...artista, artworks: {...obra, score: 0}})
      
            return artista;
      
        } 
  
        } else {
  
            //console.log("Artista from arrayArtworks <Obras/>", artista.artistname, "Obras undefined")
            return ""
        }
    })
  
    })
  } else if(sliderorsearch === "slider") {

    //console.log("slider")
    let obrasParaHome = [];

    arrayArtworks.map((artista) => {

      return artista.artworks.map((obra)=>{
        
        obrasParaHome.push(obra);

        if(obra.score){

        if (scoresearch === 0) {

          obrasFilter = [];
          console.log("scoresearch === 0", scoresearch)
          
          return artista;

      } else if(obra.score === scoresearch){  

        //console.log("obra.score === scoresearch", obra)
        let obraPPush = []
        obraPPush.push({...obra, score: obra.score})

        obrasFilter.push({...artista, artworks: obraPPush})

        //console.log("obrasFilter", obrasFilter)

        return artista;

      } else {
  
        //console.log("Artista from arrayArtworks <Obras/>", artista.artistname, "Obras undefined")
        //obrasFilter.push({...artista, artworks: []})

        return ""
        }
      } 

      setnumeroObras(obrasParaHome.length);

      })
  
/*       
    
 */ 
    
      //console.log("obra from map, arrayArtworks <Obras/>", artista)
      
    })
  
  }

  if(obrasFilter.length > 0){


    return obrasFilter

  }/*  else if(scoresearch === 0 && searchtext === ""){

    return arrayArtworks

  } */else {

    
    obrasFilter = [];

    obrasFilter.push(arrayArtworks)
    
    return obrasFilter.flat()

  }


  
}

//console.log("filterArtworks <Obras/> useEffect", obrasFiltradas)

let obrasFiltroMain = filterArtworksBySearch();

useEffect(() => {

  //console.log("arrayArtworks <Obras/>", arrayArtworks)

  setObrasFiltradas(obrasFiltroMain)

}, [obrasFiltroMain.length])



const finalArtworksFiltered = arrayArtworks.filter((obra)=>{

  if (obra !== "\"\""){

    return obra

  }

})

//console.log("slideorsearch <Home>", sliderorsearch)



/* if(sliderorsearch === "search"){

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

} */




/* else if(sliderorsearch === "slider") {

  filterArtworks = finalArtworksFiltered.filter((obra) => {

    if (scoresearch === 0) {

        return obra;
    }
  
    else if(obra.score === scoresearch){  
      
      return obra;

    } })

}
 */


  
/*
  console.log("Obras array en <Obras/>", finalArtworksFiltered);

  console.log("Search Text <Obras/>", searchtext); */

  return (   
            <> 
            
        { iscurator ? 

            obrasFiltradas &&

            obrasFiltradas.map((artista) =>{

              return(
              <>
              {
                searchtext === '' && artista ?
                  (
                   artista.artworks && Array.isArray(artista.artworks) ?

                   artista.artworks.map((obra)=>{

                    return (

                      <>
                      <div className="shadow overflow-hidden md:w-[50px] tablet:w-[410px] h-full bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url("${ obra.imgurl }")` 
                      }}

                      >  { isShown &&             
                          <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-14">
                            
                            <div className="z-10 flex flex-col pt-56 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] bg-opacity-50">
  
                              <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ obra.title }</p>
                              <p className="text-white text-right uppercase pr-6 text-lg">{ artista.artistname }</p>
                              <QualificationModal className="ml-auto" 
                                      title ={ obra.title }
                                      description={ obra.description }
                                      dimensions={ obra.widtheight}
                                      peso={ obra.weight }
                                      artistName= { artista.artistname }
                                      imgurl= {obra.imgurl }
                                      email= {artista.email}
                                      scoreFirebase={ obra.score }
                                      artistcv={ artista.cv }
                                      artistsemblance={ artista.semblance }
                                      projectdescription={ artista.project }
                                      artistex= { artista.exhibitions }
                                      technique = { obra.technique }
                                      edition = { obra.edition }
                                      year = { obra.year }
                                      value = { obra.value }
                                      artworkcomplete = { obra }
                                      address = { artista.address }
                                      estado = { artista.state }
                                      
                                      onMouseEnter={() => setIsShown(false)} />
                                      <hr style={{
                                            backgroundColor: "white",
                                            height: 1,
                                            borderStyle: "none"
                                      }} 
                                      className="mr-6 ml-6 mt-1"
                                      />
                              <p className="ml-6 mt-1 text-white text-left pr-6 text-lg"><span className="font-bold">Score</span> { obra.score }</p>
                              </div>
  
                          </div>
                          }
                      </div>
  
                      
  
                      </>





                    )


                   })

                   :

                   <p>Loading profile...</p>


                   )


                : 
                
                searchtext !== '' && artista ?


                    <>
                    <div className="shadow overflow-hidden md:w-[50px] tablet:w-[410px] h-full bg-cover bg-center"
                    style={{ 
                      backgroundImage: `url("${ artista.artworks.imgurl }")` 
                    }}

                    >  { isShown &&             
                        <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-24">
                          
                          <div className="z-10 flex flex-col pt-56 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] bg-opacity-50">

                            <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ artista.artworks.title }</p>
                            <p className="text-white text-right uppercase pr-6 text-lg">{ artista.artistname }</p>
                            <QualificationModal className="ml-auto" 
                                    title ={ artista.artworks.title }
                                    description={ artista.artworks.description }
                                    dimensions={ artista.artworks.widtheight}
                                    peso={ artista.artworks.weight }
                                    artistName= { artista.artistname }
                                    imgurl= {artista.artworks.imgurl }
                                    email= {artista.artworks.email}
                                    scoreFirebase={ artista.artworks.score }
                                    artistcv={ artista.artworks.cv }
                                    artistsemblance={ artista.artworks.semblance }
                                    projectdescription={ artista.artworks.project }
                                    artistex= { artista.artworks.exhibitions }
                                    technique = { artista.artworks.technique }
                                    edition = { artista.artworks.edition }
                                    year = { artista.artworks.year }
                                    value = { artista.artworks.value }
                                    artworkcomplete = { artista.artworks }
                                    address = { artista.address }
                                    estado = { artista.state }
                                    
                                    onMouseEnter={() => setIsShown(false)} />
                                    <hr style={{
                                          backgroundColor: "white",
                                          height: 1,
                                          borderStyle: "none"
                                    }} 
                                    className="mr-6 ml-6 mt-1"
                                    />
                            <p className="ml-6 mt-1 text-white text-left pr-6 text-lg"><span className="font-bold">Score</span> { artista.artworks.score }</p>
                            </div>

                        </div>
                        }
                    </div>

                    

                    </>


                :
                
                <p>Loading profile...</p>
  
              }
              </>
  
              )
  
            }) 

                :

                obrasVisualizacion.map((obra) =>{

                  if(obra.isimage){

                  return(
  
                    <>
                    <div className="shadow overflow-hidden"
                    style={{ 
                      backgroundImage: `url("${ obra.imgurl }")` 
                    }}

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

              
                        </div>
                        }
                    </div>
              
                    
              
                    </>)

                  } else if(obra.isvideo){

                    return(
                      
                      <div className="shadow overflow-hidden"

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

                  } else if(obra.unknown){

                    return(
    
                      <>
                      <div className="shadow overflow-hidden bg-center bg-cover"
                      style={{ 
                        backgroundImage: `url(https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/errors%2FerrorBarcoVideo.png?alt=media&token=e097dbf7-26b4-403a-9f4c-2d2d402edf21)` 
                      }}

                      >  { isShown &&             
                          <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-28">
                            {/*  */}
                            
                            <div className="z-10 flex flex-col pt-56 tablet:pt-28 hd:pt-9 lg:pt-64 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] lg:h-[1000px] bg-opacity-60">
                
                              <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ obra.title }</p>
                              <p className="text-white text-right uppercase pr-6 text-lg tablet:text-sm hd:text-base lg:text-lg">{ artistname }</p>
                              <Modal className="ml-auto" artwork ={ obra.title } artworkinfo={ obra } artistex= { artistex } description={ obra.description } artistName= { artistname } imgurl= { "https://firebasestorage.googleapis.com/v0/b/bienal-barco-02.appspot.com/o/errors%2FerrorBarcoVideo.png?alt=media&token=e097dbf7-26b4-403a-9f4c-2d2d402edf21" } dimensions={ obra.widtheight} peso={ obra.weight } artistcv={ cvURL } artistsemblance={ semblanceURL } projectdescription={ projectURL } contenttype={ "image" } onMouseEnter={() => setIsShown(false)} />
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
                
                      
                
                      </>)
  
                    }
                
               })

              }

              </>
        )
}
