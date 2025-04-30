import { useState } from 'react';
import { Dock } from 'primereact/dock';
import { RadioButton } from 'primereact/radiobutton';
import MyOrders from './MyOrders';
import OrderHistory from './OrdersHistory';
import UpdateUserDetails from './UpdateUserDetails';
import UserDetails from './UserDetails';

const UserAcountNavbar = () => {
    const [activeComponent, setActiveComponent] = useState('userdetails'); // Default to 'userdetails'

    const items = [
        {
            label: 'userdetails',
            icon: () => <img alt="הפרטים שלי" src="user.png" width="100%" />,
            command: () => setActiveComponent('userdetails') // Navigate to UserDetails
        },
        {
            label: 'updateuserdetails',
            icon: () => <img alt="App Store" src="updateuser.png" width="100%" />,
            command: () => setActiveComponent('updateuserdetails') // Navigate to UpdateUserDetails
        },
        {
            label: 'myorders',
            icon: () => <img alt="myorders" src="basket.jpg" width="100%" />,
            command: () => setActiveComponent('myorders') // Navigate to MyOrders
        },
        {
            label: 'ordershistory',
            icon: () => <img alt="ordershistory" src="history.png" width="100%" />,
            command: () => setActiveComponent('ordershistory') // Navigate to OrdersHistory
        }       
    ];

    const renderActiveComponent = () => {
        switch (activeComponent) {
            case 'userdetails':
                return <UserDetails />;
            case 'updateuserdetails':
                return <UpdateUserDetails />;
            case 'myorders':
                return <MyOrders />;
            case 'ordershistory':
                return <OrderHistory />;
            default:
                return null; // No component to render
        }
    };

    return (
        <div className="card dock-demo">
            <Dock model={items} position='right' />
            <div className="content">
                {renderActiveComponent()} {/* Render the selected component */}
            </div>
        </div>
    )
}

export default UserAcountNavbar