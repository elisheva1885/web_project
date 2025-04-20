import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const ExistAddress = ({ visible, setVisible, address }) => {
    const [address, setAddress] = useState(props.address)
    usingAddress
    return (
        <Dialog
            header="כתובת שמורה"
            visible={visible}
            style={{ width: '50vw' }}
            onHide={() => setVisible(false)}
            modal
        >
            <div>
                <h6>עיר: {address.city}</h6>
                <h6>רחוב: {address.street} {address.building_num}</h6>
                <h6>דירה: {address.apartment_num}, קומה: {address.floor}</h6>
                <h6>מיקוד: {address.zip_code}</h6>
            </div>

            <Button
                label="לשימוש בכתובת"
                onClick={() => {
                    usingAddress();
                    setVisible(false);
                }}
                className="p-button-success"
            />
            <Button
                label="ליצירת כתובת חדשה"
                onClick={() => setVisible(false)}
                className="p-button-secondary"
            />
        </Dialog>
    );
};

export default ExistAddress;