import { useState } from 'react';
import { Dock } from 'primereact/dock';
import { RadioButton } from 'primereact/radiobutton';
import MyOrders from './MyOrders';

const UserAcountNavbar = () => {
    const items = [
        {
            label: 'userdetails',
            icon: () => <img alt="הפרטים שלי" src="user.png" width="100%" />,
        },
        {
            label: 'App Store',
            icon: () => <img alt="App Store" src="updateuser.png" width="100%" />,
        },
        {
            label: 'Photos',
            icon: () => <img alt="Photos" src="basket.jpg" width="100%" />,
        },
        {
            label: 'Trash',
            icon: () => <img alt="trash" src="clock.jpg" width="100%" />,
        }
    ];
    return (
        <div className="card dock-demo">
            <div className="flex flex-wrap gap-3 mb-5">
                <div className="flex align-items-center" >
                </div>
            </div>
                <Dock model={items}  position='right'/>
                <MyOrders/>
        </div>
    )
}

export default UserAcountNavbar