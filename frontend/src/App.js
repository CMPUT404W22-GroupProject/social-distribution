import './App.css';
import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';

import Home from './pages/home';
import Login from './pages/login';
import Error from './pages/error';
import Navbar from './components/Navbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#212121',
    },
    secondary: {
      main: '#e0e0e0',
    },
  },
});


function App () {
    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Router>
              <Navbar/>
              <div className='container'>
                <Routes>
                  <Route path="/" element={<Home/>} />
                  <Route path="/login" element={<Login/>} />
                  <Route path="*" element={<Error/>} />
                </Routes>
              </div>
          </Router>
        </div>
      </ThemeProvider>
    )
}
export default App;
