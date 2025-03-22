import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react'
import axios from 'axios'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import React, { useRef } from "react";
import { DataTable } from 'primereact/datatable';
//          

const Overhead = () => {
    const {product} =  useParams();
    const stepperRef = useRef(null);
    const [overhead, setOverhead] = useState([])
    const [products, setProducts] = useState([]);

    const getOverheadById = async (_id) => {
        try {
            console.log(_id);
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/overhead/${_id}`)
            if (res.status === 200) {
                setOverhead(res.data)
                console.log(res.data);
            }
            
        }
        catch (e) {
            console.error(e)
        }
    }

    const details = {
        // "sku": "309666",
        // "מותג": overhead.company.name,
        "כולל מצב שבת": overhead.sabbath_command? "✔": "X",
        "תפוקת קירור (BTU)": overhead?.BTU_output?.cool,
        "תפוקת חימום (BTU)": "16241",
        "מדחס אינוורטר": "כולל",
        "דירוג אנרגטי קירור":  overhead?.energy_rating?.cool,
        "דירוג אנרגטי חימום":  overhead?.energy_rating?.cool,
        "הספק יעילות בקירור (COP)": "6.41",
        "הספק יעילות בחימום (COP)": "4.8",
        "דגם": overhead.title,
        // "תקופת אחריות": "שלוש שנות אחריות",
        "טכנולוגיות Wi-Fi": overhead.wifi? "✔": "X"
    };

    const coolRating = overhead?.energy_rating?.cool;
    console.log(coolRating);    

    useEffect(() => {
        getOverheadById(product);
    }, [])

    
    // useEffect(() => {
    //     ProductService.getProductsMini().then(data => setProducts(data));
    // }, []);

    return (
        <>
        <br/><br/><br/><br/>
         {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${overhead.company.imagePath}`} /> */}
         <h1>{overhead.title}</h1>
         {console.log(overhead)}
                <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/overheads/${overhead.imagepath}`} />
                <h3>{overhead.describe}</h3>          
                <h4>{overhead.price}</h4>
        <div className="card flex justify-content-center">
            <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                <StepperPanel header="מידע">
                    <div className="flex flex-column h-12rem">
                        {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content I</div> */}

                    </div>
                    <div className="flex pt-4 justify-content-end">
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="מפרט טכני">
                    <div className="flex flex-column h-12rem">
                        {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}
                        <div className="card">
                            <table  tableStyle={{ minWidth: '50rem' }}>
                            {/* <p>{overhead.title}</p> */}
                                {Object.entries(details).map(([key,value])=> (
                               <tr>
                                <td>
                                    {key}:
                                </td>
                                <td>
                                    {value}
                                </td>
                               </tr>
                                ))}
                            </table>
                        </div>

                        </div>
                    {/* </div> */}
                    <div className="flex pt-4 justify-content-between">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="Header III">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
                    </div>
                    <div className="flex pt-4 justify-content-start">
                        <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
                    </div>
                </StepperPanel>
            </Stepper>
        </div>

        
        </>
    )
}
export default Overhead

//מפרט טכני:
//react stepper component