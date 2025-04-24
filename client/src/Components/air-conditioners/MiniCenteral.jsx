import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

const MiniCenteral = () => {
    const { product } = useParams();
    const stepperRef = useRef(null);
    const [miniCenteral, setMiniCenteral] = useState(null);

    const getMiniCenteralById = async (_id) => {
        try {
            console.log(_id);
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/miniCenterals/miniCenteral/${_id}`);
            if (res.status === 200) {
                setMiniCenteral(res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };
    const Row = ({ label, value }) => (
        <tr className="border-b">
            <td className="p-2 font-semibold">{label}</td>
            <td className="p-2">{value}</td>
        </tr>
    );
    
    const Feature = ({ label, value, isBoolean = true }) => (
        <tr className="border-b">
            <td className="p-2 font-semibold">{label}</td>
            <td className="p-2">
                {isBoolean ? (value ? <span className="text-green-500 pi pi-check" /> : <span className="text-red-500 pi pi-times" />) : value}
            </td>
        </tr>
    );

    useEffect(() => {
        console.log(product);
        getMiniCenteralById(product);
    }, [product]);

    if (!miniCenteral) return <p>Loading...</p>;

    return (
        <div className="p-4 md:p-6 lg:p-8 bg-white surface-card text-gray-800">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center md:items-start gap-4">
                    <img className="w-full max-w-md rounded-xl shadow-2" src={`/miniCenterals/${miniCenteral.imagepath}`} alt="product" />
                    <img className="w-28" src={`/${miniCenteral.company?.imagePath}`} alt="brand" />
                </div>

                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl font-bold text-primary">{miniCenteral.title}</h1>
                    <p className="text-lg text-gray-600">{miniCenteral.describe}</p>
                    <Divider />
                    <div className="flex items-center gap-2">
                        <img src="/BTU_cool.png" alt="cool" className="w-6 h-6" />
                        <img src="/BTU_heat.png" alt="heat" className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-semibold text-green-700">₪{miniCenteral.price}</h2>

                    <Button label="הוספה לסל" icon="pi pi-shopping-cart" className="w-fit mt-4" severity="primary" />
                </div>
            </div>

            <Divider className="my-6" />

            <div className="card">
                <Stepper ref={stepperRef} style={{ direction: 'rtl' }}>
                    <StepperPanel header="תפוקה ונתונים טכניים">
                        <table className="w-full text-right border-collapse">
                            <tbody>
                                <Row label="תפוקת קירור (BTU)" value={miniCenteral.BTU_output?.cool} />
                                <Row label="תפוקת חימום (BTU)" value={miniCenteral.BTU_output?.heat} />
                                <Row label="דירוג אנרגטי קירור" value={miniCenteral.energy_rating?.cool} />
                                <Row label="דירוג אנרגטי חימום" value={miniCenteral.energy_rating?.heat} />
                                <Row label="זרם עבודה קירור" value={miniCenteral.working_current?.cool} />
                                <Row label="זרם עבודה חימום" value={miniCenteral.working_current?.heat} />
                                <Row label="קוטר חיבור צנרת א" value={miniCenteral.pipe_connection?.a} />
                                <Row label="קוטר חיבור צנרת ב" value={miniCenteral.pipe_connection?.b} />
                                <Row label="מידות פנימיות" value={`${miniCenteral.in_size?.width} x ${miniCenteral.in_size?.depth} x ${miniCenteral.in_size?.height}`} />
                                <Row label="מידות חיצוניות" value={`${miniCenteral.out_size?.width} x ${miniCenteral.out_size?.depth} x ${miniCenteral.out_size?.height}`} />
                                <Row label="זרימת אוויר" value={miniCenteral.air_flow} />
                            </tbody>
                        </table>
                    </StepperPanel>

                    <StepperPanel header="מאפיינים">
                        <table className="w-full text-right border-collapse">
                            <tbody>
                                <Feature label="מצב שקט" value={miniCenteral.quiet} />
                                <Feature label="WiFi" value={miniCenteral.wifi} />
                                <Feature label="מהירויות" value={miniCenteral.speeds} isBoolean={false} />
                                <Feature label="תלת מימד" value={miniCenteral.air4d} />
                                <Feature label="מצב לילה" value={miniCenteral.night_mode} />
                                <Feature label="טיימר" value={miniCenteral.timer} />
                                <Feature label="פיקוד שבת" value={miniCenteral.sabbath_command} />
                                <Feature label="הדלקה וכיבוי אוטומטיים" value={miniCenteral.onof_auto} />
                            </tbody>
                        </table>
                    </StepperPanel>
                </Stepper>
            </div>
        </div>
    );
};



export default MiniCenteral;
