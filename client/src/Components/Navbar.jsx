import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Suspense, lazy } from 'react'
import { Route, Routes, Link, Router } from 'react-router-dom';
import Add_AirConditioner from './air-conditioners/Add_AirConditioner';
import { useSelector } from 'react-redux';
const About = lazy(() => import('./About'));
const Branch = lazy(() => import('./Branch'));
const Overheads = lazy(() => import('./air-conditioners/Overheads'));
const Overhead = lazy(() => import('./air-conditioners/Overhead'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const Basket = lazy(() => import('./Basket'));

const Navbar = ()=>{
  
    const {token} = useSelector((state) => state.token)
    // const userDetalis = JSON.parse(localStorage.getItem('user'));
    // {console.log(userDetalis.username)}

    const items = [

        {
                        // {/* {userDetalis!=null ?userDetalis.role === 'user'?<Button onClick={ ()=>goToAddOverhead("Overhead")}>add overhead</Button>: <></> : <></>} */}
        //    label: token != null ? userDetalis.username : 'התחברות',
            label: 'התחברות',
            icon: 'pi pi-user',
            url: '/login'
        },
        {
            label: 'צור קשר',
            icon: 'pi pi-phone'
        },
        {
            label: 'סניפים',
            icon: 'pi pi-shop',
            url: '/branch'
        },
        {
            label: 'עגלת הקניות',
            icon: 'pi pi-shopping-cart',
            url: '/basket'
        },
        {
            label: 'אודות',
            icon: 'pi pi-question',
            url: '/about'
        },


    ];

    const start = <Link to={"/"}><img alt="logo" src="/air-conditioner.png" height="40" className="mr-2"></img></Link>;
    const end = (
        <div className="flex align-items-center gap-2">
        </div>
    );

    return(
        <>
        <Routes>
                <Route path='/branch' element={<Suspense fallback="Loading..."><Branch /></Suspense>}></Route>
                <Route path='/about' element={<Suspense fallback="Loading..."><About /></Suspense>}></Route>
                <Route path='/overheads' element={<Suspense fallback="Loading..."><Overheads /></Suspense>}>        </Route>
                <Route path={`/overheads/overhead/:product`} element={<Suspense fallback="Loading..."><Overhead /></Suspense>}></Route>
                <Route path='/login' element={<Suspense fallback="Loading..."><Login /></Suspense>}></Route>
                <Route path='/register' element={<Suspense fallback="Loading..."><Register /></Suspense>}></Route>
                <Route path='/overheads/add' element={<Suspense fallback="Loading..."><Add_AirConditioner /></Suspense>}></Route>
                <Route path='/basket' element={<Suspense fallback="Loading..."><Basket/></Suspense>}></Route>

            </Routes>
            <div className="flex align-items-center gap-2">
                <Menubar model={items} start={start} end={end} style={{ position: 'fixed', top: 0 }} />
            </div>
        </>
        
    )
}
export default Navbar