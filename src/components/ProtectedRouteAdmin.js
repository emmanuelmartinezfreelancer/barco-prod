import { useAuth } from "../context/authContext";
import {Navigate} from 'react-router-dom';

export function ProtectedRouteAdmin({children}){

    const {user, loading} = useAuth();

    if (loading) return <h1>Loading</h1>
    if (!user) return <Navigate to='/login' />
    if (user.email !== "vela.freelancer@gmail.com") return <Navigate to='/' />

    return <>{ children }</>

}