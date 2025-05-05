import axios from "axios"
import { setUserDeliveries } from "../store/userDeliveriesSlice"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { Image } from "primereact/image"
import { Divider } from "primereact/divider"
import { Tag } from "primereact/tag"
import { Card } from "primereact/card"

const AdminOrders = () => {
    const { token } = useSelector((state) => state.token)
    const [deliveries, setDeliveries] = useState([])
    const [orders, setOrders] = useState([]);

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
            if (res.status === 200) {
                console.log("res.status === 200. Deliveries from server:", res.data)
                setDeliveries(res.data)
                // console.log("userDeliveries", userDeliveries)
                // setOrders(res.data)
                const sortedOrders = sortData(res.data)
                setOrders(sortedOrders)
                // console.log("sortedOrders", orders)
                renderDelivery(sortedOrders)
            }
        } catch (error) {
            if (error.status === 404) {
                // console.log("error 404:", error)
                alert("not found")
            }
            console.error(error)
            if (error.status === 401) {
                // console.log("error 401:", error)
                alert("Unauthorized")
            }
        }
        // const filteredOrders = filterData(deliveries)

    }

    const renderDelivery = (delivery) => {
        // console.log("renderDelivery", delivery);
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
                                {console.log(product.imagepath)
                                }
                                <Image
                                    src={"/"+product.imagepath || 'air-conditioner.jpg'} // Use a placeholder image if undefined
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
        // if (deliveries && deliveries.length > 0) {
        //     const filteredOrders = filterData(deliveries);
        //     const sortedOrders = sortData(filteredOrders);
        //     setOrders(sortedOrders);
        getDeliveries()
        // }
    }, []);

    return (
        <div className="my-orders">
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