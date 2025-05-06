import React, { useRef, useState } from 'react';
 import { useForm, Controller } from 'react-hook-form';
 import { Dialog } from 'primereact/dialog';
 import { InputText } from 'primereact/inputtext';
 import { Button } from 'primereact/button';
 import axios from 'axios';
 import classNames from 'classnames';
 import { useDispatch, useSelector } from 'react-redux';
 import { Navigate, useLocation, useNavigate } from 'react-router-dom';
 import Branches from './Branch';
 import { Toast } from 'primereact/toast';

 
 const UpdateBranch = () => {
     const { control, handleSubmit, formState: { errors } } = useForm();
     const [showMessage, setShowMessage] = useState(false);
     const [formData, setFormData] = useState({});
     // const {companies} = useSelector((state) => state.companies)
     const location = useLocation();
     const { data: branch } = location.state || {};     const navigate = useNavigate();
     const toast = useRef(null);
     const { token } = useSelector((state) => state.token)
     const errorMessages = {
        INVALID_ADDRESS: "כתובת לא תקינה. ודאי שמולאו עיר, רחוב ומספר.",
        INVALID_PHONE: "מספר הטלפון שהוזן אינו תקין.",
        INVALID_OPENING_HOUR: "שעת פתיחה אינה תקינה.",
        INVALID_CLOSING_HOUR: "שעת סגירה אינה תקינה.",
        BRANCH_EXISTS: "סניף עם כתובת זו כבר קיים.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסי שוב מאוחר יותר.",

    };
     const onSubmit = async (data) => {
         const updateBranch = {
             _id: branch._id,
             address: data.address,
             phoneNumber: data.phoneNumber,
             openingHour: data.openingHour,
             closingHour : data.closingHour
         }
         try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
             const response = await axios.put('http://localhost:8000/api/branches', updateBranch, {headers});
             if(response.status===200)
             {
             setFormData(data);
             setShowMessage(true);
             navigate('/branch' )
             }
             
         }  catch (error) {
            if (error.response && error.response.data?.message) {
                const message = error.response.data.message;
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
     };
 
     const getFormErrorMessage = (name) => {
         return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
     };
 

   
     return (
        <div style={{ paddingTop: '60px' }}>
            <Toast ref={toast} />
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">עדכון סניף</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="address.city"
                                    control={control}
                                    defaultValue={branch?.address?.city || ''}
                                    rules={{ required: 'יש להזין עיר' }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )}
                                />
                                <label htmlFor="address.city" className={classNames({ 'p-error': errors.address?.city })}>*עיר</label>
                            </span>
                            {getFormErrorMessage('address.city')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="address.street"
                                    control={control}
                                    defaultValue={branch?.address?.street || ''}
                                    rules={{ required: 'יש להזין רחוב' }}
                                    render={({ field, fieldState }) => (
                                        <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                    )}
                                />
                                <label htmlFor="address.street" className={classNames({ 'p-error': errors.address?.street })}>*רחוב</label>
                            </span>
                            {getFormErrorMessage('address.street')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="address.streetNum"
                                    control={control}
                                    defaultValue={branch?.address?.streetNum || ''}
                                    rules={{ required: 'יש להזין מספר בית' }}
                                    render={({ field }) => (
                                        <InputText id={field.name} type="number" {...field} />
                                    )}
                                />
                                <label htmlFor="address.streetNum">*מספר בית</label>
                            </span>
                            {getFormErrorMessage('address.streetNum')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    defaultValue={branch?.phoneNumber || ''}
                                    rules={{
                                        required: 'יש להזין מספר טלפון',
                                        validate: value =>
                                            /^0[2-9]\d{7}$/.test(value) || 'מספר טלפון קווי לא חוקי. חייב להכיל 8 ספרות ולהתחיל בקידומת תקינה'
                                    }}
                                    render={({ field }) => (
                                        <InputText id={field.name} type="text" {...field} />
                                    )}
                                />
                                <label htmlFor="phoneNumber">*מספר טלפון</label>
                            </span>
                            {getFormErrorMessage('phoneNumber')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller
                                    name="openingHour"
                                    control={control}
                                    defaultValue={branch?.openingHour || ''}
                                    rules={{
                                        required: 'יש להזין שעת פתיחה',
                                        validate: value => value >= 7 && value <= 9 || 'שעת הפתיחה חייבת להיות בין 7 ל־9'
                                    }}
                                    render={({ field }) => (
                                        <InputText id={field.name} type="number" {...field} />
                                    )}
                                />
                                <label htmlFor="openingHour">*שעת פתיחה</label>
                            </span>
                            {getFormErrorMessage('openingHour')}
                        </div>

                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller
                                            name="weekdaysClosingHour"
                                            control={control}
                                            defaultValue={branch?.closingHour?.weekdays || ''}
                                            rules={{
                                                required: 'יש להזין שעת סגירה לימי חול',
                                                validate: value => value >= 16 && value <= 18 || 'שעת הסגירה בימי חול חייבת להיות בין 16 ל־18'
                                            }}
                                            render={({ field }) => (
                                                <InputText id={field.name} type="number" {...field} />
                                            )}
                                        />
                                        <label htmlFor="weekdaysClosingHour">*סגירה - ימי חול</label>
                                    </span>
                                    {getFormErrorMessage('weekdaysClosingHour')}
                                </div>

                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller
                                            name="fridaysClosingHour"
                                            control={control}
                                            defaultValue={branch?.closingHour?.fridays || ''}
                                            rules={{
                                                required: 'יש להזין שעת סגירה לימי שישי',
                                                validate: value => value >= 11 && value <= 13 || 'שעת הסגירה בימי שישי חייבת להיות בין 11 ל־13'
                                            }}
                                            render={({ field }) => (
                                                <InputText id={field.name} type="number" {...field} />
                                            )}
                                        />
                                        <label htmlFor="fridaysClosingHour">*סגירה - שישי</label>
                                    </span>
                                    {getFormErrorMessage('fridaysClosingHour')}
                                </div>
                            </div>
                        </div>

                        <Button type="submit" label="עדכן סניף" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
 }
 
 export default UpdateBranch