import React, { useState, useEffect } from "react";
import imgArt from "../img/M1.jpg"
import { useAuth } from "../context/authContext"
import { AiOutlineEye } from "react-icons/ai"
import { HiExternalLink } from "react-icons/hi"
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { app } from '../firebase'
import { getFirestore, doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom";

const firestore = getFirestore(app); 

const colorBlack = "black";

const CustomSlider = styled(Slider)(({ theme }) => ({
  color: colorBlack, //color of the slider between thumbs
  "& .MuiSlider-thumb": {
    backgroundColor: colorBlack //color of thumbs
  },
  "& .MuiSlider-rail": {
    color: colorBlack ////color of the slider outside  teh area between thumbs
  }
}));



const QualificationModal = ({ artwork, artistName, imgurl, email, scoreFirebase }) => {

  const [showModal, setShowModal] = useState(false);

  const { user } = useAuth();

  const [userDoc, setuserDoc] = useState(null);

  const [arrayArtworks, setarrayArtworks] = useState(null);

  const navigate = useNavigate();

  const [score, setScore] = useState(scoreFirebase);

  const searchOrCreateDocument = async(idDocumento)=>{
  
    //Crear referencia al documento
    const docuRef = doc(firestore, `users/${idDocumento}`)
     
    const query = await getDoc(docuRef);
  
    const infoDocu = query.data();
  
    return infoDocu;
  
  }



  useEffect(()=>{

    async function fetchFirebase(){

      const userDocReference = await searchOrCreateDocument(email);

      setuserDoc(userDocReference);

      setarrayArtworks(userDocReference.artworks)
      

      /* console.log("Number of artworks", userDocReference.artworks.length); */

    }

    fetchFirebase();      

  },[])

  const updateScore = async()=>{

    const artworksRef = doc(firestore, `users/${email}`);

    var val = artwork;

    let artworks = arrayArtworks;

    arrayArtworks.find(async function(item, i){

      if(item.title === val){

        artworks[i].score = score;

        console.log("Nuevo score del artwork", artworks[i]);

        setarrayArtworks(artworks);

        return i;

       }
      });

      await updateDoc(artworksRef, { artworks: arrayArtworks} )
      
      window.location.reload(false);

  }

  const handleSlider = (e)=>{

    setScore(e.target.value)
    console.log("Value", score);

  }

  return (
    <>
    <div className="flex flex-col">

      <button
        className="ml-auto pr-6 text-3xl bg-transparent text-white font-bold outline-none focus:outline-none"
        type="button"
        onClick={() => setShowModal(true)}
      >
        <AiOutlineEye className="mt-6" />
      </button>

      </div>

      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none w-full h-full bg-black bg-opacity-90">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-2 border-black rounded-lg shadow-lg relative flex flex-col w-full bg-teal-400 outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-black rounded-t ">

                <h3 className="text-3xl text-black font-semibold">{ artwork }</h3>
                  <h2 className="text-xl text-black">{ artistName }</h2>

                </div>

                <div className="relative w-full p-6 flex-auto">

                <div className="overflow-hidden"
                    style={{ 
                      backgroundImage: `url("${ imgurl }")`,
                      height: "200px",
                      borderRadius: "5rem 0",
                    }}
                ></div>
                <a href={ imgurl } rel="noreferrer" target="_blank">
                <HiExternalLink className="text-black pt-3 text-3xl" />
                </a>
                <h3 className="mt-3 text-black tracking-[.25em]">DESCRIPTION</h3>
                <p className="text-black">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use.</p>
                  <div className="flex flex-row">
                      <div className="flex flex-col">
                        <h3 className="mt-6 text-black tracking-[.25em]">TYPE</h3>
                  
                        <p className="text-black">IMG/JPG</p>
                      </div>

                      <div className="ml-auto flex flex-col">
                        <p className="mt-6 text-black font-bold text-6xl text-center ">{ scoreFirebase }</p>
                  
                        <p className="text-black text-center tracking-[.25em]">score</p>
                      </div>

                  </div>

                  
               
                <CustomSlider onChange={ handleSlider } min={0.00} max={10.00} defaultValue={ score } aria-label="Default" valueLabelDisplay="auto" />
                <h3 className="mt-6 text-xl text-black"><span className="font-bold">New score</span> { score }</h3>
                
                </div>
                
                <div className="flex items-center justify-end p-6 border-t border-solid border-black rounded-b">
                           <button
                    className="border-2 border-black text-black hover:text-white hover:bg-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => { console.log(`Artworks ${ artistName }`, arrayArtworks); updateScore() } }
                  >
                    Save score
                  </button> 

                  <button
                    className="text-white hover:text-gray-400 bg-black font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default QualificationModal;
