import axios from "axios"
import { setUserDeliveries } from "../store/userDeliveriesSlice"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Image } from "primereact/image"
import { Divider } from "primereact/divider"
import { Tag } from "primereact/tag"
import { Card } from "primereact/card"
import { Toast } from "primereact/toast";
import { useRef } from "react";
import useGetFilePath from "../hooks/useGetFilePath"

const AdminOrders = () => {
    const { token } = useSelector((state) => state.token)
    const [deliveries, setDeliveries] = useState([])
    const [orders, setOrders] = useState([]);
    const toast = useRef(null); // Add this line to create a ref for the Toast component
    const { getFilePath } = useGetFilePath()

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
        default: "שגיאה כללית. אנא נסה שוב מאוחר יותר.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו."

    };
    const filterData = (data) => {
        // console.log("before filter", data)
        if (!data) {
            return [];
        }
        return data.filter(delivery => delivery.status !== "recieved");
    };

    const sortData = (data) => {
        // console.log("sort", data);

        if (!data || data.length === 0) {
            return [];
        }
        // console.log("sort", data);
        return data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Return the sorted array
    };

    const getDeliveries = async () => {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        try {
            const res = await axios.get(`http://localhost:8000/api/delivery/`, { headers })
            console.log(res);
            if (res.status === 200) {
                console.log("res.status === 200. Deliveries from server:", res.data)
                // setDeliveries(res.data)
                const sortedOrders = sortData(res.data)
                setOrders(sortedOrders)
                renderDelivery(sortedOrders)
            }
        } catch (error) {
            // Extract the error message from the server response
            const serverMessage = error.response?.data?.message;
            // Translate the message using the dictionary
            const translatedMessage = errorMessages[serverMessage] || errorMessages["default"];
            // Show the error message via a toast
            showToast('error', 'שגיאה', translatedMessage);
            console.error("Error fetching deliveries:", error);
        }
    }

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };
    const renderDelivery = (delivery) => {
        console.log("renderDelivery", delivery);
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
                    {delivery.purchase?.products.map((shoppingBagItem) => {
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
                                {console.log(product.imagepath)
                                }
                                <Image
                                    src={getFilePath(product.imagepath)  || 'air-conditioner.jpg'} 
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
        getDeliveries()
    }, []);

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
                כל ההזמנות
            </h2>
            {/* {console.log("orders", orders)} */}
            {orders.map((delivery) => renderDelivery(delivery))}
        </div>
    )
}
export default AdminOrders