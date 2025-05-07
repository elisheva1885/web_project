import React, { useEffect, useState } from 'react';
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { Divider } from "primereact/divider";
import { Image } from "primereact/image";
import { useSelector } from 'react-redux';
import useGetFilePath from '../hooks/useGetFilePath';

const OrderHistory = () => {
    const { userDeliveries } = useSelector((state) => state.userDeliveries);
    const [historyOrders, setHistoryOrders] = useState([]);
    const { getFilePath } = useGetFilePath()

    // Filters and sorts the order history based on "recieved" status
    const filterAndSortHistory = (data) => {
        if (!data || data.length === 0) {
            return [];
        }
        const filtered = data.filter((delivery) => delivery.status === "recieved");
        return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    };

    // useEffect(() => {
    //     if (userDeliveries && userDeliveries.length > 0) {
    //         const sortedHistory = filterAndSortHistory(userDeliveries);
    //         setHistoryOrders(sortedHistory);
    //     }
    // }, [userDeliveries]); // Dependency on userDeliveries

    const renderDelivery = (delivery) => {
        const orderDate = new Date(delivery.createdAt).toLocaleDateString();
        const statusColors = {
            recieved: "success",
        };
        const statusIcons = {
            recieved: "pi pi-check",
        };
        const statusTranslations = {
            recieved: "התקבל",
        };

        return (
            <Card
                key={delivery._id}
                title={`${orderDate} :תאריך הזמנה`}
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
                                <Image
                                    src={getFilePath(product.imagepath) || 'air-conditioner.jpg'} // Use a placeholder image if undefined
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

    return (
        <div className="order-history">
            <h2 style={{
                fontSize: "2rem",
                fontWeight: "bold",
                textAlign: "center",
                color: "#2C3E50",
                marginBottom: "1rem",
                borderBottom: "2px solid #3498DB",
                paddingBottom: "0.5rem"
            }}>
                היסטוריית הזמנות
            </h2>
            {historyOrders.map((delivery) => renderDelivery(delivery))}
        </div>
    );
};

export default OrderHistory;