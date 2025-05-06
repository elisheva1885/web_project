import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setUserDeliveries } from '../store/userDeliveriesSlice';
import { Card } from "primereact/card";
import { Timeline } from "primereact/timeline";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const MyOrders = () => {
    const dispatch = useDispatch();
    const { userDeliveries } = useSelector((state) => state.userDeliveries);
    const { token } = useSelector((state) => state.token);
    const [orders, setOrders] = useState([]);
    const toast = useRef(null);
    const errorMessages = {
        USER_REQUIRED: "משתמש נדרש.",
        INVALID_ADDRESS: "כתובת לא חוקית.",
        INVALID_PURCHASE_ID: "מזהה רכישה לא חוקי.",
        NO_DELIVERIES_FOUND: "לא נמצאו הזמנות.",
        NO_DELIVERIES_FOR_USER: "לא נמצאו הזמנות עבור המשתמש.",
        DELIVERY_CREATION_FAILED: "יצירת המשלוח נכשלה.",
        DELIVERY_NOT_FOUND: "המשלוח לא נמצא.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. אנא נסה שוב מאוחר יותר.",
        UNAUTHORIZED: "אין לך הרשאות לצפות בהזמנות.",
        default: "שגיאה כללית. אנא נסה שוב מאוחר יותר."
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };

    const sortData = (data) => {
        if (!data || data.length === 0) {
            return [];
        }
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Return the sorted array
    };

    const filterData = (data) => {
        console.log("before filter", data)
        if (!data) {
            return [];
        }
        return data.filter(delivery => delivery.status !== "recieved");
    };

    const getUserDeliveries = async () => {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        try {
            const res = await axios.get(`http://localhost:8000/api/delivery/byid`, { headers })
            if (res.status === 200) {
                console.log("res.status === 200. UserDeliveries from server:", res.data)
                dispatch(setUserDeliveries(res.data))
                console.log("userDeliveries", userDeliveries)
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message; // Get server error message
            const translatedMessage = errorMessages[serverMessage] || errorMessages["default"]; // Translate message
            showToast('error', 'שגיאה', translatedMessage); // Show toast with translated message
            console.error("Error fetching user deliveries:", error);
        }
        const filteredOrders = filterData(userDeliveries)
        const sortedOrders = sortData(filteredOrders)
        setOrders(sortedOrders)
        console.log("sortedOrders", orders)
    }


    const renderDelivery = (delivery) => {
        const orderDate = new Date(delivery.createdAt).toLocaleDateString();
        const statusColors = {
            "waiting to be delivered": "warning",
            "on the way": "info",
            arrived: "success",
            recieved: "success",
        };
        const statusIcons = {
            "waiting to be delivered": "pi pi-clock",
            "on the way": "pi pi-truck",
            arrived: "pi pi-check",
            recieved: "pi pi-check",
        };
        const statusTranslations = {
            "waiting to be delivered": "ממתין למשלוח",
            "on the way": "בדרך",
            arrived: "הגיע",
            recieved: "התקבל",
        };

        return (
            <Card
                key={delivery._id}
                title={`${orderDate} :תאריך הזמנה`}
                // subTitle={`:סטטוס הזמנה `}
                className="p-mb-3"
            >
                {/* Add status with a Tag */}
                <Tag
                    icon={statusIcons[delivery.status]}
                    value={statusTranslations[delivery.status]}
                    severity={statusColors[delivery.status]}
                ></Tag>

                <Divider />

                {/* Render the list of air-conditioners */}

                <div
                    className="p-d-flex p-flex-wrap"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                        overflow: "auto"
                    }}
                >
                    {delivery.purchase.products.map((shoppingBagItem) => {
                        const product = shoppingBagItem.product_id || {}; // product_id now dynamically resolves to the correct product type
                        return (
                            <div
                                key={shoppingBagItem._id}
                                style={{
                                    textAlign: "center",
                                    flex: "0 0 auto",
                                    maxWidth: "150px",
                                    margin: "0 1rem",
                                }}
                            >
                                <Image
                                    src={product.imagepath || 'air-conditioner.jpg'} // Use a placeholder image if undefined
                                    alt={product.title || 'No Title'}
                                    width="100"
                                    preview
                                />
                                <p style={{
                                    fontWeight: "bold",
                                    fontSize: "1.1rem",
                                    color: "#333",
                                    margin: "0.5rem 0"
                                }}>
                                    {product.title || 'No Title'}
                                </p>
                                <p>{shoppingBagItem.amount || 'No Amount'} :כמות</p>
                            </div>
                        );
                    })}
                </div>
            </Card>
        );
    };



    useEffect(() => {
        if (userDeliveries && userDeliveries.length > 0) {
            const filteredOrders = filterData(userDeliveries);
            const sortedOrders = sortData(filteredOrders);
            setOrders(sortedOrders);
        }
    }, [userDeliveries]); // Dependency on userDeliveries

    // Fetch deliveries when the component is mounted
    useEffect(() => {
        getUserDeliveries();
    }, []); // Empty dependency array means this runs only once

    return (
        <div className="my-orders">
            <Toast ref={toast} />
            <h2 style={{
                fontSize: "2rem",
                fontWeight: "bold",
                textAlign: "center",
                color: "#2C3E50",
                marginBottom: "1rem",
                borderBottom: "2px solid #3498DB",
                paddingBottom: "0.5rem"
            }}>
                ההזמנות שלי
            </h2>
            {orders.map((delivery) => renderDelivery(delivery))}
        </div>
    )
}

export default MyOrders