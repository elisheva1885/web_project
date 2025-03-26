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
import { Link, useNavigate } from 'react-router-dom';
import { setUserDetails } from '../store/userDetailsSlice';

const Branches = () => {
    const {token} = useSelector(state => state.token)
    const {userDetails} = useSelector((state) => state.userDetails);
    const [branches, setBranches] = useState([])
    const [branches2, setBranches2] = useState([])
    const [value , setValue] = useState('')
    const navigate = useNavigate();


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

    const updateBranch = async (b, setBranches) => {
        const branch = {
            _id: b._id,
            phoneNumber: b.phoneNumber,
            openingHour: b.openingHour,
            closingHour: b.closingHour
        }
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
        // console.log(hour);
        console.log("the" + b.closingHour.weekdays);
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
        <br/><br/><br/>
            {userDetails.role==="user"?<Button onClick={ ()=>goToAddBranch()}>add branch</Button>: <></> }

        {renderHeader()}
        <Panel header="סניפים" style={{direction:"rtl"}}>
            <div className="card">
                <DataView value={branches} listTemplate={listTemplate}/>
            </div>
        </Panel>
        {/* <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d54128.69756066805!2d34.7439104!3d32.0139327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1siw!2sil!4v1736430187725!5m2!1siw!2sil" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe> */}
</>
    )
}
export default Branches
