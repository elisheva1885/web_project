// import { useLocation, useParams } from 'react-router-dom';
// import { useState, useEffect} from 'react'
// import axios from 'axios'
// import { Stepper } from 'primereact/stepper';
// import { StepperPanel } from 'primereact/stepperpanel';
// import { Button } from 'primereact/button';
// import React, { useRef } from "react";
// import { DataTable } from 'primereact/datatable';
// //          

// const miniCenteral = () => {
//     const {product} =  useParams();
//     const stepperRef = useRef(null);
//     const [miniCenteral, setminiCenteral] = useState([])
//     const [products, setProducts] = useState([]);

//     const getminiCenteralById = async (_id) => {
//         try {
//             console.log(_id);
//             const res = await axios.get(`http://localhost:8000/api/air-conditioner/miniCenteral/miniCenteral/${_id}`)
//             if (res.status === 200) {
//                 setminiCenteral(res.data)
//                 console.log(res.data);
//             }
            
//         }
//         catch (e) {
//             console.error(e)
//         }
//     }

//     const details = {
//         // "sku": "309666",
//         "מותג":miniCenteral?.company?.name,
//         "כולל מצב שבת": miniCenteral.sabbath_command? "✔": "X",
//         "תפוקת קירור (BTU)": miniCenteral?.BTU_output?.cool,
//         "תפוקת חימום (BTU)": miniCenteral?.BTU_output?.heat,
//         // "מדחס אינוורטר": "כולל",
//         "דירוג אנרגטי קירור":  miniCenteral?.energy_rating?.cool,
//         "דירוג אנרגטי חימום":  miniCenteral?.energy_rating?.cool,
//         "הספק יעילות בקירור (COP)": miniCenteral?.working_current?.cool,
//         "הספק יעילות בחימום (COP)": miniCenteral?.working_current?.heat,
//         "דגם": miniCenteral.title,
//         // "תקופת אחריות": "שלוש שנות אחריות",
//         "טכנולוגיות Wi-Fi": miniCenteral.wifi? "✔": "X"
//     };

//     const coolRating = miniCenteral?.energy_rating?.cool;
//     console.log(coolRating);    

//     useEffect(() => {
//         getminiCenteralById(product);
//     }, [])

    
//     // useEffect(() => {
//     //     ProductService.getProductsMini().then(data => setProducts(data));
//     // }, []);

//     return (
//         <>
//         <br/><br/><br/><br/>
//          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${miniCenteral?.company?.imagePath}`} />
//          <h1>{miniCenteral.title}</h1>
//          {console.log(miniCenteral)}
//                 <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/miniCenterals/${miniCenteral.imagepath}`} />
//                 <h3>{miniCenteral.describe}</h3>          
//                 <h4>{miniCenteral.price}</h4>
//         <div className="card flex justify-content-center">
//             <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
//                 <StepperPanel header="מידע">
//                     <div className="flex flex-column h-12rem">
//                         {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content I</div> */}

//                     </div>
//                     <div className="flex pt-4 justify-content-end">
//                         <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
//                     </div>
//                 </StepperPanel>
//                 <StepperPanel header="מפרט טכני">
//                     <div className="flex flex-column h-12rem">
//                         {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}
//                         <div className="card">
//                             <table  tableStyle={{ minWidth: '50rem' }}>
//                                 {Object.entries(details).map(([key,value])=> (
//                                <tr>
//                                 <td>
//                                     {key}:
//                                 </td>
//                                 <td>
//                                     {value}
//                                 </td>
//                                </tr>
//                                 ))}
//                             </table>
//                         </div>

//                         </div>
//                     {/* </div> */}
//                     <div className="flex pt-4 justify-content-between">
//                         <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
//                         <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
//                     </div>
//                 </StepperPanel>
//                 <StepperPanel header="Header III">
//                     <div className="flex flex-column h-12rem">
//                         <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
//                     </div>
//                     <div className="flex pt-4 justify-content-start">
//                         <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
//                     </div>
//                 </StepperPanel>
//             </Stepper>
//         </div>

        
//         </>
//     )
// }
// export default miniCenteral

// //מפרט טכני:
// //react stepper component




// import { useParams } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Stepper } from 'primereact/stepper';
// import { StepperPanel } from 'primereact/stepperpanel';
// import { Button } from 'primereact/button';

// const miniCenteral = () => {
//     const { product } = useParams();
//     const stepperRef = useRef(null);
//     const [miniCenteral, setminiCenteral] = useState(null);

//     const getminiCenteralById = async (_id) => {
//         try {
//             const res = await axios.get(`http://localhost:8000/api/air-conditioner/miniCenteral/miniCenteral/${_id}`);
//             if (res.status === 200) {
//                 setminiCenteral(res.data);
//                 console.log(res.data, miniCenteral)
//             }
//         } catch (e) {
//             console.error(e);
//         }
//     };
//     useEffect(() => {
        
