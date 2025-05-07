import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const ExistAddress = ({ visible, address, onUseAddress, onCreateNewAddress, onClose }) => {
    // const [address, setAddress] = useState(props.address)
    // usingAddress
    return (
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
                onHide={onClose}
                modal
            >
                {address ?
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
                : 
                    <div style={{ color: '#333', lineHeight: '1.6' }}>
                        <h3 style={{ marginBottom: '8px' }}>כתובת לא קיימת</h3>
                    </div>
                }
                <div style={{ display: 'flex', gap: '10px', marginTop: '20px', justifyContent: 'flex-end' }}>
                    <Button
                        label="לשימוש בכתובת"
                        onClick={onUseAddress}
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
                        onClick={onCreateNewAddress}
                         className="p-button-secondary"
                        style={{
                            backgroundColor: '#ff9800', // Orange button background
                            color: '#fff', // White text
                            border: 'none', // Remove border
                            padding: '10px 20px', // Adjust padding
                        }}
                    />
                </div>
            </Dialog>
    );
};

export default ExistAddress;