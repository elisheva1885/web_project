
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
import { setMiniCenterals } from '../../store/air-conditioner/miniCenteralsSlice';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';


const AddMiniCentral = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const { companies } = useSelector((state) => state.companies);
    const { miniCenterals } = useSelector((state) => state.miniCenterals)
    const { token } = useSelector((state) => state.token)
    const toast = useRef(null); // Initialize the Toast reference

    const messages = {
        // Error Messages
        INVALID_IMAGE: "תמונת המיני מרכזי אינה תקינה.",
        INVALID_OTHER_DATA: "נתונים אחרים אינם תקינים.",
        INVALID_OTHER_DATA_FORMAT: "פורמט הנתונים אינו תקין.",
        REQUIRED_FIELDS_MISSING: "שדות חובה חסרים.",
        MINICENTERAL_ALREADY_EXISTS: "מיני מרכזי עם שם זה כבר קיים.",
        MINICENTERAL_CREATION_FAILED: "יצירת המיני מרכזי נכשלה.",
        INVALID_MINICENTERAL_ID: "מזהה המיני מרכזי אינו תקין.",
        MINICENTERAL_NOT_FOUND: "המיני מרכזי לא נמצא.",
        INVALID_STOCK_AMOUNT: "כמות המלאי אינה תקינה.",
        INSUFFICIENT_STOCK: "אין מלאי מספיק.",
        INVALID_PRICE: "מחיר אינו תקין.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסה שוב מאוחר יותר.",
        UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו.",
        // Success Messages
        MINICENTERAL_CREATED_SUCCESSFULLY: "המיני מרכזי נוסף בהצלחה.",
        MINICENTERAL_DELETED_SUCCESSFULLY: "המיני מרכזי נמחק בהצלחה.",

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

            const res = await axios.post('http://localhost:8000/api/air-conditioner/miniCenteral', formData, { headers });

            if (res.status === 201) {
                setFormData(data);
                setShowMessage(true);
                dispatch(setMiniCenterals([...miniCenterals, res.data]));
                // console.log("Mini Central added successfully:", res.data);
                showToast('success', 'הצלחה', messages.MINICENTERAL_CREATED_SUCCESSFULLY);
                navigate('/miniCenterals');
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage]);
            console.error("Error adding Mini Central:", error);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} />
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">להוספת מזגן מיני מרכזי</h5>
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
                                <Controller
                                    name="imagepath"
                                    control={control}
                                    rules={{ required: 'Image is required.' }}
                                    render={({ field, fieldState }) => (
                                        <FileUpload
                                            id="imagepath"
                                            name="imagepath"
                                            accept="image/*"
                                            customUpload
                                            uploadHandler={(e) => field.onChange(e.files[0])} // Attach the file to the form
                                            auto
                                            mode="basic" // Use 'basic' mode for a simpler layout
                                            className={classNames({ 'p-invalid': fieldState.invalid })}
                                        />
                                    )}
                                />
                                <label htmlFor="imagepath" className={classNames({ 'p-error': errors.imagepath })}>*Image</label>
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
                                            <InputText id="BTU_output.cool" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output.cool">BTU Output Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="BTU_output.heat" control={control} render={({ field }) => (
                                            <InputText id="BTU_output.heat" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output.heat">BTU Output Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="efficiency_factor.cool" control={control} render={({ field }) => (
                                            <InputText id="efficiency_factor.cool" {...field} />
                                        )} />
                                        <label htmlFor="efficiency_factor.cool">Efficiency Factor Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="efficiency_factor.heat" control={control} render={({ field }) => (
                                            <InputText id="efficiency_factor.heat" {...field} />
                                        )} />
                                        <label htmlFor="efficiency_factor.heat">Efficiency Factor Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                        {/* Energy Ratings */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="energy_rating" control={control} render={({ field }) => (
                                    <InputText id="energy_rating" {...field} />
                                )} />
                                <label htmlFor="energy_rating">Energy Rating</label>
                            </span>
                        </div>

                        {/* Working Currents */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="working_current.cool" control={control} render={({ field }) => (
                                            <InputText type="number"  id="working_current.cool" {...field} />
                                        )} />
                                        <label htmlFor="working_current.cool">Working Current Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="working_current.heat" control={control} render={({ field }) => (
                                            <InputText type="number" id="working_current.heat" {...field} />
                                        )} />
                                        <label htmlFor="working_current.heat">Working Current Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="CFM" control={control} render={({ field }) => (
                                    <InputText id="CFM" {...field} />
                                )} />
                                <label htmlFor="CFM">CFM</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="Pa" control={control} render={({ field }) => (
                                    <InputText id="Pa" type="number" {...field} />
                                )} />
                                <label htmlFor="Pa">Static Pressure (Pa)</label>
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

                        {/* In Size */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="in_size.width" control={control} render={({ field }) => (
                                            <InputText id="in_size.width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="in_size.width">In Size Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="in_size.depth" control={control} render={({ field }) => (
                                            <InputText id="in_size.depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="in_size.depth">In Size Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="in_size.height" control={control} render={({ field }) => (
                                            <InputText id="in_size.height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="in_size.height">In Size Height</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Out Size */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="out_size.width" control={control} render={({ field }) => (
                                            <InputText id="out_size.width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="out_size.width">Out Size Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="out_size.depth" control={control} render={({ field }) => (
                                            <InputText id="out_size.depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="out_size.depth">Out Size Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="out_size.height" control={control} render={({ field }) => (
                                            <InputText id="out_size.height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="out_size.height">Out Size Height</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="speeds" control={control} render={({ field }) => (
                                    <InputText id="speeds" type="number" {...field} />
                                )} />
                                <label htmlFor="speeds">Speeds</label>
                            </span>
                        </div>
                        {/* Checkbox for boolean parameters */}
                        <div className="field-checkbox">
                            <Controller name="quiet" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="quiet" {...field} checked={field.value} />
                                    <label htmlFor="quiet">Quiet</label>
                                </div>
                            )} />
                        </div>
                        <div className="field-checkbox">
                            <Controller name="wifi" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="wifi" {...field} checked={field.value} />
                                    <label htmlFor="wifi">WiFi</label>
                                </div>
                            )} />
                        </div>
                        <div className="field-checkbox">
                            <Controller name="air4d" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="air4d" {...field} checked={field.value} />
                                    <label htmlFor="air4d">Air 4D</label>
                                </div>
                            )} />
                        </div>
                        <div className="field-checkbox">
                            <Controller name="sabbath_command" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="sabbath_command" {...field} checked={field.value} />
                                    <label htmlFor="sabbath_command">Sabbath Command</label>
                                </div>
                            )} />
                        </div>

                        <Button type="submit" label="להוספה" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMiniCentral;