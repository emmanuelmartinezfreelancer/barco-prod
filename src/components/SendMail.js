import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp, IoSendSharp } from "react-icons/io5"
import { app } from '../firebase'
import { getFirestore, doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore"
import { UseOnceCollection } from "./UseOnceCollection"
import { GetDocument } from "./GetDocument";
import { UpdateDocument } from "./UpdateDocument"
 

const firestore = getFirestore(app); 

export function SendMail() {

  const [error, setError] = useState("");

  const [mailData, setmailData] = useState("")

  const [mailgroupData, setmailgroupData] = useState("")

  const [arePhones, setarePhones] = useState(false);

  const [arrayUsers, setarrayUsers] = useState([]);

  const [actualUser, setactualUser] = useState(null);

  const [disabledButton, setdisabledButton ] = useState(false);

  const [actualFolio, setactualFolio] = useState(null);

  const [arrayMails, setarrayMails] = useState([])

  const [fakeMails, setfakeMails] = useState(["vela.freelancer@gmail.com", "muymalastierras@gmail.com", "emax52@gmail.com", "cuevas.gris@gmail.com"])

  const [seetotalMails, setseetotalMails] = useState(false)

  const [mailsSent, setmailsSent] = useState([]);

  const allUsers = UseOnceCollection("users");

  let folioNumber = GetDocument("folio", "currentnumber");

  const [docData, setdocData] = useState("");

  //setactualFolio(folioNumber.current);

/*   console.log("Users from <Send Mail>", allUsers);
  console.log("folionumber from <Send Mail>", folioNumber.current); */

  const navigate = useNavigate();

  async function getDocument(collectionName, docId) {

      const docuRef = doc(firestore, `${collectionName}/${docId}/`)
  
      const docSnap = await getDoc(docuRef);
  
      const data = docSnap.data();
  
      setdocData(data); 
  
      return data;
  }

  async function updateDocument(collectionName, docId, updatedData) {


    const collectionRef = collection(firestore, collectionName);
    const docRef = doc(collectionRef, docId);
  
    async function updateData() {
  
      await updateDoc(docRef, updatedData);
  
    }
  
    await updateData();
  }

const createMail = async(email, customText, folio)=>{

    //Crear referencia al documento
    const docuRef = doc(firestore, `mail/${email}`)

    const html = `
      <html>
      <head>
          <meta charset="utf-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <title></title>
          <meta name="description" content="">
          <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
  
      <body style="width: 550px; padding: 0; margin: 0; overflow: hidden; background-color: #fff;">
  
          <div id="folioMain" style="width: 550px; background-color: #000000; margin: 0 auto; height: fit-content; display: flex; flex-direction: column; color: rgb(45 212 191); padding: 30px;">
                  
                  <h1 style="font-size: x-large; font-family: sans-serif; font-weight: lighter; text-transform: uppercase; z-index: 1; color: black; padding-top: 50px;">¡HOLA!</h1>
                  <p style="margin:0; font-family: sans-serif; font-weight: bold; font-size: xx-large; z-index: 1; color: black">Gracias por inscribirte<br>
                     te compartimos tu<br>
                     número de folio
                  </p>
                  <h3 style="padding-top: 25px; margin:0; font-family: sans-serif; text-transform: uppercase; font-weight: lighter;">FOLIO</h3>
                  <p style="margin: 0; padding-bottom: 10px; font-family: sans-serif; text-transform: uppercase; font-weight: bold; font-size: xx-large; padding-bottom: 60px;">BA${folio}2023</p>
                  <p style="font-family: sans-serif; font-weight: 600;">Solo te falta un último paso, verificar que tengas todas las descripciones de tus obras así como la imagen cargando correctamente, solo tienes que entrar a tu perfil y revisarlo.</p>
  
                  <div style="position: relative; width: 100%; height: 100%;">
                  <div style="border-radius: 9999px; width: 350px; height: 350px;  border: 2px solid rgb(45 212 191); position: absolute; bottom:0; right:0; overflow: hidden; z-index: 1;"></div>
              </div>
          </div>
  
          <script src="" async defer></script>
      </body>
  </html>
    `;  
    const htmlCustom = `
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>

    <body>
    <p>${customText}</p>
    </body>
    </html>
    `;

    const emailFinal = {

        to: [`${email}`],
        message: {
        subject: 'Tu número de registro',
        text: '',
        html: html
        }

      }
    
    console.log("Mail para", email);

    await setDoc(docuRef, emailFinal);

    await updateFolioNumber()

    const query = await getDoc(docuRef);
  
    const infoDocu = query.data();

    return infoDocu;
  
  }

  const sendMailToUser = async(email, customText)=>{

    //Crear referencia al documento
    const docuRef = doc(firestore, `mail/${email}`)

    const htmlCustom = `
    <html>
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>

    <body>
    <p>${customText}</p>
    </body>
    </html>
    `;

    const emailFinal = {

        to: [`${email}`],
        message: {
        subject: 'Saludos desde Barco 2023',
        text: '',
        html: htmlCustom
        }

      }
    
    console.log("Mail para", email);

    await setDoc(docuRef, emailFinal);

    const query = await getDoc(docuRef);
  
    const infoDocu = query.data();

    return infoDocu;
  
  }

  async function sendMailGrupal(arrayMails, customText){
    
    for(let i = 0; i <= arrayMails.length - 1; i++){

        let currentFolioNumber = await getDocument("folio", "currentnumber");

        await createMail(arrayMails[i], customText, currentFolioNumber.current)
        .then(async(mail)=>{            

          setmailsSent(oldMails => [...oldMails, {...mail, folio: `BA${currentFolioNumber.current}2023`}]);                           

        });

      }

      //window.location.reload(false);

  }

  async function updateFolioNumber(){

    let currentFolioNumber = await getDocument("folio", "currentnumber");

    await updateDocument("folio", "currentnumber", { current: currentFolioNumber.current + 1});

    setactualFolio(currentFolioNumber.current + 1)

  }

  useEffect(()=>{

    let finalUsers = [];
    let usersMail = [];
            
    for(let i = 0; i < allUsers.length; i++){

      finalUsers.push(allUsers[i]);
      usersMail.push(allUsers[i].email);

    }

    setarrayUsers(finalUsers);
    setarrayMails(usersMail)
    

    return () => { 

/*     console.log("Array de usuarios", arrayUsers);
    console.log("Array de mails usuarios", arrayMails); */

    }

  },[allUsers, arrayUsers.length])

  return (

    <div>

    <main  className="h-screen px-24 w-screen bg-black flex flex-row gap-36">

    <div className="w-1/2">

      <h1 className="font-bold text-teal-400 text-4xl py-7">Enviar Mail</h1>

            <p className="mb-4 text-lg">Folio actual <span className="text-xl font-bold">{ `BA${folioNumber.current}2023`}</span></p>


            <div className="mb-4">
              <label
                htmlFor="phonenumber"
                className="block text-teal-400 font-helveticaL text-xs font-bold mb-2 uppercase"
              >
              { "Usuario" }
              </label>

              {arrayUsers ?

                <div className="flex flex-row w-full gap-4">         
                    <select
                    name = "type"
                    type="text"
                    onClick={(e) => 
                      {
                      const actualuser = arrayUsers.find(element => e.target.value === element.email);
                      setactualUser(actualuser);
                      console.log("actual user",actualuser);
                      }
                    
                    }
                    className="font-helveticaL bg-black pt-3 py-4 px-3 border-2 border-text-teal-400 rounded text-teal-400 text-sm rounded-lg  w-full block p-2.5 dark:bg-transparent dark:border-teal-400 placeholder-teal-400 dark:placeholder-teal-400 dark:text-teal-400 dark:focus:ring-teal-400 dark:focus:border-teal-400"
                    placeholder=""
                    >
                    <option selected>Select...</option>

                      { arrayUsers.map((user)=>{

                    return(

                      <>
                      <option className="bg-black" value={`${user.email}`}>{user.email}</option>
                      </>

                      )
                    })
                  }
                     
                  </select>
                

   
                </div>
              :

                <p>No hay usuarios cargados</p>

              }
  
            </div>

            <div className="mb-4">

            {actualUser &&

              <>

              <h1 className="text-2xl ">{actualUser.name} <span className="font-light">Folio {actualUser.folio}</span></h1>
              <p className="">Número de obras inscritas <span className="font-bold text-xl">{actualUser.artworks.length}</span></p>
              <p className="pb-4">Correo <span className="font-bold text-xl">{actualUser.email}</span></p>
              <div className="flex flex-row w-full justify-between">
                
                {
                
                actualUser.artworks.map((artwork)=>{

                    return (

                    <>

                    <div className="flex flex-col w-full gap-2">
                    <div className="w-[150px] h-[150px] lg:w-[250px] lg:h-[250px] bg-cover bg-center bg-no-repeat"
                    style={{ 
                      backgroundImage: `url("${ artwork.imgurl }")` 
                    }}></div>

                    <p>{artwork.title}</p>
                    </div>

                    </>

                    )

                })
                
                } 
                

              </div>

              </>

            }

            </div>

            
            <div className="mb-4">
            
            
              <label
                htmlFor="textmessage"
                className="block text-teal-400 font-helveticaL text-xs font-bold mb-2 uppercase"
              >
              Text Message
              </label>    
           
            
              <textarea
                name = "textmessage"
                type="text"
                onChange={(e) => {setmailData(e.target.value); /* console.log("Mail data", mailData) */}
              }
                className="font-helveticaL rounded-lg text-base shadow appearance-none bg-transparent border-2 border-teal-400 rounded w-full py-3 px-3 text-teal-400  h-[200px] focus:outline-none focus:shadow-outline"
                placeholder=""
              />
              
            </div>

                  <div className="mt-3 w-full flex flex-row pb-8">


                      <button
                      className={`w-4/12 py-3 pl-12 mt-2 ml-auto border-2  font-bold text-lg rounded-md shadow hover:border-white outline-none focus:outline-none ${disabledButton ? "border-2 border-gray-400 text-gray-400 bg-black font-bold text-lg rounded-md shadow hover:cursor-not-allowed" : "border-teal-400 text-teal-400 bg-black hover:text-white"}`}
                      type="button"
                      onClick={async(e)=>{
                        setdisabledButton(true);
                        await sendMailToUser(actualUser.email, mailData)
                        .then((mail)=>{

                          console.log("Mail enviado", mail)
                          setdisabledButton(false);

                        })
                        .catch((err)=>{ alert("Error al enviar el mail", err)})

                        }}                        
                      >
                      <div className="flex flex-row pr-6">
                      {arePhones ? <p className="my-auto mx-auto">Send Messages</p> : <p className="my-auto mx-auto">Enviar</p> }
                      <IoSendSharp className="my-auto text-2xl mr-9"/>
                      </div>
                      </button>


                  </div>

         

    </div>

   {
   actualUser &&
   <div className="w-1/2">
    <div className="flex flex-col w-full gap-2 lg:gap-3">

    <h1 className="font-bold text-teal-400 text-4xl py-7">Información del usuario</h1>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Nombre de artista</h1>
        <p className="text-base lg:text-2xl">{actualUser.artistname ? actualUser.artistname : "No hay nombre de artista"}</p>
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Disciplina</h1>
        <p className="text-base lg:text-2xl">{actualUser.discipline ? actualUser.discipline : "No hay disciplina"}</p>
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Teléfono</h1>
        <p className="text-base lg:text-2xl">{actualUser.phone ? actualUser.phone : "No hay teléfono"}</p>
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Dirección</h1>
        <p className="text-base lg:text-2xl">{actualUser.address ? actualUser.address : "No hay dirección"}</p>
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Estado</h1>
        <p className="text-base lg:text-2xl">{actualUser.state ? actualUser.state : "No hay estado"}</p>
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Fecha de nacimiento</h1>
        <p className="text-base lg:text-2xl">{actualUser.birth.day ? `${actualUser.birth.day + " / " + actualUser.birth.month + " / " + actualUser.birth.year }` : "No hay fecha de nacimiento"}</p>
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Sitio web</h1>
        <p className="text-base lg:text-2xl">{actualUser.web ? actualUser.web : "No hay sitio web"}</p>
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">CV</h1>
        { actualUser.cvUrl ? <a href={`${actualUser.cvUrl}`} rel="noreferrer" target="_blank" className="text-base lg:text-2xl hover:text-gray-300">Descargar</a> : <p className="text-base lg:text-2xl">No hay CV</p> }
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Semblanza</h1>
        { actualUser.semblanzaUrl ? <a href={`${actualUser.semblanzaUrl }`} rel="noreferrer" target="_blank" className="text-base lg:text-2xl hover:text-gray-300">Descargar</a> : <p className="text-base lg:text-2xl">No hay Semblanza</p> }
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Descripción del proyecto</h1>
        { actualUser.projectUrl ? <a href={actualUser.projectUrl} rel="noreferrer" target="_blank" className="text-base lg:text-2xl hover:text-gray-300">Descargar</a> : <p className="text-base lg:text-2xl">No hay descripción del proyecto</p> }
      </div>

      <div className="flex-col">
        <h1 className="text-lg lg:text-3xl">Comprobantes de exposición</h1>
        <div className="text-base lg:text-2xl flex flex-wrap flex-row gap-2">{actualUser.exposicionesUrls.length > 0 ? actualUser.exposicionesUrls.map((expo, i)=>{ return <a href={`${expo}`} rel="noreferrer" target="_blank" className="text-base lg:text-2xl hover:text-gray-300">{ i + 1 }</a> }) : "No hay fecha de nacimiento"}</div>
      </div>


    </div>


   </div>
  }

  
    {/*     <div className="w-1/2">

    <h1 className="font-bold text-teal-400 text-4xl py-7">Enviar Mail grupal</h1>
      
      
      <div className="mb-4">
      
      
        <label
          htmlFor="textmessage"
          className="block text-teal-400 font-helveticaL text-xs font-bold mb-2 uppercase"
        >
        Text Message
        </label>    
     
      
        <textarea
          name = "textmessage"
          type="text"
          onChange={(e) => setmailgroupData(e.target.value)}
          className="font-helveticaL rounded-lg text-base shadow appearance-none bg-transparent border-2 border-teal-400 rounded w-full py-3 px-3 text-teal-400  h-[200px] focus:outline-none focus:shadow-outline"
          placeholder=""
        />
        
      </div>

      <div className="mt-3 w-full flex flex-row pb-8 gap-4 mb-4">

              <button onClick={()=>{ setseetotalMails(true); console.log("Mails de usuarios", arrayMails)}} className="w-4/12 px-auto mt-2 ml-auto border-2 border-teal-400 text-teal-400 bg-black hover:text-white font-bold text-lg rounded-md shadow hover:border-white outline-none focus:outline-none">Revisar correos</button>

               <button
                className="w-4/12 py-3 pl-12 mt-2 border-2 border-teal-400 text-teal-400 bg-black hover:text-white font-bold text-lg rounded-md shadow hover:border-white outline-none focus:outline-none"
                type="button"
                onClick={(e)=>{ console.log("Mail grupal")}}>
                <div className="flex flex-row pr-6">
                {arePhones ? <p className="my-auto mx-auto">Send Messages</p> : <p className="my-auto mx-auto">Enviar</p> }
                <IoSendSharp className="my-auto text-2xl mr-9"/>
                </div>
                </button>


      </div>

      { seetotalMails && 

          <div className="flex flex-col w-full overflow-auto h-1/2">
              {

              arrayMails.map((mail)=>{
                return(
                  <p>{mail}</p>
                )
              })

              }

          </div>
        
      }

      { mailsSent &&  
      
        mailsSent.map((mail)=>{

          return(
            <>
            <p>Mail enviado a {mail.to}</p>
            <p>Folio enviado <span>{mail.folio}</span></p>
            </>
          )

        })
      }

   

    </div>
    */}

  
    </main>
    

    </div>
   
  );
}
