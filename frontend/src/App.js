import './App.css';
import React, {useContext, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Home from './pages/home'
import NavBar from './components/Navbar';

import { UserContextProvider } from './context/userContext'

function App() {

  return ( 
    /* <div>
      {user ? <Profile/> : <Login/>}
    </div> */
         <Router>    
            <UserContextProvider>
            <NavBar/>
            <Routes>
              <Route exact path='/login' element={<Login/>}/>
              <Route exact path='/home' element={<Home/>}/>
              {/* <Route exact path='/login' element={<Login/>}/>
              <Route exact path='/register' element={<Register/>}/> */}
            </Routes> 
            </UserContextProvider>
          </Router>
     
  );
}

export default App;
