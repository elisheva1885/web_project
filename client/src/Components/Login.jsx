import React, {useState } from 'react';
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
import { setBasket ,clearBasket  } from '../store/basketSlice';
import { clearUserDetails, setUserDetails } from '../store/userDetailsSlice';
import Basket from './Basket';

const Login  =() => {
    const {token} = useSelector((state) => state.token)
    // const {basket} = useSelector((state) => state.basket)
    const {userDetails} = useSelector((state) => state.userDetails);
    // const {role} = useSelector((state) => state.userDetails.role)

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

    const signOut = ()=> {
        clearToken()
        clearBasket()
    }

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

    const onSubmit = async (data) => {
        setFormData(data);
        const user = {
            username: data.username,
            password: data.password
        }
        try {
            const res = await axios.post(`http://localhost:8000/api/auth/login`,user)
            if(res.status===200){
                console.log(res.data.token);
                dispatch(setToken(res.data.token))
                // dispatch(setToken(res.data.token));
                dispatch(setUserDetails({username:res.data.username,role:res.data.role}))
                console.log(token);
                setShowMessage(true);
                // getShoppingBag();
                goToHome()
            }
        }

        catch (error) {
            console.error(error)
            if(error.status===401){
                    alert("Unauthorized")
                }
        }
    };

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    
    return (
        <div className="form-demo">
        {/* //     <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
        //         <div className="flex justify-content-center flex-column pt-6 px-3">
        //             <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
        //             <h5>Login Successful!</h5>
        //             <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
        //             !!התחברת בהצלחה {userDetails} שלום  <b></b>  
        //             </p>
        //         </div>
        //     </Dialog> */}
            <div className="flex justify-content-center">
                <div className="card">
                    <h5 className="text-center">התחבר</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        
                    <p>?לא רשומים באתר</p>
                    <Link to={`/register` }>לחצו כאן</Link>
                    <br/><br/><br/>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="username" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>*שם משתמש</label>
                            </span>
                            {getFormErrorMessage('name')}
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>*סיסמה</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>
                        <Button type="submit" label="Submit" className="mt-2" />
                    </form>
                </div>
            </div>

        </div>


    );
}

export default Login