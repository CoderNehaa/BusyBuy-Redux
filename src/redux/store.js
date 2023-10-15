import { configureStore } from "@reduxjs/toolkit";
import {productReducer} from "./reducers/productReducer";
import { userReducer } from "./reducers/userReducer";
import { cartReducer } from "./reducers/cartReducer";
import { filterReducer } from "./reducers/filterReducer";

export const store = configureStore({
    reducer:{
        productReducer,
        cartReducer,
        userReducer,
        filterReducer
    }
})
