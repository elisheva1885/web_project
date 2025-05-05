import React, { useState } from 'react';
import { Menubar } from 'primereact/menubar';
import { Suspense, lazy } from 'react'
import { Route, Routes, Link, Router, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MegaMenu } from 'primereact/megamenu';
import AdminRegister from './AdminRegister';
import Payment from './Payment';
import MiniCenteral from './air-conditioners/MiniCenteral';
import UpdateUserDetails from './UpdateUserDetails';


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
const AdminOrders = lazy(() => import('./AdminOrders'));
const Official = lazy(() => import('./Official'));
const UserAcount = lazy(() => import('./UserAcount'));
const MiniCenterals = lazy(() => import('./air-conditioners/MiniCentrals'));
const Add_AirConditioner = lazy(() => import('./air-conditioners/Add_AirConditioner'));
const UpdateOverheadAC = lazy(() => import('./air-conditioners/updateOvearhead'));
const UpdateMiniCenteral = lazy(() => import('./air-conditioners/UpdateMiniCenteral'));
const MultiIndoorUnits = lazy(() => import('./air-conditioners/MultiIndoorUnits'));
const MultiIndoorUnit = lazy(() => import('./air-conditioners/MultiInDoorUnit'));
const MultiOutdoorUnits = lazy(() => import('./air-conditioners/MultiOutdoorUnits'));
const MultiOutdoorUnit = lazy(() => import('./air-conditioners/MultiOutdoorUnit'));
const UpdateMultiIndoorUnit = lazy(() => import('./air-conditioners/UpdateMultiIndoorUnit'));
const UpdateMultiOutdoorUnit = lazy(() => import('./air-conditioners/UpdateMultiOutdoorUnit'));
const AddCompany = lazy(() => import('./air-conditioners/AddCompany'));
const UpdateDeliveryStatus = lazy(() => import('./UpdateDeliveryStatus'));