//         getminiCenteralById(product);
//     }, [product]);

//     if (!miniCenteral) return <p>Loading...</p>;

//     return (
//         <>
//             <br/><br/><br/><br/>
//             <img className="w-40rem shadow-2 border-round" src={`/miniCenterals/${miniCenteral.imagepath}`} alt="product" />
//             <div className="flex flex-column gap-3">
//                 <img className="w-10rem shadow-2 border-round" src={`/${miniCenteral.company?.imagePath}`} alt="brand" />
//                 <h1>{miniCenteral.title}</h1>
//                 <h3>{miniCenteral.describe}</h3>
//                 <h4 className="text-2xl font-bold text-primary">₪{miniCenteral.price}</h4>
//             </div>
//             {/* <i className="pi pi-star" style={{ color: 'slateblue' }}></i> */}
//             <img src="/BTU_heat.png" style={{ width: '24px', height: '24px' }} />
//             <img src="/BTU_cool.png" style={{ width: '24px', height: '24px' }} />

//             <div className="card flex justify-content-center">
//                 <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
//                     <StepperPanel header="תפוקה ונתונים טכניים">
//                         <table>
//                             <tbody>
//                                 <tr><td>תפוקת קירור (BTU):</td><td>{miniCenteral.BTU_output?.cool}</td></tr>
//                                 <tr><td>תפוקת חימום (BTU):</td><td>{miniCenteral.BTU_output?.heat}</td></tr>
//                                 <tr><td>דירוג אנרגטי קירור:</td><td>{miniCenteral.energy_rating?.cool}</td></tr>
//                                 <tr><td>דירוג אנרגטי חימום:</td><td>{miniCenteral.energy_rating?.heat}</td></tr>
//                                 <tr><td>זרם עבודה קירור:</td><td>{miniCenteral.working_current?.cool}</td></tr>
//                                 <tr><td>זרם עבודה חימום:</td><td>{miniCenteral.working_current?.heat}</td></tr>
//                                 <tr><td>קוטר חיבור צנרת א:</td><td>{miniCenteral.pipe_connection?.a}</td></tr>
//                                 <tr><td>קוטר חיבור צנרת ב:</td><td>{miniCenteral.pipe_connection?.b}</td></tr>
//                                 <tr><td>מידות פנימיות (רוחב x עומק x גובה):</td><td>{`${miniCenteral.in_size?.width} x ${miniCenteral.in_size?.depth} x ${miniCenteral.in_size?.height}`}</td></tr>
//                                 <tr><td>מידות חיצוניות (רוחב x עומק x גובה):</td><td>{`${miniCenteral.out_size?.width} x ${miniCenteral.out_size?.depth} x ${miniCenteral.out_size?.height}`}</td></tr>
//                                 <tr><td>זרימת אוויר:</td><td>{miniCenteral.air_flow}</td></tr>
//                                 {/* <tr><td>שיטת התקנה מומלצת:</td><td>{miniCenteral.recommended_method}</td></tr> */}
//                             </tbody>
//                         </table>
//                     </StepperPanel>
//                     {/* <StepperPanel header="מידות וחיבורים">
//                         <table>
//                             <tbody>
                                
//                             </tbody>
//                         </table>
//                     </StepperPanel> */}
//                     <StepperPanel header="מאפיינים">
//                         <table>
//                             <tbody>
//                                 <tr><td>מצב שקט:</td><td>{miniCenteral.quiet ? '✔' : 'X'}</td></tr>
//                                 <tr><td>WiFi:</td><td>{miniCenteral.wifi ? '✔' : 'X'}</td></tr>
//                                 <tr><td>מהירויות:</td><td>{miniCenteral.speeds}</td></tr>
//                                 <tr><td>תלת מימד:</td><td>{miniCenteral.air4d ? '✔' : 'X'}</td></tr>
//                                 <tr><td>מצב לילה:</td><td>{miniCenteral.night_mode ? '✔' : 'X'}</td></tr>
//                                 <tr><td>טיימר:</td><td>{miniCenteral.timer ? '✔' : 'X'}</td></tr>
//                                 <tr><td>פיקוד שבת:</td><td>{miniCenteral.sabbath_command ? '✔' : 'X'}</td></tr>
//                                 <tr><td>הדלקה וכיבוי אוטומטיים:</td><td>{miniCenteral.onof_auto ? '✔' : 'X'}</td></tr>
//                             </tbody>
//                         </table>
//                     </StepperPanel>
//                 </Stepper>
//             </div>
//         </>
//     );
// };

// export default miniCenteral;



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

export default MiniCenteral;
