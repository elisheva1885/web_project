import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar'; 
import { Suspense, lazy } from 'react'
import {  Route, Routes, Link, Router} from 'react-router-dom';
const About = lazy(() => import('./About'));
const Branch = lazy(() => import('./Branch'));
const Overheads = lazy(() => import('./air-conditioners/Overheads'));
const Overhead = lazy(() => import('./air-conditioners/Overhead'));


const Home = ()=> {
    // const itemRenderer = (item) => (
    //     <a className="flex align-items-center p-menuitem-link">
    //         <span className={item.icon} />
    //         <span className="mx-2">{item.label}</span>
    //         {item.badge && <Badge className="ml-auto" value={item.badge} />}
    //         {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
    //     </a>
    // );
    const items = [

        {
            label: 'התחברות',
            icon: 'pi pi-user'
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
            url: '/overheads'
        },
        // {
        //     label: 'חיפוש',
        //     icon: 'pi pi-search'
        // },
        {
            label: 'אודות',
            icon: 'pi pi-question',
            url: '/about'
        },

    ];

    const start = <Link to={"/"}><img alt="logo" src="air-conditioner.png" height="40" className="mr-2"></img></Link>;
    const end = (
        <div className="flex align-items-center gap-2">
            {/* <Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" /> */}
        </div>
    );

    return (
        <>
        <Routes>
        <Route path='/branch' element={<Suspense fallback="Loading..."><Branch /></Suspense>}></Route>
        <Route path='/about' element={<Suspense fallback="Loading..."><About /></Suspense>}></Route>
        <Route path='/overheads' element={<Suspense fallback="Loading..."><Overheads /></Suspense>}>        </Route>
        <Route path='/overheads/overhead' element={<Suspense fallback="Loading..."><Overhead /></Suspense>}></Route>

    </Routes>
        <div className="card">
            <Menubar model={items} start={start} end={end} style={{ position: 'fixed', top: 0}}/>
        </div>
        </>
    )
}

export default Home