import React, { useEffect, useContext } from 'react'
import { useRef, useState, isEffect } from 'react';
import './register.css';
import { useForm } from 'react-hook-form'

import UserContext from '../../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API_URL = "https://cmput-404-w22-group-10-backend.herokuapp.com/"

const Register = () => {

    const { register, handleSubmit, watch, setError, formState : { errors }} = useForm();
    const onSubmit = (data) => {
        delete data["confirmPassword"];
        return axios.post(API_URL+'register/', data)
            .then((response) => {
                navigate('/login')
            })
            .catch(function (error) {
                if (error.response.status === 409) {
                    setError("email", {"message":"This email address already exists"});
                }
            });
    }

    const navigate = useNavigate();
    const password = useRef({});
    password.current = watch("password", "");

    return (
        <div className='login'>
            <form className='login_form' onSubmit={handleSubmit(onSubmit)}>
                <h1>Register</h1>

                <input type='id' placeholder='Display Name' 
                    {...register("displayName", { required: true})}
                    />
                    {errors.displayName && <p>Please enter the display name</p>}

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


                <input type='password' placeholder='confirm password' 
                    {...register("confirmPassword", {
                        validate: value =>
                            value === password.current || "The passwords do not match"
                    })}
                    />
                    {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

                <button className='submit_btn' type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;