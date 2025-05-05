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
    const [shoppingBags, setShoppingBags] = useState([]);
    const [errorStates, setErrorStates] = useState({}); // To track errors
    const [sum, setSum] = useState(1);

    const [amount, setAmount] = useState(1);
    const [quantities, setQuantities] = useState({});

    const dispatch = useDispatch()
    const navigate = useNavigate()

    // // let sum = 0;
    // if (basket) {
    //     console.log(selectedItems);
    //     selectedItems.map(item => sum += item.price)
    // }

    // console.log(basket);
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
                const updatedBasket = basket.filter(itemInBasket => itemInBasket.product._id != product._id)
                dispatch(setBasket(updatedBasket))
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
                console.log("res.data ", res.data);
                dispatch(setBasket(res.data))
                setShoppingBags(res.data)
                // console.log("res.data", res.data);
            }
        }
        catch (e) {
            console.error(e)
        }
    }
    const updateShoppingBagProductAmount = async (productDetails, newAmount) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const data = {
                product_id: productDetails._id,
                amount: newAmount
            };

            const res = await axios.put('http://localhost:8000/api/user/shoppingBag', data, { headers });

            if (res.status === 200) {
                const updatedBasket = basket.map(item => {
                    if (!item) return item;
                    if (item.product._id === res.data.updatedShoppingBag.product_id) {
                        return { ...item, amount: res.data.updatedShoppingBag.amount };
                    }
                    return item;
                });

                dispatch(setBasket(updatedBasket));

                // גם לעדכן את selectedItems
                const updatedSelectedItems = selectedItems.map(item => {
                    if (item.product._id === res.data.updatedShoppingBag.product_id) {
                        return { ...item, amount: res.data.updatedShoppingBag.amount };
                    }
                    return item;
                });

                setSelectedItems(updatedSelectedItems);

                // חישוב מחדש של הסכום
                const totalSum = updatedSelectedItems.reduce((sum, item) => sum + (item.product.price * item.amount), 0);
                setSum(totalSum);

            }
            else {
                // if (res.status === 404) {
                //     console.log("error 404:", res)
                //     alert("not found")
                // }
            }
        } catch (e) {
            console.error(e);
        }
    };
    const goToPayment = () => {
        const navigationData = {
            products: selectedItems,
            // You can add any other data you may want to send
        };
        navigate('/basket/payment', { state: navigationData })
    }
    useEffect(() => {
        getShoppingBag()
    }, [])
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

    const listItem = (productInBasket, index) => {
        const productDetails = productInBasket?.product;
        if (!productDetails) {
            return null; // אל תרנדר פריטים ללא פרטים או שאזלו מהמלאי
        }

        const isSelected = selectedItems.some(item => item.product._id === productDetails._id);

        const handleSelectionChange = (productInBasket) => {
            const alreadySelected = selectedItems.some(item => item.product._id === productInBasket.product._id);
            let updatedSelectedItems;

            if (alreadySelected) {
                updatedSelectedItems = selectedItems.filter(item => item.product._id !== productInBasket.product._id);
            } else {
                updatedSelectedItems = [...selectedItems, productInBasket];
            }

            setSelectedItems(updatedSelectedItems);

            const totalSum = updatedSelectedItems.reduce((sum, item) => sum + (item.product.price * item.amount), 0);
            setSum(totalSum);
        };

        return (
            <div className="col-12" key={productDetails._id}>
                <div className={classNames('flex flex-column xl:flex-row p-4 gap-3 border-bottom-1')}>
                    <Checkbox
                        inputId={productDetails._id}
                        checked={isSelected}
                        onChange={() => handleSelectionChange(productInBasket)}
                        disabled={productDetails.stock === 0}
                    />
                    {productDetails.stock === 0 && <> <h3>אזל מהמלאי <br /> המוצר יהיה ניתן לרכישה בעדכון המלאי </h3>   </>}

                    <img
                        className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round"
                        src={`${productDetails.imagepath}`}
                        alt={productDetails.title}
                    />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Link
                                to={`/overheads/overhead/${productDetails._id}`}
                                style={{
                                    textDecoration: 'none'
                                }}
                            >
                                <div className="text-2xl font-bold text-900">{productDetails.title}</div>
                            </Link>
                            <Tag value={getSeverityText(productDetails)} severity={getSeverity(productDetails.stock)}></Tag>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">₪{productDetails.price}</span>
                            <h2>amount : {productInBasket?.amount}</h2>
                            <InputNumber
                                value={productInBasket?.amount}
                                onValueChange={(e) => {
                                    const newAmount = e.value;
                                    // Handle invalid input cases
                                    if (newAmount < 1 || newAmount === null) {
                                        setErrorStates((prev) => ({ ...prev, [productDetails._id]: true }));
                                    } 
                                    else if (newAmount > productDetails.stock) {
                                        setErrorStates((prev) => ({ ...prev, [productDetails._id]: true }));
                                        //alert(`לא ניתן להזמין יותר מהמלאי הקיים. כמות נוכחית במלאי: ${productDetails.stock}`); // Show alert if exceeds stock
                                        // productInBasket?.amount = productDetails.stock; // Set to max stock

                                    }
                                    else {
                                        // Update the basket locally for immediate UI feedback
                                        const updatedBasket = basket.map((item) =>
                                            item.product._id === productDetails._id
                                                ? { ...item, amount: newAmount }
                                                : item
                                        );
                                        dispatch(setBasket(updatedBasket));
                                        // Synchronize with the backend
                                        updateShoppingBagProductAmount(productDetails, newAmount);
                                        console.log("newAmount", newAmount);
                                        console.log("productDetails.stock", productDetails.stock);
                                    }
                                }}
                                showButtons
                                className="p-inputnumber-sm"
                                inputStyle={{ padding: '0.5rem', textAlign: 'center', width: 'auto' }}
                                decrementButtonClassName="p-button-sm p-button-primary"
                                incrementButtonClassName="p-button-sm p-button-primary"
                                //incrementButtonDisabled={productInBasket?.amount >= productDetails.stock}
                                incrementButtonIcon="pi pi-plus"
                                decrementButtonIcon="pi pi-minus"
                                disabled={productDetails.stock === 0}
                                min={1}
                            />
                            <Button
                                // icon="pi pi-shopping-cart" 
                                icon="pi pi-trash"
                                className="p-button-rounded p-button-danger"
                                disabled={getSeverity(productDetails.stock) === "danger"}
                                onClick={() => deleteShoppingBag(productDetails)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    const listTemplate = () => {
        if (!basket) {
            return <h1>basket is empty</h1>
        }
        //console.log(basket);
        return (
            <div
                className="grid grid-nogutter"
                style={{ maxWidth: '1300px', margin: '0 auto', alignContent: 'center' }}
            >
                {basket.map((product, index) => listItem(product, index))}
            </div>
        )
    };

    // const header = () => {
    //     return (
    //         <div className="flex justify-content-end">
    //             <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
    //         </div>
    //     );
    // };
    useEffect(() => {
        // if (token) {
        //     // קריאה ל-API רק אם יש טוקן
        //     getShoppingBag();
        setSum(0)
        // }
        // else {
        //     alert("to save thing in your basket you need to register")
        //     navigate("/register")
        // }

    }, []);

    return (
        <div style={{ paddingTop: '60px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px', fontSize: '2rem', color: '#333' }}>
                סל הקניות שלי
            </h1>
            <div className="flex">
                {/* Left Panel with Payment Button */}
                <div
                    className="card p-3"
                    style={{
                        width: '200px',
                        height: '150px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        borderRadius: '12px',
                        textAlign: 'center',
                        position: 'sticky',
                        top: '400px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #d0f0fd, #b0e0f8)',
                        border: '2px solid #90caf9',
                        color: '#fff',
                    }}
                >
                    <h3 style={{ marginBottom: '10px' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>סך הכל</span>
                        <br />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>₪{sum}</span>
                    </h3>
                    <Button
                        label="לשלם עכשיו"
                        icon="pi pi-credit-card"
                        onClick={goToPayment}
                        className="p-button-rounded"
                        style={{
                            width: '160px',
                            height: '35px',
                            fontSize: '1rem',
                            background: '#ff9800',
                            border: 'none',
                            color: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                        }}
                    />
                </div>

                {/* Right Side with Shopping Basket Items */}
                <div className="card flex-1">
                    {/* <div className="flex justify-content-end">
                    </div> */}
                    <DataView value={basket} listTemplate={listTemplate} layout="list" />
                </div>
            </div>
        </div>
    );
};

export default Basket;