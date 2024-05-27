import React,{ useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
import './SignUp.css';

const SignUp = ({ onSignUpSuccess }) => {

    const[formData, setFormData] = useState({
        name:'',
        email:'',
        password:'',
        confirmPassword:'',
    });

    const [errors,setErrors] = useState({});
    // const navigate = useNavigate();


    const { name, email, password, confirmPassword } = formData;

    const validate = () =>{
      const newErrors = {};
      const namePattern = /^[a-zA-Z]{2,30}$/;
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const strongPasswordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;



      if(!name){
        newErrors.name = 'Name is required'
        }else if (!namePattern.test(name)){
          newErrors.name = 'Invalid name'
        }
      if(!email){
        newErrors.email = 'Email is required'
      }else if (!emailPattern.test(email)){
        newErrors.email = 'Invalid Email'
      }
      if(!password){
        newErrors.password = 'password is required'
      }else if (!strongPasswordPattern.test(password)){
        newErrors.password = 'Weak Password'
      }
      if(!confirmPassword){
        newErrors.confirmPassword = 'password is required'
      }else if (password !== confirmPassword){
        newErrors.confirmPassword = 'password doesn`t match'
      }
      console.log('Validation Errors:', newErrors); 
      return newErrors;
    }

    const onChange = e => setFormData({...formData,[e.target.name]:e.target.value});

    const onSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          // Display errors in placeholders
          // setFormData(prevState => ({
          //   ...prevState,
          //   name: errors.name ? errors.name : prevState.name,
          //   email: errors.email ? errors.email : prevState.email,
          //   password: errors.password ? errors.password : prevState.password,
          //   confirmPassword: errors.confirmPassword ? errors.confirmPassword : prevState.confirmPassword,
          // }));
          return;
        }
        try{
            const response = await axios.post('http://localhost:5000/auth/signup',formData);
            if (response && response.data) {
              console.log(response.data);
              onSignUpSuccess();
              // Process the response data here
          } else {
              console.error("Response or data is undefined");
              // Handle the case where response or data is undefined
          }
      } catch (err) {
          console.error(err.message);
          // Handle any errors that occur during the request
      }
        //     console.log(response.data)
        //     navigate('/login');
        // } catch (err){
        //     console.error(err.response.data);
        // }
      };

return (
    <div className='signup-container'>
      
      <form onSubmit={ onSubmit } className="signup-form">
      
       
           <div>
           <label>Name</label>
           <input 
           type="text" 
           name="name" value={name} 
           onChange={ onChange }    
           placeholder={errors.name ? errors.name : 'Enter Your Name'}
           className={errors.name ? 'error' : ''} 
           required />
         
           </div>

           <div>
           <label>Email</label>
           <input 
           type="email" 
           name="email" 
           value={email} 
           autoComplete="email" 
           onChange={ onChange } 
           placeholder={errors.Email ? errors.Email : 'Enter Your Email'}
           className={errors.email ? 'error' : ''} 
           required />
           
           </div>
        
      
           <div>
           <label>Password</label>
           <input 
           type="password" 
           name="password" 
           value={password} 
           autoComplete="current-password" 
           onChange={ onChange }  
           placeholder={errors.password ? errors.password : 'Enter Your Password'}  
           className={errors.password ? 'error' : ''} 
           required />
       
          </div>
          
       
          <div>
          <label>Confirm Password</label>
          <input 
          type="password" 
          name="confirmPassword" 
          value={confirmPassword} 
          autoComplete="new-password" 
          onChange={ onChange } 
          placeholder={errors.confirmPassword ? errors.confirmPassword : 'Enter Your ConfirmPassword'}
          className={errors.confirmPassword ? 'error' : ''} 
          required />
          </div>
      
          <div className='button_container'>
          <button type='submit'>Sign-Up</button>
          </div>
        </form>
    </div>
  )
}


export default SignUp;
