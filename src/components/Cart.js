import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCartProductsAsync, increaseProductAsync, decreaseProductAsync, removeFromCartAsync, purchaseAsync, clearCartAsync } from '../redux/reducers/cartReducer';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartInfo } = useSelector((state) => state.cartReducer);
  
  // Calculating discount and billing price based on the cart's total price
  const discount = (cartInfo.totalPrice*0.10).toFixed(0);
  const billingPrice = (cartInfo.totalPrice - discount).toFixed(0);

  useEffect(() => {
    // Fetching cart products and updating document title
    dispatch(getCartProductsAsync());
    document.title = "BusyBuy | Cart"
  },[])
    
  // Function to handle purchase and navigate to orders
  const handlePurchase = () => {
    dispatch(purchaseAsync());
    navigate('/orders');
    dispatch(clearCartAsync());
  }

  return (
    <div className={`h-full w-full pt-28 tracking-wide dark:bg-slate-900 dark:text-gray-400 min-h-screen`}>
      {cartInfo.cartProducts.length === 0 ? 
      <div className='text-center text-2xl tracking-wide'> 
        <i className="fa-regular fa-face-frown-open"></i> 
        <p> Your cart is Empty ! </p>
        <Link to='/'>
          <button className='bg-red-500 dark:bg-slate-400 text-black text-lg px-5 py-2 m-8 font-mono dark:tracking-widest'> 
            ADD PRODUCTS 
          </button> 
        </Link>
        </div>  : 
      <div className='flex flex-col justify-evenly lg:flex-row lg:w-full'>
        <div className='lg:w-7/12 flex flex-col flex-wrap p-1'>  
          {cartInfo.cartProducts.map((product, index) =>  
            <div className="flex justify-start shadow-lg p-2 text-md m-2 border-2 dark:border-slate-800" key={index}>
              <div> <img src={product.image} className="h-28 w-32 p-2" alt={product.title}/> </div>
              
              <div className='ml-4 text-left w-full'>
                <h1 className='lg:text-xl'> {product.title} </h1>
                <div className='flex flex-wrap justify-between items-center'>
                  <div className='p-2'> ${(product.price)} </div>
                  <div> {product.rating} <i className="fa-solid fa-star text-yellow-400"></i> </div>
                </div>
                

                <div className='flex flex-wrap justify-between content-between'>
                    <div className='flex'>
                    <i className="fa-solid fa-circle-plus text-xl cursor-pointer" onClick={() => dispatch(increaseProductAsync(product))}></i>
                      <span className='mx-2 text-xl'> {product.count} </span>
                      <i className="fa-solid fa-circle-minus text-xl cursor-pointer" onClick={() => dispatch(decreaseProductAsync(product))}></i>
                    </div>

                    <button className='bg-red-500 px-2 py-1 lg:px-4 dark:bg-slate-400 dark:text-black' onClick={() => dispatch(removeFromCartAsync(product))}> Remove From Cart </button>
                </div>

              </div>
              
            </div>
          )}

        </div>
        <div className='lg:w-5/12 flex flex-col shadow-lg desktop:w-1/3 p-8 dark:shadow-md dark:shadow-slate-800'>
        <div className='lg:text-4xl text-2xl p-2'> Price Details </div> <hr />
        <div className='p-6 flex flex-col flex-wrap tracking-wider lg:text-xl'>
        <div className='flex justify-between'>
            <span> Total items : </span> 
            <span className='text-green-800'> {cartInfo.totalItems} </span>
          </div>

          <div className='flex justify-between'>
            <span> Total price : </span> 
            <span className='text-green-800'> ${(cartInfo.totalPrice).toFixed(0)} </span>
          </div>
          <div className='flex justify-between'>
            <span> Discount : </span> 
            <span className='text-green-800'> ${discount} </span>
          </div>

          <div className='flex justify-between'>
            <span> Delievery charges : </span> 
            <span className='text-green-800'> Free </span>
          </div>

          <div className='flex justify-between'>
            <span> Billing price : </span> 
            <span className='text-green-800'> ${billingPrice} </span>
          </div>

          <div className='flex justify-center'>
            <button className=' bg-yellow-700 px-2 py-1 text-slate-200 m-2' onClick={() => dispatch(clearCartAsync())}> Clear Cart </button>
            <button className=' bg-orange-700 px-2 py-1 text-slate-200 m-2' onClick={handlePurchase}> Place Order </button>
          </div>
        </div>
      </div>
      </div>
        }
  </div>
  )
}

export default Cart;
