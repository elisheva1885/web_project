import axios from 'axios'
import { useEffect, useState, lazy, useRef } from 'react'
import { Button } from 'primereact/button';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Link, useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { getToken } from '../../store/tokenSlice';
import { useDispatch, useSelector } from 'react-redux';
import Add_AirConditioner from './Add_AirConditioner';
import { setCompanies } from '../../store/companySlice'
import { setBasket } from '../../store/basketSlice';
import { setOverheads } from '../../store/air-conditioner/overHeadsSlice';
import SideFillter from '../SideFillter';
import UpdateOverhead from './updateOvearhead';
import { Controller, useForm } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { setMultiIndoorUnits } from '../../store/air-conditioner/multiIndoorUnitsSlice';
import useGetFilePath from '../../hooks/useGetFilePath';
import { Toast } from 'primereact/toast';
import useAddToBasket from "../../hooks/useAddToBasket";


const Overhead = lazy(() => import('./Overhead'));


const MultiIndoorUnits = () => {

 const { token } = useSelector((state) => state.token)
 const { companies } = useSelector((state) => state.companies)
 const { basket } = useSelector((state) => state.basket)
 const { userDetails } = useSelector((state) => state.userDetails);

 const { multiIndoorUnits } = useSelector((state) => state.multiIndoorUnits);
 const [selectedProduct, setSelectedProduct] = useState(null);
 const [value, setValue] = useState('')
 const [priceVisible, setPriceVisible] = useState(false);
 const [stockVisible, setStockVisible] = useState(false);
 const { control, handleSubmit, formState: { errors }, watch } = useForm()
 const [layout, setLayout] = useState('grid');
 const navigate = useNavigate();
 const dispatch = useDispatch();
 const priceValue = watch('price');
 const stockValue = watch('stock');
 const { getFilePath } = useGetFilePath()
 const { addToBasket, toast } = useAddToBasket();

 const errorMessages = {
  INVALID_USER_ID: "המזהה שלך אינו תקין. נסי להתחבר מחדש.",
  INVALID_PRODUCT_ID: "מזהה המוצר אינו תקין.",
  INVALID_AMOUNT: "כמות המוצר חייבת להיות מספר חיובי.",
  "Invalid type: MiniCenteral. Must be one of Overhead, MiniCenteral, MultiIndoorUnit, MultiOutdoorUnit":
   "סוג המוצר אינו תקין. אנא נסי שוב.",
  INTERNAL_ERROR: "שגיאת שרת פנימית. נסי שוב מאוחר יותר.",
  Access_denied: "אינך מורשה לבצע פעולה זו.",
  Forbidden: "אינך מורשה לבצע פעולה זו.",
  UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
  INVALID_TITLE: "הכותרת שסיפקת אינה תקינה. נסי שנית.",
  NO_MULTI_INDOOR_UNITS_FOUND: "לא נמצאו יחידות פנימיות תואמות.",
  INVALID_MULTI_INDOOR_UNIT_ID: "מזהה היחידה הפנימית אינו תקין.",
  INVALID_PRICE: "המחיר חייב להיות מספר חיובי.",
  MULTI_INDOOR_UNIT_NOT_FOUND: "היחידה הפנימית לא נמצאה.",
 };

 const goToAddMultiIndoorUnit = (type) => {
  const navigationData = {
   type: type,
   // You can add any other data you may want to send
  };
  navigate('/air_conditioner/add', { state: navigationData });
 };

 const addtoBasket = async (product) => {
  addToBasket(product, "MultiIndoorUnit")
 }


 const deleteMultiIndoorUnit = async (product) => {
  try {
   const headers = {
    'Authorization': `Bearer ${token}`
   };
   const _id = {
    _id: product._id
   };
   const res = await axios.delete('http://localhost:8000/api/air-conditioner/multiIndoorUnit', {
    headers: headers,
    data: _id
   });
   if (res.status === 200) {
    toast.current.show({
     severity: "success",
     summary: "הצלחה",
     detail: "היחידה הפנימית נמחקה בהצלחה.",
    });
    const updatedOverheads = multiIndoorUnits.filter(multiIndoorUnit => multiIndoorUnit._id !== product._id)
    dispatch(setMultiIndoorUnits(updatedOverheads))
   }
  } catch (error) {
   if (error.response && error.response.data?.message) {
    const message = error.response.data.message;
    toast.current.show({
     severity: "error",
     summary: "שגיאה",
     detail: errorMessages[message] || "שגיאה בלתי צפויה. נסי שוב מאוחר יותר.",
    });
   } else {
    toast.current.show({
     severity: "error",
     summary: "שגיאה",
     detail: "ודאי שיש חיבור לאינטרנט ונסי שוב.",
    });
   }
  }
 };
 const openPriceUpdateDialog = (product) => {
  setSelectedProduct(product);
  setPriceVisible(true);
 };

 const openStockUpdateDialog = (product) => {
  setSelectedProduct(product);
  setStockVisible(true);
 };


 const updatePrice = async (data) => {
  try {
   const headers = {
    'Authorization': `Bearer ${token}`
   }
   const details = {
    _id: selectedProduct._id,
    price: priceValue
   }
   console.log(details);
   const res = await axios.put(`http://localhost:8000/api/air-conditioner/multiIndoorUnit/price`, details, { headers });
   console.log(res);
   if (res.status === 200) {
    toast.current.show({
     severity: "success",
     summary: "הצלחה",
     detail: `${selectedProduct.title} עודכן בהצלחה.`,
    });
    const unUpdatedOverheads = multiIndoorUnits.filter(multiIndoorUnit => multiIndoorUnit._id !== res.data._id)
    dispatch(setMultiIndoorUnits([...unUpdatedOverheads, res.data]))
    setPriceVisible(false);
   }
  }
  catch (error) {
   if (error.response && error.response.data?.message) {
    const message = error.response.data.message;
    toast.current.show({
     severity: "error",
     summary: "שגיאה",
     detail: errorMessages[message] || "שגיאה בלתי צפויה. נסי שוב מאוחר יותר.",
    });
   } else {
    toast.current.show({
     severity: "error",
     summary: "שגיאה",
     detail: "ודאי שיש חיבור לאינטרנט ונסי שוב.",
    });
   }
   setPriceVisible(false);
  }
 }


 const sortData = (data) => {
  data.sort((a, b) => {
   if (a.title < b.title) return -1;  // a comes before b
   if (a.title > b.title) return 1;   // a comes after b
   return 0;                           // a and b are equal
  })
 }


 const getMultiIndoorUnitByTitle = async (c) => {
  try {
   setValue(c.target.value)
   const res = await axios.get(`http://localhost:8000/api/air-conditioner/multiIndoorUnit/${c.target.value}`)
   if (res.status === 200) {
    dispatch(setMultiIndoorUnits(res.data))
   }
  }
  catch (e) {
   if (e.response && e.response.data?.message) {
    const message = e.response.data.message;
    toast.current.show({
     severity: "error",
     summary: "שגיאה",
     detail: errorMessages[message] || "שגיאה בלתי צפויה. נסי שוב מאוחר יותר.",
    });
   } else {
    toast.current.show({
     severity: "error",
     summary: "שגיאה",
     detail: "ודאי שיש חיבור לאינטרנט ונסי שוב.",
    });
   }
  }
 }

const getSeverity = (s) => {
    if (s >= 50) {
        return 'success'
    }
    else if (s > 0) {
        return 'warning';
    }
    else if (s === 0) {
        return 'danger';
    }

};
const getSeverityText = (product) => {
    const severity = getSeverity(product.stock)

    switch (severity) {
        case 'success':
            return "במלאי";

        case 'warning': //check what problematic
            return "פריטים אחרונים";

        case 'danger':
            return "אזל מהמלאי";

        default:
            return null;
    }
};

const UpdateMultiIndoorUnit = async (m) => {
    const navigationData = {
        type: m,
        // You can add any other data you may want to send
    };
    navigate('/multiIndoorUnits/multiIndoorUnit/update', { state: navigationData })
    // dispatch(setOverheads(res.data))
}

const gridItem = (product) => {
    return (
        <div className="col-12 sm:col-6 lg:col-3 p-3" key={product._id}>
            <div className="border-1 surface-border border-round p-4 shadow-3 h-full flex flex-column justify-content-between gap-4">

                {/* תמונת החברה - גדולה ובולטת */}
                <img
                    src={`/${product?.company?.imagePath}`}
                    alt="Company"
                    className="w-full h-10rem object-contain border-round"
                />

                {/* תמונת המוצר - גדולה ורחבה */}
                <img
                    src={getFilePath(product.imagepath)}
                    alt={product.title}
                    className="w-full h-12rem object-contain border-round"
                />

                {/* פרטי המוצר */}
                <div className="flex flex-column align-items-center text-center gap-2">
                    <Link to={`/multiIndoorUnits/multiIndoorUnit/${product._id}`}>
                        <div className="text-xl font-bold text-900">{product.title}</div>
                    </Link>

                    <Tag value={getSeverityText(product)} severity={getSeverity(product.stock)} />
                    <span className="text-lg font-medium text-primary">₪{product.price}</span>
                    {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => UpdateMultiIndoorUnit(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}></i></Button> : <></>}
                    {userDetails?.role === 'official' || userDetails?.role === 'admin' ? (<Button onClick={() => openPriceUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מחיר </i> </Button>) : <></>}
                    {/* {userDetails?.role === 'official' || userDetails?.role === 'admin' ? <Button onClick={() => openStockUpdateDialog(product)}><i className="pi pi-pencil" style={{ fontSize: '1rem' }}> עדכון מלאי </i></Button> : <></>} */}

                    {userDetails?.role === 'admin' && (
                        <Button icon="pi pi-trash" className="p-button-rounded p-button-danger p-button-sm" onClick={() => deleteMultiIndoorUnit(product)} tooltip="מחק" tooltipOptions={{ position: 'bottom' }} />
                    )}
                </div>
                <Button
                    label="הוספה לעגלה"
                    icon="pi pi-shopping-cart"
                    className="w-full"
                    disabled={
                        getSeverity(product.stock) === "danger"
                    }
                    onClick={() => addtoBasket(product)}
                />
            </div>
        </div>
    );
};

const itemTemplate = (product, layout, index) => {
    if (!product) {
        return;
    }
    if (layout === 'grid') return gridItem(product, index);
};

const listTemplate = (products, layout) => {
    if (!Array.isArray(multiIndoorUnits) || multiIndoorUnits.length === 0) {
        return <h1>No multiIndoorUnits available</h1>; // Fallback UI          
    }
    return <div className="grid grid-nogutter">{multiIndoorUnits.map((product, index) => itemTemplate(product, layout, index))}</div>;
};

return (
    <>
        {userDetails.role === 'admin' ? <Button onClick={() => goToAddMultiIndoorUnit("MultiIndoorUnit")}>להוספת מאייד מולטי</Button> : <></>}
            <Toast ref={toast} />
        <div className="card">
            <div className="flex justify-content-end">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText placeholder="Search by name" onChange={(c) => getMultiIndoorUnitByTitle(c)} value={value} />
                </IconField>
            </div>
            <DataView value={multiIndoorUnits} listTemplate={listTemplate} layout={layout} />
        </div>


        <Dialog
            header="עדכון מחיר"
            visible={priceVisible}
            style={{ width: '50vw' }}
            onHide={() => priceVisible(false)}
            modal
        >
            <h6>מחיר:</h6>
            <div className="field">
                <span className="p-float-label">
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <InputText id={field.name} type="number" {...field} />
                        )}
                    />
                    <label htmlFor="price">{selectedProduct?.price}</label>
                </span>
            </div>
            <Button
                label="לעדכון"
                onClick={handleSubmit(updatePrice)}
                className="p-button-success"
            />
        </Dialog>

    </>
)
}

export default MultiIndoorUnits