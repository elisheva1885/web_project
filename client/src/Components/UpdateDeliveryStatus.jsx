import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { useSelector } from 'react-redux';

const UpdateDeliveryStatus = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsDialogVisible, setProductsDialogVisible] = useState(false);
    const [selectedDeliveryProducts, setSelectedDeliveryProducts] = useState([]);
    const { token } = useSelector((state) => state.token);

    // Fetch deliveries
    const fetchDeliveries = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('http://localhost:8000/api/delivery', { headers });
            if (response.status === 200) {
                setDeliveries(response.data);
            }
        } catch (error) {
            console.error('Error fetching deliveries:', error);
            alert('Failed to fetch deliveries.');
        }
    };

    // Update a single delivery to the next logical status
    const updateSingleDelivery = async (id, newStatus) => {
        if (!newStatus) {
            alert('No valid next status selected.');
            return;
        }

        setLoading(true);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.put(
                'http://localhost:8000/api/delivery',
                { _id: id, status: newStatus },
                { headers }
            );

            if (response.status === 200) {
                alert('Delivery status updated successfully.');
                setDeliveries(response.data);
            }
        } catch (error) {
            console.error('Error updating delivery:', error);
            alert('Failed to update delivery status.');
        } finally {
            setLoading(false);
        }
    };

    // Show products for a specific delivery
    const showProducts = (rowData) => {
        setSelectedDeliveryProducts(rowData.purchase.products || []);
        setProductsDialogVisible(true);
    };

    // Define the status flow
    const statusFlow = ['waiting to be delivered', 'on the way', 'arrived', 'recieved'];
    const statusFlowHebrew = ['ממתין למשלוח', 'בדרך', 'הגיע', 'התקבל'];

    // Get the next logical status
    const getNextStatus = (currentStatus) => {
        const currentIndex = statusFlow.indexOf(currentStatus);
        return currentIndex >= 0 && currentIndex < statusFlow.length - 2
            ? statusFlow[currentIndex + 1]
            : null;
    };

    // Button to update to the next status
    const nextStatusButtonTemplate = (rowData) => {
        const nextStatus = getNextStatus(rowData.status);
        const nextStatusHebrew = getNextStatus(rowData.status) ? statusTranslations[getNextStatus(rowData.status)] : null;
        return nextStatus ? (
            <Button
                label={` לעדכון הסטטוס ל-${nextStatusHebrew}`}
                icon="pi pi-refresh"
                onClick={() => updateSingleDelivery(rowData._id, nextStatus)}
                loading={loading}
                className="p-button-success"
            />
        ) : (
            <span style={{ color: 'gray' }}>אין עדכונים אפשריים</span>
        );
    };

    const productsTemplate = (rowData) => {
        return (
            <Button
                label="לצפיה במוצרים"
                icon="pi pi-eye"
                onClick={() => showProducts(rowData)}
                className="p-button-text"
            />
        );
    };

    const statusTranslations = {
        "waiting to be delivered": "ממתין למשלוח",
        "on the way": "בדרך",
        "arrived": "הגיע",
        "recieved": "התקבל",
    };
    const currentStatusTemplate = (rowData) => {
        return <span>{statusTranslations[rowData.status] || "סטטוס לא ידוע"}</span>;
    };


    // Fetch deliveries on component mount
    useEffect(() => {
        fetchDeliveries();
    }, []);

    return (
        <div style={{ maxWidth: '100%', margin: '2rem auto', overflowX: 'auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2C3E50' }}>
                עדכון סטטוס משלוחים
            </h2>
            <DataTable value={deliveries} responsiveLayout="scroll" scrollable style={{ minWidth: '1000px',direction:'rtl' }}>
                <Column
                    field="_id"
                    header="מזהה משלוח"
                    bodyStyle={{ textAlign: 'right' }}
                    headerStyle={{ textAlign: 'right' }}
                    style={{ width: '200px' }}
                ></Column>
                <Column
                    field="user_id.username"
                    header="שם משתמש"
                    bodyStyle={{ textAlign: 'right' }}
                    headerStyle={{ textAlign: 'right' }}
                    style={{ width: '200px' }}
                ></Column>
                <Column
                    field="createdAt"
                    header="תאריך הזמנה"
                    bodyStyle={{ textAlign: 'right' }}
                    headerStyle={{ textAlign: 'right' }}
                    style={{ width: '150px' }}
                ></Column>
                <Column
                    field="status"
                    header="סטטוס נוכחי"
                    body={currentStatusTemplate}
                    bodyStyle={{ textAlign: 'right' }}
                    headerStyle={{ textAlign: 'right' }}
                    style={{ width: '200px' }}
                ></Column>
                <Column
                    header="פעולת סטטוס הבא"
                    body={nextStatusButtonTemplate}
                    bodyStyle={{ textAlign: 'right' }}
                    headerStyle={{ textAlign: 'right' }}
                    style={{ width: '300px' }}
                ></Column>
                <Column
                    body={productsTemplate}
                    header="מוצרים"
                    bodyStyle={{ textAlign: 'right' }}
                    headerStyle={{ textAlign: 'right' }}
                    style={{ width: '200px' }}
                ></Column>
            </DataTable>
            <Dialog
                visible={productsDialogVisible}
                onHide={() => setProductsDialogVisible(false)}
                header="מוצרים במשלוח"
                style={{ width: '50vw', direction: 'rtl' }}
            >
                {selectedDeliveryProducts.length > 0 ? (
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {selectedDeliveryProducts.map((product, index) => (
                            <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                                <img
                                    src={product.product_id.imagepath}
                                    alt={product.product_id.title}
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        objectFit: 'contain',
                                        marginRight: '1rem',
                                        borderRadius: '4px',
                                        border: '1px solid #ccc',
                                    }}
                                />
                                <div>
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{product.product_id.title}</p>
                                    <p style={{ margin: 0 }}>כמות: {product.amount}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>לא נמצאו מוצרים למשלוח זה</p>
                )}
            </Dialog>
        </div>
    );
};

export default UpdateDeliveryStatus;