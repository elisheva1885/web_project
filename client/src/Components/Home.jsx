import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../home.module.css'
import { useDispatch, useSelector } from 'react-redux';
import { setOverheads } from '../store/air-conditioner/overHeadsSlice';
import { setCompanies } from '../store/companySlice';


const Home = () => {

    const navigate = useNavigate();
    const {overheads} = useSelector((state) => state.overheads)
    const {companies} = useSelector((state) => state.company)
    const dispatch = useDispatch();

    const AirConditionerTypes = () => {
        const acTypes = [
            { id: 1, name: 'מזגן עילי', imageUrl: '/overheads/back.jpg' },
            { id: 2, name: 'מזגן מיני מרכזי', imageUrl: '/overheads/back.jpg' },
            { id: 3, name: 'מערכת VRF', imageUrl: '/overheads/back.jpg' },
            { id: 4, name: 'מולטי', imageUrl: '/overheads/back.jpg' },
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
                    navigate('/miniVrfs')                    
                    break;
                case 4:
                    navigate('/multis')                    
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
                                onClick={() => goToACDetail(1)}>
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

    const getOverheads = async () => {
        try {
            // const headers = {
            //     'Authorization': `Bearer ${token}`
            // }
            // const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead',{headers})
            const res = await axios.get('http://localhost:8000/api/air-conditioner/overhead')
            if (res.status === 200) {
                // sortData(res.data)
                // setOverheads(res.data)
                dispatch(setOverheads(res.data));
                console.log(overheads);
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
                // console.log("company:",res.data);
                dispatch(setCompanies(res.data))
                // console.log(companies);
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getOverheads()
        getCompanies()
    }, [])

    return (
        <>
            <AirConditionerTypes />
        </>
    )
}

export default Home


