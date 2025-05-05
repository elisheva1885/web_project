import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Link } from 'react-router-dom';
import { Tag } from 'primereact/tag';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Checkbox } from 'primereact/checkbox';
import { setOverheads } from '../store/air-conditioner/overHeadsSlice';
import GooglePayButton from '@google-pay/button-react';

const Payment = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showNewAddressDialog, setShowNewAddressDialog] = useState(false);
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.token);
    const { overheads } = useSelector((state) => state.overheads);
    const dispatch = useDispatch();
    const [address, setAddress] = useState([]);
    const [newAddress, setNewAddress] = useState([]);
    const { basket } = useSelector((state) => state.basket);
    const [layout, setLayout] = useState('list');
    const [selectedItems, setSelectedItems] = useState([]);
    const [purchase, setPurcase] = useState(null)
    // const [products, setProducts] = useState([])
    const [visible, setVisible] = useState(false);
    const [formDisabled, setFromDisabled] = useState(false);
    const [buttonColor, setButtonColor] = useState("default");
    const [buttonType, setButtonType] = useState("buy");
    const [buttonSizeMode, setButtonSizeMode] = useState("static");
    const [buttonWidth, setButtonWidth] = useState(240);
    const [buttonHeight, setButtonHeight] = useState(40);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const location = useLocation();
    const { products } = location.state || {}; // Access the type from state
    console.log("Products from payment ", products);

    const paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
            {
                type: "CARD",
                parameters: {
                    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                    allowedCardNetworks: ["MASTERCARD", "VISA"]
                },
                tokenizationSpecification: {
                    type: "PAYMENT_GATEWAY",
                    parameters: {
                        gateway: "example"
                    }
                }
            }
        ],
        merchantInfo: {
            merchantId: "12345678901234567890",
            merchantName: "Demo Merchant"
        },
        transactionInfo: {
            totalPriceStatus: "FINAL",
            totalPriceLabel: "Total",
            totalPrice: "100.00",
            currencyCode: "USD",
            countryCode: "US"
        }
    };

    const createAddress = async (address) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const res = await axios.post("http://localhost:8000/api/user/address", address, { headers });
            if (res.status === 201) {
                setNewAddress(res.data);
                alert("כתובת להזמנה נשמרה במערכת")
                setShowNewAddressDialog(false); // Close the new address dialog
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("Error");
            }
        }
    };

    const updateProductsStock = async (products) => {
        console.log(" inside update function  ", products);

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const updateRequests = null
            // const updateRequests = products.map(product => {
            //     console.log("product", product);
            //     try {
            //         const data = {
            //             _id: product._id,
            //             amount: 1
            //         };
            //         console.log(data);
            //         return axios.put(`http://localhost:8000/api/air-conditioner/${product.type}/stock`, data, { headers });
            //     }
            //     catch (e) {
            //         alert("error")
            //     }
            // });

            // const responses = await Promise.all(updateRequests);
            // console.log(responses);
            // const updatedOverheads = responses
            //     .filter(res => res.status === 200)
            //     .map(res => res.data);
            // console.log(updatedOverheads);
            // if (updatedOverheads.length > 0) {
            //     dispatch(setOverheads(overheads => {
            //         const existingMap = new Map(overheads.map(item => [item._id, item]));
            //         updatedOverheads.forEach(item => {
            //             existingMap.set(item._id, item); // מחליף אם כבר קיים
            //         });
            //         return Array.from(existingMap.values());
            //     }));
            // }

        } catch (error) {
            if (error.response?.status === 400) {
                alert("All details are required");
            } else if (error.response?.status === 204) {
                alert("The stock didn't change");
            }
        }
    };

    const createDelivery = async (purchase) => {
        if (!address && !newAddress.length) {
            alert('Insert address details')
        }
        const details = {
            address: address ? address : newAddress,
            // purchase:  products.map(product => product.product._id)
            purchase: purchase._id
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            console.log("details", details);
            const res = await axios.post("http://localhost:8000/api/delivery", details, { headers });
            console.log("res", res);
            if (res.status === 201) {
                alert("the deleviry created in the system")
                navigate('/')
            }

        } catch (e) {
            if (e.response) {
                console.error("Error response from server:", e.response.data);
                if (e.response.status === 400) {
                    alert("Error: " + e.response.data.message);
                }
            } else {
                console.error("Error making request:", e.message);
            }
        }
    }

    const createPurchase = async (paymentType) => {
        // setProducts(selectedItems)
        if (products) {
            console.log(products);
            const data = {
                products: products.map(product => { return product.shoppingBagId }),
                paymentType: paymentType
            }
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                const res = await axios.post("http://localhost:8000/api/user/purchase", data, { headers });
                if (res.status === 201) {
                    // console.log("to the function");
                    // updateProductsStock(selectedItems)
                    setPurcase(res.data);
                    console.log(res.data);
                    createDelivery(res.data)
                    alert("ההזמנה הושלמה")
                }
            } catch (error) {
                console.log(error);
                if (error.response?.status === 400) {
                    alert("Error");
                }
            }
            // }
        }
    }

    const onSubmit = (data) => {
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

    // const listItem = (product, index) => {
    //     const isSelected = selectedItems.some(item => item._id === product._id);
    //     const handleSelectionChange = (product) => {
    //         const isSelected = selectedItems.some(item => item._id === product._id);
    //         if (isSelected) {
    //             setSelectedItems(selectedItems.filter(item => item._id !== product._id));
    //         } else {
    //             setSelectedItems([...selectedItems, product]);
    //         }
    //     };
    //     if (product && product.stock > 0) {
    //         return (

    //             <div className="col-12" key={product._id}>
    //                 <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
    //                     <Checkbox inputId={product._id} checked={isSelected} onChange={() => handleSelectionChange(product)} />
    //                     <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
    //                     <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
    //                         <div className="flex flex-column align-items-center sm:align-items-start gap-3">
    //                             <Link to={`/overheads/overhead/${product._id}`}><div className="text-2xl font-bold text-900">{product.title}</div></Link>
    //                             <div className="flex align-items-center gap-3">
    //                                 <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
    //                             </div>
    //                         </div>
    //                         <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
    //                             <span className="text-2xl font-semibold">₪{product.price}</span>
    //                             {/* <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={() => deleteShoppingBag(product)}> להסרה מהעגלה </Button> */}
    //                         </div>
    //                     </div>
    //                 </div>
    //             </div>
    //         );
    //     }
    //     else {
    //         return (<></>)
    //     }
    // };

    // const listTemplate = (products, layout) => {
    //     if (!basket) {
    //         return <h1>basket is empty</h1>
    //     }
    //     return <div className="grid grid-nogutter">{basket.map((product, index) => listItem(product, index))}</div>;
    // };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };

    const usingAddress = () => {
        setFromDisabled(true)
    }

    const existAddress = () => {
        return (
            <div>
                <Dialog
                    header="כתובת משלוח"
                    visible={visible}
                    style={{
                        width: '35vw', // Make the dialog narrower
                        textAlign: 'right', // Align content to the right
                        borderRadius: '12px', // Add rounded corners
                        direction: 'rtl', // Right-to-left direction
                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Add a drop shadow
                        background: 'linear-gradient(135deg, #f6d365, #fda085)', // Add a colorful gradient background
                    }}
                    onHide={() => setVisible(false)}
                    modal
                >
                    <div style={{ color: '#333', lineHeight: '1.6' }}>
                        <h3 style={{ marginBottom: '8px' }}>כתובת שמורה:</h3>
                        <h5 style={{ marginBottom: '8px' }}>עיר: {address.city}</h5>
                        <h5 style={{ marginBottom: '8px' }}>
                            רחוב: {address.street} {address.building_num}
                        </h5>
                        <h5 style={{ marginBottom: '8px' }}>
                            דירה: {address.apartment_num}, קומה: {address.floor}
                        </h5>
                        <h5 style={{ marginBottom: '8px' }}>מיקוד: {address.zip_code}</h5>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                        <Button
                            label="לשימוש בכתובת"
                            onClick={() => {
                                usingAddress();
                                setVisible(false);
                            }}
                            className="p-button-success"
                            style={{
                                backgroundColor: '#4caf50', // Green button background
                                color: '#fff', // White text
                                border: 'none', // Remove border
                                padding: '10px 20px', // Adjust padding
                            }}
                        />
                        <Button
                            label="ליצירת כתובת חדשה"
                            onClick={() => {
                                setVisible(false); // Hide existing address dialog
                                setShowNewAddressDialog(true); // Show new address dialog
                            }} className="p-button-secondary"
                            style={{
                                backgroundColor: '#ff9800', // Orange button background
                                color: '#fff', // White text
                                border: 'none', // Remove border
                                padding: '10px 20px', // Adjust padding
                            }}
                        />
                    </div>
                </Dialog>
            </div>
        );
    };
    const getUserAddress = async (c) => {
        console.log("address in getUserAddress: ")
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const res = await axios.get(`http://localhost:8000/api/user/address/existAddress`, { headers })
            if (res.status === 200) {
                console.log("address: ", res.data[0])
                setAddress(res.data[0])
                setVisible(true);
            }
        }
        catch (e) {
            console.error(e)
        }
    }
    const renderNewAddressDialog = () => {
        return (
            <Dialog
                header="הוסף כתובת חדשה"
                visible={showNewAddressDialog}
                onHide={() => setShowNewAddressDialog(false)}
                breakpoints={{ '960px': '80vw', '640px': '90vw' }}
                style={{
                    width: '40vw',
                    direction: 'rtl', // Align content to the right (handles text direction for Hebrew)
                    border: '2px solid #90caf9', // Styled border with color
                    borderRadius: '12px', // Rounded corners for the dialog
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)', // Add a shadow for better design
                }}
                modal
            >
                <div style={{ padding: '20px', textAlign: 'right', color: '#333' }}>
                    <h5 className="text-center" style={{ marginBottom: '20px' }}>
                        הוספת כתובת
                    </h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="country"
                                    control={control}
                                    defaultValue="ישראל"
                                    rules={{ required: 'יש להזין מדינה' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} {...field} disabled={formDisabled} />
                                    )}
                                />
                                <label htmlFor="country">*מדינה</label>
                            </span>
                            {getFormErrorMessage('country')}
                        </div>
    
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="city"
                                    control={control}
                                    rules={{ required: 'יש להזין עיר' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} {...field} disabled={formDisabled} />
                                    )}
                                />
                                <label htmlFor="city">*עיר</label>
                            </span>
                            {getFormErrorMessage('city')}
                        </div>
    
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="street"
                                    control={control}
                                    rules={{ required: 'יש להזין רחוב' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} {...field} disabled={formDisabled} />
                                    )}
                                />
                                <label htmlFor="street">*רחוב</label>
                            </span>
                            {getFormErrorMessage('street')}
                        </div>
    
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="building_num"
                                    control={control}
                                    rules={{ required: 'יש להזין מספר בניין' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} type="number" {...field} disabled={formDisabled} />
                                    )}
                                />
                                <label htmlFor="building_num">*מספר בניין</label>
                            </span>
                            {getFormErrorMessage('building_num')}
                        </div>
    
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="apartment_num"
                                    control={control}
                                    rules={{ required: 'יש להזין מספר דירה' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} type="number" {...field} disabled={formDisabled} />
                                    )}
                                />
                                <label htmlFor="apartment_num">*מספר דירה</label>
                            </span>
                            {getFormErrorMessage('apartment_num')}
                        </div>
    
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="floor"
                                    control={control}
                                    rules={{ required: 'יש להזין קומה' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} type="number" {...field} disabled={formDisabled} />
                                    )}
                                />
                                <label htmlFor="floor">*קומה</label>
                            </span>
                            {getFormErrorMessage('floor')}
                        </div>
    
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="zip_code"
                                    control={control}
                                    rules={{ required: 'יש להזין מיקוד' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} {...field} disabled={formDisabled} />
                                    )}
                                />
                                <label htmlFor="zip_code">*מיקוד</label>
                            </span>
                            {getFormErrorMessage('zip_code')}
                        </div>
    
                        <Button
                            type="submit"
                            label="הוסף כתובת"
                            className="mt-3"
                            disabled={formDisabled}
                            style={{
                                backgroundColor: '#90caf9',
                                border: 'none',
                                color: '#fff',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '1rem',
                            }}
                        />
                    </form>
                </div>
            </Dialog>
        );
    };
    useEffect(() => {
        getUserAddress()
    }, [])

    return (

        <div style={{ paddingTop: '60px' }}>
            <GooglePayButton
                environment="TEST"
                buttonColor={buttonColor}
                buttonType={buttonType}
                buttonSizeMode={buttonSizeMode}
                paymentRequest={paymentRequest}
                onLoadPaymentData={paymentRequest => {
                    console.log("load payment data", paymentRequest);
                }}
                style={{ width: buttonWidth, height: buttonHeight }}
            />
            {console.log("in the return",address)}
            {address ? existAddress() : <></>}

            <div>
                {/* Left: Payment Square */}
                <>
                    <h3>Choose Payment</h3>
                    <Button label="Pay with PayPal" icon="pi pi-paypal" className="p-button-info p-mb-2" onClick={() => createPurchase("paypal")} />
                    <Button label="Pay with Google Pay" icon="pi pi-google" className="p-button-warning" onClick={() => createPurchase("google")} />
                    {/* </div> */}

                    <script async src="https://pay.google.com/gp/p/js/pay.js" onload="onGooglePayLoaded()" ></script>
                </>
                {/* </div> */}
                <div style={{ width: "65%", marginLeft: "auto" }}>
                    <div className="form-demo">
                        <Dialog visible={showSuccessDialog} style={{ width: '30vw' }} onHide={() => setShowSuccessDialog(false)} position="top" footer={<Button label="Close" onClick={() => (false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} disabled={formDisabled}>
                            <div className="flex justify-content-center flex-column pt-6 px-3">
                                <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                                <h5>!הכתובת נוספה בהצלחה</h5>
                            </div>
                        </Dialog>

                        <div className="flex justify-content-center">
                            {showNewAddressDialog && (renderNewAddressDialog() )}
                        </div>
                    </div>
                </div>
                <div className="flex">
                    {/* Left Panel with Payment Button */}
                    <div className="card p-4 mr-4" style={{ width: '20%', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
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

                            <h2> המוצרים שנבחרו</h2>
                            <br />

                        </div>
                        <div> {products.map(product => product.product.title)} </div>

                        <div style={{ width: "65%", marginLeft: "auto" }}>
                            {/* <DataView value={basket} listTemplate={listTemplate} layout={layout} header={header()} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment
