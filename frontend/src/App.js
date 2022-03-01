import './App.css';
import React, {useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Home from './pages/home'
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';


function App() {

  const user = useSelector(selectUser)


  return ( 

    /* <div>
      {user ? <Profile/> : <Login/>}
    </div> */
         <Router>    
            {/* <NavBar/> */}
            <Routes>
              <Route exact path='/' element={<Home/>}/>
              {/* <Route exact path='/login' element={<Login/>}/>
              <Route exact path='/register' element={<Register/>}/> */}
            </Routes> 
          </Router>
     
  );
}

export default App;
