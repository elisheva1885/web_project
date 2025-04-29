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
import MyOrders2 from './MyOrders2';
import { Card } from "primereact/card";
import { Timeline } from "primereact/timeline";
import { Image } from "primereact/image";
import { Divider } from "primereact/divider";

const MyOrders = () => {

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

    const dispatch = useDispatch();
    const { userDeliveries } = useSelector((state) => state.userDeliveries);
    const { token } = useSelector((state) => state.token);
    const [orders, setOrders] = useState([]);


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
                // setOrders(res.data)
            }
        } catch (error) {
            if (error.status === 404) {
                console.log("error 404:", error)
                alert("not found")
            }
            console.error(error)
            if (error.status === 401) {
                console.log("error 401:", error)
                alert("Unauthorized")
            }
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

        return (
            <Card
                key={delivery._id}
                title={`Order Date: ${orderDate}`}
                subTitle={`Status: `}
                className="p-mb-3"
            >
                {/* Add status with a Tag */}
                <Tag
                    value={delivery.status}
                    severity={statusColors[delivery.status]}
                ></Tag>

                <Divider />

                {/* Render the list of air-conditioners */}
                {/* <div className="p-grid">                   
                    {delivery.purchase.products.map((shoppingBagItem) => {
                        const product = shoppingBagItem.product || {}; // Fallback to an empty object
                        console.log("product.imagepath:",product.imagepath)
                        return (
                            <div
                                key={shoppingBagItem._id}
                                className="p-col-12 p-md-4 p-lg-3"
                                style={{ textAlign: "center" }}
                            >
                                <Image
                                    src={product.imagepath || 'air-conditioner.png'} // Use a placeholder image if undefined
                                    alt={product.title || 'No Title'}
                                    width="100"
                                    preview
                                />
                                <p>{product.title || 'No Title'}</p>
                            </div>
                        );
                    })}
                </div> */}
            <div className="p-grid">
                {delivery.purchase.products.map((shoppingBagItem) => {
                    const product = shoppingBagItem.product_id || {}; // product_id now dynamically resolves to the correct product type
                    return (
                        <div
                            key={shoppingBagItem._id}
                            className="p-col-12 p-md-4 p-lg-3"
                            style={{ textAlign: "center" }}
                        >
                            <Image
                                src={product.imagepath || 'placeholder.jpg'} // Use a placeholder image if undefined
                                alt={product.title || 'No Title'}
                                width="100"
                                preview
                            />
                            <p>{product.title || 'No Title'}</p>
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
            <h2>My Orders</h2>
            {orders.map((delivery) => renderDelivery(delivery))}
        </div>
    )
}

export default MyOrders