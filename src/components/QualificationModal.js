import React, { useState } from "react";
import imgArt from "../img/M1.jpg"
import { Slider } from "@mui/material";
import { styled } from "@mui/material/styles";


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



const QualificationModal = () => {
  const [showModal, setShowModal] = useState(false);

  const [score, setScore] = useState(5);

  const handleSlider = (e)=>{

    console.log("Value", setScore(e.target.value));


}

  return (
    <>
      <button
        className="bg-gray-500 text-white font-bold py-2 rounded mx-12 mt-5
        font-bold px-6 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
        type="button"
        onClick={() => setShowModal(true)}
      >
        View Artwork
      </button>
      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-2 border-black rounded-lg shadow-lg relative flex flex-col w-full bg-barco outline-none focus:outline-none">
                <div className="flex flex-col items-start justify-between p-5 border-b border-solid border-black rounded-t ">
{/*                 <button
                    className="bg-transparent text-black float-right"
                    onClick={() => setShowModal(false)}
                    >
                    <p className="text-black opacity-7 h-6 w-6 text-xl block border-2 border-black py-0 rounded-full">
                      
                    </p>
                  </button> */}
                  <h3 className="text-3xl font=semibold">ARTWORK TITLE</h3>
                  <h2 className="text-xl">ARTIST NAME</h2>

                </div>
                <div className="relative w-full p-6 flex-auto">
                <img  src={imgArt} alt="imgArt" />
                <h3 className="mt-6">DESCRIPTION</h3>
                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use.</p>
                <h3 className="mt-6">TYPE</h3>
                <p>IMG/JPG</p>
               
                    <CustomSlider onChange={ handleSlider } min={0.00} max={10.00} defaultValue={5} aria-label="Default" valueLabelDisplay="auto" />
                    <h3 className="mt-6 text-2xl">{ score }</h3>
                </div>
                <div className="flex items-center justify-end p-6 border-t border-solid border-black rounded-b">
                  <button
                    className="text-black hover:text-gray-400 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button
                    className="border-2 border-black  text-black hover:text-white hover:bg-black font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Save Score
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
