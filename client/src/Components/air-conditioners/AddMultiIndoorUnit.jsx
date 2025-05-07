import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
import { setMultiIndoorUnits } from '../../store/air-conditioner/multiIndoorUnitsSlice';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const AddMultiIndoorUnit = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const { companies } = useSelector((state) => state.companies);
    const { multiIndoorUnits } = useSelector((state) => state.multiIndoorUnits)
    const { token } = useSelector((state) => state.token)
    const toast = useRef(null); // Initialize the Toast reference

    const messages = {
        // Error Messages
        INVALID_OTHER_DATA: "נתונים אחרים אינם תקינים.",
        INVALID_OTHER_DATA_FORMAT: "פורמט הנתונים אינו תקין.",
        REQUIRED_FIELDS_MISSING: "שדות חובה חסרים.",
        INVALID_IMAGE: "תמונת היחידה הפנימית אינה תקינה.",
        MULTIINDOORUNIT_ALREADY_EXIST: "יחידה פנימית עם שם זה כבר קיימת.",
        MULTIINDOORUNIT_CREATION_FAILED: "יצירת היחידה הפנימית נכשלה.",
        INVALID_MULTIINDOORUNIT_ID: "מזהה היחידה הפנימית אינו תקין.",
        MULTIINDOORUNIT_NOT_FOUND: "היחידה הפנימית לא נמצאה.",
        INVALID_STOCK_AMOUNT: "כמות המלאי אינה תקינה.",
        INSUFFICIENT_STOCK: "אין מלאי מספיק.",
        INVALID_PRICE: "מחיר אינו תקין.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסה שוב מאוחר יותר.",
        UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו.",
        // Success Messages
        MULTIINDOORUNIT_CREATED_SUCCESSFULLY: "היחידה הפנימית נוספה בהצלחה.",
        MULTIINDOORUNIT_DELETED_SUCCESSFULLY: "היחידה הפנימית נמחקה בהצלחה.",
    
        // Default
        default: "אירעה שגיאה לא צפויה. נסה שוב."
    };
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };
    const onSubmit = async (data) => {
        const formData = new FormData(); // Create an empty FormData object      
        // Append the file to the FormData object
        if (data.imagepath instanceof File) {
            formData.append('imagepath', data.imagepath);
        } else {
            showToast('error', 'שגיאה', messages.INVALID_IMAGE);
            return;
        }
       
        formData.append('otherData', JSON.stringify(data));
        try {
            const headers = {
                'Authorization': `Bearer ${token}`, // If you have authentication
                'Content-Type': 'multipart/form-data'
            };
            const res = await axios.post('http://localhost:8000/api/air-conditioner/multiIndoorUnit', formData, { headers });
            if (res.status === 201) {
                setFormData(data);
                setShowMessage(true);
                dispatch(setMultiIndoorUnits([...multiIndoorUnits, res.data]));
                showToast('success', 'הצלחה', messages.MULTIINDOORUNIT_CREATED_SUCCESSFULLY);
                navigate("/multiIndoorUnits");
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage]);
            console.error("Error adding Multi Indoor Unit:", error);        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={<Button label="Close" onClick={() => setShowMessage(false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '40vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Multi Indoor Unit Added Successfully!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Multi Indoor Unit <b>{formData.title}</b> has been successfully added.
                    </p>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Add Multi Indoor Unit</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="company" control={control} render={({ field }) => (
                                    <Dropdown id={field.id} value={field.value} onChange={(e) => field.onChange(e.value)} options={companies} optionLabel="name" />
                                )} />
                                <label htmlFor="company">Company</label>
                            </span>
                            {getFormErrorMessage('company')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="title" control={control} rules={{ required: 'Title is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="title" className={classNames({ 'p-error': errors.title })}>*Title</label>
                            </span>
                            {getFormErrorMessage('title')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="describe" control={control} rules={{ required: 'Description is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="describe" className={classNames({ 'p-error': errors.describe })}>*Description</label>
                            </span>
                            {getFormErrorMessage('describe')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="imagepath" control={control} rules={{ required: 'Image path is required.' }} render={({ field, fieldState }) => (
                                    <FileUpload
                                            id="imagepath"
                                            name="imagepath"
                                            accept="image/*"
                                            customUpload
                                            uploadHandler={(e) => field.onChange(e.files[0])} // Attach the file to the form
                                            auto
                                            mode="basic" // Use 'basic' mode for a simpler layout
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />                                )} />
                                <label htmlFor="imagepath" className={classNames({ 'p-error': errors.imagepath })}>*Image Path</label>
                            </span>
                            {getFormErrorMessage('imagepath')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="stock">Stock</label>
                            </span>
                            {getFormErrorMessage('stock')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="price" control={control} rules={{ required: 'Price is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} type="number" {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="price" className={classNames({ 'p-error': errors.price })}>*Price</label>
                            </span>
                            {getFormErrorMessage('price')}
                        </div>

                        {/* BTUs */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="BTU_output.cool" control={control} render={({ field }) => (
                                            <InputText id="BTU_output.cool" type="number" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output.cool">BTU Output Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="BTU_output.heat" control={control} render={({ field }) => (
                                            <InputText id="BTU_output.heat" type="number" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output.heat">BTU Output Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="CFM" control={control} render={({ field }) => (
                                    <InputText id="CFM" type="number" {...field} />
                                )} />
                                <label htmlFor="CFM">CFM</label>
                            </span>
                        </div>

                        {/* Pipe Connections */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="pipe_connection.a" control={control} render={({ field }) => (
                                            <InputText id="pipe_connection.a" {...field} />
                                        )} />
                                        <label htmlFor="pipe_connection.a">Pipe Connection A</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="pipe_connection.b" control={control} render={({ field }) => (
                                            <InputText id="pipe_connection.b" {...field} />
                                        )} />
                                        <label htmlFor="pipe_connection.b">Pipe Connection B</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* In Size (Evaporator Unit Dimensions) */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="evaporator_unit_dimensions.width" control={control} render={({ field }) => (
                                            <InputText id="evaporator_unit_dimensions.width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="evaporator_unit_dimensions.width">Evaporator Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="evaporator_unit_dimensions.depth" control={control} render={({ field }) => (
                                            <InputText id="evaporator_unit_dimensions.depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="evaporator_unit_dimensions.depth">Evaporator Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="evaporator_unit_dimensions.height" control={control} render={({ field }) => (
                                            <InputText id="evaporator_unit_dimensions.height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="evaporator_unit_dimensions.height">Evaporator Height</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <Button type="submit" label="Add Indoor Unit" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMultiIndoorUnit