import { React, useState, useEffect } from 'react'
import Modal from './Modal';
import QualificationModalAdmin from './QualificationModalAdmin';
import { useAuth } from "../context/authContext"
import { app } from '../firebase'
import { getFirestore, doc, getDocs, collection } from "firebase/firestore"
import { getStorage, ref, getMetadata, child } from "firebase/storage";
import { set } from 'firebase/database';

const firestore = getFirestore(app); 

export default function ObrasAdmin({obras, artistname, email, iscurator, cvURL, semblanceURL, projectURL, artistex, searchtext, scoresearch, sliderorsearch, setnumeroObras, setnumeroObrasFilt, numerobras }) {

const [isShown, setIsShown] = useState(true);
const [userMail, setuserMail] = useState(email);
const [totalArtworks, setTotalArtworks] = useState([]);
const [curatorview, setcuratorView] = useState(iscurator);
/* console.log("Email desde Obras", userMail); */

const [obrasVisualizacion, setobrasVisualizacion] = useState([]);

 //console.log("Obras desde componente <Obras>", obrasVisualizacion);

 const [startIndex, setStartIndex] = useState(0);
 const [ sectorRange, setsectorRange ] = useState("1 - 25");
 const [ sectorNumber, setsectorNumber ] = useState("1");

 const handleNext = () => {
  setStartIndex(startIndex + 5);

};

const handlePrev = () => {
  setStartIndex(startIndex - 5);

};

const countSegmentsOfTen = (arr) => {
  const segments = [];
  for (let i = 0; i < arr.length; i += 25) {
    if (i + 24 < arr.length) {
      segments.push(i / 25 + 1);
    }
  }
  return segments;
};




//console.log("SegmentNumbers", segmentNumbers);

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

  setnumeroObras(artworkCounter)

  
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

const totalArtworksSKU = obras.reduce((total, artista) => {
  if (artista.artworks !== undefined) {
    return total + artista.artworks.length;
  } else {
    return total;
  }
}, 0);

let artworkCounter = 0;

const arrayArtworksAll = obras.map((artista) => {
  if (artista.artworks !== undefined) {
    const artworksWithNumbers = artista.artworks.map((artwork, index) => {
      artworkCounter++;
      return { ...artwork, sku: artworkCounter };
    });
    return {
      ...artista,
      artworks: artworksWithNumbers,
      totalArtworks: totalArtworksSKU
    };
  } else {
    return artista;
  }
});

let artworksSlice
const [obrasFiltradas, setObrasFiltradas] = useState(arrayArtworksAll);
let segmentNumbers;

if(sliderorsearch === ""){

 artworksSlice = arrayArtworksAll.slice(startIndex, startIndex + 5);
 segmentNumbers = countSegmentsOfTen(obras);

} else if(sliderorsearch === "slider" || sliderorsearch === "search"){

  artworksSlice = obrasFiltradas.slice(startIndex, startIndex + 5);
  segmentNumbers = countSegmentsOfTen(obrasFiltradas);


}

let arrayArtworks = arrayArtworksAll;

console.log("artworksSlice", artworksSlice)

useEffect(()=>{

  //setArtworksSlice(arrayArtworksAll.slice(startIndex, startIndex + 10))
  

},[startIndex])





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

  
            obrasFilter.push({...artista, artworks: [obra]})
      
            return artista;
      
        } else if(artista.artistname.toLowerCase().includes(searchtext.toLowerCase())){  

          obrasFilter.push({...artista, artworks: [obra]});
    
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
          //console.log("scoresearch === 0", scoresearch)
          
          return artista;

      } else if(obra.scoreadmin === scoresearch){  

        //console.log("obra.score === scoresearch", obra)
        let obraPPush = []
        obraPPush.push({...obra, score: obra.scoreadmin})

        obrasFilter.push({...artista, artworks: obraPPush})

        //console.log("obrasFilter", obrasFilter)

        return artista;

      } else {
  
        //console.log("Artista from arrayArtworks <Obras/>", artista.artistname, "Obras undefined")
        //obrasFilter.push({...artista, artworks: []})

        return ""
        }
      } 

      //setnumeroObras(obrasParaHome.length);

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

    obrasFilter.push(totalArtworksSKU)
    
    return obrasFilter.flat()

  }


  
}

