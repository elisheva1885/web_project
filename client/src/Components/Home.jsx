import React from 'react';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import styles from '../home.module.css'


const Home = () => {

    const goToOverhead = () => {
        navigate('/overheads');
    };
    const navigate = useNavigate();

    const AirConditionerTypes = () => {
        const acTypes = [
            { id: 1, name: 'מזגן עילי', imageUrl: '/overheads/back.jpg' },
            { id: 2, name: 'מזגן נייד', imageUrl: '/overheads/back.jpg' },
            { id: 3, name: 'מזגן חלון', imageUrl: '/overheads/back.jpg' },
            { id: 4, name: 'מזגן מרכזי', imageUrl: '/overheads/back.jpg' },
        ];

        const goToACDetail = (id) => {
            // Implement navigation logic here
            goToOverhead()
            console.log(`Navigating to details of AC type ${id}`);
        };
        return (
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
        );
    };

    return (
        <>
            <AirConditionerTypes />
        </>
    )
}

export default Home


