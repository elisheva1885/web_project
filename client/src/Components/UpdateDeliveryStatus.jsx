import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';
import useGetFilePath from '../hooks/useGetFilePath';

const UpdateDeliveryStatus = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [productsDialogVisible, setProductsDialogVisible] = useState(false);
    const [selectedDeliveryProducts, setSelectedDeliveryProducts] = useState([]);
    const { token } = useSelector((state) => state.token);
    const toast = useRef(null);
    const { getFilePath } = useGetFilePath()

    const messages = {
        USER_REQUIRED: "משתמש אינו מחובר למערכת.",
        INVALID_ADDRESS: "כתובת לא תקינה.",
        INVALID_PURCHASE_ID: "מזהה רכישה לא תקין.",
        INVALID_DELIVERY_ID: "מזהה משלוח לא תקין.",
        INVALID_STATUS: "סטטוס לא תקין.",
        DELIVERY_NOT_FOUND: "משלוח לא נמצא.",
        NO_DELIVERIES_FOUND: "לא נמצאו משלוחים.",
        NO_DELIVERIES_FOR_USER: "לא נמצאו משלוחים למשתמש זה.",
        DELIVERY_CREATION_FAILED: "יצירת המשלוח נכשלה.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסה שוב מאוחר יותר.",
        DELIVERY_CREATED_SUCCESSFULLY: "משלוח נוצר בהצלחה.",
        DELIVERY_UPDATED_SUCCESSFULLY: "סטטוס המשלוח עודכן בהצלחה.",
        DELIVERY_DELETED_SUCCESSFULLY: "משלוח נמחק בהצלחה.",
        UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו.",
        default: "אירעה שגיאה לא צפויה. נסה שוב."
    };

    const showToast = (toast, severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };
    const fetchDeliveries = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get('http://localhost:8000/api/delivery', { headers });
            if (response.status === 200) {
                setDeliveries(response.data);
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast(toast, 'error', 'שגיאה', messages[serverMessage]);
            console.error('Error fetching deliveries:', error);
        }
    };

    const updateSingleDelivery = async (id, newStatus) => {
        if (!newStatus) {
            showToast(toast, 'warn', 'אזהרה', 'לא נבחר סטטוס עדכון תקין.');
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
                setDeliveries(response.data);
                showToast(toast, 'success', 'הצלחה', messages.DELIVERY_UPDATED_SUCCESSFULLY);
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast(toast, 'error', 'שגיאה', messages[serverMessage]);
            console.error('Error updating delivery:', error);
        } finally {
            setLoading(false);
        }
    };

    const showProducts = (rowData) => {
        setSelectedDeliveryProducts(rowData.purchase.products || []);
        setProductsDialogVisible(true);
    };

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

    useEffect(() => {
        fetchDeliveries();
    }, []);

    return (
        <div style={{ maxWidth: '100%', margin: '2rem auto', overflowX: 'auto', textAlign: 'center' }}>
            <Toast ref={toast} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#2C3E50' }}>
                עדכון סטטוס משלוחים
            </h2>
            <DataTable value={deliveries} responsiveLayout="scroll" scrollable style={{ minWidth: '1000px', direction: 'rtl' }}>
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
                                    src={getFilePath(product.product_id?.imagepath) }
                                    alt={product.product_id?.title}
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
                                    <p style={{ margin: 0, fontWeight: 'bold' }}>{product.product_id?.title}</p>
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