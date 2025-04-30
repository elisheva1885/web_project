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
import { setCompanies } from '../../store/companySlice'
import { setBasket } from '../../store/basketSlice';
import { setOverheads } from '../../store/air-conditioner/overHeadsSlice';
import SideFillter from '../SideFillter';
import UpdateOverhead from './updateOvearhead';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { setMultiOutdoorUnits } from '../../store/air-conditioner/multiOutdoorUnitsSlice';


const Overhead = lazy(() => import('./Overhead'));


const MultiOutdoorUnits = () => {

    const { token } = useSelector((state) => state.token)
    const { companies } = useSelector((state) => state.companies)
    const { basket } = useSelector((state) => state.basket)
    const { userDetails } = useSelector((state) => state.userDetails);

    const { multiOutdoorUnits } = useSelector((state) => state.multiOutdoorUnits);
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
    const stockValue = watch('stock');

    console.log("multiOutdoorUnits",multiOutdoorUnits);

    const goToAddMultiOutdoorUnit = (m) => {
        const navigationData = {
            type: m,
            // You can add any other data you may want to send
        };
        navigate('/air_conditioner/add', { state: navigationData });
    };

    const addToBasket = async (product) => {
        if(token === null){
            alert('כדי להוסיף לסל חובה להיכנס לאיזור האישי')
        }
        else{
        const shoppingBagDetails = {
            product_id: product._id,
            type: "MultiOutdoorUnit",
            amount: 1
        }
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.post('http://localhost:8000/api/user/shoppingBag', shoppingBagDetails, { headers })
            if (res.status === 201) {
                dispatch(setBasket([...basket, res.data]))
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
}
  

    

    const deleteMultiOutdoorUnit = async (product) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const _id = {
                _id: product._id
            };
            const res = await axios.delete('http://localhost:8000/api/air-conditioner/multiOutdoorUnit', {
                headers: headers,
                data: _id
            });
            if (res.status === 200) {
                const updatedOverheads = multiOutdoorUnits.filter(multiOutdoorUnit => multiOutdoorUnit._id != product._id)
                dispatch(setMultiOutdoorUnits(updatedOverheads))
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
            const res = await axios.put(`http://localhost:8000/api/air-conditioner/multiOutdoorUnit/price`, details, { headers });
            console.log(res);
            if (res.status === 200) {
                alert(`${selectedProduct.title} price updated`)
                const unUpdatedOverheads = multiOutdoorUnits.filter(multiOutdoorUnit => multiOutdoorUnit._id != res.data._id)
                dispatch(setMultiOutdoorUnits([...unUpdatedOverheads, res.data]))
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
    //         const res = await axios.put(`http://localhost:8000/api/air-conditioner/multiOutdoorUnit/stock`, details, { headers });
    //         console.log(res);
    //         if (res.status === 200) {
    //             alert(`${selectedProduct.title} stock updated`)
    //             const unUpdatedOverheads = multiOutdoorUnits.filter(multiOutdoorUnit => multiOutdoorUnit._id != res.data._id)
    //             dispatch(setOverheads([...unUpdatedOverheads, res.data]))
    //             setStockVisible(false);
    //         }
    //     }
    //     catch (error) {
    //         console.error(error);
    //         setStockVisible(false);
    //     }
    // }

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

    const getMultiOutdoorUnitByTitle = async (c) => {
        try {
            setValue(c.target.value)
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/multiOutdoorUnit/${c.target.value}`)
            if (res.status === 200) {
                dispatch(setMultiOutdoorUnits(res.data))
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
    // const listItem = (product, index) => {
    //     return (
    //         <>
    //             <div className="col-12" key={product._id}>
    //                 <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
    //                     <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${product?.company?.imagePath}`} />
    //                     <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
    //                     <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
    //                         <div className="flex flex-column align-items-center sm:align-items-start gap-3">
    //                             {/* <Link to={{pathName:`/multiOutdoorUnits/${product.title}` , state: {product:product} }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link> */}
    //                             <Link to={`/multiOutdoorUnits/multiOutdoorUnit/${product._id}` } params={{ product: product }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link>
    //                             <p>{product.imagepath}</p>
    //                             <div className="flex align-items-center gap-3">
    //                                 <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
    //                             </div>
    //                         </div>
    //                         <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
    //                             <span className="text-2xl font-semibold">₪{product.price}</span>
    //                             <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={()=>addToBasket(product)}></Button>
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // };

    // const gridItem = (product, index) => {
    //     return (
    //         <>
    //         <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product._id}>
    //             <div className="p-4 border-1 surface-border surface-card border-round">
    //                 <div className="flex flex-wrap align-items-center justify-content-between gap-2">
    //                     {/* <img className="w-9 shadow-2 border-round" src={`${product.company.imagePath}`} /> */}
    //                     <div className="flex align-items-center gap-2">
    //                         <Link to={"/multiOutdoorUnits/multiOutdoorUnit"}><div className="text-2xl font-bold text-900" style={{}}>{product.title}</div></Link>
    //                     </div>
    //                 </div>
    //                 <div className="flex flex-column align-items-center gap-3 py-5">
    //                     <img className="w-9 shadow-2 border-round" src={`${product.imagepath}`} />
    //                 </div>
    //                 <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>

    //                 <div className="flex align-items-center justify-content-between">
    //                     <span className="text-2xl font-semibold">₪{product.price}</span>
    //                     <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={()=>addToBasket(product)}></Button>
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product._id}>
    //         <div className={classNames('p-4 border-1 surface-border surface-card border-roun', { 'border-top-1 surface-border': index !== 0 })}>
    //             <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${product?.company?.imagePath}`} />
    //             <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
    //             <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
    //                 <div className="flex flex-column align-items-center sm:align-items-start gap-3">
    //                     {/* <Link to={{pathName:`/multiOutdoorUnits/${product.title}` , state: {product:product} }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link> */}
    //                     <Link to={`/multiOutdoorUnits/multiOutdoorUnit/${product._id}` } params={{ product: product }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link>
    //                     <p>{product.imagepath}</p>
    //                     <div className="flex align-items-center gap-3">
    //                         <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
    //                     </div>
    //                 </div>
    //                 <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
    //                     <span className="text-2xl font-semibold">₪{product.price}</span>
    //                     <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={()=>addToBasket(product)}></Button>
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    //     </>
    //     );
    // };

    const UpdateMultiOutdoorUnit = async (m) => {
        const navigationData = {
            type: m,
            // You can add any other data you may want to send
        };
        console.log("mmmmmmmm",m);
        navigate('/multiOutdoorUnits/multiOutdoorUnit/update', { state: navigationData })
        // dispatch(setOverheads(res.data))
    }

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
                        src={`overheads/${product.imagepath}`}
                        alt={product.title}
                        className="w-full h-12rem object-contain border-round"
                    />

                    {/* פרטי המוצר */}
                    <div className="flex flex-column align-items-center text-center gap-2">
                        <Link to={`/multiOutdoorUnits/multiOutdoorUnit/${product._id}`}>
                            <div className="text-xl font-bold text-900">{product.title}</div>
                        </Link>

                        <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)} />
                        <span className="text-lg font-medium text-primary">₪{product.price}</span>
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => UpdateMultiOutdoorUnit(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i></Button> : <></>}
                        {userDetails?.role === 'official' || userDetails?.role === 'admin' ? (<Button onClick={() => openPriceUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מחיר </i> </Button>) : <></>}
                        {/* {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => openStockUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מלאי </i></Button> : <></>} */}

                        {userDetails?.role === 'admin' && (
                            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => deleteMultiOutdoorUnit(product)} tooltip="מחק" tooltipOptions={{ position: 'bottom' }} />
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
        if (!Array.isArray(multiOutdoorUnits) || multiOutdoorUnits.length === 0) {
            return <h1>No multiOutdoorUnits available</h1>; // Fallback UI          
        }
        return <div className="grid grid-nogutter">{multiOutdoorUnits.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    // const header = () => {
    //     return (
    //         // <div className="flex justify-content-end">
    //             // <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
    //         // </div>
    //         <></>
    //     );
    // };

    const filterOverheads = (filters) => {
        // Filter multiOutdoorUnits based on selected criteria
        let filteredOverheads = multiOutdoorUnits;
        console.log(filteredOverheads)

        // Example filter logic
        if (filters.companies.length > 0) {
            filteredOverheads = filteredOverheads.filter(multiOutdoorUnit =>
                filters.companies.includes(multiOutdoorUnit.company.name)
            );
        }
        if (filters.shabbatMode) {
            filteredOverheads = filteredOverheads.filter(multiOutdoorUnit => multiOutdoorUnit.isShabbatCompatible);
        }
        if (filters.wifi) {
            filteredOverheads = filteredOverheads.filter(multiOutdoorUnit => multiOutdoorUnit.hasWifi);
        }
        if (filters.priceRange) {
            filteredOverheads = filteredOverheads.filter(multiOutdoorUnit =>
                multiOutdoorUnit?.price >= filters.priceRange[0] && multiOutdoorUnit.price <= filters.priceRange[1]
            );
        }
        if (filters.btuHeating) {
            filteredOverheads = filteredOverheads.filter(multiOutdoorUnit =>
                multiOutdoorUnit?.btuHeating >= filters.btuHeating
            );
        }
        if (filters.btuCooling) {
            filteredOverheads = filteredOverheads.filter(multiOutdoorUnit =>
                multiOutdoorUnit?.btuCooling >= filters.btuCooling
            );
        }
        if (filters.energyRating) {
            filteredOverheads = filteredOverheads.filter(multiOutdoorUnit =>
                multiOutdoorUnit?.energyRating === filters.energyRating
            );
        }
        console.log(filterOverheads)
        dispatch(setOverheads(filteredOverheads)); // Update the state with the filtered results
    }

    useEffect(() => {
        // getCompanies()

        if (token) {
            setRegistered(true)
        }
    }, [])

    return (
        <>
            {userDetails.role === 'admin' ? <Button onClick={() => goToAddMultiOutdoorUnit("MultiOutdoorUnit")}>add multiOutdoorUnit</Button> : <></>}
            {/* {<Button onClick={ ()=>goToAddOverhead("Overhead")}>add multiOutdoorUnit</Button>} */}
            <div className="card">
                <div className="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Search by name" onChange={(c) => getMultiOutdoorUnitByTitle(c)} value={value} />
                    </IconField>
                </div>
                <DataView value={multiOutdoorUnits} listTemplate={listTemplate} layout={layout} />
            </div>
            <SideFillter onFilter={filterOverheads} />


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

export default MultiOutdoorUnits