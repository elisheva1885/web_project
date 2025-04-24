import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { useDispatch, useSelector } from 'react-redux';
import { setBasket } from '../store/basketSlice';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';

const Basket = () => {
    const { basket } = useSelector((state) => state.basket);
    const { token } = useSelector((state) => state.token);
    const [layout, setLayout] = useState('list');
    const [selectedItems, setSelectedItems] = useState([]);
    const [amount, setAmount] = useState(1);
    const [quantities, setQuantities] = useState({});

    const dispatch = useDispatch()
    const navigate = useNavigate()

    let sum = 0;
    if (basket) {
        selectedItems.map(item => sum += item.price)
    }
    console.log(basket);
//     const updatedItems = selectedItems.map(item => ({
//   ...item,
//   amount: 1
// }));
    const [totalAmount, setTotalAmount] = useState(0);
    const deleteShoppingBag = async (product) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const product_id = { product_id: product._id };
            const res = await axios.delete('http://localhost:8000/api/user/shoppingBag', {
                headers: headers,
                data: product_id
            });
            if (res.status === 200) {
                console.log("Item removed", res.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getShoppingBag = async () => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.get('http://localhost:8000/api/user/shoppingBag', { headers })
            if (res.status === 200) {
                dispatch(setBasket(res.data))
                console.log("res.data", res.data);
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    const goToPayment = () => {
        const navigationData = {
            products: selectedItems,
            // You can add any other data you may want to send
        };
        navigate('/basket/payment', { state: navigationData })
    }
    const getSeverity = (stock) => {
        if (stock >= 50) return 'success';
        else if (stock > 0) return 'warning';
        else return 'danger';
    };

    const getSeverityText = (product) => {
        const severity = getSeverity(product.stock);
        switch (severity) {
            case 'success': return "במלאי";
            case 'warning': return "פריטים אחרונים";
            case 'danger': return "אזל מהמלאי";
            default: return null;
        }
    };

    const listItem = (product, index) => {
        const isSelected = selectedItems.some(item => item._id === product._id);
        const handleSelectionChange = (product) => {
            const isSelected = selectedItems.some(item => item._id === product._id);
            if (isSelected) {
                setSelectedItems(selectedItems.filter(item => item._id !== product._id));
            } else {
                setSelectedItems([...selectedItems, product]);
            }
        }
        const productDetails = product.product
        let amount = product.amount
        if (productDetails && productDetails.stock > 0) {
            return (

                <div className="col-12" key={productDetails._id}>
                    <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                        <Checkbox inputId={productDetails._id} checked={isSelected} onChange={() => handleSelectionChange(productDetails)} />
                        <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${productDetails.imagepath}`} />
                        <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                            <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                                <Link to={`/overheads/overhead/${productDetails._id}`}><div className="text-2xl font-bold text-900">{productDetails.title}</div></Link>
                                <div className="flex align-items-center gap-3">
                                    <Tag value={getSeverityText(productDetails)} severity={getSeverity(productDetails.stock)}></Tag>
                                </div>
                            </div>
                            <div className="card flex justify-content-center">
                            </div>
                            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                <span className="text-2xl font-semibold">₪{productDetails.price}</span>
                                <InputNumber
                                    value={amount}
                                    onValueChange={(e) => amount = e.value}
                                    showButtons
                                    className="p-inputnumber-sm"
                                    inputStyle={{
                                        padding: '0.5rem', // יותר ריפוד מסביב למספר
                                        textAlign: 'center',
                                        width: 'auto' // אפשרות לגודל אוטומטי שמתאים לתוכן + ריפוד
                                    }}
                                    decrementButtonClassName="p-button-sm p-button-primary"
                                    incrementButtonClassName="p-button-sm p-button-primary"
                                    incrementButtonIcon="pi pi-plus"
                                    decrementButtonIcon="pi pi-minus"
                                />
                                {/* <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={() => deleteShoppingBag(product)}> להסרה מהעגלה </Button> */}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
    const listTemplate = (products, layout) => {
        if (!basket) {
            return <h1>basket is empty</h1>
        }
        return <div className="grid grid-nogutter">{basket.map((product, index) => listItem(product, index))}</div>;
    };

    // const header = () => {
    //     return (
    //         <div className="flex justify-content-end">
    //             <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
    //         </div>
    //     );
    // };
    useEffect(() => {
        if (token) {
            // קריאה ל-API רק אם יש טוקן
            getShoppingBag();
            sum = 0;
        }
        else {
            alert("to save thing in your basket you need to register")
            navigate("/register")
        }

    }, [token]);

    return (
        <div style={{ paddingTop: '60px' }}>
            <div className="flex">
                {/* Left Panel with Payment Button */}
                <div className="card p-4 mr-4" style={{ width: '200px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <h3>סך הכל</h3>
                    {/* {setTotalAmount(amount)} */}
                    <h4>{sum} ש"ח</h4>
                    <div className="flex justify-content-center align-items-center" style={{ height: '200px', border: '2px solid #e0e0e0', borderRadius: '8px' }}>
                        <Button label="לשלם עכשיו" icon="pi pi-credit-card" onClick={goToPayment} className="p-button-success p-button-rounded" style={{ width: '150px' }} />
                    </div>
                </div>

                {/* Right Side with Shopping Basket Items */}
                <div className="card flex-1">
                    <div className="flex justify-content-end">
                    </div>
                    <DataView value={basket} listTemplate={listTemplate} layout={layout} />
                </div>
            </div>
        </div>
    );
    // <div className="card">
    //     <div className="flex justify-content-end">
    //         <IconField iconPosition="left">
    //             <InputIcon className="pi pi-search" />
    //         </IconField>
    //     </div>
    //     <DataView value={basket} listTemplate={listTemplate} layout={layout} header={header()} />
    // </div>
    // );

};

export default Basket;