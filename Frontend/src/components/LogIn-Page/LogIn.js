// src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LogIn.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();

    const { email, password } = formData;

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/auth/login', formData);
            console.log(response);
            if (response && response.data) {
                console.log(response.data);
            navigate('/Dashboard');
        } else {
            console.error("Response or data is undefined");
               } 
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="login-container">
            <form onSubmit={onSubmit} className="login-form">
             
                <div>
                <label>Email</label>
                <input type="email" name="email" value={email} onChange={onChange} required placeholder='Enter your email' />
                </div>
                
               
                <div>
                <label>Password</label>
                <input type="password" name="password" value={password} onChange={onChange} required  placeholder='Enter your password'/>
                </div>
               
                <div className='button_container'>
                <button type="submit">Login</button>
                </div>
                
            </form>
        </div>
    );
};

export default Login;
