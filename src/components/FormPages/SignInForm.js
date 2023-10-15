import React, { useEffect, useState } from 'react';
import formStyle from "./formStyle.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { logInAsync, signInWithGoogle, userSelector } from '../../redux/reducers/userReducer';
import { useDispatch, useSelector } from 'react-redux';


const SignInForm = () => {
  const user = useSelector(userSelector);
  const [values, setValues] = useState({email:"", pass:""});
  const navigate = useNavigate();
  const dispatch = useDispatch();
    
  useEffect(() => {
    // This effect will run when the user state changes
    if (user) {
      navigate('/'); // Navigate to home page
    }
  }, [user, navigate]);

  // Function to handle form submission - login with id and password 
  function handleSubmit(e){
    e.preventDefault();
    dispatch(logInAsync(values));
  }

  // if user signed in with google, dispatch signInWithGoogle function and navigate to home page 
  async function handleSignInWithGoogle (){ 
    dispatch(signInWithGoogle());
    navigate('/');
  }

  // useEffect hook to set the document title and redirect if the user is logged in
  useEffect(() => {
    document.title = "BusyBuy | Sign in to your account"
  }, [])

  return (
    <div className=' pt-12 dark:bg-slate-900 dark:text-gray-400 z-20'>
    <div className={formStyle.pageStyle}>
      <h1> Sign  In </h1>
      <form>
        <input type="email" placeholder="Enter email" onChange={(e) => setValues((prev) => ({...prev, email:e.target.value}))} required/>
        <input type="passwrord" placeholder="Enter password" onChange={(e) => setValues((prev) => ({...prev, pass:e.target.value}))} required/>
        <button type='submit' onClick={handleSubmit}> Sign In </button>
        <button type='button' onClick={() => {handleSignInWithGoogle()}}> 
          <span> Sign In with Google </span> <i className = "fa-brands fa-google px-2 py-1 border-2 border-solid rounded-3xl text-base"></i> 
        </button>
      </form>

      <Link to='/signup' className="linkStyle">  Or SignUp instead </Link>
    </div>
    </div>
  )
}

export default SignInForm;
