import './App.css';
import React, {useContext, useState} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Home from './pages/home'
import NavBar from './components/Navbar';
import AuthorsList from './components/authorList/authorList';
import ForeignProfile from './pages/profile/foreignProfile';
import PublicPosts from './pages/publicPosts';
import { UserContextProvider } from './context/userContext'
import Register from './pages/register/Register';
import PrivateRoute from './routes/PrivateRoute';
function App() {
  
  return ( 
        <UserContextProvider>
         <Router>    
            <NavBar/>
            <Routes>
              <Route exact path='/login' element={<Login/>}/>
              <Route exact path='/register' element={<Register/>}/>
              <Route exact path='/profile/:id' element={<PrivateRoute><Profile/></PrivateRoute>}/>
              <Route exact path='/home' element={<PrivateRoute><Home/></PrivateRoute>}/>
              <Route exact path='/publicPosts' element={<PrivateRoute><PublicPosts feedType = "publicPosts"/></PrivateRoute>}/>
              <Route exact path='/' element={<PrivateRoute><Home/></PrivateRoute>}/>
              <Route exact path='/authors/:id/inbox' element={<PrivateRoute><Home feedType = "inbox"/></PrivateRoute>}/>
              <Route exact path='/authors/:id/posts' element={<PrivateRoute><Profile/></PrivateRoute>}/>
              <Route exact path='/fprofile/:id' element={<PrivateRoute><ForeignProfile/></PrivateRoute>}/>  
              <Route exact path='/directory' element={<PrivateRoute><AuthorsList/></PrivateRoute>}/>  

            </Routes> 
          </Router>
        </UserContextProvider>
  );
}

export default App;
