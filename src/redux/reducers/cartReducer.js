import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import db from '../../firebase/firebase.js'
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getOrdersAsync, setOrdersArray } from "./productReducer.js";

const INITIAL_STATE = {
    cartInfo:{
        totalItems:0, 
        totalPrice:0, 
        cartProducts:[]
    }
}

// Get cart products
export const getCartProductsAsync = createAsyncThunk(
    'cart/getCartProducts',
    async (arg, thunkAPI) => {
        // getting user's data from redux store
        const {userReducer} = thunkAPI.getState();
        const { user } = userReducer;

        const unsub = onSnapshot(doc(db, "users", user.email), (currentUser) => {
            if(currentUser.exists()){
                thunkAPI.dispatch(setCartProducts(currentUser.data().cartInfo));
            }
        });
    }
)

//  Add to cart
export const addProductToCartAsync = createAsyncThunk(
    'cart/addProduct',
    async (obj, thunkAPI) => {
        // getting user's info
        const { userReducer } = thunkAPI.getState();
        const { user } = userReducer;

        const item = { category : obj.category, id:obj.id, image:obj.image, price:obj.price, title:obj.title, count:1, rating:obj.rating.rate};
        
        // Getting cart info
        const { cartReducer } = thunkAPI.getState();
        const {cartInfo } = cartReducer;

        const isItemInCart = cartInfo.cartProducts.some(product => product.id === item.id);
        if (isItemInCart) {
            toast.info("Product already present in the cart");
            return;
        }

        const docRef = doc(db, "users", user.email);
        await updateDoc(docRef, {
            cartInfo:{
                        cartProducts: [...cartInfo.cartProducts, item],
                        totalItems : cartInfo.totalItems + 1,
                        totalPrice : cartInfo.totalPrice + item.price
                    }
        });

        toast.success("Product added successfully");
    }
)

// Remove product from cart
export const removeFromCartAsync = createAsyncThunk(
    'cart/removeProduct',
    async (product, thunkAPI) => {
        // Getting cart information
        const {cartReducer} = thunkAPI.getState();
        const {cartInfo } = cartReducer;        
        const updatedArray = cartInfo.cartProducts.filter((item) => item.id !== product.id);

        // Getting user information
        const { userReducer } = thunkAPI.getState();
        const { user } = userReducer;

        const docRef = doc(db, "users", user.email);
        await updateDoc(docRef, {
            cartInfo:{
                        cartProducts: updatedArray,
                        totalItems : cartInfo.totalItems - product.count,
                        totalPrice : cartInfo.totalPrice - product.price * product.count
                    }
        });
        
        toast.success("Product Removed successfully");
    }
)

//increase qty of product in cart
export const increaseProductAsync = createAsyncThunk(
    'cart/increaseProductCount',
    async (product, thunkAPI) => {
        // Getting cart information
        const { cartReducer } = thunkAPI.getState();
        const { cartInfo } = cartReducer;        
        let index = cartInfo.cartProducts.findIndex((el)=> el.id === product.id);
        
        // Getting user information
        const { userReducer } = thunkAPI.getState();
        const { user } = userReducer;
        
        if(index !== -1){
            const updatedCartProducts = [...cartInfo.cartProducts];  
            updatedCartProducts[index] = {
                ...updatedCartProducts[index],
                count: updatedCartProducts[index].count + 1 
            };            
            const docRef = doc(db, "users", user.email);
            await updateDoc(docRef, {
                cartInfo:{
                            cartProducts: updatedCartProducts,
                            totalItems : cartInfo.totalItems + 1,
                            totalPrice : cartInfo.totalPrice + product.price
                        }
                        
            });

        }
    }
)

//decrease qty of product in cart
export const decreaseProductAsync = createAsyncThunk(
    'cart/decreaseProductCount',
    async(product, thunkAPI) => {
        // Getting cart and user information
        const { cartReducer, userReducer } = thunkAPI.getState();
        const { cartInfo } = cartReducer;
        const { user } = userReducer;

        let index = cartInfo.cartProducts.findIndex((el)=> el.id === product.id);
        
        if(index !== -1 ){
            if(cartInfo.cartProducts[index].count > 1){
                const updatedCartProducts = [...cartInfo.cartProducts];
                updatedCartProducts[index] = {
                    ...updatedCartProducts[index],
                    count: updatedCartProducts[index].count - 1
                }
            
                const docRef = doc(db, "users", user.email);
                await updateDoc(docRef, {
                    cartInfo:{
                                cartProducts: updatedCartProducts,
                                totalItems : cartInfo.totalItems - 1,
                                totalPrice : cartInfo.totalPrice - product.price
                            }
                            
                });
            } else {
                thunkAPI.dispatch(removeFromCartAsync(product));
                return;   
            }      
        }
    }
)

// To make the cart empty
export const clearCartAsync = createAsyncThunk(
    'cart/clearCart',
    async(arg, thunkAPI) => {
        // Getting user information
        const { userReducer } = thunkAPI.getState();
        const { user } = userReducer;

        const docRef = doc(db, "users", user.email);
        await updateDoc(docRef, {
            cartInfo:{
                        cartProducts: [],
                        totalItems : 0,
                        totalPrice : 0
                    }
        });
    }  
)

// To purchase the cart products - cartReducer
export const purchaseAsync = createAsyncThunk(
    'cart/purchase',
    async (arg, thunkAPI) => {
        let date = new Date();
        let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
        // Getting user information
        const { userReducer } = thunkAPI.getState();
        const { user } = userReducer;

        // Getting cart information and previous orders
        const { productReducer, cartReducer } = thunkAPI.getState();
        const { cartInfo } = cartReducer;
        const { orders } = productReducer;
        
        let order = {
            orderDate : currentDate, 
            totalPrice : cartInfo.totalPrice,
            orderedProductDetails : cartInfo.cartProducts
        }

        const docRef = doc(db, 'users', user.email);
        await updateDoc(docRef, {
            orders: [order, ...orders]
        });
        thunkAPI.dispatch(getOrdersAsync());
    }
)

const cartSlice = createSlice({
    name:'cart',
    initialState:INITIAL_STATE,
    reducers:{
        setCartProducts: (state, action) => {
            state.cartInfo = action.payload
        },

    },
})

export const cartReducer = cartSlice.reducer;
export const { setCartProducts } = cartSlice.actions;