const Navbar = () => {

    const { token } = useSelector((state) => state.token)

    const {userDetails} = useSelector((state) => state.userDetails);
    console.log("userDetails Navbar",userDetails)
    console.log("token Navbar",token)
    const navigate = useNavigate();

    const acItems = [
        {
            label: 'מזגן עילי',
            // items: [{ label: 'Details for Overhead AC' }],
            command: () => navigate('/overheads'),
        },
        {
            label: 'מזגן מיני מרכזי',
            // items: [{ label: 'Details for Mobile AC' }],
            command: () => navigate('/miniCenterals'),
        },
        {
            label: 'מאייד מולטי',
            // items: [{ label: 'Details for Window AC' }],
            command: () => navigate('/multiInDoorUnits'),
        },
        {
            label: 'מעבה מולטי',
            // items: [{ label: 'Details for Central AC' }],
            command: () => navigate('/multiOutDoorUnits'),
        },
    ];

    const items = [

        {
            // {/* {userDetalis!=null ?userDetalis.role === 'user'?<Button onClick={ ()=>goToAddOverhead("Overhead")}>add overhead</Button>: <></> : <></>} */}
            // label: token != null ?'התנתקות' : 'התחברות',
            label: userDetails?.username ? userDetails?.username : 'התחברות',
            icon: 'pi pi-user',
            url: userDetails?.username? '/userAcount': '/login'
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
        },
        {
           label:userDetails?.role==='admin' || userDetails?.role==='official'? '':'',
           icon: userDetails?.role==='admin' || userDetails?.role==='official'?<img src="desk.png" style={{ width: '24px', height: '24px' }} />:'' ,
           url: userDetails?.role==='admin' || userDetails?.role==='official'?'/official' :'/'
        },
        {
            label: userDetails?.role === 'admin' ? 'לאתר הניהול' : '',
            icon: userDetails?.role === 'admin' ? <img src="admin.png" style={{ width: '24px', height: '24px' }} /> : '',
            url: userDetails?.role === 'admin' ? '/admin' : '/'
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
                <Route path='/branch/add' element={<Suspense fallback="Loading..."><AddBranch /></Suspense>}></Route>
                <Route path='/branch/update' element={<Suspense fallback="Loading..."><UpdateBranch /></Suspense>}></Route>
                <Route path='/about' element={<Suspense fallback="Loading..."><About /></Suspense>}></Route>
                <Route path='/overheads' element={<Suspense fallback="Loading..."><Overheads /></Suspense>}>        </Route>
                <Route path='/miniCenterals' element={<Suspense fallback="Loading..."><MiniCenterals /></Suspense>}>        </Route>
                <Route path='/multiIndoorUnits' element={<Suspense fallback="Loading..."><MultiIndoorUnits /></Suspense>}>        </Route>
                <Route path='/multiOutdoorUnits' element={<Suspense fallback="Loading..."><MultiOutdoorUnits /></Suspense>}>        </Route>
                <Route path={`/overheads/overhead/:product`} element={<Suspense fallback="Loading..."><Overhead /></Suspense>}></Route>
                <Route path={`/miniCenterals/miniCenteral/:product`} element={<Suspense fallback="Loading..."><MiniCenteral /></Suspense>}></Route>
                <Route path={`/multiOutdoorUnits/multiOutdoorUnit/:product`} element={<Suspense fallback="Loading..."><MultiOutdoorUnit /></Suspense>}></Route>
                <Route path={`/multiIndoorUnits/multiIndoorUnit/:product`} element={<Suspense fallback="Loading..."><MultiIndoorUnit /></Suspense>}></Route>
                <Route path='/multiIndoorUnits/multiIndoorUnit/update' element={<Suspense fallback="Loading..."><UpdateMultiIndoorUnit/></Suspense>}></Route>
                <Route path='/overheads/overhead/update' element={<Suspense fallback="Loading..."><UpdateOverheadAC/></Suspense>}></Route>
                <Route path='/multiOutdoorUnits/multiOutdoorUnit/update' element={<Suspense fallback="Loading..."><UpdateMultiOutdoorUnit/></Suspense>}></Route>
                <Route path='/miniCenterals/miniCenteral/update' element={<Suspense fallback="Loading..."><UpdateMiniCenteral/></Suspense>}></Route>
                <Route path='/login' element={<Suspense fallback="Loading..."><Login /></Suspense>}></Route>
                <Route path='/register' element={<Suspense fallback="Loading..."><Register /></Suspense>}></Route>
                <Route path='/air_conditioner/add' element={<Suspense fallback="Loading..."><Add_AirConditioner/></Suspense>}></Route>
                <Route path='/basket' element={<Suspense fallback="Loading..."><Basket /></Suspense>}></Route>
                <Route path='/admin' element={<Suspense fallback="Loading..."><Admin/></Suspense>}></Route>
                <Route path='/official' element={<Suspense fallback="Loading..."><Official/></Suspense>}></Route>
                <Route path='/userAcount' element={<Suspense fallback="Loading..."><UserAcount/></Suspense>}></Route>
                <Route path='/userAcount/UpdateDetails' element={<Suspense fallback="Loading..."><UpdateUserDetails/></Suspense>}></Route>
                <Route path='/admin/orders' element={<Suspense fallback="Loading..."><AdminOrders/></Suspense>}></Route>
                <Route path='/official/updateDeliveryStatus' element={<Suspense fallback="Loading..."><UpdateDeliveryStatus/></Suspense>}></Route>
                <Route path='/official/addCompany' element={<Suspense fallback="Loading..."><AddCompany/></Suspense>}></Route>
                <Route path='/admin/registerOfficial' element={<Suspense fallback="Loading..."><AdminRegister/></Suspense>}></Route>
                <Route path='/basket/Payment' element={<Suspense fallback="Loading..."><Payment/></Suspense>}></Route>
            </Routes>
            <div className="flex align-items-center gap-2">
                <div style={{ position: "relative" }}
                    >

                    <Menubar model={items} start={start} end={end} style={{ position: "fixed", top: 0, width: "100%", zIndex: 999 }} />

                    {hoverMenuVisible && (
                        <div
                            onMouseEnter={() => setHoverMenuVisible(true)}
                            onMouseLeave={() => setHoverMenuVisible(false)}
                            style={{
                                position: "fixed",
                                top: "50px",  // Ensures it appears just below the navbar
                                left: "22px", // Adjust this if necessary
                                width: "auto", // Prevents it from taking full width
                                minWidth: "80px", // Adjust based on the menu size
                                zIndex: 1000,
                                background: "white",
                                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                                borderRadius: "4px",
                                overflow: "visible"
                            }}
                        >
                            <MegaMenu model={acItems} orientation="vertical" breakpoint="960px" />
                        </div>
                    )}
                </div>
            </div>
            </div>
        </>

    )
}
export default Navbar
