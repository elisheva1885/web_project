import React, { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';


const AddBranch = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate()
    const toast = useRef(null);

    const errorMessages = {
        INVALID_ADDRESS: "כתובת לא תקינה. ודאי שמולאו עיר, רחוב ומספר.",
        INVALID_PHONE: "מספר הטלפון שהוזן אינו תקין.",
        INVALID_OPENING_HOUR: "שעת פתיחה אינה תקינה.",
        INVALID_CLOSING_HOUR: "שעת סגירה אינה תקינה.",
        BRANCH_EXISTS: "סניף עם כתובת זו כבר קיים.",
        INVALID_BRANCH_ID: "לא נשלח מזהה סניף.",
        BRANCH_NOT_FOUND: "הסניף לא נמצא.",
        NO_BRANCHES_FOUND: "לא נמצאו סניפים.",
        NO_BRANCH_IN_CITY: "לא נמצאו סניפים בעיר המבוקשת.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסי שוב מאוחר יותר.",
        UNAUTHORIZED: "אינך רשום במערכת.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו."
    };
    const onSubmit = async (data) => {
        try {
            if (data.openingHour < 7 || data.openingHour > 9) {
                alert("openingHour is not fitting")
            }
            if (data.closingHour.weekdays < 16 || data.closingHour.fridays > 13) {
                alert("closingHour is not fitting")
            }
            const res = await axios.post('http://localhost:8000/api/branches', data);
            if (res.status === 201) {
                setFormData(data);
                setShowMessage(true);
                navigate('/branch')
            }
        }
        catch (error) {
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
        const error = name.split('.').reduce((acc, part) => acc && acc[part], errors);
        return error ? <small className="p-error">{error.message}</small> : null;
    };

    return (


        <div style={{ paddingTop: '60px' }}>
            <div className="form-demo">
            <Toast ref={toast} />

                <Dialog
                    visible={showMessage}
                    onHide={() => setShowMessage(false)}
                    position="top"
                    footer={<Button label="סגור" onClick={() => setShowMessage(false)} />}
                    showHeader={false}
                    breakpoints={{ '960px': '80vw' }}
                    style={{ width: '40vw' }}
                >
                    <div className="flex justify-content-center flex-column pt-6 px-3">
                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                        <h5>הסניף נוסף בהצלחה!</h5>
                        <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                            הסניף נוסף בהצלחה למערכת.
                        </p>
                    </div>
                </Dialog>

                <div className="flex justify-content-center">
                    <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                        <h5 className="text-center">הוספת סניף</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="address.city"
                                        control={control}
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
                                        rules={{ required: 'יש להזין מספר בית' }}
                                        render={({ field }) => (
                                            <InputText id={field.name} type="number" {...field} />
                                        )}
                                    />
                                    <label htmlFor="address.streetNum" className={classNames({ 'p-error': errors.address?.streetNum })}>*מספר בית</label>
                                </span>
                                {getFormErrorMessage('address.streetNum')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="phoneNumber"
                                        control={control}
                                        rules={{
                                            required: 'יש להזין מספר טלפון',
                                            validate: {
                                                validPhone: value =>
                                                    /^0[2-9]\d{7}$/.test(value) || 'מספר טלפון קווי לא חוקי. חייב להכיל 8 ספרות ולהתחיל בקידומת תקינה'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <InputText id={field.name} type="text" {...field} />
                                        )}
                                    />
                                    <label htmlFor="phoneNumber" className={classNames({ 'p-error': errors.phoneNumber })}>*מספר טלפון</label>
                                </span>
                                {getFormErrorMessage('phoneNumber')}
                            </div>

                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="openingHour"
                                        control={control}
                                        rules={{
                                            required: 'יש להזין שעת פתיחה',
                                            validate: {
                                                validHour: value => value >= 7 && value <= 9 || 'שעת הפתיחה חייבת להיות בין 7 ל־9 בבוקר'
                                            }
                                        }}
                                        render={({ field }) => (
                                            <InputText id={field.name} type="number" {...field} />
                                        )}
                                    />
                                    <label htmlFor="openingHour" className={classNames({ 'p-error': errors.openingHour })}>*שעת פתיחה</label>
                                </span>
                                {getFormErrorMessage('openingHour')}
                            </div>

                            <div className="field">
                                <div className="flex">
                                    <div style={{ flex: '1', marginRight: '10px' }}>
                                        <span className="p-float-label">
                                            <Controller
                                                name="closingHour.weekdays"
                                                control={control}
                                                rules={{
                                                    required: 'יש להזין שעת סגירה לימי חול',
                                                    validate: {
                                                        validHour: value => value >= 16 && value <= 17 || 'שעת הסגירה בימי חול חייבת להיות בין 16 ל־17'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <InputText id={field.name} type="number" {...field} />
                                                )}
                                            />
                                            <label htmlFor="closingHour.weekdays" className={classNames({ 'p-error': errors.closingHour?.weekdays })}>*סגירה - ימי חול</label>
                                        </span>
                                        {getFormErrorMessage('closingHour.weekdays')}
                                    </div>

                                    <div style={{ flex: '1', marginLeft: '10px' }}>
                                        <span className="p-float-label">
                                            <Controller
                                                name="closingHour.fridays"
                                                control={control}
                                                rules={{
                                                    required: 'יש להזין שעת סגירה לימי שישי',
                                                    validate: {
                                                        validHour: value => value >= 11 && value <= 13 || 'שעת הסגירה בימי שישי וערבי חג חייבת להיות בין 11 ל־13'
                                                    }
                                                }}
                                                render={({ field }) => (
                                                    <InputText id={field.name} type="number" {...field} />
                                                )}
                                            />
                                            <label htmlFor="closingHour.fridays" className={classNames({ 'p-error': errors.closingHour?.fridays })}>*סגירה - שישי</label>
                                        </span>
                                        {getFormErrorMessage('closingHour.fridays')}
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" label="הוסף סניף" className="mt-2" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default AddBranch;


