import React, { useEffect } from "react";

import ProductCard from "./ProductCard";
import Filter from './Filter';
import { useDispatch, useSelector } from "react-redux";
import { getCartProductsAsync } from "../redux/reducers/cartReducer";
import { getOrdersAsync, fetchDataAsync } from "../redux/reducers/productReducer";
import { userSelector } from "../redux/reducers/userReducer";


const Home = () => {
  const user = useSelector(userSelector);
  
  const products = useSelector((state) => state.productReducer.products);
  const dispatch = useDispatch();

  // useEffect hook to set title, 
  useEffect(() => {
    document.title = "BusyBuy | Busy in buying"
    if(user){
      // get cart products and orders if the user is logged in
      dispatch(getCartProductsAsync());
      dispatch(getOrdersAsync());
    }
  }, []);
   
  return (
    <div className='h-full min-h-screen pt-20 lg:pt-10 dark:bg-slate-900 dark:text-slate-400'>
      <div className="flex flex-col flex-wrap content-center justify-center">
        <h1 className="text-3xl text-center font-bold pt-20 font-mono"> Welcome {user && user.name}</h1>
      </div>
    
      <div className="invisible md:visible"> <Filter /> </div>
      
      <div className="mt-4 flex justify-evenly flex-wrap md:ml-72">
        {products.map((product, index) => { return <ProductCard product = {product} key={index}/> })}
      </div>

    </div>
  )
}

export default Home;