//console.log("filterArtworks <Obras/> useEffect", obrasFiltradas)

let obrasFiltroMain = filterArtworksBySearch();

useEffect(() => {

  //console.log("arrayArtworks <Obras/>", arrayArtworks)
  setStartIndex(0)
  setsectorRange("1 - 25")
  setsectorNumber(1)
  setObrasFiltradas(obrasFiltroMain)

}, [obrasFiltroMain.length]) 



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

        {
        startIndex > 0 &&
        (
        <button 
        className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100 fixed h-full left-0 top-0"
        onClick={handlePrev}
        >
        {"<"}
        </button>
        )
        }
            
        { iscurator ? 

            artworksSlice && artworksSlice.map((artista, i) =>{

              return(
              <>
              {
                sliderorsearch === '' && artista ?
                
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
                          <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-3">
                            <p className="w-2/6 text-white font-bold uppercase text-xl bg-black py-1 pl-2">SKU{" "}<span className="text-teal-400">{obra.sku}</span> </p>
                            <div className="z-10 flex flex-col pt-56 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] bg-opacity-50">

                              <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ obra.title }</p>
                              <p className="text-white text-right uppercase pr-6 text-lg">{ artista.artistname }</p>
                              <QualificationModalAdmin className="ml-auto" 
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
                                      scoreadmin = { obra.scoreadmin }
                                      
                                      onMouseEnter={() => setIsShown(false)} />
                                      <hr style={{
                                            backgroundColor: "white",
                                            height: 1,
                                            borderStyle: "none"
                                      }} 
                                      className="mr-6 ml-6 mt-1"
                                      />

                              <p className="ml-6 mt-1 text-white text-left pr-6 text-lg"><span className="font-bold">Score Admin</span> { obra.scoreadmin }</p>
                              
                              <p></p>
                              </div>
  
                          </div>
                          }
                      </div>                     
  
                      </>

                    )


                   })
                
                   :

                   <p>Loading profile main...</p>


                   )

                : 
                
                sliderorsearch !== '' && artista ?

                  artista.artworks && Array.isArray(artista.artworks) ?

                  artista.artworks.map((obra)=>{

                    return (

                      <>
                      
                      <div className="shadow overflow-hidden md:w-[50px] tablet:w-[410px] h-full bg-cover bg-center"
                      style={{ 
                        backgroundImage: `url("${ obra.imgurl }")` 
                      }}

                      >  { isShown &&             
                          <div className="h-fit pt-72 hhd:pt-48 hmd:pt-36 hsm:pt-3">
                            <p className="w-2/6 text-white font-bold uppercase text-xl bg-black py-1 pl-2">SKU{" "}<span className="text-teal-400">{obra.sku}</span> </p>
                            <div className="z-10 flex flex-col pt-56 pl-4 rounded-l-[15rem] bg-[#26A7A3] h-[1000px] bg-opacity-50">

                              <p className="text-white font-bold text-right pr-6 uppercase text-xl tablet:text-base hd:text-lg lg:text-xl truncate ...">{ obra.title }</p>
                              <p className="text-white text-right uppercase pr-6 text-lg">{ artista.artistname }</p>
                              <QualificationModalAdmin className="ml-auto" 
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
                              <p className="ml-6 mt-1 text-white text-left pr-6 text-lg"><span className="font-bold">Score Admin</span> { obra.scoreadmin }</p>
                              </div>
  
                          </div>
                          }
                      </div>                     
  
                      </>

                    )


                   })

                  :

                  null


                :
                
                <p>Not qualified artworks by that score or search mode activated...</p>
  
              }

              <p className="text-white text-xl px-2" >|</p>
              </>
  
              )
  
            }) 

                :
                

                obrasVisualizacion.map((obra) => {



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

                  startIndex + 5 < obras.length && (
                    <button 
                    className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100"
                    onClick={handleNext}
                    >
                    {">"}
                    </button>
                  )
                
               })

        }


        { 

          sliderorsearch === '' ? 
        
              startIndex + 5 < obras.length && 
              (
              <button 
              className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100 fixed h-full right-0 top-0"
              onClick={handleNext}
              >
              {">"}
              </button>
              ) 
        
          : 

          startIndex + 5 < obrasFiltradas.length && 
            <button 
            className="text-4xl w-[40px] text-white bg-black shadow-black shadow-xl bg-opacity-100 fixed h-full right-0 top-0"
            onClick={handleNext}
            >
            {">"}
            </button>
          
          
          }

        {iscurator &&
        <>
        <p className="w-full text-teal-400 fixed bottom-0 pb-10 text-xl font-bold">Sector {sectorNumber}{" "}<span className="font-light">{sectorRange}{" range of artists, not artworks"}</span></p>
        <div className="w-full flex flex-row gap-2 text-teal-400 fixed bottom-0 pb-3">

              {segmentNumbers.map((number) => (
              <span className="tex-teal-400 cursor-pointer hover:text-gray-400" key={number} 
              
              onClick={ () => {

                switch(number){
                  case 1:
                    setStartIndex(0)
                    setsectorRange("1 - 25")
                    setsectorNumber(1)
                    break;
                  case 2:
                    setStartIndex(25)
                    setsectorRange("26 - 50")
                    setsectorNumber(2)
                    break;
                  case 3:
                    setStartIndex(50)
                    setsectorRange("51 - 75")
                    setsectorNumber(3)
                    break;
                  case 4:
                    setStartIndex(75)
                    setsectorRange("76 - 100")
                    setsectorNumber(4)
                    break;
                  case 5:
                    setStartIndex(100)
                    setsectorRange("101 - 125")
                    setsectorNumber(5)
                    break;
                  case 6:
                    setStartIndex(125)
                    setsectorRange("126 - 150")
                    setsectorNumber(6)
                    break;
                  case 7:
                    setStartIndex(150)
                    setsectorRange("151 - 175")
                    setsectorNumber(7)
                  break;
                  case 8:
                    setStartIndex(175)
                    setsectorRange("176 - 200")
                    setsectorNumber(8)
                  break;
                  case 9:
                    setStartIndex(200)
                    setsectorRange("201 - 225")
                    setsectorNumber(9)
                  break;
                  case 10:
                    setStartIndex(225)
                    setsectorRange("226 - 250")
                    setsectorNumber(10)
                  break;
                  case 11:
                    setStartIndex(250)
                    setsectorRange("251 - 275")
                    setsectorNumber(11)
                  break;
                  case 12:
                    setStartIndex(275)
                    setsectorRange("276 - 300")
                    setsectorNumber(12)
                  break;
                  case 13:
                    setStartIndex(300)
                    setsectorRange("301 - 325")
                    setsectorNumber(13)
                  break;
                  case 14:
                    setStartIndex(350)
                    setsectorRange("326 - 350")
                    setsectorNumber(14)

                  break;
                  case 15:
                    setStartIndex(375)
                    setsectorRange("351 - 375")
                    setsectorNumber(15)
                  break;
                  case 16:
                    setStartIndex(400)
                    setsectorRange("376 - 400")
                    setsectorNumber(16)
                  break;
                  case 17:
                    setStartIndex(425)
                    setsectorRange("401 - 425")
                    setsectorNumber(17)
                  break;
                  case 18:
                    setStartIndex(450)
                    setsectorRange("426 - 450")
                    setsectorNumber(18)
                  break;
                  case 19:
                    setStartIndex(475)
                    setsectorRange("451 - 475")
                    setsectorNumber(19)
                  break;
                  case 20:
                    setStartIndex(500)
                    setsectorRange("476 - 500")
                    setsectorNumber(20)
                  break;
                  case 21:
                    setStartIndex(525)
                    setsectorRange("501 - 525")
                    setsectorNumber(21)
                  break;
                  case 22:
                    setStartIndex(550)
                    setsectorRange("526 - 550")
                    setsectorNumber(22)
                  break;
                  case 23:
                    setStartIndex(575)
                    setsectorRange("551 - 575")
                    setsectorNumber(23)
                  break;
                    default:
                      setStartIndex(0)
                }
                
                //handleClick(number)
              
              }
                }>
              {number}
              </span>         
              ))}
        </div>
        </>
        }




              


        </>
        )
}