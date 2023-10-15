import React from 'react'
import { useNavigate } from 'react-router-dom';
import { addProductToCartAsync } from '../redux/reducers/cartReducer';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from '../redux/reducers/userReducer';

const ProductCard = ({product}) => {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Function to handle "Add to Cart" button
  function handleCartBtn(product){
    if(user === null){
      navigate('/signin');
    } else {
      // Add product to cart
      dispatch(addProductToCartAsync(product))
    }
  }

  return (
    <div className="w-1/2 flex flex-col justify-start shadow-lg p-6 border-2 lg:w-72 lg:text-xl lg:flex-wrap lg:content-center lg:m-4 dark:border-slate-800">
      <div> <img src={product.image} className="h-32 w-28 p-2 lg:h-72 lg:w-60" alt={product.title}/> </div>
      
      <div className='text-left w-full'>
        <h1 className='h-12 lg:h-16 overflow-hidden'> {product.title} </h1>
        <div className='flex flex-wrap justify-between items-center'>
          <div className='p-2'> ${(product.price)} </div>
          <div> {product.rating.rate} <i className="fa-solid fa-star text-yellow-400"></i></div>
        </div>
        
        <button className='bg-red-500 px-2 py-1 dark:bg-slate-400 dark:text-black lg:w-60 lg:mt-2' onClick={() => handleCartBtn(product)}> Add to Cart </button>
      
      </div>
    </div>
  )
}

export default ProductCard;
