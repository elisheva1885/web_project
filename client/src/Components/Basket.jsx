// import axios from 'axios'
// import { useEffect, useState } from 'react'
// import { Button } from 'primereact/button';
// import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
// import { Tag } from 'primereact/tag';
// import { classNames } from 'primereact/utils';
// import { Link, useNavigate } from 'react-router-dom';
// import { InputText } from 'primereact/inputtext';
// import { IconField } from 'primereact/iconfield';
// import { InputIcon } from 'primereact/inputicon';
// import { getToken } from '../store/tokenSlice';
// import { useDispatch, useSelector } from 'react-redux';
// import { setBasket } from '../store/basketSlice';


// const Basket = () => {
//     const { token } = useSelector((state) => state.token)
//     // const { basket } = useSelector((state) => state.basket)
//     const dispatch = useDispatch();
//     const [shoppingBags, setShoppingBags] = useState([])

//     const [layout, setLayout] = useState('list');

//     // const sortData = (data) => {
//     //     data.sort((a, b) => {
//     //         if (a.title < b.title) return -1;  // a comes before b
//     //         if (a.title > b.title) return 1;   // a comes after b
//     //         return 0;                           // a and b are equal
//     //     })
//     // }

//     const getShoppingBags = async () => {
//         try {
//             console.log(`token: ${token}`); // token is null here!!!!!!!!!
//             const headers = {
//                 'Authorization': `Bearer ${token}`
//             }
//             const res = await axios.get('http://localhost:8000/api/user/shoppingBag', { headers })
//             if (res.status === 200) {
//                 // sortData(res.data)
//                 console.log(res.data);
//                 // dispatch(setBasket(res.data))
//                 setShoppingBags(res.data)
//                 // alert("basket:", basket);
//                 console.log("res.data", res.data);
//                 // console.log("useState",shoppingBags);
//             }
//         }
//         catch (e) {
//             if (e.status === 401){
//                 alert("unauthorized")
//             }
//             else if (e.status === 403){
//                 alert("forbiddened")
//             }
//             console.error(e)
//         }
//     }
//     const deleteShoppingBag = async (product) => {
//         alert("hgvh")
//         try {
//             const headers = {
//                 'Authorization': `Bearer ${token}`
//             }
//             const product_id = {
//                 product_id: product._id
//             }
//             const res = await axios.delete('http://localhost:8000/api/user/shoppingBag', {
//                 headers: headers,
//                 data: product_id
//             })
//             if (res.status === 200) {
//                 // dispatch(setBasket(res.data))
//                 // sortData(res.data)
//                 // setShoppingBags(res.data)
//                 console.log("res.data", res.data);
//                 // console.log("useState",shoppingBags);
//                 getShoppingBags()
//             }

//         }
//         catch (e) {
//             console.error(e)
//         }
//     }

//     const getSeverity = (s) => {
//         if (s >= 50) {
//             return 'success'
//         }
//         else if (s > 0) {
//             return 'warning';
//         }
//         else if (s === 0) {
//             return 'danger';
//         }

//     };
//     const getSeverityText = (product) => {
//         const severity = getSeverity(product.stock)

//         switch (severity) {
//             case 'success':
//                 return "במלאי";

//             case 'warning': //check what problematic
//                 return "פריטים אחרונים";

//             case 'danger':
//                 return "אזל מהמלאי";

//             default:
//                 return null;
//         }
//     };

//     const listItem = (product, index) => {
//         // alert(product.describe)
//         return (
//             <>
//                 <div className="col-12" key={product._id}>
//                     <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
//                         {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${product.company.imagePath}`} /> */}
//                         <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
//                         <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
//                             <div className="flex flex-column align-items-center sm:align-items-start gap-3">
//                                 {/* <Link to={{pathName:`/overheads/${product.title}` , state: {product:product} }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link> */}
//                                 <Link to={`/overheads/overhead/${product._id}`} params={{ product: product }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link>

//                                 <div className="flex align-items-center gap-3">
//                                     <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
//                                 </div>
//                             </div>
//                             <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
//                                 <span className="text-2xl font-semibold">₪{product.price}</span>
//                                 <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={() => deleteShoppingBag(product)}>   להסרה מהעגלה  </Button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     };

