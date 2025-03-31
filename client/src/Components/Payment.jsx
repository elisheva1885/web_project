// import { useState } from "react";
// import { useSelector } from "react-redux";
// import axios from "axios";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext";
// import { Divider } from "primereact/divider";

// const Payment = () => {
//     const { token } = useSelector((state) => state.token);
//     const [address, setAddress] = useState();

//     const createAddress = async (address) => {
//         try {
//             const headers = {
//                 'Authorization': `Bearer ${token}`
//             };
//             const res = await axios.post("http://localhost:8000/api/user/address", address, { headers });
//             if (res.status === 201) {
//                 setAddress(res.data);
//                 console.log(res.data);
//             }
//         } catch (error) {
//             console.log(error);
//             if (error.response?.status === 400) {
//                 alert("Error");
//             }
//         }
//     };
//     const createPurchase = async(paymentType)=> {
        
//     }

//     const [form, setForm] = useState({
//         country: "ישראל",
//         city: "",
//         street: "",
//         building_num: "",
//         apartment_num: "",
//         floor: "",
//         zip_code: "",
//     });

//     const [errors, setErrors] = useState({});

//     const handleChange = (e) => {
//         setForm({ ...form, [e.target.name]: e.target.value });
//     };

//     const validate = () => {
//         let newErrors = {};
//         for (let key in form) {
//             if (!form[key]) newErrors[key] = "Required";
//         }
//         return newErrors;
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const newErrors = validate();
//         if (Object.keys(newErrors).length === 0) {
//             createAddress(form);
//         }
//         setErrors(newErrors);
//     };

//     return (
//         <div style={{ display: "flex", width: "100vw", height: "100vh", padding: "20px" }}>
//             {/* Left: Payment Square */}
//             <div
//                 style={{
//                     width: "30%",
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     border: "2px solid #ccc",
//                     borderRadius: "10px",
//                     padding: "20px",
//                     height: "300px",
//                     boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
//                 }}
//             >
//                 <h3>Choose Payment</h3>
//                 <Button label="Pay with PayPal" icon="pi pi-paypal" className="p-button-info p-mb-2" onClick={()=>createPurchase("paypal")} />
//                 <Button label="Pay with Google Pay" icon="pi pi-google" className="p-button-warning" onClick={()=>createPurchase("google")}/>
//             </div>

//             <Divider layout="vertical" />

//             {/* Right: Address Form */}
//             <div style={{ width: "65%", marginLeft: "auto" }}>
//                 <form onSubmit={handleSubmit} className="p-fluid">
//                     {["country", "city", "street", "zip_code"].map((field) => (
//                         <div key={field} className="p-field">
//                             <label htmlFor={field}>{field.replace("_", " ")}</label>
//                             <InputText id={field} name={field} value={form[field]} onChange={handleChange} />
//                             {errors[field] && <small className="p-error">{errors[field]}</small>}
//                         </div>
//                     ))}
//                     {["building_num", "apartment_num", "floor"].map((field) => (
//                         <div key={field} className="p-field">
//                             <label htmlFor={field}>{field.replace("_", " ")}</label>
//                             <InputText id={field} name={field} type="number" value={form[field]} onChange={handleChange} />
//                             {errors[field] && <small className="p-error">{errors[field]}</small>}
//                         </div>
//                     ))}
//                     <Button type="submit" label="Submit" className="p-mt-2" />
//                 </form>
//             </div>
//         </div>



//     );
// };

// export default Payment;


import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Link } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';


