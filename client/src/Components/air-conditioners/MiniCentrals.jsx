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
import { setMiniCenterals } from '../../store/air-conditioner/MiniCenteralsSlice';
import SideFillter from '../SideFillter';


const MiniCenteral = lazy(() => import('./MiniCenteral'));


const MiniCenterals = () => {

    const {token} = useSelector((state) => state.token)
    // const {companies} = useSelector((state) => state.companies)
    const {basket} = useSelector((state) => state.basket)
    const {userDetails} = useSelector((state) => state.userDetails);
    const {MiniCenterals}= useSelector((state) => state.MiniCenterals);
    const [value, setValue] = useState('')
    const [shoppingBags, setShoppingBags] = useState([])
    const [registered, setRegistered] = useState(false);
    const [layout, setLayout] = useState('grid');
    const navigate = useNavigate();
    const dispatch = useDispatch();
   

    
    const goToAddMiniCenteral = (type) => {
        const navigationData = {
            type: type,
            // You can add any other data you may want to send
        };
        navigate('/MiniCenterals/add', { state: navigationData });
    };

    const addToBasket = async(product) => {
        //function to create prucace object
        //by the token and the object
        alert("shoping")
        const shoppingBagDetails = {
            product_id  : product._id,
            type : "MiniCenteral"
        }
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.post('http://localhost:8000/api/user/shoppingBag', shoppingBagDetails, {headers},)
            if (res.status === 200) {
                alert("in here")
                dispatch(setBasket(basket.push(res.data)))
                console.log("res.data",res.data);
                console.log("useState",shoppingBags);
            }
            if(res.status === 409){
                // updateAmount(product)
            }
        }
        catch (e) {
            console.error(e)
        }

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
    // const listItem = (product, index) => {
    //     return (
    //         <>
    //             <div className="col-12" key={product._id}>
    //                 <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
    //                     <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${product?.company?.imagePath}`} />
    //                     <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
    //                     <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
    //                         <div className="flex flex-column align-items-center sm:align-items-start gap-3">
    //                             {/* <Link to={{pathName:`/MiniCenterals/${product.title}` , state: {product:product} }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link> */}
    //                             <Link to={`/MiniCenterals/MiniCenteral/${product._id}` } params={{ product: product }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link>
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
    //                         <Link to={"/MiniCenterals/MiniCenteral"}><div className="text-2xl font-bold text-900" style={{}}>{product.title}</div></Link>
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
    //                     {/* <Link to={{pathName:`/MiniCenterals/${product.title}` , state: {product:product} }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link> */}
    //                     <Link to={`/MiniCenterals/MiniCenteral/${product._id}` } params={{ product: product }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link>
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
                        src={`MiniCenterals/${product.imagepath}`}
                        alt={product.title}
                        className="w-full h-12rem object-contain border-round"
                    />
    
                    {/* פרטי המוצר */}
                    <div className="flex flex-column align-items-center text-center gap-2">
                        <Link to={`/MiniCenterals/MiniCenteral/${product._id}`}>
                            <div className="text-xl font-bold text-900">{product.title}</div>
                        </Link>
    
                        <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)} />
                        <span className="text-lg font-medium text-primary">₪{product.price}</span>
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
        if (!Array.isArray(MiniCenterals) || MiniCenterals.length === 0) {
            return <h1>No MiniCenterals available</h1>; // Fallback UI          
            }
        return <div className="grid grid-nogutter">{MiniCenterals.map((product, index) => itemTemplate(product, layout, index))}</div>;
    };

    // const header = () => {
    //     return (
    //         // <div className="flex justify-content-end">
    //             // <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
    //         // </div>
    //         <></>
    //     );
    // };


    useEffect(() => {
        // getCompanies()
        
        if(token){
            setRegistered(true)
        }
    }, [])

    return (
        <>
            {userDetails.role === 'admin'?<Button onClick={ ()=>goToAddMiniCenteral("MiniCenteral")}>add MiniCenteral</Button>: <></> }
            {/* {<Button onClick={ ()=>goToAddMiniCenteral("MiniCenteral")}>add MiniCenteral</Button>} */}
            <div className="card">
                <div className="flex justify-content-end">
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText placeholder="Search by name" onChange={(c) => getMiniCenteralByTitle(c)} value={value} />
                    </IconField>
                </div>
                <DataView value={MiniCenterals} listTemplate={listTemplate} layout={layout}/>
            </div>
            <SideFillter/>
        </>
    )
}

export default MiniCenterals