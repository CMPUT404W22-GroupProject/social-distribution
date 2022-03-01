import React, { useEffect, useContext } from 'react'
import { useRef, useState, iseEffect } from 'react';
import './login.css';
import { useDispatch } from 'react-redux';
import { login } from '../../features/userSlice';


const Login = () => {

    const[id, setId] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");


    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        dispatch(login({
            id: id,
            email: email,
            password: password,
            loggedIn: true
        }))

    }

    return (
        <div className='login'>
            <form className='login_form' onSubmit={(e) => handleSubmit(e)} >
                <h1>Login</h1>

                <input type='id' placeholder='123' 
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