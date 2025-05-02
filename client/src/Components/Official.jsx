import { Button } from "primereact/button";
import UpdateDeliveryStatus from "./UpdateDeliveryStatus";
import { useNavigate } from "react-router-dom";

const Official = () => {
    const navigate = useNavigate();

    const toAddCompany = () => {  
        navigate("/addCompany");
    }
    return (
        <div>
            <h1>Official</h1>

            <Button label="להוספת חברה" onClick={toAddCompany}></Button>
            <UpdateDeliveryStatus/>
        </div>
        
    );
}

export default Official;    