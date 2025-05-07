import './App.css';
import { Route, Routes, Link, Router } from 'react-router-dom';
import Home from './Components/Home';
import { Suspense, lazy, useEffect } from 'react'
import Navbar from './Components/Navbar';
import BasketPayment from './Components/Payment';
import SideBasket from './Components/Payment';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCompanies } from './store/companySlice';
import { setMiniCenterals } from './store/air-conditioner/miniCenteralsSlice';
import { setMultiOutdoorUnits } from './store/air-conditioner/multiOutdoorUnitsSlice';
import { setMultiIndoorUnits } from './store/air-conditioner/multiIndoorUnitsSlice';
import { setOverheads } from './store/air-conditioner/overHeadsSlice';
import { setBasket } from './store/basketSlice';
const About = lazy(() => import('./Components/About'));
const Branch = lazy(() => import('./Components/Branch'));
const Overheads = lazy(() => import('./Components/air-conditioners/Overheads'));
const Overhead = lazy(() => import('./Components/air-conditioners/Overhead'));
const Login = lazy(() => import('./Components/Login'));
const Register = lazy(() => import('./Components/Register'));



function App() {
  const {overheads} = useSelector((state) => state.overheads)
    const {miniCenterals} = useSelector((state) => state.miniCenterals)
    const {token} = useSelector((state) => state.token)
    const dispatch = useDispatch();
    const getOverheads = async () => {
      try {
          // const headers = {
          //     'Authorization': `Bearer ${token}`
          // }
          // const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead',{headers})
          const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead')
          if (res.status === 200) {
              dispatch(setOverheads(res.data));
            //   console.log(overheads);
          }
      }
      catch (e) {
          console.error(e)
      }
  }

  const getMultiIndoorUnit = async () => {
      try {
          const res = await axios.get('http://localhost:8000/api/air-conditioner/multiIndoorUnit')
          if (res.status === 200) {
              dispatch(setMultiIndoorUnits(res.data));
              // console.log(overheads);
          }
      }
      catch (e) {
          console.error(e)
      }
  }

  const getMultiOutdoorUnit = async () => {
      try {
          const res = await axios.get('http://localhost:8000/api/air-conditioner/multiOutdoorUnit')
          if (res.status === 200) {
              dispatch(setMultiOutdoorUnits(res.data));
              // console.log(overheads);
          }
      }
      catch (e) {
          console.error(e)
      }
  }

  const getMiniCenterals = async () => {
      try {
          // const headers = {
          //     'Authorization': `Bearer ${token}`
          // }
          // const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead',{headers})
          const res = await axios.get('http://localhost:8000/api/air-conditioner/miniCenteral')
          if (res.status === 200) {
              dispatch(setMiniCenterals(res.data));
            //   console.log(miniCenterals);
          }
      }
      catch (e) {
          console.error(e)
      }
  }


  const getCompanies = async()=>{
      try{
          const res = await axios.get('http://localhost:8000/api/company')
          if(res.status === 200){
            //   console.log("in getCompanies");
              dispatch(setCompanies(res.data))
          }
      }
      catch (e) {
          console.error(e)
      }
  }

  useEffect(() => {
      getOverheads()
      getCompanies()
      getMiniCenterals()
      getMultiIndoorUnit()
      getMultiOutdoorUnit()
  }, [])

  
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
