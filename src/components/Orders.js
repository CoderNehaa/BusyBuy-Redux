import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrdersAsync } from '../redux/reducers/productReducer';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.productReducer);
  
  // useEffect hook to update document title
  useEffect(() => {
    document.title = "BusyBuy | Orders"
    // get orders
    dispatch(getOrdersAsync());
  }, [])

  return (
    <div className='h-full text-center py-32 dark:bg-slate-900 dark:text-gray-400 min-h-screen'>
      {orders.length === 0 ? 
      <div className='text-2xl laptop:text-4xl'> 
       <p> No order has been placed yet. </p>
        <Link to='/'>
            <button className='bg-red-500 dark:bg-slate-400 text-black text-lg px-5 py-2 m-8 font-mono dark:tracking-widest'> 
              Start shopping 
            </button> 
        </Link>
      </div> :
        <div>
          <h1 className='text-3xl md:text-4xl'> Your orders </h1>
          {orders.map((order, index) => 
            <div key={index} className='flex flex-col flex-wrap justify-center content-center m-3 laptop:m-8'>
              <h2 className='text-xl m-2'> Ordered on :- {order.orderDate} </h2>
              <div className='overflow-x-auto'>

                <table className='laptop:w-1/2 text-left tracking-wider text-black dark:text-gray-400 sm:w-[600px] lg:w-[900px]'>
                  <thead className='text-md font-normal text-gray-700 bg-gray-400 dark:bg-gray-700 dark:text-gray-400'>
                      <tr className='text-center'>
                        <th className='py-2'> Title </th>
                        <th> Price </th>
                        <th> Qty. </th>
                        <th> TC </th>
                      </tr>
                    </thead>

                    <tbody>
                    {order.orderedProductDetails.map((product, index) => 
                      <tr key={index} className='bg-gray-200 dark:bg-gray-800 dark:border-gray-700'> 
                        <td className='p-1 lg:p-2'> {product.title} </td>
                        <td className='p-1 lg:p-2'> {(product.price).toFixed(0)} </td>
                        <td className='p-1 lg:p-2'> {product.count} </td>
                        <td className='p-1 lg:p-2'> {(product.count * product.price).toFixed(0)} </td> 
                      </tr>                      
                      )}
                    </tbody>
                    
                    <tfoot className='bg-gray-200 font-bold text-base text-right border-2 border-gray-100 dark:bg-gray-800 dark:border-2 dark:border-gray-700'>
                      <tr>
                        <td colSpan='4' className='p-3 pr-4'>
                           ${(order.totalPrice).toFixed(0)} 
                        </td>
                      </tr>
                    </tfoot>
              </table>
              </div>
            </div>

           )}
        </div>
      }
      
    </div>
  )
}

export default Orders;
