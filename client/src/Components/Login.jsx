import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import '../Login.css';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearToken, setToken } from '../store/tokenSlice';
import myStore from '../store/store';
import { setBasket, clearBasket } from '../store/basketSlice';
import { clearUserDetails, setUserDetails } from '../store/userDetailsSlice';
import Basket from './Basket';
import { clearUserDeliveries } from '../store/userDeliveriesSlice';

const Login = () => {
    const { token } = useSelector((state) => state.token)
    // const {basket} = useSelector((state) => state.basket)
    const { userDetails } = useSelector((state) => state.userDetails);
    // const {role} = useSelector((state) => state.userDetails.role)
    const errorMessages = {
        INVALID_CREDENTIALS: "שליחת הנתונים נכשלה. אנא בדוק את החיבור שלך ונסה שוב.",
        UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. אנא נסה שוב מאוחר יותר."
    };
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const dispatch = useDispatch();
    const defaultValues = {
        username: '',
        password: '',
        accept: false
    }

    const goToHome = () => {
        navigate('/');
    };

    const signOut = () => {
        clearToken()
        clearBasket()
        clearUserDeliveries()
    }



    const onSubmit = async (data) => {
        setFormData(data);
        const user = {
            username: data.username,
            password: data.password
        }
        try {
            const res = await axios.post(`http://localhost:8000/api/auth/login`, user)
            if (res.status === 200) {
                console.log(res.data);
                dispatch(setToken(res.data.token))
                console.log(token);
                dispatch(setUserDetails({ name: res.data.name, username: res.data.username, email: res.data.email, phone: res.data.phone, role: res.data.role }))
                setShowMessage(true);
                goToHome()
            }
        }

        catch (error) {
            if (error.response && error.response.data?.code) {
                const code = error.response.data.code;
                alert(errorMessages[code] || "שגיאה לא צפויה");
            } else {
                alert("שגיאה כללית, נסי שוב מאוחר יותר");
            }
        }
    };

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;

    return (
        <div style={{ paddingTop: '60px' }}>

            <div className="form-demo">
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">התחבר</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                            <p>?לא רשומים באתר</p>
                            <Link to={`/register`}>לחצו כאן</Link>
                            <br /><br /><br />
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="username" control={control} rules={{ required: 'יש להזין שם משתמש.', }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>*שם משתמש</label>
                                </span>
                                {getFormErrorMessage('name')}
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="password" control={control} rules={{ required: 'יש להזין סיסמה.', }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>*סיסמה</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <Button type="submit" label="להתחברות" className="mt-2" />
                        </form>
                    </div>
                </div>

            </div>
        </div>

    );
}

export default Login