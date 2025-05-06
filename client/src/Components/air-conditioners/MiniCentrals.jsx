import axios from 'axios'
import { useEffect, useState, lazy } from 'react'
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { getToken } from '../../store/tokenSlice';
import { useDispatch, useSelector } from 'react-redux';
import Add_AirConditioner from './Add_AirConditioner';
import { setBasket } from '../../store/basketSlice';
import { setMiniCenterals } from '../../store/air-conditioner/miniCenteralsSlice'
import SideFillter from '../SideFillter';
import UpdateMiniCenteral from './UpdateMiniCenteral';
import { Dialog } from 'primereact/dialog';
import { Controller, useForm } from 'react-hook-form';
import useGetFilePath from '../../hooks/useGetFilePath';
import { Toast } from 'primereact/toast'; // Import the Toast component
import useAddToBasket from "../../hooks/useAddToBasket";

const MiniCenterals = () => {

    const { token } = useSelector((state) => state.token)
    const { basket } = useSelector((state) => state.basket)
    const { userDetails } = useSelector((state) => state.userDetails);
    const { miniCenterals } = useSelector((state) => state.miniCenterals);
    const [value, setValue] = useState('')
    const [shoppingBags, setShoppingBags] = useState([])
    const [registered, setRegistered] = useState(false);
    const [layout, setLayout] = useState('grid');
    const [priceVisible, setPriceVisible] = useState(false);
    const [stockVisible, setStockVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const { control, handleSubmit, formState: { errors }, watch } = useForm()
    const { getFilePath } = useGetFilePath()

    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(miniCenterals);
    const priceValue = watch('price');
    const stockValue = watch('stock');
    const { addToBasket, toast } = useAddToBasket();

    const errorMessages = {
        INVALID_USER_ID: "המזהה שלך אינו תקין. נסי להתחבר מחדש.",
        INVALID_PRODUCT_ID: "מזהה המוצר אינו תקין.",
        INVALID_AMOUNT: "כמות המוצר חייבת להיות מספר חיובי.",
        INTERNAL_ERROR: "שגיאת שרת פנימית. נסי שוב מאוחר יותר.",
        INVALID_TITLE: "הכותרת שסיפקת אינה תקינה. נסי שנית.",
        NO_MINICENTERALS_FOUND: "לא נמצאו מזגנים תואמים.",
        INVALID_MINICENTERAL_ID: "מזהה המזגן אינו תקין.",
        INVALID_PRICE: "המחיר חייב להיות מספר חיובי.",
        MINICENTERAL_NOT_FOUND: "המזגן לא נמצא.",
    };

    const goToAddMiniCenteral = (type) => {
        const navigationData = {
            type: type,
        };
        navigate('/air_conditioner/add', { state: navigationData });
    };

    const addtoBasket =  async (product) => {
        addToBasket(product, "MiniCenteral");
    }
   

    const deleteMiniCentral = async (product) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const _id = {
                _id: product._id
            };
            const res = await axios.delete('http://localhost:8000/api/air-conditioner/miniCenteral', {
                headers: headers,
                data: _id
            });
    
            if (res.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "הצלחה",
                    detail: "המזגן נמחק בהצלחה.",
                });
                const updatedMiniCenterals = miniCenterals.filter(miniCenteral => miniCenteral._id !== product._id);
                dispatch(setMiniCenterals(updatedMiniCenterals));
            }
        } catch (error) {    
            if (error.response && error.response.data?.message) {
                const message = error.response.data.message;
                toast.current.show({
                    severity: "error",
                    summary: "שגיאה",
                    detail: errorMessages[message] || "שגיאה בלתי צפויה. נסי שוב מאוחר יותר.",
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "שגיאה",
                    detail: "ודאי שיש חיבור לאינטרנט ונסי שוב.",
                });
            }
        }
    };

    const openPriceUpdateDialog = (product) => {
        setSelectedProduct(product);
        setPriceVisible(true);
    };

    const updatePrice = async (data) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const details = {
                _id: selectedProduct._id,
                price: priceValue
            }
            const res = await axios.put(`http://localhost:8000/api/air-conditioner/miniCenteral/price`, details, { headers });
            if (res.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "הצלחה",
                    detail: `${selectedProduct.title} עודכן בהצלחה.`,
                });
                const updatedMiniCenterals = miniCenterals.filter(minicenteral => minicenteral._id !== res.data._id);
                dispatch(setMiniCenterals([...updatedMiniCenterals, res.data])); // Update Redux state
                setPriceVisible(false); 
            }
        }
        catch (error) {
            if (error.response && error.response.data?.message) {
                const message = error.response.data.message;
                toast.current.show({
                    severity: "error",
                    summary: "שגיאה",
                    detail: errorMessages[message] || "שגיאה בלתי צפויה. נסי שוב מאוחר יותר.",
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "שגיאה",
                    detail: "ודאי שיש חיבור לאינטרנט ונסי שוב.",
                });
            }
            setPriceVisible(false); 
        }
    }

    const UpdateMiniCenteral = async (mc) => {
        const navigationData = {
            type: mc,
        };
        console.log(mc);
        navigate('/miniCenterals/miniCenteral/update', { state: navigationData })
    }


    const sortData = (data) => {
        data.sort((a, b) => {
            if (a.title < b.title) return -1;  // a comes before b
            if (a.title > b.title) return 1;   // a comes after b
            return 0;                           // a and b are equal
        })
    }

    const getMiniCenteralByTitle = async (c) => {
            const title = c.target.value
            setValue(c.target.value)
            
            try{      
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/MiniCenteral/${title}`)
            if (res.status === 200) {
                dispatch(setMiniCenterals(res.data))
            }
        }
        catch (e) {
            if (e.response && e.response.data?.message) {
                const message = e.response.data.message;
                toast.current.show({
                    severity: "error",
                    summary: "שגיאה",
                    detail: errorMessages[message] || "שגיאה בלתי צפויה. נסי שוב מאוחר יותר.",
                });
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "שגיאה",
                    detail: "ודאי שיש חיבור לאינטרנט ונסי שוב.",
                });
            }
        }       
    }


    const getSeverity = (s) => {
        if (s >= 50) {
            return 'success'
        }
        else if (s > 0) {
            return 'warning';
        }
        else if (s === 0) {
            return 'danger';
        }

    };
    const getSeverityText = (product) => {
        const severity = getSeverity(product.stock)

        switch (severity) {
            case 'success':
                return "במלאי";

            case 'warning': //check what problematic
                return "פריטים אחרונים";

            case 'danger':
                return "אזל מהמלאי";

            default:
                return null;
        }
    };

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-3 p-3" key={product._id}>
                <div className="border-1 surface-border border-round p-4 shadow-3 h-full flex flex-column justify-content-between gap-4">
                    <img
                        src={getFilePath(product?.company?.imagePath)}
                        alt="Company"
                        className="w-full h-10rem object-contain border-round"
                    />
                    <img
                        src={getFilePath(product.imagepath)}
                        alt={product.title}
                        className="w-full h-12rem object-contain border-round"
                    />
                    <div className="flex flex-column align-items-center text-center gap-2">
                        <Link to={`miniCenteral/${product._id}`}>
                            <div className="text-xl font-bold text-900">{product.title}</div>
                        </Link>
                        <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)} />
                        <span className="text-lg font-medium text-primary">₪{product.price}</span>
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => UpdateMiniCenteral(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i></Button> : <></>}
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? (<Button onClick={() => openPriceUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מחיר </i> </Button>) : <></>}
                        {userDetails?.role === 'admin' && (
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => deleteMiniCentral(product)} tooltip="מחק" tooltipOptions={{ position: 'bottom' }} />
                        )}
                    </div>
                    <Button
                        label="הוספה לעגלה"
                        icon="pi pi-shopping-cart"
                        className="w-full"
                        disabled={
                            getSeverity(product.stock) === "danger"
                        }
                        onClick={() => addtoBasket(product)}
                    />
                </div>
            </div>
        );
    };

    const itemTemplate = (product, layout, index) => {
        if (!product) {
            return;
        }
        if (layout === 'grid') return gridItem(product, index);
    };

    const listTemplate = (products, layout) => {
        if (!Array.isArray(miniCenterals) || miniCenterals.length === 0) {
            return <h1>אין מיני מרכזיים זמינים</h1>; 
        }
        return <div className="grid grid-nogutter">{miniCenterals.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    useEffect(() => {
        if (token) {
            setRegistered(true)
        }
    }, [])

    return (
        <>
            {userDetails?.role === 'official' || userDetails?.role === 'admin'? <Button onClick={() => goToAddMiniCenteral("MiniCenteral")}>הוספת מזגן מיני מרכזי</Button> : <></>}
            <Toast ref={toast} />
            <div className="card">
                <div className="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Search by name" onChange={(c) => getMiniCenteralByTitle(c)} value={value} />
                    </IconField>
                </div>
                <DataView value={miniCenterals} listTemplate={listTemplate} layout={layout} />
            </div>
            <Dialog
                header="עדכון מחיר"
                visible={priceVisible}
                style={{ width: '50vw' }}
                onHide={() => priceVisible(false)}
                modal
            >
                <h6>מחיר:</h6>
                <div className="field">
                    <span className="p-float-label">
                        <Controller
                            name="price"
                            control={control}
                            render={({ field }) => (
                                <InputText id={field.name} type="number" {...field} />
                            )}
                        />
                        <label htmlFor="price">{selectedProduct?.price}</label>
                    </span>
                </div>
                <Button
                    label="לעדכון"
                    onClick={handleSubmit(updatePrice)}
                    className="p-button-success"
                />
            </Dialog>

        </>
    )
}

export default MiniCenterals