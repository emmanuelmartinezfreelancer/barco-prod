import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { Alert } from "./Alert";
import { ReactComponent as LogoNuevo } from '../assets/logoBarcoNuevo.svg';

export function Login() {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(user.email, user.password);
      navigate("/");
    } catch (error) {
        if (error.code === "auth/internal-error"){
                
            setError("Correo inválido/Introduce un password");

        } else if(error.code === "auth/user-not-found" ) {

            setError("El usuario no existe")

        } else if(error.code === "auth/wrong-password") {
        
            setError("Contraseña incorrecta")
        } 
    }
  };

  const handleChange = ({ target: { value, name } }) =>
    setUser({ ...user, [name]: value });

  const handleGoogleSignin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      setError(error.message);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!user.email) return setError("Write an email to reset password");
    try {
      await resetPassword(user.email);
      setError('We sent you an email. Check your inbox')
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="w-full flex sm:flex-col md:flex-row">
      
      {error && <Alert message={error} />}


      <div className="w-full bg-[#40E0D0] p-5 h-screen bg-[url('/assets/backgroundHome.svg')]">

     
      <a href="https://barcobienal.com" className="flex place-content-center h-full">
        
        <LogoNuevo className="sm:w-11/12 tablet:w-3/4 lg:w-8/12"/>
        
      </a>

      

      </div>
          

      <div className="bg-black sm:w-full md:w-2/5 grid h-screen place-items-center">
      
      <form
        onSubmit={handleSubmit}
        className="shadow-md rounded sm:pt-8 md:pt-6 pb-8 mb-4"
        >
        <h1 className="text-center font-helveticaL sm:text-2xl md:text-4xl tracking-widest" >BIENVENIDO</h1>
        <div className="sm:pt-8 md:pt-16 mb-8">
          <label
            htmlFor="email"
            className="block text-teal-400 text-sm font-bold mb-2 font-helveticaL"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            onChange={handleChange}
            className="bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-teal-400 leading-tight focus:outline-none focus:shadow-outline"          
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block teal-400 text-sm font-bold mb-2 font-helveticaL"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={handleChange}
            className="bg-transparent border border-[#40E0D0] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="flex items-center justify-between sm:pt-3 md:pt-0">
          <button
            className="hover:text-gray-500 font-bold rounded focus:outline-none focus:shadow-outline font-helveticaL text-xs"
            type="submit"
          >
            Sign In
          </button>
          <a
            className="inline-block align-baseline font-bold text-sm font-helveticaL text-xs"
            href="#!"
            onClick={handleResetPassword}
          >
            Forgot Password?
          </a>
        </div>

      <hr className="bg-grey my-8 h-px bg-[#40E0D0] border-0 dark:bg-[#40E0D0"/>

      </form>


        </div> 

        </div>
    
  );
}