//     const gridItem = (product) => {
//         alert(product.describe)
//         return (
//             <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product._id}>
//                 <div className="p-4 border-1 surface-border surface-card border-round">
//                     <div className="flex flex-wrap align-items-center justify-content-between gap-2">
//                         {/* <img className="w-9 shadow-2 border-round" src={`${product.company.imagePath}`} /> */}
//                         <div className="flex align-items-center gap-2">
//                             <Link to={"/overheads/overhead"}><div className="text-2xl font-bold text-900" style={{}}>{product.title}</div></Link>
//                         </div>
//                     </div>
//                     <div className="flex flex-column align-items-center gap-3 py-5">
//                         <img className="w-9 shadow-2 border-round" src={`${product.imagepath}`} />
//                     </div>
//                     <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>

//                     <div className="flex align-items-center justify-content-between">
//                         <span className="text-2xl font-semibold">₪{product.price}</span>
//                         <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"}> להסרה מהעגלה </Button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };

//     const itemTemplate = (product, layout, index) => {
//         if (!product) {
//             return;
//         }

//         if (layout === 'list') return listItem(product, index);
//         else if (layout === 'grid') return gridItem(product);
//     };

//     const listTemplate = (products, layout) => {
//         if (!token) {
//             return <h1>please login to see your shopping bag</h1>; // Or any other fallback UI
//         }
//         if (!shoppingBags) {
//             return <h1>Your basket is empty</h1>; // Or any other fallback UI
//         }
//         return <div className="grid grid-nogutter">{shoppingBags.map((product, index) => itemTemplate(product, layout, index))}</div>;
//         // else{
//         //     <h1>basketIsEmpty</h1>
//         // }
//     };

//     const header = () => {
//         return (
//             <div className="flex justify-content-end">
//                 <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
//             </div>
//         );
//     };
//     useEffect(() => {
//         getShoppingBags()
//     }, [])

//     return (
//         <>
//             {/* 
//             <Routes>
//                 <Route path='/overheads/overhead' element={<Suspense fallback="Loading..."><Overhead /></Suspense>}></Route>
//             </Routes> */}
//             {/* {userDetalis!=null ?userDetalis.role === 'user'?<Button onClick={ ()=>goToAddOverhead("Overhead")}>add overhead</Button>: <></> : <></>} */}
//             {/* {<Button onClick={ ()=>goToAddOverhead("Overhead")}>add overhead</Button>} */}


//             <div className="card">
//                 <div className="flex justify-content-end">
//                     <IconField iconPosition="left">
//                         <InputIcon className="pi pi-search" />
//                         {/* <InputText placeholder="Search by name" onChange={(c) => getOverheadByTitle(c)} value={value} /> */}
//                     </IconField>
//                 </div>
//                 {/* {console.log("in return",basket)} */}
//                 <DataView value={shoppingBags} listTemplate={listTemplate} layout={layout} header={header()} />
//             </div>
//         </>
//     )
//     //showing all the shopping bag objects which belongs to the userId
//     // alert("basket")
// }
// export default Basket
// import axios from 'axios'
//  import { useEffect, useState} from 'react'
//  import { Button } from 'primereact/button';
//  import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
//  import { Tag } from 'primereact/tag';
//  import { classNames } from 'primereact/utils';
//  import { Link, useNavigate } from 'react-router-dom';
//  import { InputText } from 'primereact/inputtext';
//  import { IconField } from 'primereact/iconfield';
//  import { InputIcon } from 'primereact/inputicon';
//  import { getToken } from '../store/tokenSlice';
//  import { useSelector } from 'react-redux';
 
//  const Basket = () =>{
 
 
//      const {token} = useSelector((state) => state.token)
//      const [shoppingBags, setShoppingBags] = useState([])
//      const [layout, setLayout] = useState('list');
 
//      const sortData = (data) => {
//          data.sort((a, b) => {
//              if (a.title < b.title) return -1;  // a comes before b
//              if (a.title > b.title) return 1;   // a comes after b
//              return 0;                           // a and b are equal
//          })
//      }
 
