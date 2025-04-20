import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Suspense, lazy } from 'react'
import { Route, Routes, Link, Router } from 'react-router-dom';
import Add_AirConditioner from './air-conditioners/Add_AirConditioner';
import { useSelector } from 'react-redux';
import { MegaMenu } from 'primereact/megamenu';
import AdminRegister from './AdminRegister';
import Payment from './Payment';

const About = lazy(() => import('./About'));
const Branch = lazy(() => import('./Branch'));
const Overheads = lazy(() => import('./air-conditioners/Overheads'));
const Overhead = lazy(() => import('./air-conditioners/Overhead'));
const Login = lazy(() => import('./Login'));
const Register = lazy(() => import('./Register'));
const Basket = lazy(() => import('./Basket'));
const UpdateBranch = lazy(() => import('./UpdateBranch'));
const AddBranch = lazy(() => import('./AddBranch'));
const Admin = lazy(() => import('./Admin'));
const UserAccont = lazy(() => import('./UserAccont'));

const Navbar = () => {

    const { token } = useSelector((state) => state.token)

    const {userDetails} = useSelector((state) => state.userDetails);
    console.log("userDetails Navbar",userDetails)
    console.log("token Navbar",token)

    const acItems = [
        {
            label: 'מזגן עילי',
            items: [{ label: 'Details for Overhead AC' }], // You can customize this
        },
        {
            label: 'מזגן נייד',
            items: [{ label: 'Details for Mobile AC' }],
        },
        {
            label: 'מזגן חלון',
            items: [{ label: 'Details for Window AC' }],
        },
        {
            label: 'מזגן מרכזי',
            items: [{ label: 'Details for Central AC' }],
        },
    ];

    const menuItems = [
        {
            label: 'AC Types',
            icon: 'pi pi-desktop',
            items: [
                [
                    ...acItems,
                ],
            ],
        },
    ];

    const items = [

        {
            // {/* {userDetalis!=null ?userDetalis.role === 'user'?<Button onClick={ ()=>goToAddOverhead("Overhead")}>add overhead</Button>: <></> : <></>} */}
            // label: token != null ?'התנתקות' : 'התחברות',
            label:userDetails?.username? userDetails?.username:'התחברות',
            icon: 'pi pi-user',
            url: userDetails?.username? '/userAccount': '/login'
        }
        ,
        {
            label: 'צור קשר',
            icon: 'pi pi-phone',
            url: '/overheads'
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
        }
        ,
        {
           label:userDetails?.role==='admin'? 'לאתר הניהול':'',
           icon: userDetails?.role==='admin'?<img src="admin.png" style={{ width: '24px', height: '24px' }} />:'' ,
           url: userDetails?.role==='admin'?'/admin' :'/'
        }


    ];
    const [hoverMenuVisible, setHoverMenuVisible] = useState(false);

    const start = (
        <Link to={"/"}
            onMouseEnter={() => setHoverMenuVisible(true)}
            onMouseLeave={() => setHoverMenuVisible(false)}>
            <img alt="logo" src="/air-conditioner.png" height="40" className="mr-2" />
        </Link>
    )
    const end = (
        <div className="flex align-items-center gap-2">
        </div>
    );

    return (
        <>
                <div style={{ paddingTop: '60px' }}>

            <Routes>
                <Route path='/branch' element={<Suspense fallback="Loading..."><Branch /></Suspense>}></Route>
                <Route path='/branch/add' element={<Suspense fallback="Loading..."><AddBranch/></Suspense>}></Route>
                <Route path='/branch/update' element={<Suspense fallback="Loading..."><UpdateBranch/></Suspense>}></Route>
                <Route path='/about' element={<Suspense fallback="Loading..."><About /></Suspense>}></Route>
                <Route path='/overheads' element={<Suspense fallback="Loading..."><Overheads /></Suspense>}>        </Route>
                <Route path={`/overheads/overhead/:product`} element={<Suspense fallback="Loading..."><Overhead /></Suspense>}></Route>
                <Route path='/login' element={<Suspense fallback="Loading..."><Login /></Suspense>}></Route>
                <Route path='/register' element={<Suspense fallback="Loading..."><Register /></Suspense>}></Route>
                <Route path='/overheads/add' element={<Suspense fallback="Loading..."><Add_AirConditioner /></Suspense>}></Route>
                <Route path='/basket' element={<Suspense fallback="Loading..."><Basket /></Suspense>}></Route>
                <Route path='/admin' element={<Suspense fallback="Loading..."><Admin/></Suspense>}></Route>
                <Route path='/userAccount' element={<Suspense fallback="Loading..."><UserAccont/></Suspense>}></Route>
                <Route path='/admin/register' element={<Suspense fallback="Loading..."><AdminRegister/></Suspense>}></Route>
                <Route path='/basket/Payment' element={<Suspense fallback="Loading..."><Payment/></Suspense>}></Route>
            </Routes>
            <div className="flex align-items-center gap-2">
                <Menubar model={items} start={start} end={end} style={{ position: 'fixed', top: 0 }} />
                {hoverMenuVisible && (
                    <div  onMouseEnter={() => setHoverMenuVisible(true)} onMouseLeave={() => setHoverMenuVisible(false)}>
                        <MegaMenu model={acItems} orientation="vertical" breakpoint="960px" />
                    </div>
                )}
            </div>
            </div>
        </>

    )
}
export default Navbar