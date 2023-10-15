import { useEffect } from 'react';
import { RouterProvider, createBrowserRouter} from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { authentication, userSelector } from './redux/reducers/userReducer';
import { fetchDataAsync } from './redux/reducers/productReducer';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import SignInForm from "./components/FormPages/SignInForm";
import SignUpForm from "./components/FormPages/SignUpForm";
import ErrorElement from './components/ErrorElement';


function App() {
  const user = useSelector(userSelector);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchDataAsync());
    dispatch(authentication());
  }, [])
  
  const router = createBrowserRouter([
    {path: '/', element: <Navbar />, errorElement: <ErrorElement />,
      children:[
      {index: true, element: <Home />},
      {path:'/cart', element: user===null? <Home/> : <Cart/> },
      {path:'/orders', element: user===null? <Home/> : <Orders/> },
      {path:'/signin', element: <SignInForm/>},
      {path:'/signup', element: <SignUpForm/>}
    ]},
  ]);

  return (
    <>
      <RouterProvider router={router}/>
      <ToastContainer theme="dark" autoClose={2000}/>
    </>
  );
}

export default App;
