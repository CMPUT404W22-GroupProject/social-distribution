import './App.css';
import React, {useContext, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Home from './pages/home'
import NavBar from './components/Navbar';

import { UserContextProvider } from './context/userContext'
import PrivateRoute from './routes/PrivateRoute';

function App() {

  return ( 
        <UserContextProvider>
         <Router>    
            <NavBar/>
            <Routes>
              <Route exact path='/login' element={<Login/>}/>
              <Route element={<PrivateRoute/>}>
                <Route exact path='/profile/:id' element={<Profile/>}/>
                <Route exact path='/home' element={<Home/>}/>
              </Route>
            </Routes> 
          </Router>
          </UserContextProvider>
  );
}

export default App;
