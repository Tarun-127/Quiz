// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp_In from './components/SignUP_In-Page/SignUp_In';
import Login from './components/LogIn-Page/LogIn';
import SignUp from './components/SignUp-Page/SignUp';
import './App.css'

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="/" element={<SignUp_In/>}/>
            
          </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
