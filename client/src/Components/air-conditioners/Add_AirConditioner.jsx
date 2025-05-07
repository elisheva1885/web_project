import { useLocation } from 'react-router-dom';
import Overhead from './Overhead';
import axios from 'axios';
import AddMiniCentral from './AddMiniCentral';
import AddOverhead from './AddOverhead';
import AddMultiIndoorUnit from './AddMultiIndoorUnit';
import AddMultiOutdoorUnits from './AddMultiOutdoorUnits';

const Add_AirConditioner = () => {
    const location = useLocation();
    const { type } = location.state || {}; // Access the type from state
    console.log(type);
    switch (type) {
        case "Overhead":
            return <AddOverhead/>
        case "MiniCenteral":
            return <AddMiniCentral/>
        case "MultiIndoorUnit":
            return <AddMultiIndoorUnit/>
        case "MultiOutdoorUnit":
            return <AddMultiOutdoorUnits/>
        default:
            break;
    }

    return (
        <>
        </>
    );
};

export default Add_AirConditioner;