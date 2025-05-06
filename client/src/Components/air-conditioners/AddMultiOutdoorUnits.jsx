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
import { setMultiOutdoorUnits } from '../../store/air-conditioner/multiOutdoorUnitsSlice';
import { Checkbox } from 'primereact/checkbox';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

const AddMultiOutdoorUnits = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const { companies } = useSelector((state) => state.companies);
    const { multiOutdoorUnits } = useSelector((state) => state.multiOutdoorUnits)
    const token = useSelector((state) => state.token);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useRef(null); // Initialize the Toast reference

    const messages = {
        // Error Messages
        INVALID_OTHER_DATA: "נתונים אחרים אינם תקינים.",
        INVALID_OTHER_DATA_FORMAT: "פורמט הנתונים אינו תקין.",
        REQUIRED_FIELDS_MISSING: "שדות חובה חסרים.",
        INVALID_IMAGE: "תמונת היחידה החיצונית אינה תקינה.",
        MULTIOUTDOORUNIT_ALREADY_EXISTS: "יחידה חיצונית עם שם זה כבר קיימת.",
        MULTIOUTDOORUNIT_CREATION_FAILED: "יצירת היחידה החיצונית נכשלה.",
        INVALID_MULTIOUTDOORUNIT_ID: "מזהה היחידה החיצונית אינו תקין.",
        MULTIOUTDOORUNIT_NOT_FOUND: "היחידה החיצונית לא נמצאה.",
        INVALID_STOCK_AMOUNT: "כמות המלאי אינה תקינה.",
        INSUFFICIENT_STOCK: "אין מספיק מלאי.",
        INVALID_PRICE: "מחיר אינו תקין.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסה שוב מאוחר יותר.",

        // Success Messages
        MULTIOUTDOORUNIT_CREATED_SUCCESSFULLY: "היחידה החיצונית נוספה בהצלחה.",
        MULTIOUTDOORUNIT_DELETED_SUCCESSFULLY: "היחידה החיצונית נמחקה בהצלחה.",

        // Default
        default: "אירעה שגיאה לא צפויה. נסה שוב."
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

            const res = await axios.post('http://localhost:8000/api/air-conditioner/multiOutdoorUnit', formData, { headers });
            if (res.status === 201) {
                setFormData(data);
                setShowMessage(true);
                dispatch(setMultiOutdoorUnits([...multiOutdoorUnits, res.data]));
                showToast('success', 'הצלחה', messages.MULTIOUTDOORUNIT_CREATED_SUCCESSFULLY);
                navigate("/multiOutdoorUnits");
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage]);
            console.error("Error adding Multi Outdoor Unit:", error);        }
    };
    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
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
                    <h5>Multi Outdoor Unit Added Successfully!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Multi Outdoor Unit <b>{formData.title}</b> has been successfully added.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Add Multi Outdoor Unit</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        {/* Company */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="company" control={control} render={({ field }) => (
                                    <Dropdown id={field.id} value={field.value} onChange={(e) => field.onChange(e.value)} options={companies} optionLabel="name" />
                                )} />
                                <label htmlFor="company">Company</label>
                            </span>
                            {getFormErrorMessage('company')}
                        </div>

                        {/* Title */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="title" control={control} rules={{ required: 'Title is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="title" className={classNames({ 'p-error': errors.title })}>*Title</label>
                            </span>
                            {getFormErrorMessage('title')}
                        </div>

                        {/* Description */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="describe" control={control} rules={{ required: 'Description is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="describe" className={classNames({ 'p-error': errors.describe })}>*Description</label>
                            </span>
                            {getFormErrorMessage('describe')}
                        </div>

                        {/* Image Path */}
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
                                    />)} />
                                <label htmlFor="imagepath" className={classNames({ 'p-error': errors.imagepath })}>*Image Path</label>
                            </span>
                            {getFormErrorMessage('imagepath')}
                        </div>

                        {/* Stock */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="stock">Stock</label>
                            </span>
                            {getFormErrorMessage('stock')}
                        </div>

                        {/* Price */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="price" control={control} rules={{ required: 'Price is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} type="number" {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="price" className={classNames({ 'p-error': errors.price })}>*Price</label>
                            </span>
                            {getFormErrorMessage('price')}
                        </div>

                        {/* BTU Output */}
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

                        {/* Working Current */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="working_current.cool" control={control} render={({ field }) => (
                                            <InputText id="working_current.cool" {...field} />
                                        )} />
                                        <label htmlFor="working_current.cool">Working Current Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="working_current.heat" control={control} render={({ field }) => (
                                            <InputText id="working_current.heat" {...field} />
                                        )} />
                                        <label htmlFor="working_current.heat">Working Current Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Condenser Unit Dimensions */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="condenser_unit_dimensions.width" control={control} render={({ field }) => (
                                            <InputText id="condenser_unit_dimensions.width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="condenser_unit_dimensions.width">Condenser Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="condenser_unit_dimensions.depth" control={control} render={({ field }) => (
                                            <InputText id="condenser_unit_dimensions.depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="condenser_unit_dimensions.depth">Condenser Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="condenser_unit_dimensions.height" control={control} render={({ field }) => (
                                            <InputText id="condenser_unit_dimensions.height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="condenser_unit_dimensions.height">Condenser Height</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Booleans */}
                        <div className="field-checkbox">
                            <Controller name="quiet" control={control} render={({ field }) => (
                                <Checkbox inputId="quiet" checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                            )} />
                            <label htmlFor="quiet">Quiet</label>
                        </div>

                        <div className="field-checkbox">
                            <Controller name="wifi" control={control} render={({ field }) => (
                                <Checkbox inputId="wifi" checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                            )} />
                            <label htmlFor="wifi">WiFi</label>
                        </div>

                        <div className="field-checkbox">
                            <Controller name="timer" control={control} render={({ field }) => (
                                <Checkbox inputId="timer" checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                            )} />
                            <label htmlFor="timer">Timer</label>
                        </div>

                        <div className="field-checkbox">
                            <Controller name="sabbath_command" control={control} render={({ field }) => (
                                <Checkbox inputId="sabbath_command" checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                            )} />
                            <label htmlFor="sabbath_command">Sabbath Command</label>
                        </div>

                        <div className="field-checkbox">
                            <Controller name="onof_auto" control={control} render={({ field }) => (
                                <Checkbox inputId="onof_auto" checked={field.value} onChange={(e) => field.onChange(e.checked)} />
                            )} />
                            <label htmlFor="onof_auto">Auto ON/OFF</label>
                        </div>

                        <Button type="submit" label="Add Outdoor Unit" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}
export default AddMultiOutdoorUnits