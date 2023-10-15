// firebase database
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import db, { auth } from '../../firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { setLoading } from './productReducer';
import { useNavigate } from 'react-router-dom';


const INITIAL_STATE = {
    user:null,
    loading:false
}

// Sign up function - create a new user
export const createUserAsync = createAsyncThunk(
    "user/createUser",
    async (values, thunkAPI) => {
        createUserWithEmailAndPassword(auth, values.email, values.pass)
        .then(async(res) => {
            thunkAPI.dispatch(setLoading(true));
            console.log("signed up successfully.")
            await updateProfile(res.user, {
                displayName: values.name
            });
            const currentUser = {
                name: res.user.displayName,
                email: res.user.email,
                password:values.pass,
                cartInfo: {totalItems:0, totalPrice:0, cartProducts:[]},
                orders:[]
            }
            // Store user info in db
            const userDocRef = doc(db , "users" , currentUser.email);
            setDoc(userDocRef , currentUser);
            
            thunkAPI.dispatch(setUser(currentUser));
            thunkAPI.dispatch(setLoading(false));
        }).catch((err) => {
            toast.error(err.message);
            thunkAPI.dispatch(setLoading(false));
        })
    }
)

// Sign In
export const logInAsync = createAsyncThunk(
    "user/login",
    async (values, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        await signInWithEmailAndPassword(auth, values.email, values.pass)
        .then(async (res) => {
            console.log('signed in successfully');

            const currentUser = {
                name: res.user.displayName,
                email: res.user.email,
                password:values.pass,
                cartInfo: {totalItems:0, totalPrice:0, cartProducts:[]},
                orders:[]
            }
            thunkAPI.dispatch(setUser(currentUser));
            thunkAPI.dispatch(setLoading(false));
        })
        .catch((err) => {
            toast.error(err.message);
            thunkAPI.dispatch(setLoading(false));
        })
    }
)

export const signInWithGoogle = createAsyncThunk(
    "user/signInWithGoogle",
    async (arg, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider)
        .then((res) => {
            const currentUser = {
                name: res.user.displayName,
                email: res.user.email,
                cartInfo: {totalItems:0, totalPrice:0, cartProducts:[]},
                orders:[]
            }
            thunkAPI.dispatch(setUser(currentUser));
            thunkAPI.dispatch(setLoading(false));
        }).catch((err) => {
            toast.error(err.message);
            thunkAPI.dispatch(setLoading(false));
        })
    }
)

// Sign out
export const logOutAsync = createAsyncThunk(
    'user/logOut',
    async (arg, thunkAPI) => {
        signOut(auth)
        .then(() => {
            console.log("signed out successfully ! ");
            thunkAPI.dispatch(setUser(null));
        }).catch((err) => {
            toast.error(err.message);
        })
    }
)

export const authentication = createAsyncThunk(
    'user/authentication',
    async (arg, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        onAuthStateChanged(auth, (currentUser) => {
            if(currentUser){
                const user = {
                    userId: currentUser.uid,
                    name: currentUser.displayName,
                    email: currentUser.email,
                    cartInfo: {totalItems:0, totalPrice:0, cartProducts:[]},
                    orders:[]
                }
                thunkAPI.dispatch(setUser(user));
            }
        });
        thunkAPI.dispatch(setLoading(false));
    }
)

const userSlice = createSlice({
    name:'userInfo',
    initialState:INITIAL_STATE,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload
        },
    }
})

export const userReducer = userSlice.reducer;
export const { setUser } = userSlice.actions;
export const userSelector = (state) => state.userReducer.user;
