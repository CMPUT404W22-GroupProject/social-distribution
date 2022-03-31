import React, { useEffect, useContext } from 'react'
import { useRef, useState, iseEffect } from 'react';
import './login.css';

import UserContext from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = "https://cmput-404-w22-group-10-backend.herokuapp.com/"

const login = (email, password) => {
    return axios.post(API_URL+'login/', {
        "email" : email,
        "password" : password
    })
    .then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data));
        console.log(response.data)
        return response.data;
    });
};

const Login = () => {

    const team10Authorization = btoa("admin:gwbRqv8ZLtM3TFRW");

    const navigate = useNavigate();
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    
    const {id, setId} = useContext(UserContext);

    const {loggedIn, setLoggedIn} = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault();
        login(email, password)
        .then(() => {
            navigate('/authors');
            window.location.reload();
        },
        (error) => {
            console.log(error.response)
        });

        // var URL = 'https://cmput-404-w22-group-10-backend.herokuapp.com/authors'

        // const body = {
        //     "email": "nando@gmail.com",
        //     "password": "1231498"
        // }

        // axios.post("https://cmput-404-w22-group-10-backend.herokuapp.com/login/",body)
        //   .then(res=> console.log(res.data))
        //   .catch(err=> console.log(err))


    };
    return (
        <div className='login'>
            <form className='login_form' onSubmit={handleSubmit}>
                <h1>Login</h1>

                <input type='email' placeholder='example@gmail.com' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>

                <input type='password' placeholder='password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>

                <button className='submit_btn' type="submit">Log In</button>
            </form>
        </div>
    )
}

export default Login;