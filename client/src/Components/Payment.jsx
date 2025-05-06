import React, { useEffect, useState } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
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
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

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
    const { products } = location.state || {};
    const toast = useRef(null);

    const messages = {
        // Error Messages
        INVALID_USER_ID: "מזהה המשתמש אינו תקין.",
        INVALID_ADDRESS: "כתובת לא תקינה.",
        REQUIRED_FIELDS_MISSING: 'שדות חובה חסרים.',
        ADDRESS_CREATION_FAILED: 'יצירת הכתובת נכשלה.',
        PURCHASE_CREATION_FAILED: 'יצירת הרכישה נכשלה.',
        DELIVERY_CREATION_FAILED: 'יצירת המשלוח נכשלה.',
        NO_ADDRESS_FOUND: "לא נמצאה כתובת.",
        ADDRESS_ALREADY_EXISTS: "כתובת כבר קיימת במערכת.",

        // Success Messages
        ADDRESS_CREATED_SUCCESSFULLY: "הכתובת נוספה בהצלחה.",
        PURCHASE_COMPLETED: "הרכישה הושלמה בהצלחה.",
        DELIVERY_CREATED_SUCCESSFULLY: "משלוח נוצר בהצלחה.",

        // Warnings
        OUT_OF_STOCK: "המוצר אזל מהמלאי.",
        NOT_ENOUGH_STOCK: "אין מספיק מלאי למוצר.",
        PRODUCT_NOT_FOUND: "המוצר לא נמצא.",

        // Informational
        INFO_FETCHING_ADDRESS: "כתובת נטענת מהשרת.",
        INFO_ADDRESS_USED: "כתובת קיימת נבחרה לשימוש.",

        // Default
        default: "אירעה שגיאה לא צפויה. נסה שוב."
    };

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
                setShowNewAddressDialog(false); // Close the new address dialog
                setShowSuccessDialog(true)
                showToast('success', 'הצלחה', messages.ADDRESS_CREATED_SUCCESSFULLY);
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage]);
            console.error("Error creating address:", error);
        }
    };

    const createDelivery = async (purchase) => {
        if (!address && !newAddress.length) {
            alert('Insert address details')
        }
        const details = {
            address: address ? address : newAddress,
            purchase: purchase._id
        }

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const res = await axios.post("http://localhost:8000/api/delivery", details, { headers });
            if (res.status === 201) {
                showToast('success', 'הצלחה', messages.DELIVERY_CREATED_SUCCESSFULLY);
                navigate('/')
            }

        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
        showToast('error', 'שגיאה', messages[serverMessage]);
        console.error("Error creating delivery:", error);
        }
    }

    const createPurchase = async (paymentType) => {
        if (products) {
            console.log("createPurchase products: ", products);
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
                    setPurcase(res.data);
                    createDelivery(res.data)
                    showToast('success', 'הצלחה', messages.PURCHASE_COMPLETED);
                }
            } catch (error) {
                const serverMessage = error.response?.data?.message || 'default';
                showToast('error', 'שגיאה', messages[serverMessage]);
                console.error("Error creating purchase:", error);
            }
        }
    }

    const onSubmit = (data) => {
        createAddress(data)
    };

    const getFormErrorMessage = (name) => {
        const error = name.split('.').reduce((acc, part) => acc && acc[part], errors);
        return error ? <small className="p-error">{error.message}</small> : null;
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
                                setShowNewAddressDialog(true); // Show new address dialog
                                setVisible(false); // Hide existing address dialog
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
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const res = await axios.get(`http://localhost:8000/api/user/address/existAddress`, { headers })
            if (res.status === 200) {
                setAddress(res.data[0])
                setVisible(true);
                showToast('info', 'מידע', messages.INFO_ADDRESS_USED);
            }
        }
        catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage]);
            console.error("Error fetching user address:", error);        }
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

    const DefineAddressButton = () => {
        return (
            <Button
                label="הגדר כתובת למשלוח"
                icon="pi pi-map-marker"
                className="p-button-rounded p-button-info"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, #d0f0fd, #b0e0f8)',
                    border: 'none',
                    color: '#000',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }}
                onClick={() => {
                    setVisible(true);
                    if (address) { // Check if address exists
                        existAddress();
                    }
                }}
            />
        );
    };

    const AddressAddedSuccessfulyDialog = () => {
        return (
            <Dialog visible={showSuccessDialog} style={{ width: '30vw' }} onClick={() => setShowSuccessDialog(false)} onHide={() => setShowSuccessDialog(false)} position="top" footer={<Button label="Close" onClick={() => (false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} disabled={formDisabled} modal>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>!הכתובת נוספה בהצלחה</h5>
                </div>
            </Dialog>
        )
    }

    const TotalSumDisplay = () => {
        // Calculate the total sum
        const totalSum = products.reduce((sum, item) => sum + (item.product.price * item.amount), 0);

        return (
            <div
                className="card p-4"
                style={{
                    position: 'absolute', // Top-right placement
                    top: '20px',          // Adjust vertical position
                    right: '20px',        // Adjust horizontal position
                    width: '250px',       // Slightly larger width
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #d0f0fd, #b0e0f8)',
                    border: '2px solid #90caf9',
                    color: '#333',
                }}
            >
                <h3 style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '1.5rem' }}>סך הכל</h3>
                <h4 style={{ marginBottom: '10px', fontSize: '1.2rem' }}>₪{totalSum.toFixed(2)}</h4>
                <p style={{ fontSize: '0.9rem', color: '#666' }}>כולל את כל המוצרים שנבחרו</p>
            </div>
        );
    };

    const OrderProductsDisplay = ({ products }) => {
        console.log("products in order display", products);
        return (
            <div
                style={{
                    padding: '20px',
                    marginTop: '120px', // Add spacing from top
                    direction: 'rtl', // Set text direction
                    textAlign: 'right', // Center-align the table
                    marginLeft: 'auto', // Center align horizontally
                    marginRight: 'auto', // Center align horizontally
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for better look
                    border: '1px solid #ccc', // Add border
                    borderRadius: '12px', // Rounded corners
                    width: '50%'
                }}
            >
                <h2 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '1.8rem', color: '#333' }}>
                    מוצרים שנבחרו
                </h2>
                <DataTable
                    value={products}
                    paginator={false} // Disable pagination
                    scrollable={false} // Disable scrolling
                    stripedRows
                    rows={products.length}
                    style={{
                        direction: 'rtl',
                        textAlign: 'right', // Align text for RTL languages
                        width: '100%',     // Full width for table
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Column
                        field="product.title"
                        header="כותרת מוצר"
                        style={{ width: '40%', borderRight: '1px solid #ccc', textAlign: 'right' }} />
                    <Column
                        header="תמונת מוצר"
                        body={(rowData) => (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <img
                                    src={'/' + rowData.product.imagepath}
                                    alt={rowData.product.title}
                                    style={{
                                        width: '80px',
                                        height: 'auto',
                                        objectFit: 'contain',
                                        borderRadius: '4px',
                                        borderRight: '1px solid #ccc', // Add right border
                                        textAlign: 'center'
                                    }}
                                />
                            </div>
                        )}
                        style={{ width: '30%' }}
                    />
                    <Column
                        field="amount"
                        header="כמות"
                        style={{ width: '30%', textAlign: 'right' }}
                    />
                </DataTable>
            </div>
        );
    };

    const PaymentAndAddressButtons = () => {
        return (
            <div style={{
                position: 'absolute',
                top: '20px',           // Same vertical alignment as TotalSumDisplay
                left: '20px',          // Align to the left
                display: 'flex',
                flexDirection: 'column', // Stack buttons vertically
                gap: '10px',           // Add spacing between buttons
            }}>
                <DefineAddressButton />
                {address ? existAddress() : <></>}
                {/* <GooglePayButton
                    environment="TEST"
                    buttonColor={buttonColor}
                    buttonType={buttonType}
                    buttonSizeMode={buttonSizeMode}
                    paymentRequest={paymentRequest}
                    onLoadPaymentData={paymentRequest => {
                        console.log("load payment data", paymentRequest);
                    }}
                    style={{ width: buttonWidth, height: buttonHeight }}
                /> */}
                <Button
                    label="Pay with PayPal"
                    icon="pi pi-paypal"
                    className="p-button-info"
                    style={{
                        width: '250px', // Increase button width
                        height: '60px', // Increase button height
                        fontSize: '1.2rem', // Increase font size
                        background: 'linear-gradient(135deg, #d0f0fd, #b0e0f8)', // Matching theme
                        border: 'none',
                        color: '#000',
                        borderRadius: '8px', // Rounded corners
                    }}
                    onClick={() => createPurchase("paypal")}
                />
                <Button
                    label="Pay with Google Pay"
                    icon="pi pi-google"
                    className="p-button-warning"
                    style={{
                        width: '250px',
                        background: 'linear-gradient(135deg, #fbc2eb, #a18cd1)', // Matching theme
                        border: 'none',
                        color: '#000',
                        height: '60px', // Increase button height
                        fontSize: '1.2rem', // Increase font size
                        borderRadius: '8px', // Rounded corners
                    }}
                    onClick={() => createPurchase("google")}
                />
            </div>
        );
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    useEffect(() => {
        getUserAddress()
    }, [])

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh', // Full-page height
            padding: '20px',
            background: '#f5f5f5', // Neutral background for contrast
            display: 'flex',
            flexDirection: 'column',
            gap: '20px', // Spacing between sections
        }}>
            <Toast ref={toast} />
            {existAddress()}
            {AddressAddedSuccessfulyDialog()}
            {renderNewAddressDialog()}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between', // Align Total Sum and Payment Buttons
                alignItems: 'flex-start',        // Align items to the top
                position: 'relative',
            }}>
                <PaymentAndAddressButtons />
                <TotalSumDisplay />
            </div>
            <div style={{
                marginTop: '120px', // Add spacing between top and products section
                zIndex: 1,         // Ensure products are below the top section
            }}>
                <OrderProductsDisplay products={products} />
            </div>
        </div>
    );
};

export default Payment