const AddAddress = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.token);
    const [address, setAddress] = useState();
    const { basket } = useSelector((state) => state.basket);
    const [layout, setLayout] = useState('list');

    const createAddress = async (address) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const res = await axios.post("http://localhost:8000/api/user/address", address, { headers });
            if (res.status === 201) {
                setAddress(res.data);
                alert("כתובת להזמנה נשמרה במערכת")
                console.log(res.data);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("Error");
            }
        }
    };
    const createPurchase = async(paymentType)=> {
        
     }
    const onSubmit =  (data) => {
        createAddress(data)
    };

    const getFormErrorMessage = (name) => {
        const error = name.split('.').reduce((acc, part) => acc && acc[part], errors);
        return error ? <small className="p-error">{error.message}</small> : null;
    };
    const getSeverity = (stock) => {
        if (stock >= 50) return 'success';
        else if (stock > 0) return 'warning';
        else return 'danger';
    };

    const getSeverityText = (product) => {
        const severity = getSeverity(product.stock);
        switch (severity) {
            case 'success': return "במלאי";
            case 'warning': return "פריטים אחרונים";
            case 'danger': return "אזל מהמלאי";
            default: return null;
        }
    };

    const listItem = (product, index) => {
        return (
            <div className="col-12" key={product._id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Link to={`/overheads/overhead/${product._id}`}><div className="text-2xl font-bold text-900">{product.title}</div></Link>
                            <div className="flex align-items-center gap-3">
                                <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">₪{product.price}</span>
                            {/* <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={() => deleteShoppingBag(product)}> להסרה מהעגלה </Button> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (products, layout) => {
        if(!basket){
            return <h1>basket is empty</h1>
        }
        return <div className="grid grid-nogutter">{basket.map((product, index) => listItem(product, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    return (
        <div>
        {/* <div style={{ display: "flex", width: "100vw", height: "100vh", padding: "20px" }}> */}
                     {/* Left: Payment Square */}
                     {/* <div
                         style={{
                             width: "30%",
                             display: "flex",
                             flexDirection: "column",
                             justifyContent: "center",
                             alignItems: "center",
                             border: "2px solid #ccc",
                             borderRadius: "10px",
                             padding: "20px",
                             height: "300px",
                             boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                         }}
                     > */}
                     <>
                         <h3>Choose Payment</h3>
                        <Button label="Pay with PayPal" icon="pi pi-paypal" className="p-button-info p-mb-2" onClick={()=>createPurchase("paypal")} />
                        <Button label="Pay with Google Pay" icon="pi pi-google" className="p-button-warning" onClick={()=>createPurchase("google")}/>
                     {/* </div> */}
                     </>
            {/* </div> */}
     <div style={{ width: "65%", marginLeft: "auto" }}>
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={<Button label="Close" onClick={() => setShowMessage(false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '40vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Address Added Successfully!</h5>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Add Address</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="country" control={control} defaultValue="ישראל" rules={{ required: 'Country is required.' }} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="country">*Country</label>
                            </span>
                            {getFormErrorMessage('country')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="city" control={control} rules={{ required: 'City is required.' }} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="city">*City</label>
                            </span>
                            {getFormErrorMessage('city')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="street" control={control} rules={{ required: 'Street is required.' }} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="street">*Street</label>
                            </span>
                            {getFormErrorMessage('street')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="building_num" control={control} rules={{ required: 'Building number is required.' }} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="building_num">*Building Number</label>
                            </span>
                            {getFormErrorMessage('building_num')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="apartment_num" control={control} rules={{ required: 'Apartment number is required.' }} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="apartment_num">*Apartment Number</label>
                            </span>
                            {getFormErrorMessage('apartment_num')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="floor" control={control} rules={{ required: 'Floor is required.' }} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="floor">*Floor</label>
                            </span>
                            {getFormErrorMessage('floor')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="zip_code" control={control} rules={{ required: 'Zip code is required.' }} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="zip_code">*Zip Code</label>
                            </span>
                            {getFormErrorMessage('zip_code')}
                        </div>

                        <Button type="submit" label="Add Address" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
        </div>
        <div className="flex">
        {/* Left Panel with Payment Button */}
        <div className="card p-4 mr-4" style={{ width: '200px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h3>סך הכל</h3>
            {/* {setTotalAmount(amount)} */}
            {/* <h4>{amount} ש"ח</h4> */}
            <div className="flex justify-content-center align-items-center" style={{ height: '200px', border: '2px solid #e0e0e0', borderRadius: '8px' }}>
                {/* <Button label="לשלם עכשיו" icon="pi pi-credit-card" onClick={goToPayment} className="p-button-success p-button-rounded" style={{ width: '150px' }} /> */}
            </div>
        </div>

        {/* Right Side with Shopping Basket Items */}
        <div className="card flex-1">
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                </IconField>
            </div>
            <DataView value={basket} listTemplate={listTemplate} layout={layout} header={header()} />
        </div>
    </div>
        </div>
    );
};

export default AddAddress;
