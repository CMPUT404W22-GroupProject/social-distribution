import React, { useEffect, useContext } from 'react'
import { useRef, useState, iseEffect } from 'react';
import './login.css';
import { useForm } from 'react-hook-form'

import UserContext from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = "https://cmput-404-w22-group-10-backend.herokuapp.com/"

const Login = () => {

    const navigate = useNavigate();
    const { register, handleSubmit, setError, formState : { errors } } = useForm();

    const onSubmit = (data) => {
        return axios.post(API_URL+'login/', data)
            .then((response) => {
                localStorage.setItem('user', JSON.stringify(response.data));
                let uuid = response.data.user.uuid;
                navigate('/authors/' + uuid + '/inbox');
            })
            .catch(function (error) {
                setError("password", {"message":"Your password is incorrect or this account doesn't exist."})
            });
    }

    return (
        <div className='login'>
            <form className='login_form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Login</h1>

                <input type='email' placeholder='example@gmail.com' 
                    {...register("email", {
                        required: "Please enter an email",
                        pattern: pattern =>
                            pattern === /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ || "Please enter a valid email"
                    })}
                    />
                    {errors.email && <p>{errors.email.message}</p>}

                <input type='password' placeholder='password' 
                {...register("password", {
                    required: "Please enter a password"
                })}
                />
                {errors.password && <p>{errors.password.message}</p>}

                <button className='submit_btn' type="submit">Log In</button>
            </form>
        </div>
    )
}

export default Login;