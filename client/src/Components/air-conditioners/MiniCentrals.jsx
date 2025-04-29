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


const MiniCenterals = () => {

    const { token } = useSelector((state) => state.token)
    // const {companies} = useSelector((state) => state.companies)
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


    // const [showDialog, setShowDialog] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(miniCenterals);
    const priceValue = watch('price');
    const stockValue = watch('stock');

    const goToAddMiniCenteral = (type) => {
        const navigationData = {
            type: type,
            // You can add any other data you may want to send
        };
        navigate('/air_conditioner/add', { state: navigationData });
    };

    const addToBasket = async (product) => {
        // alert("shoping")
        const shoppingBagDetails = {
            product_id: product._id,
            type: "MiniCenteral"
        }
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.post('http://localhost:8000/api/user/shoppingBag', shoppingBagDetails, { headers },)
            if (res.status === 201) {
                dispatch(setBasket([...basket, res.data]))
                console.log("res.data", res.data);
                console.log("useState", shoppingBags);
                alert(` המוצר נוסף לעגלה`)

            }
            if(res.status==200){
                alert(` המוצר נוסף לעגלה`)
            }
        }
        catch (e) {
            console.error(e)
        }

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
                const updatedMiniCenterals = miniCenterals.filter(miniCenteral=> miniCenteral._id != product._id)
                dispatch(setMiniCenterals(updatedMiniCenterals))
            }
        } catch (e) {
            console.log(e);
        }
    };

    // Function to open the dialog
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
            const res = await axios.put(`http://localhost:8000/api/air-conditioner/miniCenteral/price`, details, { headers });
            console.log(res);
            if (res.status === 200) {
                alert(`${selectedProduct.title} price updated`)
                const unUpdatedMiniCenterals = miniCenterals.filter(minicenteral=> minicenteral._id != res.data._id)
                dispatch(setMiniCenterals([...unUpdatedMiniCenterals , res.data]))
                setPriceVisible(false);
            }
        }
        catch (error) {
            console.error(error);
            setPriceVisible(false);
        }
    }

    // const updateStock = async (data) => {
    //     try {
    //         const headers = {
    //             'Authorization': `Bearer ${token}`
    //         }
    //         const details = {
    //             _id: selectedProduct._id,
    //             stock: stockValue
    //         }
    //         const res = await axios.put(`http://localhost:8000/api/air-conditioner/miniCenteral/stock`, details, { headers });
    //         console.log(res);
    //         if (res.status === 200) {
    //             alert(`${selectedProduct.title} stock updated`)
    //             const unUpdatedMiniCenterals = miniCenterals.filter(minicenteral=> minicenteral._id != res.data._id)
    //             dispatch(setMiniCenterals([...unUpdatedMiniCenterals , res.data]))
    //             setStockVisible(false);
    //         }
    //     }
    //     catch (error) {
    //         console.error(error);
    //         setStockVisible(false);
    //     }
    // }

    const UpdateMiniCenteral = async (mc) => {
        const navigationData = {
            type: mc,
        };
        console.log(mc);
        navigate('/miniCenterals/miniCenteral/update', { state: navigationData })
        }

    // const getCompanies = async()=>{
    //     try{
    //         const res = await axios.get('http://localhost:8000/api/company')
    //         if(res.status === 200){
    //             console.log("company:",res.data);
    //             dispatch(setCompanies(res.data))
    //             // console.log(companies);
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }

    const sortData = (data) => {
        data.sort((a, b) => {
            if (a.title < b.title) return -1;  // a comes before b
            if (a.title > b.title) return 1;   // a comes after b
            return 0;                           // a and b are equal
        })
    }

    // const getMiniCenterals = async () => {
    //     try {
    //         const headers = {
    //             'Authorization': `Bearer ${token}`
    //         }
    //         console.log(headers);
    //         const res = await axios.get('http://localhost:8000/api/air-conditioner/MiniCenteral',{headers})
    //         if (res.status === 200) {
    //             sortData(res.data)
    //             setMiniCenterals(res.data)
    //         }
    //     }
    //     catch (e) {
    //         console.error(e)
    //     }
    // }

    const getMiniCenteralByTitle = async (c) => {
        try {
            setValue(c.target.value)
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/MiniCenteral/${c.target.value}`)
            if (res.status === 200) {
                dispatch(setMiniCenterals(res.data))
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

    const gridItem = (product) => {
        return (
            <div className="col-12 sm:col-6 lg:col-3 p-3" key={product._id}>
                <div className="border-1 surface-border border-round p-4 shadow-3 h-full flex flex-column justify-content-between gap-4">

                    {/* תמונת החברה - גדולה ובולטת */}
                    <img
                        src={`/${product?.company?.imagePath}`}
                        alt="Company"
                        className="w-full h-10rem object-contain border-round"
                    />

                    {/* תמונת המוצר - גדולה ורחבה */}
                    <img
                        src={`miniCenterals/${product.imagepath}`}
                        alt={product.title}
                        className="w-full h-12rem object-contain border-round"
                    />

                    {/* פרטי המוצר */}
                    <div className="flex flex-column align-items-center text-center gap-2">
                        <Link to={`/miniCenterals/miniCenteral/${product._id}`}>
                            <div className="text-xl font-bold text-900">{product.title}</div>
                        </Link>

                        <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)} />
                        <span className="text-lg font-medium text-primary">₪{product.price}</span>
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => UpdateMiniCenteral(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i></Button> : <></>}
                        {/* {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={()=>updateMiniCenteralPrice(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מחיר </i></Button> : <></>} */}
                        {/* {updateMiniCenteralPrice} */}
                        {/* <div> */}
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? (<Button onClick={() =>openPriceUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מחיר </i> </Button>) : <></>}
                        {/* </div> */}
                        {/* {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() =>openStockUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מלאי </i></Button> : <></>} */}
                        {userDetails?.role === 'admin' && (
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => deleteMiniCentral(product)} tooltip="מחק" tooltipOptions={{ position: 'bottom' }}  />
                    )}  
                    </div>
                    <Button
                        label="הוספה לעגלה"
                        icon="pi pi-shopping-cart"
                        className="w-full"
                        disabled={
                            getSeverity(product.stock) === "danger" || registered === false
                        }
                        onClick={() => addToBasket(product)}
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
            return <h1>No MiniCenterals available</h1>; // Fallback UI          
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
            {userDetails.role === 'admin' ? <Button onClick={() => goToAddMiniCenteral("MiniCenteral")}>add MiniCenteral</Button> : <></>}
            {/* {<Button onClick={ ()=>goToAddMiniCenteral("MiniCenteral")}>add MiniCenteral</Button>} */}
            <div className="card">
                <div className="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Search by name" onChange={(c) => getMiniCenteralByTitle(c)} value={value} />
                    </IconField>
                </div>
                <DataView value={miniCenterals} listTemplate={listTemplate} layout={layout} />
            </div>
            {/* <SideFillter /> */}
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

{/* <Dialog
    header="עדכון מלאי"
    visible={stockVisible}
    style={{ width: '50vw' }}
    onHide={() => setStockVisible(false)}
    modal
>
    <h6>מלאי:</h6>
    <div className="field">
        <span className="p-float-label">
            <Controller
                name="stock"
                control={control}
                render={({ field }) => (
                    <InputText id={field.name} type="number" {...field} />
                )}
            />
            <label htmlFor="stock">{selectedProduct?.stock}</label>
        </span>
    </div>
    <Button
        label="לעדכון"
        onClick={handleSubmit(updateStock)}
        className="p-button-success"
    />
</Dialog> */}
        </>
    )
}

export default MiniCenterals