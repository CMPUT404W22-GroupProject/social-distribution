import './App.css';
import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Home from './pages/Home';
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import NavBar from './components/Navbar';

function App() {
  return (
    <div className='App'>
      <NavBar/>
      <Router>
        <Routes>
          <Route exact path='/' element={<Home/>}/>
          <Route exact path='/login' element={<Login/>}/>
          <Route exact path='/register' element={<Register/>}/>
        </Routes>
      </Router>
    </div>

  );
}

export default App;
