import { useRef } from "react";
import { setBasket } from "../store/basketSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const useAddToBasket = () => { // Renamed to a valid custom hook
    const {token} = useSelector((state) => state.token); // Hook used correctly inside a custom hook
    const { basket } = useSelector((state) => state.basket);
    const dispatch = useDispatch();
    const toast = useRef(null);

    const errorMessages = {
        INVALID_USER_ID: "המזהה שלך אינו תקין. נסי להתחבר מחדש.",
        INVALID_PRODUCT_ID: "מזהה המוצר אינו תקין.",
        INVALID_AMOUNT: "כמות המוצר חייבת להיות מספר חיובי.",
        INTERNAL_ERROR: "שגיאת שרת פנימית. נסי שוב מאוחר יותר.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו.",
        UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
    };

    const addToBasket = async (product, type) => {
        if (token === null) {
            toast.current.show({
                severity: 'warn',
                summary: 'שגיאה',
                detail: 'כדי להוסיף לסל חובה להיכנס לאיזור האישי',
            });
        } else {
            const shoppingBagDetails = {
               product_id: product._id,
                type: type,
                amount: 1
            };
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`
                };
                const res = await axios.post('http://localhost:8000/api/user/shoppingBag', shoppingBagDetails, { headers });
                if (res.status === 201) {
                    dispatch(setBasket([...basket, res.data]));
                    toast.current.show({
                        severity: 'success',
                        summary: 'הצלחה',
                        detail: 'המוצר נוסף לעגלה בהצלחה',
                    });
                } else if (res.status === 200) {
                    toast.current.show({
                        severity: 'info',
                        summary: 'עדכון',
                        detail: 'כמות המוצר בעגלה עודכנה בהצלחה',
                    });
                }
            } catch (e) {
                console.log(e);
                if (e.response && e.response.data?.message) {
                    const message = e.response.data.message;
                    toast.current.show({
                        severity: 'error',
                        summary: 'שגיאה',
                        detail: errorMessages[message] || "שגיאה לא צפויה. נסי שוב מאוחר יותר."
                    });
                } else {
                    toast.current.show({
                        severity: 'error',
                        summary: 'שגיאה כללית',
                        detail: "ודאי שיש חיבור לאינטרנט ונסי שוב."
                    });
                }
            }
        }
    };

    return { addToBasket, toast }; // Return the function and toast ref
};

export default useAddToBasket;