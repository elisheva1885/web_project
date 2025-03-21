import { useLocation, useParams } from 'react-router-dom';
import { useState, useEffect} from 'react'
import axios from 'axios'
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import React, { useRef } from "react";

const Overhead = () => {
    const {product} =  useParams();
    const stepperRef = useRef(null);
    const [overhead, setOverhead] = useState([])
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

    useEffect(() => {
        getOverheadById(product);
    }, [])
    return (
        <>
        <br/><br/><br/><br/>
                            {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${overhead.company.imagePath}`} /> */}
                            {/* { console.log(overhead.imagepath)} */}
                            {/* <img src={`${overhead.imagepath}`} /> */}
                            <p>{overhead.imagepath}</p>
                            <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${overhead.imagepath}`} />
                            
                            <h3>{overhead.describe}</h3>
                            {/* { console.log(overhead.company.imagePath)} */}
                            { console.log(overhead.company)}
                            {/* <img src={`${overhead.company.imagePath}`} /> */}
                            <p>  ש"ח {overhead.price}</p>
        <div className="card flex justify-content-center">
            <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
                <StepperPanel header="מידע">
                    <div className="flex flex-column h-12rem">
                        {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content I</div> */}
                        <h1>{overhead.title}</h1>

                    </div>
                    <div className="flex pt-4 justify-content-end">
                        <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
                    </div>
                </StepperPanel>
                <StepperPanel header="מפרט טכני">
                    <div className="flex flex-column h-12rem">
                        <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content II</div>
                    </div>
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