//      const getShoppingBags = async () => {
//          try {
//              const headers = {
//                  'Authorization': `Bearer ${token}`
//              }
//              const res = await axios.get('http://localhost:8000/api/user/shoppingBag',{headers})
//              if (res.status === 200) {
//                  // sortData(res.data)
//                  setShoppingBags(res.data)
//                  console.log("res.data",res.data);
//                  console.log("useState",shoppingBags);
//              }
//          }
//          catch (e) {
//            if( e.status === 401){
//                 alert('Unauthorized')
//            }

//              console.error(e)
//          }
//      }
 
//      const deleteShoppingBag = async (product)=>{
//          alert("hgvh")
//          try {
//              const headers = {
//                  'Authorization': `Bearer ${token}`
//              }
//              const product_id = {
//                  product_id: product._id
//              }
//              const res = await axios.delete('http://localhost:8000/api/user/shoppingBag',{
//                  headers: headers,
//              data:product_id
//          })
//              if (res.status === 200) {
//                  // sortData(res.data)
//                  // setShoppingBags(res.data)
//                  console.log("res.data",res.data);
//                  console.log("useState",shoppingBags);
//              }
             
//          }
//          catch (e) {
//              console.error(e)
//          }
//      }
 
//      const getSeverity = (s) => {
//          if (s >= 50) {
//              return 'success'
//          }
//          else if (s > 0) {
//              return 'warning';
//          }
//          else if (s === 0) {
//              return 'danger';
//          }
 
//      };
//      const getSeverityText = (product) => {
//          const severity = getSeverity(product.stock)
 
//          switch (severity) {
//              case 'success':
//                  return "במלאי";
 
//              case 'warning': //check what problematic
//                  return "פריטים אחרונים";
 
//              case 'danger':
//                  return "אזל מהמלאי";
 
//              default:
//                  return null;
//          }
//      };
 
//      const listItem = (product, index) => {
//          return (
//              <>
//                  <div className="col-12" key={product._id}>
//                      <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
//                          {/* <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${product.company.imagePath}`} /> */}
//                          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
//                          <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
//                              <div className="flex flex-column align-items-center sm:align-items-start gap-3">
//                                  {/* <Link to={{pathName:`/overheads/${product.title}` , state: {product:product} }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link> */}
//                                  <Link to={`/overheads/overhead/${product._id}` } params={{ product: product }}><div className="text-2xl font-bold text-900" style={{}} >{product.title}</div></Link>
 
//                                  <div className="flex align-items-center gap-3">
//                                      <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
//                                  </div>
//                              </div>
//                              <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
//                                  <span className="text-2xl font-semibold">₪{product.price}</span>
//                                  <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={()=>deleteShoppingBag(product)}>   להסרה מהעגלה  </Button>
//                              </div>
//                          </div>
//                      </div>
//                  </div>
//              </>
//          );
//      };
 
//      const gridItem = (product) => {
//          return (
//              <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2" key={product._id}>
//                  <div className="p-4 border-1 surface-border surface-card border-round">
//                      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
//                          {/* <img className="w-9 shadow-2 border-round" src={`${product.company.imagePath}`} /> */}
//                          <div className="flex align-items-center gap-2">
//                              <Link to={"/overheads/overhead"}><div className="text-2xl font-bold text-900" style={{}}>{product.title}</div></Link>
//                          </div>
//                      </div>
//                      <div className="flex flex-column align-items-center gap-3 py-5">
//                          <img className="w-9 shadow-2 border-round" src={`${product.imagepath}`} />
//                      </div>
//                      <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
 
//                      <div className="flex align-items-center justify-content-between">
//                          <span className="text-2xl font-semibold">₪{product.price}</span>
//                          <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"}> להסרה מהעגלה </Button>
//                      </div>
//                  </div>
//              </div>
//          );
//      };
 
//      const itemTemplate = (product, layout, index) => {
//          if (!product) {
//              return;
//          }
         
//          if (layout === 'list') return listItem(product, index);
//          else if (layout === 'grid') return gridItem(product);
//      };
 
