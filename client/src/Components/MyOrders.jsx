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

const MyOrders = () => {

    const sortData = (data) => {
        if (!data) {
            return [];
        }
        data.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        console.log("sorted",data)
        return data
    };

    const filterData = (data) => {
        console.log("before filter",data)
        if (!data) {
            return [];
        }
        data.filter(delivery => delivery.status !== "recieved");
        console.log("filtered",data)
        return data
    };

    const dispatch = useDispatch();
    const { userDeliveries } = useSelector((state) => state.userDeliveries);
    const { userDetails } = useSelector((state) => state.userDetails);
    const { token } = useSelector((state) => state.token);
    const [orders, setOrders] = useState([]);


    const getUserDeliveries = async () => {
        const headers = {
            'Authorization': `Bearer ${token}`
        }
        try {
            const res = await axios.get(`http://localhost:8000/api/delivery/byid`, { headers })
            if (res.status === 200) {
                console.log("UserDeliveries from server type:", res.data)
                dispatch(setUserDeliveries(res.data))
                console.log("userDeliveries", userDeliveries)
                setOrders(res.data)
            }
        } catch (error) {
            if (error.status === 404) {
                alert("not found")
            }
            console.error(error)
            if (error.status === 401) {
                alert("Unauthorized")
            }
        }
        const filteredOrders = filterData(orders)
        const sortedOrders = sortData(filteredOrders)
        setOrders(sortedOrders)
        console.log("setOrders",orders)
    }

    const itemTemplate = (product, index) => {
        return (
            <div className="col-12" key={product._id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={'basket.jpg'} alt={product.address.city} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <div className="text-2xl font-bold text-900">{product.address.city}</div>
                            {/* <Rating value={product.rating} readOnly cancel={false}></Rating> */}
                            <div className="flex align-items-center gap-3">
                                <span className="flex align-items-center gap-2">
                                    <i className="pi pi-tag"></i>
                                    <span className="font-semibold">{product.user_id}</span>
                                </span>
                                {/* <Tag value={product.status} severity={getSeverity(product)}></Tag> */}
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            {/* <span className="text-2xl font-semibold">${product.price}</span> */}
                            <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={false}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    useEffect(() => {
        getUserDeliveries()
        console.log("useEffect MyOrders")
    }, []);

    // useEffect(() => {

    // }, [userOrders])

    return (
        //     <div className="card">
        //     <DataView value={orders} listTemplate={listTemplate} />
        // </div>
        <>
        <MyOrders2 deliveries={orders} />
        </>
    )
}

export default MyOrders