import React, { useEffect } from 'react'
import { useRef, useState, iseEffect } from 'react';


function Register() {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);


    const [password, setPassword] = useState('')
    const [passwordFocus, setPassowrdFocues] = useState(false)

    const [matchPassword, setMatchPassword] = useState('')
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        const match = password === matchPassword;
        setValidMatch(match)
    }, [password, matchPassword])

    useEffect(() => {
        setErrMsg('');
    },[user, password, matchPassword])
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user, password, matchPassword)
        setUser('');
        setPassword('')
        setMatchPassword('')
        setSuccess(true)
    }

    return (
        <div className="register">
            <div id='form'>
                <h3 className="loginLogo">SocialDistritbution</h3>
                <form onSubmit={handleSubmit}>
            
                        <label className='labels' htmlFor='email'>Email</label>
                        <input className='inputs' 
                                type='text' 
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
                 

                    
                        <label htmlFor='password'>Confirm Password</label>
                        <input className='inputs' type='password' 
                                id='ConfirmPassword'
                                onChange={(e) => setMatchPassword(e.target.value)}
                                value={matchPassword}
                                required/>
                
                        <button className="loginRegisterButton">Create a New Account</button>           
                </form>

            </div>            
                
        </div>             
  )
}

export default Register