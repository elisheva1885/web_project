import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import axios from 'axios'
import '../Login.css';
import { useSelector } from 'react-redux';


const AdminRegister = ()=> {
        const [showMessage, setShowMessage] = useState(false);
        const [formData, setFormData] = useState({});
        const {userDetails} = useSelector((state) => state.userDetails);
        const {token} = useSelector((state) => state.token);

        const defaultValues = {
            name: '',
            username: '',
            password: '',
            email: '',
            phone: '',
            accept: false
        }
    
        const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    
      
        const onSubmit = async (data) => {
            setFormData(data);
            const user = {
                name: data.name,
                username: data.username,
                password: data.password,
                email: data.email,
                phone: data.phone,
                roles: "official"
            }
            try {
                const headers = {
                    'Authorization': `Bearer ${token}`
                }
                const res = await axios.post(`http://localhost:8000/api/auth/admin/register`,headers,user)
                if(res.status===200){
                    setShowMessage(true);
                }
            } catch (error) {
                if(error.status === 401){
                    alert("Unauthorized")
                }
            }
            reset();
        };
    
        const getFormErrorMessage = (name) => {
            return errors[name] && <small className="p-error">{errors[name].message}</small>
        };
    
        const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
        const passwordHeader = <h6>Pick a password</h6>;
        const passwordFooter = (
            <React.Fragment>
                <Divider />
                <p className="mt-2">Suggestions</p>
                <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                    <li>At least one lowercase</li>
                    <li>At least one uppercase</li>
                    <li>At least one numeric</li>
                    <li>Minimum 8 characters</li>
                </ul>
            </React.Fragment>
        );
    
        return (
            <div style={{ paddingTop: '60px' }}>
            <div className="form-demo">
                <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                    <div className="flex justify-content-center flex-column pt-6 px-3">
                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                        <h5>!הרישום בוצע בהצלחה</h5>
                        <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                            החשבון שלך תחת שם משתמש:  <b>{formData.name}</b> ; מיילים ישלחו לכתובת    <b>{formData.email}</b> ברוכים הבאים.
                        </p>
                    </div>
                </Dialog>
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">הירשם</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="name" control={control} rules={{ required: 'Name is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>Name*</label>
                                </span>
                                {getFormErrorMessage('name')}
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="username" control={control} rules={{ required: 'Username is required.' }} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="username" className={classNames({ 'p-error': errors.name })}>UserName*</label>
                                </span>
                                {getFormErrorMessage('username')}
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="password" control={control} rules={{ required: 'Password is required.' }} render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                    )} />
                                    <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>Password*</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    {/* <i className="pi pi-envelope" /> */}
                                    <Controller name="email" control={control}
                                        rules={{ required: 'Email is required.', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' } }}
                                        render={({ field, fieldState }) => (
                                            <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                        )} />
                                    <label htmlFor="email" className={classNames({ 'p-error': !!errors.email })}>Email</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller name="phone" control={control} render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )} />
                                    <label htmlFor="phone" className={classNames({ 'p-error': errors.name })}>phone</label>
                                </span>
                                {getFormErrorMessage('phone')}
                            </div>
                            <div className="field-checkbox">
                                <Controller name="accept" control={control} rules={{ required: true }} render={({ field, fieldState }) => (
                                    <Checkbox inputId={field.name} onChange={(e) => field.onChange(e.checked)} checked={field.value} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="accept" className={classNames({ 'p-error': errors.accept })}>I agree to the terms and conditions*</label>
                            </div>
                            <Button type="submit" label="הירשם" className="mt-2" />
                            {/* {userDetails?.role==="user"?<Button type="button"label="הוספת מזכירה" className="mt-2" onClick={registerOfficial()} />: <></> } */}
    
                        </form>
                    </div>
                </div>
            </div>
            </div>
        );
    
    
}
export default AdminRegister