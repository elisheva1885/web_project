import './App.css';
import { Route, Routes, Link, Router } from 'react-router-dom';
import Home from './Components/Home';
import { Suspense, lazy } from 'react'
import Navbar from './Components/Navbar';
import BasketPayment from './Components/Payment';
import SideBasket from './Components/Payment';
const About = lazy(() => import('./Components/About'));
const Branch = lazy(() => import('./Components/Branch'));
const Overheads = lazy(() => import('./Components/air-conditioners/Overheads'));
const Overhead = lazy(() => import('./Components/air-conditioners/Overhead'));
const Login = lazy(() => import('./Components/Login'));
const Register = lazy(() => import('./Components/Register'));



function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
