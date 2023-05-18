import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoLocationSharp, IoSendSharp } from "react-icons/io5"
import { app } from '../firebase'
import { getFirestore, doc, getDoc, getDocs, collection, setDoc, updateDoc } from "firebase/firestore"
import { UseOnceCollection } from "./UseOnceCollection"
import { GetDocument } from "./GetDocument";
import { UpdateDocument } from "./UpdateDocument"
 

const firestore = getFirestore(app); 

export function Numeralia() {

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

  const [ subMenu, setsubMenu ] = useState("usuario");

  const [statesData, setStatesData] = useState([
    { name: 'Aguascalientes', value: 1 },
    { name: 'Baja California', value: 2 },
    { name: 'Baja California Sur', value: 3 },
    { name: 'Campeche', value: 4 },
    { name: 'Chiapas', value: 5 },
    { name: 'Chihuahua', value: 6 },
    { name: 'Coahuila', value: 7 },
    { name: 'Colima', value: 8 },
    { name: 'Durango', value: 9 },
    { name: 'Guanajuato', value: 10 },
    { name: 'Guerrero', value: 11 },
    { name: 'Hidalgo', value: 12 },
    { name: 'Jalisco', value: 13 },
    { name: 'Ciudad de México', value: 14 },
    { name: 'CDMX', value: 14 },
    { name: 'Michoacán', value: 15 },
    { name: 'Morelos', value: 16 },
    { name: 'Nayarit', value: 17 },
    { name: 'Nuevo León', value: 18 },
    { name: 'Oaxaca', value: 19 },
    { name: 'Puebla', value: 20 },
    { name: 'Querétaro', value: 21 },
    { name: 'Quintana Roo', value: 22 },
    { name: 'San Luis Potosí', value: 23 },
    { name: 'Sinaloa', value: 24 },
    { name: 'Sonora', value: 25 },
    { name: 'Tabasco', value: 26 },
    { name: 'Tamaulipas', value: 27 },
    { name: 'Tlaxcala', value: 28 },
    { name: 'Veracruz', value: 29 },
    { name: 'Yucatán', value: 30 },
    { name: 'Zacatecas', value: 31 },
  ]);

  const handleValueChange = (event, index) => {
    const updatedStatesData = [...statesData];
    updatedStatesData[index].value = event.target.value;
    setStatesData(updatedStatesData);
  };

  const [stateCounts, setStateCounts] = useState([]);
  const [ageCounts, setAgeCounts] = useState([]);
  const [disciplineCounts, setDisciplineCounts] = useState([]);

  //setactualFolio(folioNumber.current);

  console.log("Users from <Numeralia>", allUsers);

  const navigate = useNavigate();

  async function getDocument(collectionName, docId) {

      const docuRef = doc(firestore, `${collectionName}/${docId}/`)
  
      const docSnap = await getDoc(docuRef);
  
      const data = docSnap.data();
  
      setdocData(data); 
  
      return data;
  }

  const calculateAge = (birthDate) => {
    if (!birthDate || !birthDate.day || !birthDate.month || !birthDate.year) {
      return "Sin formato de nacimiento"; // Return a category for missing or invalid birth date
    }
  
    const currentDate = new Date();
    const birthYear = parseInt(birthDate.year);
    const birthMonth = parseInt(birthDate.month);
    const birthDay = parseInt(birthDate.day);
  
    let age = currentDate.getFullYear() - birthYear;
  
    if (
      currentDate.getMonth() < birthMonth ||
      (currentDate.getMonth() === birthMonth && currentDate.getDate() < birthDay)
    ) {
      age--;
    }
  
    return age;
  };
  
  const getAgeRange = (age, attribute) => {
    if (isNaN(age)) {
      return `Edad inválida (${attribute})`; // Return a category with the invalid attribute
    }
  
    const lowerBound = Math.floor(age / 5) * 5;
    const upperBound = lowerBound + 4;
    return `${lowerBound}-${upperBound}`;
  };

  useEffect(() => {
    const counts = {};
  
    allUsers.forEach((user) => {
      const state = user.state;
      counts[state] = counts[state] ? counts[state] + 1 : 1;
    });
  
    const stateCountsData = [];
  
    Object.entries(counts).forEach(([state, count]) => {
      const existingState = statesData.find((s) => s.name === state);
  
      if (existingState) {
        stateCountsData.push({ ...existingState, value: count });
      } else {
        stateCountsData.push({ name: state, value: count });
      }
    });
  
    // Sort stateCountsData by value in descending order
    stateCountsData.sort((a, b) => b.value - a.value);
  
    setStateCounts(stateCountsData);
  }, [allUsers, statesData]);

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

  useEffect(() => {
    const counts = {};
  
    allUsers.forEach((user) => {
      const age = calculateAge(user.birth);
      const ageRange = getAgeRange(age);
  
      counts[ageRange] = counts[ageRange] ? counts[ageRange] + 1 : 1;
    });
  
    console.log("Counts:", counts);
  
    const ageCountsData = Object.keys(counts).map((ageRange) => ({
      name: ageRange,
      value: counts[ageRange],
    }));
  
    console.log("Age Counts Data:", ageCountsData);
  
    // Sort ageCountsData by value in descending order
    ageCountsData.sort((a, b) => b.value - a.value);
  
    setAgeCounts(ageCountsData);
  }, [allUsers]);

  useEffect(() => {
    const counts = {};
    
    allUsers.forEach((user) => {
      const discipline = user.discipline || "No especificada";
    
      counts[discipline] = counts[discipline] ? counts[discipline] + 1 : 1;
    });
    
    const disciplineCountsData = Object.keys(counts).map((discipline) => ({
      name: discipline,
      value: counts[discipline],
    }));
    
    // Sort discipline counts by the highest value
    disciplineCountsData.sort((a, b) => b.value - a.value);
    
    setDisciplineCounts(disciplineCountsData);
  }, [allUsers]);
  return (

    <div>

    <main  className="h-screen px-24 w-screen bg-black flex flex-col">

    <h1 className="font-bold text-teal-400 text-4xl py-7">Numeralia</h1>

    <ul className="w-3/4 flex flex-row border-b-[1px] border-teal-400 pb-3 gap-6">
        <li className={`cursor-pointer hover:text-gray-400 ${subMenu === "usuario" ? "text-gray-400" : null}`}
        onClick={()=>{setsubMenu("usuario")}}
        >Usuario</li>
        <li className={`cursor-pointer hover:text-gray-400 ${subMenu === "estado" ? "text-gray-400" : null}`}
        onClick={()=>{setsubMenu("estado")}}
        >Participantes por Estado</li>
        <li className={`cursor-pointer hover:text-gray-400 ${subMenu === "edad" ? "text-gray-400" : null}`}
        onClick={()=>{setsubMenu("edad")}}
        >Participantes por Edad</li>
        <li className={`cursor-pointer hover:text-gray-400 ${subMenu === "disciplina" ? "text-gray-400" : null}`}
        onClick={()=>{setsubMenu("disciplina")}}
        >Participantes por Disciplina</li>    
    </ul>
    {subMenu === "usuario" && 
    <div className="flex flex-row w-full gap-36">
    <div className="w-1/2 pb-10">



            <p className="mb-4 text-lg mt-7">Folio actual <span className="text-xl font-bold">{ `BA${folioNumber.current}2023`}</span></p>


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
                    <option defaultValue>Select...</option>

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
                    {

                      artwork.imgurl ? <div className="flex flex-col pt-2 border-t-2 border-teal-400"><p>Si hay obra subida</p><a href={artwork.imgurl} target="_blank" rel="noreferrer" className="hover:text-gray-300 cursor-pointer">Descargar</a></div> : <p> No hay obra</p>

                    }
                    </div>

                    </>

                    )

                })
                
                } 
                

              </div>

              </>

            }

            </div>


         

    </div>

   {
   actualUser &&
   <div className="w-1/2 pb-10">
    <div className="flex flex-col w-full gap-2 lg:gap-3">


      <div className="flex-col pt-3">
        <h1 className="text-lg lg:text-3xl ">Nombre de artista</h1>
        <p className="text-base lg:text-2xl pt-1">{actualUser.artistname ? actualUser.artistname : "No hay nombre de artista"}</p>
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

    </div>
    }

    {subMenu === "estado" &&

    <div className="state-grid grid grid-cols-3 gap-4 pb-10 mt-7">
    {stateCounts.map((state, index) => (
    <div
    key={state.name}
    className="state-grid-item p-4 bg-transparent border-2 border-teal-400 text-center rounded-lg"
    >
    <div className ="flex flex-col w-full">
    <span className="state-name text-xl font-bold">{state.name}</span>
    <p className="font-bold text-2xl">{state.value}</p>
    </div>
    </div>
    ))}
    </div>   
    }

    {subMenu === "edad" && 
    <div className="age-grid grid grid-cols-3 gap-4 text-teal-400 pb-10 mt-7">
    {ageCounts.map((age) => (
      <div
        key={age.name}
        className="age-grid-item  p-4 bg-transparent border-2 border-teal-400 text-center rounded-lg"
      >
        <div className ="flex flex-col w-full">
        <span className="age-name text-xl font-bold">{age.name}</span>
        <span className="age-value font-bold text-2xl">{age.value}</span>
        </div>
      </div>
    ))}
    </div>    
    }
    {subMenu === "disciplina" &&
        <div className="age-grid grid grid-cols-3 gap-4 text-teal-400 pb-10 mt-7">
        {disciplineCounts.map((discipline) => (
          <div
            key={discipline.name}
            className="age-grid-item  p-4 bg-transparent border-2 border-teal-400 text-center rounded-lg"
          >
            <div className ="flex flex-col w-full">
            <span className="discipline-name text-xl font-bold">{discipline.name}</span>
            <span className="discipline-value font-bold text-2xl">{discipline.value}</span>
            </div>
          </div>
        ))}
      </div>

    }
    </main>
    

    </div>
   
  );
}
