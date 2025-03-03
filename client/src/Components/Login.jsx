import React, {useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import './Login.css';
import axios from 'axios'
import { Link } from 'react-router-dom';

const Login  =() => {

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const defaultValues = {
        username: '',
        password: '',
        accept: false
    }
   
    const onSubmit = async (data) => {
        // console.log(data);
        setFormData(data);
        const user = {
            username: data.username,
            password: data.password

        }
        try {
            const res = await axios.post(`http://localhost:8000/api/auth/login`,user)
            if(res.status===200){
                console.log(res.data);
                setShowMessage(true);
            }
        } catch (error) {
            console.error(error)
        }
        reset();
    };

    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });



    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    
    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Login Successful!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Your account is registered under name <b>{formData.name}</b> ; it'll be valid next 30 days without activation. Please check <b>{formData.email}</b> for activation instructions.
                    </p>
                </div>
            </Dialog>
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