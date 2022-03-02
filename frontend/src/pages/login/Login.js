import React, { useEffect, useContext } from 'react'
import { useRef, useState, iseEffect } from 'react';
import './login.css';

import UserContext from '../../context/userContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {

    const navigate = useNavigate();
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    
    const {id, setId} = useContext(UserContext);

    const {loggedIn, setLoggedIn} = useContext(UserContext)

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoggedIn(true)
        navigate('/home')
    }

    return (
        <div className='login'>
            <form className='login_form' onSubmit={(e) => handleSubmit(e)} >
                <h1>Login</h1>

                <input type='id' placeholder='id' 
                    value={id} 
                    onChange={(e) => setId(e.target.value)}/>

                <input type='email' placeholder='example@gmail.com' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>

                <input type='password' placeholder='password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}/>

                <button className='submit_btn'>Log In</button>
            </form>
        </div>
    )
}

export default Login;