import { React, useState } from 'react'
import Modal from './Modal';

const propprueba = "Prop prueba"

export default function Obras({obras, artistname}) {

const [isShown, setIsShown] = useState(false);

  return (      
<>
 
            {obras.map((obra) =>{

              /* console.log("Obra", obra);
 */
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
                            <Modal className="ml-auto" artwork ={ obra.title }  artistName= { artistname } imgurl= { obra.imgurl } onMouseEnter={() => setIsShown(false)} />
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
                )
                                    }
                )}

{/*               <div className="bg-[url('/img/M1.jpg')] border shadow rounded-xl overflow-hidden"
                    onMouseEnter={() => setIsShown(true)}
                    onMouseLeave={() => setIsShown(false)}
                    >
                      
                <div className="h-64 w-64 h-full">

                {isShown &&
                  <div className="pt-24 h-64 w-64 h-full bg-black opacity-100"> 
                    <p className="text-white text-center">Artwork title #1</p>
                    <Modal onMouseEnter={() => setIsShown(false)} />
                  </div>
                 }
                  </div>
              
              </div> */}
</>
        )
}
