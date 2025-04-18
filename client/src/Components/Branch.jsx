import { useEffect, useState } from "react"
import axios from 'axios'
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useSelector } from "react-redux";
import { Button } from 'primereact/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setUserDetails } from '../store/userDetailsSlice';
import 'primeicons/primeicons.css';

const Branches = () => {
    const {token} = useSelector(state => state.token)
    const {userDetails} = useSelector((state) => state.userDetails);
    const [branches, setBranches] = useState([])
    const [branches2, setBranches2] = useState([])
    const [value , setValue] = useState('')
    const navigate = useNavigate();
    const location = useLocation();
    const { data } = location.state || {}; 


    const sortData = (data) => {
        data.sort((a, b) => {
            if (a.address.city < b.address.city) return -1;  // a comes before b
            if (a.address.city > b.address.city) return 1;   // a comes after b
            return 0;                           // a and b are equal
        })
    }
    const goToAddBranch = ()=> {
        navigate('/branch/add');

    } 
    const getBranches = async () => {
        try {
            console.log(token);
            const res = await axios.get('http://localhost:8000/api/branches')
            if (res.status === 200) {
                sortData(res.data)
                setBranches(res.data)
            }
        }
        catch (e) {
            console.error(e)
        }
    }
    const deleteBranch =async (b)=>{
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const _id = {
                _id: b._id
            }
            const res = await axios.delete('http://localhost:8000/api/branches',{
                headers: headers,
            data:_id
        })
        if(res.status === 200){
            setBranches(res.data)
        }
    }
    catch (e) {
        console.error(e)
    }
            
    }
    const updateBranch = async (b) => {
        const navigationData = {
            type: b,
            // You can add any other data you may want to send
        };
        console.log(b);
        navigate('/branch/update' , { state: navigationData })
        setBranches(data)
    }

    const getInMap = (branch)=> {
        const lat = 32.0853; // קו רוחב (Latitude)
        const lng = 34.7818; // קו אורך (Longitude)
        const address = encodeURIComponent(`${branch.address.city}, ${branch.address.street},${branch.address.streetNum}`); // כתובת בעברית או אנגלית
        // window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');

    }

    const printBranches = () => {
        if (branches2.length !== 0) {
            setBranches(branches2)

        }
        else {
            setBranches(branches)
        }
    }

    const isOpen = (b) => {
        const date = new Date();
        const hour = date.getHours()
        const day = date.getDay()
        if (day === 6) {
            return 'danger';
        }
        else if (hour < b.openingHour) {
            return 'danger';
        }
        else if (day === 5 && b.closingHour.fridays < hour) {
            return 'danger';
        }
        else if (day < 5 && b.closingHour.weekdays <= hour) {
            return 'danger';
        }
        return 'success';
    }

    const itemTemplate = (branch, index) => {
        return (
            <>
            <div className="col-12" key={branch._id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src="storeIcon.png"/>
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{branch.address.city}</div>
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                <div className="font-semibold">{`${branch.address.street}  ${branch.address.streetNum}`}</div>
                                <span className="font-semibold">{`שעות פתיחה:`}</span>
                                <span className="font-semibold">{`א-ה: ${branch.closingHour.weekdays} - ${branch.openingHour}`}</span>
                                <span className="font-semibold">{`שישי וערבי חג:  ${branch.closingHour.fridays} - ${branch.openingHour}`}</span>
                                <div className="font-semibold">{` ליצירת קשר: ${branch.phoneNumber} `}</div>
                                </span>
                                <Tag value={isOpen(branch) === "success" ? "פתוח" : "סגור"} severity={isOpen(branch)}></Tag>
                                {userDetails?.role==='official'|| userDetails?.role==='admin' ?<Button onClick={()=>updateBranch(branch)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i></Button>: <></>}
                                {userDetails?.role==='admin'?<Button onClick={()=>deleteBranch(branch)}><i className="pi pi-trash" style={{ fontSize: '1rem' }}></i></Button>:<></>}
                                <Button  onClick={()=>getInMap(branch)}><i className="pi pi-map-marker"></i></Button>

                            </div>
                        </div>
                    </div>
                </div>
                </div>
                </>
                
        );
    }

    const listTemplate = (branches) => {
        if (!branches || branches.length === 0) return null;

        let list = branches.map((b, index) => {
            return itemTemplate(b, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    }

    const getBranchByCity = async (c) => {
        try {
            setValue(c.target.value)
            const res = await axios.get(`http://localhost:8000/api/branches/${c.target.value}`)
            if (res.status === 200) {
                setBranches2(branches)
                setBranches(res.data)
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    const renderHeader = () => {
        return (
            <>

            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText  placeholder="Search by city" onChange={(c)=>getBranchByCity(c)}  value = {value} />
                </IconField>
            </div>
            </>
        );
    };

    useEffect(() => {
        getBranches()
    }, [])
    return (
        <>
                <div style={{ paddingTop: '60px' }}>
            {userDetails.role==="admin"?<Button onClick={ ()=>goToAddBranch()}>add branch</Button>: <></> }

        {renderHeader()}
        <Panel header="סניפים" style={{direction:"rtl"}}>
            <div className="card">
                <DataView value={branches} listTemplate={listTemplate}/>
            </div>
        </Panel>
        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d54128.69756066805!2d34.7439104!3d32.0139327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1siw!2sil!4v1736430187725!5m2!1siw!2sil" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
        </div>
</>
    )
}
export default Branches
