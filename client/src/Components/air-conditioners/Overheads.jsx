import axios from 'axios'
import { useEffect, useState, lazy, useRef } from 'react'
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
import { setCompanies } from '../../store/companySlice'
import { setBasket } from '../../store/basketSlice';
import { setOverheads } from '../../store/air-conditioner/overHeadsSlice';
import SideFillter from '../SideFillter';
import UpdateOverhead from './updateOvearhead';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import useGetFilePath from '../../hooks/useGetFilePath';
import { Toast } from 'primereact/toast';
import useAddToBasket from "../../hooks/useAddToBasket";


const Overhead = lazy(() => import('./Overhead'));


const Overheads = () => {

    const { token } = useSelector((state) => state.token)
    const { companies } = useSelector((state) => state.companies)
    const { basket } = useSelector((state) => state.basket)
    const { userDetails } = useSelector((state) => state.userDetails);

    const { overheads } = useSelector((state) => state.overheads);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [value, setValue] = useState('')
    const [shoppingBags, setShoppingBags] = useState([])
    const [registered, setRegistered] = useState(false);
    const [priceVisible, setPriceVisible] = useState(false);
    const [stockVisible, setStockVisible] = useState(false);
    const { control, handleSubmit, formState: { errors }, watch } = useForm()

    const [layout, setLayout] = useState('grid');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const priceValue = watch('price');
    const { getFilePath } = useGetFilePath()
    const { addToBasket, toast } = useAddToBasket();

    const errorMessages = {
        INVALID_USER_ID: "המזהה שלך אינו תקין. נסי להתחבר מחדש.",
        INVALID_PRODUCT_ID: "מזהה המוצר אינו תקין.",
        INVALID_AMOUNT: "כמות המוצר חייבת להיות מספר חיובי.",
        "Invalid type: MiniCenteral. Must be one of Overhead, MiniCenteral, MultiIndoorUnit, MultiOutdoorUnit":
            "סוג המוצר אינו תקין. אנא נסי שוב.",
        INTERNAL_ERROR: "שגיאת שרת פנימית. נסי שוב מאוחר יותר.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו.",
        UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
    };

    const goToAddOverhead = (type) => {
        const navigationData = {
            type: type,
            // You can add any other data you may want to send
        };
        navigate('/air_conditioner/add', { state: navigationData });
    };


    const addtoBasket = async (product) => {
        addToBasket(product, "Overhead")
    }

    const deleteOverhead = async (product) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const _id = {
                _id: product._id
            };
            const res = await axios.delete('http://localhost:8000/api/air-conditioner/overhead', {
                headers: headers,
                data: _id
            });
            if (res.status === 200) {
                const updatedOverheads = overheads.filter(overhead => overhead._id != product._id)
                dispatch(setOverheads(updatedOverheads))
            }
        } catch (e) {
            console.log(e);
        }
    };
    const openPriceUpdateDialog = (product) => {
        setSelectedProduct(product);
        setPriceVisible(true);
    };

    const openStockUpdateDialog = (product) => {
        setSelectedProduct(product);
        setStockVisible(true);
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
            console.log(details);
            const res = await axios.put(`http://localhost:8000/api/air-conditioner/overhead/price`, details, { headers });
            console.log(res);
            if (res.status === 200) {
                alert(`${selectedProduct.title} price updated`)
                const unUpdatedOverheads = overheads.filter(overhead => overhead._id != res.data._id)
                dispatch(setOverheads([...unUpdatedOverheads, res.data]))
                setPriceVisible(false);
            }
        }
        catch (error) {
            console.error(error);
            setPriceVisible(false);
        }
    }

    const sortData = (data) => {
        data.sort((a, b) => {
            if (a.title < b.title) return -1;  // a comes before b
            if (a.title > b.title) return 1;   // a comes after b
            return 0;                           // a and b are equal
        })
    }

    const getOverheadByTitle = async (c) => {
        try {
            setValue(c.target.value)
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/${c.target.value}`)
            if (res.status === 200) {
                dispatch(setOverheads(res.data))
            }
        }
        catch (e) {
            console.error(e)
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

    const UpdateOverhead = async (o) => {
        const navigationData = {
            type: o,
        };
        console.log(o);
        navigate('/overheads/overhead/update', { state: navigationData })
    }

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-3 p-3" key={product._id}>
                <div className="border-1 surface-border border-round p-4 shadow-3 h-full flex flex-column justify-content-between gap-4">
                    <img
                        src={`/${product?.company?.imagePath}`}
                        alt="Company"
                        className="w-full h-10rem object-contain border-round"
                    />

                    <img
                        // src={`overheads/${product.imagepath}`}
                        src={getFilePath(product.imagepath)}
                        alt={product.title}
                        className="w-full h-12rem object-contain border-round"
                    />

                    {/* פרטי המוצר */}
                    <div className="flex flex-column align-items-center text-center gap-2">
                        <Link to={`/overheads/overhead/${product._id}`}>
                            <div className="text-xl font-bold text-900">{product.title}</div>
                        </Link>

                        <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)} />
                        <span className="text-lg font-medium text-primary">₪{product.price}</span>
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => UpdateOverhead(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i></Button> : <></>}
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? (<Button onClick={() => openPriceUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מחיר </i> </Button>) : <></>}
                        {/* {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => openStockUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מלאי </i></Button> : <></>} */}

                        {userDetails?.role === 'admin' && (
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => deleteOverhead(product)} tooltip="מחק" tooltipOptions={{ position: 'bottom' }} />
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
        if (!Array.isArray(overheads) || overheads.length === 0) {
            return <h1>No overheads available</h1>; // Fallback UI          
        }
        return <div className="grid grid-nogutter">{overheads.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    return (
        <>
            {userDetails.role === 'admin' ? <Button onClick={() => goToAddOverhead("Overhead")}>add overhead</Button> : <></>}
            <div className="card">
                <Toast ref={toast} />
                <div className="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Search by name" onChange={(c) => getOverheadByTitle(c)} value={value} />
                    </IconField>
                </div>
                <DataView value={overheads} listTemplate={listTemplate} layout={layout} />
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

export default Overheads