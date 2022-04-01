import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import {Provider} from 'react-redux'
import store from './store/store'
import { Navigate } from 'react-router-dom';

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

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


