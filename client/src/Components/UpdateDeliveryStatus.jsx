import React, { useState, useEffect, use } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { useSelector } from 'react-redux';
const UpdateDeliveryStatus = () => {
    const [deliveries, setDeliveries] = useState([]); // List of deliveries
    const [selectedStatus, setSelectedStatus] = useState(''); // Status to apply to all deliveries
    const [loading, setLoading] = useState(false); // Loading state for the update button
    const {token} = useSelector((state) => state.token); // Get token from Redux store

    // Fetch deliveries from the database
    const fetchDeliveries = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            console.log('token:', token);
            const response = await axios.get('http://localhost:8000/api/delivery', { headers });
            if (response.status === 200) {
                setDeliveries(response.data); // Set fetched deliveries
            }
        } catch (error) {
            if (error.response) {
                console.error('Error fetching deliveries:', error.response.data);
            }
            console.error('Error fetching deliveries:', error);
            alert('Failed to fetch deliveries.');
        }
    };

    // Update status for all deliveries
    const updateAllStatuses = async () => {
        if (!selectedStatus) {
            alert('Please select a status to apply.');
            return;
        }

        setLoading(true); // Show loading state
        try {
            const response = await axios.put(
                'http://localhost:8000/api/delivery/update-status',
                {
                    status: selectedStatus, // New status to apply
                }
            );

            if (response.status === 200) {
                alert('All delivery statuses updated successfully.');
                fetchDeliveries(); // Refresh deliveries
            }
        } catch (error) {
            console.error('Error updating statuses:', error);
            alert('Failed to update delivery statuses.');
        } finally {
            setLoading(false); // Reset loading state
        }
    };

    // Fetch deliveries on component mount
    useEffect(() => {
        fetchDeliveries();
    }, []);

    // Status options
    const statusOptions = [
        { label: 'ממתין למשלוח', value: 'waiting to be delivered' },
        { label: 'בדרך', value: 'on the way' },
        { label: 'הגיע', value: 'arrived' },
        { label: 'התקבל', value: 'recieved' },
    ];

    // Template to display status in the table
    const statusTemplate = (rowData) => {
        return (
            <span>
                {statusOptions.find((option) => option.value === rowData.status)?.label || 'Unknown'}
            </span>
        );
    };

    return (
        <div style={{ maxWidth: '800px', margin: '2rem auto', textAlign: 'center' }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem',
                color: '#2C3E50',
                textAlign: 'center'
            }}>
                Bulk Update Delivery Statuses
            </h2>

            <div style={{ marginBottom: '1rem' }}>
                <Dropdown
                    value={selectedStatus}
                    options={statusOptions}
                    onChange={(e) => setSelectedStatus(e.value)}
                    placeholder="Select a status to apply to all deliveries"
                    style={{ width: '100%' }}
                />
            </div>

            <Button
                label="Update All"
                icon="pi pi-check"
                onClick={updateAllStatuses}
                loading={loading}
                style={{ width: '100%', marginBottom: '1rem' }}
            />

            <DataTable value={deliveries} responsiveLayout="scroll">
                <Column field="id" header="Delivery ID"></Column>
                <Column field="createdAt" header="Order Date"></Column>
                <Column field="status" header="Current Status" body={statusTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default UpdateDeliveryStatus;