import { Button } from 'primereact/button';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tooltip } from 'primereact/tooltip';

const Admin = () => {
    const { userDetails } = useSelector((state) => state.userDetails);
    const { overheads } = useSelector((state) => state.overheads);
    // const { miniCentrals } = useSelector((state) => state.miniCentrals);

    // const air_conditioners = null
    const navigate = useNavigate()
    const registerOfficial = async () => {
        navigate('/admin/registerOfficial')
    };

    const toOrders = () => {
        navigate('/admin/orders')
    }
    return (
        <>
            <div style={{ paddingTop: '60px' }}>
                <Button type="button" label="הוספת מזכירה" className="mt-2" onClick={()=>registerOfficial} />
            </div>
            <Button type="button" label="לצפייה בכל ההזמנות" className="mt-2" onClick={()=>toOrders} />
        </>
    )
}
export default Admin