import { configureStore } from '@reduxjs/toolkit';
import './App.css';
import {  Route, Routes, Link, Router} from 'react-router-dom';
import Home from './Components/Home';
import { Suspense, lazy } from 'react'
const About = lazy(() => import('./Components/About'));
const Branch = lazy(() => import('./Components/Branch'));
const Overheads = lazy(() => import('./Components/air-conditioners/Overheads'));
const Overhead = lazy(() => import('./Components/air-conditioners/Overhead'));
const Login = lazy(() => import('./Components/Login'));
const Register = lazy(() => import('./Components/Register'));

// const myStore = configureStore({
  // reducer:{
  //   tokenSlice
  // }
// })

function App() {
  return (
    <div className="App">

    <Routes>
    <Route path="/" element={<Home />} />
    <Route path='/branch' element={<Suspense fallback="Loading..."><Branch /></Suspense>}></Route>
        <Route path='/about' element={<Suspense fallback="Loading..."><About /></Suspense>}></Route>
        <Route path='/overheads' element={<Suspense fallback="Loading..."><Overheads /></Suspense>}>        </Route>
        <Route path={`/overheads/overhead/:product`} element={<Suspense fallback="Loading..."><Overhead /></Suspense>}></Route>
        <Route path='/login' element={<Suspense fallback="Loading..."><Login /></Suspense>}></Route>
        <Route path='/register' element={<Suspense fallback="Loading..."><Register /></Suspense>}></Route>

  </Routes>
   
        {/* <Home /> */}
      </div>

  );
}

export default App;
