import { Navigate, Outlet, Route, useLocation } from "react-router-dom";
import UserContext from "../context/userContext";
import { useContext } from "react";
import Login from "../pages/login/Login";


// const PrivateRoute = () => {
//     const {loggedIn} = useContext(UserContext)
//     const location = useLocation();

//     const logged = false
    
//     return (
//         loggedIn ? <Outlet/> 
//         : <Navigate to='/login' state={{from: location}} replace/>
//     );


// }

// No token validation here, just looks for a token
const PrivateRoute = ({ children }) => {
    try{
      const userToken = JSON.parse(localStorage.getItem('user')).token
      return children
    }
    catch(err){
      return <Navigate to="/login"/>
    }
  };

export default PrivateRoute;

