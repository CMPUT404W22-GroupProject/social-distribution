import './App.css';
import React, {useContext, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Home from './pages/home'
import NavBar from './components/Navbar';

import { UserContextProvider } from './context/userContext'
import PrivateRoute from './routes/PrivateRoute';
import Register from './pages/register/Register';

function App() {

  return ( 
        <UserContextProvider>
         <Router>    
            <NavBar/>
            <Routes>
              <Route exact path='/login' element={<Login/>}/>
              <Route exact path='/register' element={<Register/>}/>
              {/* <Route element={<PrivateRoute/>}> */}
                <Route exact path='/profile/:id' element={<Profile/>}/>
               { /*<Route exact path='/home' element={<Home/>}/>*/}
                <Route exact path='/authors/:id/inbox' element={<Home feedType = "inbox"/>}/>
                <Route exact path='/authors/:id/posts' element={<Home feedType = "posts"/>}/> 
              {/*</Route>*/}
            </Routes> 
          </Router>
          </UserContextProvider>
  );
}

export default App;
