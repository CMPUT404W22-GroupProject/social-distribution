import React, { useEffect, useContext } from 'react'
import { useRef, useState, iseEffect } from 'react';
import './register.css';

import UserContext from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = "https://cmput-404-w22-group-10-backend.herokuapp.com/"


const Register = () => {

    const navigate = useNavigate();
    const {displayName, setDisplayName} = useContext(UserContext);
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");

    const register = (displayName, email, password) => {
        return axios.post(API_URL+'register/', {
            "displayName" : displayName,
            "email" : email,
            "password" : password
        })
        .then((response) => {
            console.log(response)
        })
        ;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        register(displayName, email, password)
        .then(
            response => {
                navigate('/login')
        },
        error => {
            setDisplayName("")
            setEmail("")
            setPassword("")
        });

        var registerBody = {
            "displayName": displayName,
            "email": email,
            "password": password
        }
    }

    return (
        <div className='login'>
            <form className='login_form' onSubmit={handleSubmit}>
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

                <button className='submit_btn' type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;