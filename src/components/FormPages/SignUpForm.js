import React, { useEffect, useState } from 'react';
import formStyle from "./formStyle.module.css";

import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUserAsync, signInWithGoogle, userSelector } from '../../redux/reducers/userReducer';
import { toast } from 'react-toastify';

function SignUpForm () {
  const user = useSelector(userSelector);
  const [values, setValues] = useState({name:"", email:"", pass:"", confirmPass:""});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Function to handle form submission
  const handleSubmission = (e) => {
    e.preventDefault();
    if(values.pass !== values.confirmPass){
      toast("Password and confirm password does not match.");
      return;
    }
    // Sign up and navigate to home page
    dispatch(createUserAsync(values));
  }

  useEffect(() => {
    document.title = "BusyBuy | Create your account for free.";
    // This effect will run when the user state changes
    if (user) {
      navigate('/'); // Navigate to home page
    }
  }, [user, navigate]);
  
  // if user signed in with google, dispatch signInWithGoogle function and navigate to home page 
  async function handleSignInWithGoogle (){ 
    dispatch(signInWithGoogle());
    navigate('/');
  }

  return (
    <div className=' pt-12 dark:bg-slate-900 dark:text-gray-400'>
      <div className={formStyle.pageStyle}>
        <h1> Sign Up </h1>

        <form onSubmit={handleSubmission}>
          <input type="name" placeholder="Enter Name" onChange={(e) => setValues((prev) => ({...prev, name:e.target.value}))} required/>
          <input type="email" placeholder="Enter email" onChange={(e) => setValues((prev) => ({...prev, email:e.target.value}))} required/>
          <input type="passwrord" placeholder="Enter password" onChange={(e) => setValues((prev) => ({...prev, pass:e.target.value}))} required/>
          <input type="passwrord" placeholder="Confirm password" onChange={(e) => setValues((prev) => ({...prev, confirmPass:e.target.value}))} required/>
          
          <button> Sign Up </button>
          <button onClick={() => handleSignInWithGoogle()}> 
          <span> Sign In with Google </span> <i className = "fa-brands fa-google px-2 py-1 border-2 border-solid rounded-3xl text-base"></i> 
        </button>
        </form>

        <Link to='/signin' className="linkStyle"> Or Signin instead </Link>
      </div>
    </div>
  )
}

export default SignUpForm;
