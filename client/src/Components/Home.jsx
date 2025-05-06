import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../home.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setOverheads } from '../store/air-conditioner/overHeadsSlice';
import { setCompanies } from '../store/companySlice';
import { setMiniCenterals } from '../store/air-conditioner/miniCenteralsSlice';
import { setMultiIndoorUnits } from '../store/air-conditioner/multiIndoorUnitsSlice';
import { setBasket } from '../store/basketSlice';
import { setMultiOutdoorUnits } from '../store/air-conditioner/multiOutdoorUnitsSlice';


const Home = () => {

    const navigate = useNavigate();
    const {overheads} = useSelector((state) => state.overheads)
    const {miniCenterals} = useSelector((state) => state.miniCenterals)
    const {token} = useSelector((state) => state.token)
    const {companies} = useSelector((state) => state.companies)
    const {userDetails} = useSelector((state) => state.userDetails);
    const {basket} = useSelector((state) => state.basket);
    console.log("HomeBasket",basket);
    const dispatch = useDispatch();
    // console.log("userDetails",userDetails.username)
    const AirConditionerTypes = () => {
        const acTypes = [
            { id: 1, name: 'מזגן עילי', imageUrl: '/overheads/overhead-room.jpg' },
            { id: 2, name: 'מזגן מיני מרכזי', imageUrl: '/overheads/central.png' },
            { id: 3, name: 'מעבי מולטי', imageUrl: '/overheads/mm.jpg' },
            { id: 4, name: 'מאייד מולטי' , imageUrl: '/overheads/uu.jpeg' },
        ];

        const goToACDetail = (id) => {
            switch (id) {
                case 1:
                    navigate('/overheads')
                    break;
                case 2:
                    navigate('/miniCenterals')                    
                    break;
                case 3:
                    navigate('/multiOutdoorUnits')                    
                    break;
                case 4:
                    navigate('/multiIndoorUnits')                    
                    break;
                default:
                    break;
            }
            console.log(`Navigating to details of AC type ${id}`);
        };
        return (
            <>
                <div className={styles.grid}>
                    {acTypes.map(ac => (
                        <div key={ac.id} className="flex justify-center items-center p-4">
                            <div className={styles.cardContainer}
                                style={{ backgroundImage: `url(${ac.imageUrl})` }}
                                onClick={() => goToACDetail(ac.id)}>
                                <div className={styles.imageOverlay}></div> {/* Overlay for background effect */}
                                <div className={styles.cardContent}>
                                    <div className="text-2xl font-bold">
                                        {ac.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    };

    // const getOverheads = async () => {
    //     try {
    //         // const headers = {
    //         //     'Authorization': `Bearer ${token}`
    //         // }
    //         // const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead',{headers})
    //         const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead')
    //         if (res.status === 200) {
    //             dispatch(setOverheads(res.data));
    //             console.log(overheads);
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }


    // const getShoppingBag = async () => {
    //     try {
    //         const headers = {
    //             'Authorization': `Bearer ${token}`
    //         }
    //         const res = await axios.get('http://localhost:8000/api/user/shoppingBag', { headers })
    //         if (res.status === 200) {
    //             console.log("res.data ",res.data);
    //             dispatch(setBasket(res.data))
    //             // setShoppingBags(res.data)
    //             // console.log("res.data", res.data);
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }

    // const getMultiIndoorUnit = async () => {
    //     try {
    //         const res = await axios.get('http://localhost:8000/api/air-conditioner/multiIndoorUnit')
    //         if (res.status === 200) {
    //             dispatch(setMultiIndoorUnits(res.data));
    //             // console.log(overheads);
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }

    // const getMultiOutdoorUnit = async () => {
    //     try {
    //         const res = await axios.get('http://localhost:8000/api/air-conditioner/multiOutdoorUnit')
    //         if (res.status === 200) {
    //             dispatch(setMultiOutdoorUnits(res.data));
    //             // console.log(overheads);
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }

    // const getMiniCenterals = async () => {
    //     try {
    //         // const headers = {
    //         //     'Authorization': `Bearer ${token}`
    //         // }
    //         // const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead',{headers})
    //         const res = await axios.get('http://localhost:8000/api/air-conditioner/miniCenteral')
    //         if (res.status === 200) {
    //             dispatch(setMiniCenterals(res.data));
    //             console.log(miniCenterals);
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }


    // const getCompanies = async()=>{
    //     try{
    //         const res = await axios.get('http://localhost:8000/api/company')
    //         if(res.status === 200){
    //             console.log("in getCompanies");
    //             dispatch(setCompanies(res.data))
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }

    // useEffect(() => {
    //     getOverheads()
    //     getCompanies()
    //     getMiniCenterals()
    //     getMultiIndoorUnit()
    //     getShoppingBag()
    //     getMultiOutdoorUnit()
    // }, [])

    return (
        <>
                <div style={{ paddingTop: '60px' }}>
            <AirConditionerTypes />
                    </div>
        </>
    );
}

export default Home

