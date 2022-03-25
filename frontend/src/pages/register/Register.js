import React, { useEffect, useContext } from 'react'
import { useRef, useState, iseEffect } from 'react';
import './register.css';

import UserContext from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const Register = () => {

    const URL = "https://cmput-404-w22-group-10-backend.herokuapp.com/register/"
    const URL2 = "https://cmput-404-w22-group-10-backend.herokuapp.com/authors/6f6995ed-ab47-4a5f-a916-7e238895cd0e"
    const navigate = useNavigate();
    const {displayName, setDisplayName} = useContext(UserContext);
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const {id, setId} = useContext(UserContext);
    const {loggedIn, setLoggedIn} = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault();

        var registerBody = {
            "displayName": displayName,
            "email": email,
            "password": password
        }
    
        axios.post(URL, registerBody).then(function (response) {
            console.log(response.data);
            var str = response.data.user.uuid
            console.log("STR", str)
            var n = str.lastIndexOf('/');
            var result = str.substring(n + 1)
            setId(result)
            setLoggedIn(true)
            navigate(`/profile/:${id}`)
          })
          .catch(function (error) {
            console.log(error);
            setDisplayName("")
          });
    }

    return (
        <div className='login'>
            <form className='login_form' onClick={(e) => handleSubmit(e)}>
                <h1>Register</h1>

                <input type='id' placeholder='Display Name' 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}/>

                <input type='email' placeholder='example@gmail.com' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>


                <input type='password' placeholder='password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>


                <input type='password' placeholder='confirm password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>

                <button className='submit_btn'>Register</button>
            </form>
        </div>
    )
}

export default Register;