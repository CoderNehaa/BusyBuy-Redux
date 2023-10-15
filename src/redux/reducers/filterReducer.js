import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { setProducts } from "./productReducer";

const initialState = {
    searchText : '',
    categories : ["men's clothing", "women's clothing", "electronics", "jewelery"],
    filterPrice:1000,
    selectedCategories:[]
}

// Whenever searchtext is changed, this function will work
export const handleSearchChange = createAsyncThunk(
    "filter/searchQuery",
    async(text, thunkAPI) => {
        // Change search Text
        thunkAPI.dispatch(setSearchText(text)); 
        // Filter products based on the search text  
        thunkAPI.dispatch(filterProducts());     
    }    
)

// Apply filters data
export const applyFiltersAsync = createAsyncThunk (
    "filter/applyFilters",
    async (values, thunkAPI) => {
        thunkAPI.dispatch(setPrice(values.filterPrice));
        if(values.category !== null){
            const { filterReducer } = thunkAPI.getState();
            const { selectedCategories } = filterReducer;

            if (selectedCategories.includes(values.category)) {                  // removing category
                thunkAPI.dispatch(removeCategory(values.category));
            } else { 
                thunkAPI.dispatch(addCategory(values.category));                 // Adding selected category
            }
        }
        // Filter products based on category and price
        thunkAPI.dispatch(filterProducts());
    }
)

// Filter products
export const filterProducts = createAsyncThunk(
    'filter/filterProducts',
    async (values, thunkAPI) => {
        const { filterReducer, productReducer } = thunkAPI.getState();
        const { searchText, filterPrice, selectedCategories } = filterReducer;
        const { data } = productReducer;

        const filteredProducts = data.filter(product => {
            const matchesPrice = !filterPrice || product.price < filterPrice;
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
            const matchesSearchText = searchText === '' || product.title.toLowerCase().includes(searchText.toLowerCase());
            return matchesPrice && matchesCategory && matchesSearchText;
        });
        thunkAPI.dispatch(setProducts(filteredProducts));
    }
)

const filterSlice = createSlice({
    name:'filter',
    initialState,
    reducers:{
        setSearchText: (state, action) => {
            state.searchText = action.payload            
        },
        setPrice : (state, action) => {
            state.filterPrice = action.payload;
        },
        addCategory: (state, action) => {
            state.selectedCategories = [...state.selectedCategories, action.payload]
        },
        removeCategory : (state, action) => {
            const temp = state.selectedCategories.filter((category) => category !== action.payload)
            state.selectedCategories = [...temp]
        }
    },
    extraReducers:{}
})

export const filterReducer =  filterSlice.reducer;
export const { setSearchText, setPrice, addCategory, removeCategory } = filterSlice.actions;