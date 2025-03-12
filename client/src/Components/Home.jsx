import React from 'react';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';

const Home = () => {

    const goToOverhead = () => {
        navigate('/overheads');
      };
      const navigate = useNavigate();


    return (
        <>
            <div className="flex justify-center items-center p-4">
                <div
                    className="w-[300px] h-[300px] h-190 rounded-lg shadow-lg bg-cover bg-center flex items-end"
                    style={{ backgroundImage: "url('/overheads/back.jpg')" }}>
                    {/* מסגרת הכרטיס ללא רקע */}
                    <Card className="bg-transparent border-none shadow-none" style={{ width: '30vw', height: '30vh' }} onClick={goToOverhead}>
                        <div className="w-full text-center text-white text-2xl font-bold bg-black/50 p-4 rounded-b-lg">
                            מזגנים עיליים
                        </div>
                    </Card>

                </div>
            </div>
        </>
    )
}

export default Home


