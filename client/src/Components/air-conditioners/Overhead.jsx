// import { useLocation, useParams } from 'react-router-dom';
// import { useState, useEffect} from 'react'
// import axios from 'axios'
// import { Stepper } from 'primereact/stepper';
// import { StepperPanel } from 'primereact/stepperpanel';
// import { Button } from 'primereact/button';
// import React, { useRef } from "react";
// import { DataTable } from 'primereact/datatable';
// //          

// const Overhead = () => {
//     const {product} =  useParams();
//     const stepperRef = useRef(null);
//     const [overhead, setOverhead] = useState([])
//     const [products, setProducts] = useState([]);

//     const getOverheadById = async (_id) => {
//         try {
//             console.log(_id);
//             const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/overhead/${_id}`)
//             if (res.status === 200) {
//                 setOverhead(res.data)
//                 console.log(res.data);
//             }
            
//         }
//         catch (e) {
//             console.error(e)
//         }
//     }

//     const details = {
//         // "sku": "309666",
//         "מותג":overhead?.company?.name,
//         "כולל מצב שבת": overhead.sabbath_command? "✔": "X",
//         "תפוקת קירור (BTU)": overhead?.BTU_output?.cool,
//         "תפוקת חימום (BTU)": overhead?.BTU_output?.heat,
//         // "מדחס אינוורטר": "כולל",
//         "דירוג אנרגטי קירור":  overhead?.energy_rating?.cool,
//         "דירוג אנרגטי חימום":  overhead?.energy_rating?.cool,
//         "הספק יעילות בקירור (COP)": overhead?.working_current?.cool,
//         "הספק יעילות בחימום (COP)": overhead?.working_current?.heat,
//         "דגם": overhead.title,
//         // "תקופת אחריות": "שלוש שנות אחריות",
//         "טכנולוגיות Wi-Fi": overhead.wifi? "✔": "X"
//     };

//     const coolRating = overhead?.energy_rating?.cool;
//     console.log(coolRating);    

//     useEffect(() => {
//         getOverheadById(product);
//     }, [])

    
//     // useEffect(() => {
//     //     ProductService.getProductsMini().then(data => setProducts(data));
//     // }, []);

//     return (
//         <>
//         <br/><br/><br/><br/>
//          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${overhead?.company?.imagePath}`} />
//          <h1>{overhead.title}</h1>
//          {console.log(overhead)}
//                 <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/overheads/${overhead.imagepath}`} />
//                 <h3>{overhead.describe}</h3>          
//                 <h4>{overhead.price}</h4>
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
// export default Overhead

// //מפרט טכני:
// //react stepper component




import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';

const Overhead = () => {
    const { product } = useParams();
    const stepperRef = useRef(null);
    const [overhead, setOverhead] = useState(null);

    const getOverheadById = async (_id) => {
        try {
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/overhead/${_id}`);
            if (res.status === 200) {
                setOverhead(res.data);
                console.log(res.data, overhead)
            }
        } catch (e) {
            console.error(e);
        }
    };
    useEffect(() => {
        
        getOverheadById(product);
    }, [product]);

    if (!overhead) return <p>Loading...</p>;

    return (
        <>
            <br/><br/><br/><br/>
            <img className="w-40rem shadow-2 border-round" src={`/overheads/${overhead.imagepath}`} alt="product" />
            <div className="flex flex-column gap-3">
                <img className="w-10rem shadow-2 border-round" src={`/${overhead.company?.imagePath}`} alt="brand" />
                <h1>{overhead.title}</h1>
                <h3>{overhead.describe}</h3>
                <h4 className="text-2xl font-bold text-primary">₪{overhead.price}</h4>
            </div>
            {/* <i className="pi pi-star" style={{ color: 'slateblue' }}></i> */}
            <img src="/BTU_heat.png" style={{ width: '24px', height: '24px' }} />
            <img src="/BTU_cool.png" style={{ width: '24px', height: '24px' }} />

            <div className="card flex justify-content-center">
                <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                    <StepperPanel header="תפוקה ונתונים טכניים">
                        <table>
                            <tbody>
                                <tr><td>תפוקת קירור (BTU):</td><td>{overhead.BTU_output?.cool}</td></tr>
                                <tr><td>תפוקת חימום (BTU):</td><td>{overhead.BTU_output?.heat}</td></tr>
                                <tr><td>דירוג אנרגטי קירור:</td><td>{overhead.energy_rating?.cool}</td></tr>
                                <tr><td>דירוג אנרגטי חימום:</td><td>{overhead.energy_rating?.heat}</td></tr>
                                <tr><td>זרם עבודה קירור:</td><td>{overhead.working_current?.cool}</td></tr>
                                <tr><td>זרם עבודה חימום:</td><td>{overhead.working_current?.heat}</td></tr>
                                <tr><td>קוטר חיבור צנרת א:</td><td>{overhead.pipe_connection?.a}</td></tr>
                                <tr><td>קוטר חיבור צנרת ב:</td><td>{overhead.pipe_connection?.b}</td></tr>
                                <tr><td>מידות פנימיות (רוחב x עומק x גובה):</td><td>{`${overhead.in_size?.width} x ${overhead.in_size?.depth} x ${overhead.in_size?.height}`}</td></tr>
                                <tr><td>מידות חיצוניות (רוחב x עומק x גובה):</td><td>{`${overhead.out_size?.width} x ${overhead.out_size?.depth} x ${overhead.out_size?.height}`}</td></tr>
                                <tr><td>זרימת אוויר:</td><td>{overhead.air_flow}</td></tr>
                                {/* <tr><td>שיטת התקנה מומלצת:</td><td>{overhead.recommended_method}</td></tr> */}
                            </tbody>
                        </table>
                    </StepperPanel>
                    {/* <StepperPanel header="מידות וחיבורים">
                        <table>
                            <tbody>
                                
                            </tbody>
                        </table>
                    </StepperPanel> */}
                    <StepperPanel header="מאפיינים">
                        <table>
                            <tbody>
                                <tr><td>מצב שקט:</td><td>{overhead.quiet ? '✔' : 'X'}</td></tr>
                                <tr><td>WiFi:</td><td>{overhead.wifi ? '✔' : 'X'}</td></tr>
                                <tr><td>מהירויות:</td><td>{overhead.speeds}</td></tr>
                                <tr><td>תלת מימד:</td><td>{overhead.air4d ? '✔' : 'X'}</td></tr>
                                <tr><td>מצב לילה:</td><td>{overhead.night_mode ? '✔' : 'X'}</td></tr>
                                <tr><td>טיימר:</td><td>{overhead.timer ? '✔' : 'X'}</td></tr>
                                <tr><td>פיקוד שבת:</td><td>{overhead.sabbath_command ? '✔' : 'X'}</td></tr>
                                <tr><td>הדלקה וכיבוי אוטומטיים:</td><td>{overhead.onof_auto ? '✔' : 'X'}</td></tr>
                            </tbody>
                        </table>
                    </StepperPanel>
                </Stepper>
            </div>
        </>
    );
};

export default Overhead;
