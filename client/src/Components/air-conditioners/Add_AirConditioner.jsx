import { useLocation } from 'react-router-dom';
import Overhead from './Overhead';
import axios from 'axios';
import AddOverheadForm from './AddOverhead';

const Add_AirConditioner = () => {
    const location = useLocation();
    const { type } = location.state || {}; // Access the type from state
    console.log(type);
    switch (type) {
        case "Overhead":
            return <AddOverheadForm/>
            break;
    
        default:
            break;
    }


    return (
        <>
            
        </>
    );
};

export default Add_AirConditioner;