//      const listTemplate = (products, layout) => {
//          if(shoppingBags!=null){
//              return <div className="grid grid-nogutter">{shoppingBags.map((product, index) => itemTemplate(product, layout, index))}</div>;
//          }
//          else{
//              <>basketIsEmpty</>
//          }
//          };
 
//      const header = () => {
//          return (
//              <div className="flex justify-content-end">
//                  <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
//              </div>
//          );
//      };
//      useEffect(() => {
//          getShoppingBags()
//      }, [])
 
//      return (
//          <>
//  {/* 
//              <Routes>
//                  <Route path='/overheads/overhead' element={<Suspense fallback="Loading..."><Overhead /></Suspense>}></Route>
//              </Routes> */}
//              {/* {userDetalis!=null ?userDetalis.role === 'user'?<Button onClick={ ()=>goToAddOverhead("Overhead")}>add overhead</Button>: <></> : <></>} */}
//              {/* {<Button onClick={ ()=>goToAddOverhead("Overhead")}>add overhead</Button>} */}
 
 
//              <div className="card">
//                  <div className="flex justify-content-end">
//                      <IconField iconPosition="left">
//                          <InputIcon className="pi pi-search" />
//                          {/* <InputText placeholder="Search by name" onChange={(c) => getOverheadByTitle(c)} value={value} /> */}
//                      </IconField>
//                  </div>
//                  <DataView value={shoppingBags} listTemplate={listTemplate} layout={layout} header={header()} />
//              </div>
//          </>
//      )
//      //showing all the shopping bag objects which belongs to the userId
//  // alert("basket")
//  }

//  export default Basket


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

const Basket = () => {
    const {basket} = useSelector((state) => state.basket);
    const {token} = useSelector((state) => state.token);
    const [layout, setLayout] = useState('list');
    const dispatch = useDispatch()
    const navigate = useNavigate()
    console.log("token Basket",token)
    

    let amount =0;
    if(basket){
        basket.map(b=> amount+=b.price)
    }

    const [totalAmount,setTotalAmount] =useState(0);
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
            const res = await axios.get('http://localhost:8000/api/user/shoppingBag',{headers})
            if (res.status === 200) {
                dispatch(setBasket(res.data))
                console.log("res.data",res.data);
            }
        }
        catch (e) {
            console.error(e)
        }
    }

    const goToPayment = ()=> {
        navigate('/basket/payment')
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
        return (
            <div className="col-12" key={product._id}>
                <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-4 gap-4', { 'border-top-1 surface-border': index !== 0 })}>
                    <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`${product.imagepath}`} />
                    <div className="flex flex-column sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                        <div className="flex flex-column align-items-center sm:align-items-start gap-3">
                            <Link to={`/overheads/overhead/${product._id}`}><div className="text-2xl font-bold text-900">{product.title}</div></Link>
                            <div className="flex align-items-center gap-3">
                                <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)}></Tag>
                            </div>
                        </div>
                        <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                            <span className="text-2xl font-semibold">₪{product.price}</span>
                            <Button icon="pi pi-shopping-cart" className="p-button-rounded" disabled={getSeverity(product.stock) === "danger"} onClick={() => deleteShoppingBag(product)}> להסרה מהעגלה </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const listTemplate = (products, layout) => {
        if(!basket){
            return <h1>basket is empty</h1>
        }
        return <div className="grid grid-nogutter">{basket.map((product, index) => listItem(product, index))}</div>;
    };

    const header = () => {
        return (
            <div className="flex justify-content-end">
                <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
            </div>
        );
    };
    useEffect(() => {
        if (token) {
            // קריאה ל-API רק אם יש טוקן
            getShoppingBag();
            amount = 0;
        }
        else{
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
            <h4>{amount} ש"ח</h4>
            <div className="flex justify-content-center align-items-center" style={{ height: '200px', border: '2px solid #e0e0e0', borderRadius: '8px' }}>
                <Button label="לשלם עכשיו" icon="pi pi-credit-card" onClick={goToPayment} className="p-button-success p-button-rounded" style={{ width: '150px' }} />
            </div>
        </div>

        {/* Right Side with Shopping Basket Items */}
        <div className="card flex-1">
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                </IconField>
            </div>
            <DataView value={basket} listTemplate={listTemplate} layout={layout} header={header()} />
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