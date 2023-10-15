import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, onSnapshot } from "firebase/firestore";

import db from '../../firebase/firebase.js'
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';

const INITIAL_STATE = {
    loading:false,
    products:[],
    data:[],
    orders:[],
}

// fetch data/products
export const fetchDataAsync = createAsyncThunk(
    'data/fetchProducts',
    async (arg, thunkAPI) => {
        thunkAPI.dispatch(setLoading(true));
        const response = await axios.get('https://fakestoreapi.com/products');
        thunkAPI.dispatch(setProducts(response.data));
        thunkAPI.dispatch(setData(response.data));
        thunkAPI.dispatch(setLoading(false));
    }
)

// Get all orders
export const getOrdersAsync = createAsyncThunk(
    "data/fetchOrders",
    async (arg, thunkAPI) => {
        // getting user's data from redux store
        const { userReducer } = thunkAPI.getState();
        const { user } = userReducer;
        
        const unsub = onSnapshot(doc(db, "users", user.email),(currentUser) => {
            if(currentUser.data()){
                thunkAPI.dispatch(setOrdersArray(currentUser.data().orders))
            }
        })
        
    }
)

const productSlice = createSlice({
    name:'data',
    initialState:INITIAL_STATE,
    reducers:{
        setProducts : (state, action) => {
            state.loading = false;  
            state.products = [...action.payload]
        },
        setData: (state, action) => {
            state.data = [...action.payload]
        },
        setOrdersArray : (state, action) => {
            state.loading=false;
            state.orders = [...action.payload]
        },
        setLoading : (state, action) => {
            state.loading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchDataAsync.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchDataAsync.fulfilled, (state, action) => {
            state.loading = false;
        })
        .addCase(fetchDataAsync.rejected, (state, action) => {
            state.loading = false;
        })
    }
})

export const productReducer = productSlice.reducer;
export const { setProducts, setData, setOrdersArray, setLoading } = productSlice.actions;
