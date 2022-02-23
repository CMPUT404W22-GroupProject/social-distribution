import React, { useEffect } from 'react'
import { useRef, useState, iseEffect } from 'react';
import './login.css';

function Login() {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, password)
        setUser('');
        setPassword('')
        setSuccess(true)
    }

    return (
        <div className="login">
            <div id='form'>
                <h3 className="loginLogo">SocialDistritbution</h3>
                <form onSubmit={handleSubmit}>
                
                        <label className='labels' htmlFor='email'>Email</label>
                        <input className='inputs' type='text' 
                                id='email'
                                ref={userRef}
                                onChange={(e) => setUser(e.target.value)}
                                value={user}
                                required/>
                 

                   
                        <label className='labels' htmlFor='password'>Password</label>
                        <input className='inputs' type='password' 
                                id='password'
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                required/>
                   

                    
                        <button className="loginButton">Log In</button> 
                   

                    
                        <button className="loginRegisterButton">Create a New Account</button>
                    
                
                </form>

            </div>            
                
        </div>             
  )
}

export default Login