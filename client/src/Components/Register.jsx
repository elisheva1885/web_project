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
import { Navigate, useNavigate } from 'react-router-dom';

const Register = () => {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate()
    const errorMessages = {
        INVALID_USERNAME: "שם המשתמש לא תקין או חסר",
        USERNAME_TAKEN: "שם המשתמש כבר תפוס",
        INVALID_PASSWORD: "הסיסמה חייבת להכיל לפחות 8 תווים כולל אות גדולה, קטנה, מספר ותו מיוחד",
        INVALID_EMAIL: "כתובת המייל לא תקינה",
        INVALID_PHONE: "מספר הטלפון לא תקין",
        INTERNAL_ERROR: "שגיאה בשרת, נסי שוב מאוחר יותר",
    };
    const defaultValues = {
        name: '',
        username: '',
        password: '',
        email: '',
        phone: ''
    };
    const { control, formState: { errors }, handleSubmit, reset } = useForm({ defaultValues });
    const onSubmit = async (data) => {
        setFormData(data);
        const user = {
            name: data.name,
            username: data.username,
            password: data.password,
            email: data.email,
            phone: data.phone
        }
        try {
            const res = await axios.post(`http://localhost:8000/api/auth/register`, user)
            if (res.status === 201) {
                setShowMessage(true);
                navigate('/')
            }
        } catch (error) {
            if (error.response && error.response.data?.code) {
                const code = error.response.data.code;
                alert(errorMessages[code] || "שגיאה לא צפויה");
            } else {
                alert("שגיאה כללית, נסי שוב מאוחר יותר");
            }
        }
        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => setShowMessage(false)} /></div>;
    const passwordHeader = <h6>בחר סיסמה חזקה</h6>;
    const passwordFooter = (
        <React.Fragment>
            <ul>
                <li>לפחות אות אחת קטנה</li>
                <li>לפחות אות אחת גדולה</li>
                <li>לפחות פסרה אחת</li>
                <li>לפחות סימן אחד</li>
                <li>מינימום 8 ספרות</li>
            </ul>
        </React.Fragment>
    );
    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <h2 className="text-center">הרשמה</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        {/* שם */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{
                                        required: 'יש להזין שם.',
                                        minLength: { value: 2, message: 'השם חייב להכיל לפחות 2 תווים.' },
                                        validate: value => value.trim() !== '' || 'השם לא יכול להיות ריק או להכיל רווחים בלבד.'
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )}
                                />
                                <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>שם*</label>
                            </span>
                            {getFormErrorMessage('name')}
                        </div>

                        {/* שם משתמש */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{
                                        required: 'יש להזין שם משתמש.',
                                        minLength: { value: 3, message: 'שם המשתמש חייב להכיל לפחות 3 תווים.' },
                                        validate: value => value.trim() !== '' || 'שם המשתמש לא יכול להיות ריק או להכיל רווחים בלבד.'
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )}
                                />
                                <label htmlFor="username" className={classNames({ 'p-error': errors.username })}>שם משתמש*</label>
                            </span>
                            {getFormErrorMessage('username')}
                        </div>

                        {/* אימייל */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'יש להזין כתובת אימייל.',
                                        pattern: {
                                            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                            message: 'כתובת אימייל לא תקינה.'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )}
                                />
                                <label htmlFor="email" className={classNames({ 'p-error': errors.email })}>אימייל*</label>
                            </span>
                            {getFormErrorMessage('email')}
                        </div>

                        {/* טלפון */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{
                                        pattern: {
                                            value: /^05\d{8}$/,
                                            message: 'מספר הטלפון חייב להיות בפורמט ישראלי).'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field}
                                            className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )}
                                />
                                <label htmlFor="phone" className={classNames({ 'p-error': errors.phone })}>טלפון</label>
                            </span>
                            {getFormErrorMessage('phone')}
                        </div>

                        {/* סיסמה */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: 'יש להזין סיסמה.',
                                        pattern: {
                                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/,
                                            message: 'הסיסמה חייבת להכיל לפחות 8 תווים, כולל אות קטנה, אות גדולה, ספרה ותו מיוחד.'
                                        }
                                    }}
                                    render={({ field, fieldState }) => (
                                        <Password id={field.name} {...field}
                                            toggleMask
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                            header={passwordHeader}
                                            footer={passwordFooter}
                                        />
                                    )}
                                />
                                <label htmlFor="password" className={classNames({ 'p-error': errors.password })}>סיסמה*</label>
                            </span>
                            {getFormErrorMessage('password')}
                        </div>

                        <Button type="submit" label="הרשמה" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Register;    