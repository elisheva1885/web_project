import { useEffect, useState } from "react";
import axios from 'axios';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Panel } from 'primereact/panel';
import { InputText } from 'primereact/inputtext';
import { InputIcon } from 'primereact/inputicon';
import { useSelector } from "react-redux";
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router-dom';
import 'primeicons/primeicons.css';

const Branches = () => {
    const { token } = useSelector(state => state.token);
    const { userDetails } = useSelector((state) => state.userDetails);
    const [branches, setBranches] = useState([]);
    const [filteredBranches, setFilteredBranches] = useState([]);
    const [searchValue, setSearchValue] = useState('');
    const navigate = useNavigate();

    const sortData = (data) => {
        data.sort((a, b) => {
            if (a.address.city < b.address.city) return -1;
            if (a.address.city > b.address.city) return 1;
            return 0;
        });
    };

    const goToAddBranch = () => {
        navigate('/branch/add');
    };

    const getBranches = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/branches');
            if (res.status === 200) {
                sortData(res.data);
                setBranches(res.data);
                setFilteredBranches(res.data); // Initialize filtered branches
            }
        } catch (e) {
            console.error(e);
        }
    };

    const deleteBranch = async (branchToDelete) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const _id = {
                _id: branchToDelete._id
            };
            const res = await axios.delete('http://localhost:8000/api/branches', {
                headers: headers,
                data: _id
            });
            if (res.status === 200) {
                setBranches(res.data);
                setFilteredBranches(res.data); // Update filtered branches after deletion
            }
        } catch (e) {
            console.error(e);
        }
    };

    const updateBranch = async (branchToUpdate) => {
        navigate('/branch/update', { state: { data: branchToUpdate } });
    };

    const getInMap = (branch)=> {
        const lat = 32.0853; // קו רוחב (Latitude)
        const lng = 34.7818; // קו אורך (Longitude)
        const address = encodeURIComponent(`${branch.address.city}, ${branch.address.street},${branch.address.streetNum}`); // כתובת בעברית או אנגלית
        // window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');

    }

    const isOpen = (branch) => {
        const date = new Date();
        const hour = date.getHours();
        const day = date.getDay();
        if (day === 6) {
            return 'danger';
        } else if (hour < branch.openingHour) {
            return 'danger';
        } else if (day === 5 && branch.closingHour.fridays < hour) {
            return 'danger';
        } else if (day < 5 && branch.closingHour.weekdays <= hour) {
            return 'danger';
        }
        return 'success';
    };

    const itemTemplate = (branch, index) => {
        return (
            <div key={branch._id} style={styles.listItem}>
                <img src="storeIcon.png" alt="סניף" style={styles.listImage} />
                <div style={styles.listDetails}>
                    <div style={{ ...styles.listCity, lineHeight: '1.6' }}>{branch.address.city}</div>
                    <div style={{ ...styles.listAddress, lineHeight: '1.5', letterSpacing: '0.01em' }}>{`${branch.address.street} ${branch.address.streetNum}`}</div>
                    <div style={{ ...styles.listHours, lineHeight: '1.5', letterSpacing: '0.01em' }}>
                        <span>שעות פתיחה:</span>
                        <span>א'-ה': {`${branch.openingHour} - ${branch.closingHour.weekdays}`}</span>
                        <span>ו' וערבי חג: {`${branch.openingHour} - ${branch.closingHour.fridays}`}</span>
                    </div>
                    <div style={{ ...styles.listContact, lineHeight: '1.5', letterSpacing: '0.01em' }}>ליצירת קשר: {branch.phoneNumber}</div>
                    <div style={styles.listStatus}>
                        <Tag value={isOpen(branch) === "success" ? "פתוח" : "סגור"} severity={isOpen(branch)} />
                    </div>
                </div>
                <div style={styles.listActions}>
                    {(userDetails?.role === 'official' || userDetails?.role === 'admin') && (
                        <Button icon="pi pi-pencil" className="p-button-rounded p-button-sm" onClick={() => updateBranch(branch)} tooltip="ערוך" tooltipOptions={{ position: 'bottom' }} style={styles.actionButton} />
                    )}
                    {userDetails?.role === 'admin' && (
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => deleteBranch(branch)} tooltip="מחק" tooltipOptions={{ position: 'bottom' }} style={styles.actionButton} />
                    )}
                    <Button icon="pi pi-map-marker" className="p-button-rounded p-button-info p-button-sm" onClick={() => getInMap(branch)} tooltip="הצג במפה" tooltipOptions={{ position: 'bottom' }} style={styles.actionButton} />
                </div>
            </div>
        );
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchValue(value);
        const filtered = branches.filter(branch =>
            branch.address.city.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBranches(filtered);
    };

    const renderHeader = () => {
        return (
            <div style={styles.searchContainer}>
                <InputIcon icon="pi pi-search" position="left">
                    <InputText placeholder="חפש לפי עיר" value={searchValue} onChange={handleSearch} style={{ width: '100%' }} />
                </InputIcon>
            </div>
        );
    };

    useEffect(() => {
        getBranches();
    }, []);

    return (
        <div style={styles.branchesPage}>
            <div style={styles.pageHeader}>
                <h2 style={styles.pageTitle}>סניפים</h2>
                {userDetails?.role === "admin" && (
                    <Button label="הוסף סניף" icon="pi pi-plus" onClick={goToAddBranch} className="p-button-success" />
                )}
            </div>

            <Panel header={renderHeader()} className="branches-panel" style={styles.branchesPanel}>
                <div className="card">
                    <DataView value={filteredBranches} itemTemplate={itemTemplate} layout="list" />
                </div>
            </Panel>
        </div>
    );
};

const styles = {
    branchesPage: {
        padding: '20px',
        direction: 'rtl',
    },
    pageHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    pageTitle: {
        margin: '0',
    },
    searchContainer: {
        marginBottom: '15px',
        width: '100%',
        maxWidth: '400px',
    },
    branchesPanel: {
        padding: '15px',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        padding: '15px 0',
        width: '100%',
    },
    listImage: {
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        marginRight: '15px',
        objectFit: 'cover',
    },
    listDetails: {
        flexGrow: 1,
        textAlign: 'right',
        marginRight: '15px',
    },
    listCity: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    listAddress: {
        color: '#555',
        marginBottom: '3px',
    },
    listHours: {
        fontSize: '0.9rem',
        marginBottom: '3px',
    },
    listHoursSpan: {
        display: 'block',
    },
    listContact: {
        color: '#333',
        fontWeight: 'bold',
        marginBottom: '5px',
    },
    listStatus: {
        marginBottom: '5px',
    },
    listActions: {
        display: 'flex',
        gap: '5px',
        marginLeft: 'auto',
    },
    actionButton: {
        margin: '0 5px',
    },
};

export default Branches;