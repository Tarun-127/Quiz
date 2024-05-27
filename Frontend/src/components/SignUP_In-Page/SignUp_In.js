

import React, { useState,useRef } from 'react';
import SignUp from '../SignUp-Page/SignUp';
import Login from '../LogIn-Page/LogIn';
import './SignUp_In.css';

const SignUp_In = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const loginButtonRef = useRef(null);


  const toggleForm = (formType) => {
    setIsSignUp(formType === 'signup');
  };

  const handleSignUpSuccess = () => {
    setIsSignUp(false);
    setTimeout(() => {
      if (loginButtonRef.current) {
        loginButtonRef.current.click();
      }
    }, 0);
  };

  return (
  <div className="auth-wrapper">
    <div className="form-box">
          <div><h2 className="heading">QUIZZIE</h2></div>
          <div className="toggle-buttons">
            <button onClick={() => toggleForm('signup')} className={isSignUp ? 'active' : ''}>Sign Up</button>
            <button ref={loginButtonRef} onClick={() => toggleForm('login')} className={!isSignUp ? 'active' : ''}>Log In</button>
          </div>
          <div> {isSignUp ? <SignUp onSignUpSuccess={handleSignUpSuccess} /> : <Login />}</div>
      </div>
    </div>
  );
};

export default SignUp_In;


