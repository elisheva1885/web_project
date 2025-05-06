import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Dropdown } from 'primereact/dropdown';
import { setOverheads } from '../../store/air-conditioner/overHeadsSlice';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';


const AddOverhead = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const { overheads } = useSelector((state) => state.overheads)
    const { companies } = useSelector((state) => state.companies)
    const token = useSelector((state) => state.token);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const toast = useRef(null);

    const massages = {
        INVALID_OTHER_DATA: "מידע לא תקין",
        REQUIRED_FIELDS_MISSING: "שדות חובה חסרים",
        INVALID_IMAGE: "תמונה לא תקינה",
        OVERHEAD_ALREADY_EXISTS: "מזגן קיים כבר",
        OVERHEAD_CREATION_FAILED: "יצירת מזגן נכשלה",
        INTERNAL_ERROR: "שגיאה פנימית בשרת",
        NO_OVERHEADS_FOUND: "לא נמצאו מזגנים",
        INVALID_TITLE: "כותרת לא תקינה",
        INVALID_OTHER_DATA_FORMAT: "פורמט מידע לא תקין",
    }

    const onSubmit = async (data) => {
        const formData = new FormData(); // Create an empty FormData object      
        // Append the file to the FormData object
        if (data.imagepath instanceof File) {
            formData.append('imagepath', data.imagepath);
        } else {
            console.error("Error: imagepath is not a valid file.");
            return;
        }
        formData.append('otherData', JSON.stringify(data));
        try {
            const headers = {
                'Authorization': `Bearer ${token}`, // If you have authentication
                'Content-Type': 'multipart/form-data'
            };
            const res = await axios.post('http://localhost:8000/api/air-conditioner/overhead', formData, { headers });
            if (res.status === 201) {
                setFormData(data);
                setShowMessage(true);
                dispatch(setOverheads([...overheads, res.data]));
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Overhead Air Conditioner Added Successfully!', life: 3000 });
                navigate('/overheads');
            }

        } catch (error) {
            if (error.response) {
                const errorMessage = massages[error.response.data.message] || "התרחשה שגיאה";
                toast.current.show({ severity: 'error', summary: 'Error', detail: errorMessage, life: 3000 });
            } else {
                console.error("Error:", error);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'התרחשה שגיאה לא צפויה', life: 3000 });
            }
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    };

    return (
        <div className="form-demo">
            <Toast ref={toast} position="top-right" />
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={<Button label="Close" onClick={() => setShowMessage(false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '40vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>מזגן עילי נוסף בהצלחה</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        מזגן <b>{formData.title}</b> נוסף בהצלחה למערכת.
                    </p>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">הוספת מזגן עילי</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="company" control={control} render={({ field }) => (
                                    <Dropdown id={field.id} value={field.value} onChange={(e) => field.onChange(e.value)} options={companies} optionLabel="name" />
                                )} />
                                <label htmlFor="company">חברה</label>
                            </span>
                            {getFormErrorMessage('company')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="title" control={control} rules={{ required: 'Title is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="title" className={classNames({ 'p-error': errors.title })}>*כותרת</label>
                            </span>
                            {getFormErrorMessage('title')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="describe" control={control} rules={{ required: 'Description is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="describe" className={classNames({ 'p-error': errors.describe })}>*תיאור</label>
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
                                    />)} />
                                <label htmlFor="imagepath" className={classNames({ 'p-error': errors.imagepath })}>*Image Path</label>
                            </span>
                            {getFormErrorMessage('imagepath')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="stock">מלאי</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="price" control={control} rules={{ required: 'Price is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} type="number" {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="price" className={classNames({ 'p-error': errors.price })}>*מחיר</label>
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

                        {/* Energy Ratings */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="energy_rating.cool" control={control} render={({ field }) => (
                                            <InputText id="energy_rating.cool" {...field} />
                                        )} />
                                        <label htmlFor="energy_rating.cool">Energy Rating Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="energy_rating.heat" control={control} render={({ field }) => (
                                            <InputText id="energy_rating.heat" {...field} />
                                        )} />
                                        <label htmlFor="energy_rating.heat">Energy Rating Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Working Currents */}
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
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="recommended_model_C" control={control} render={({ field }) => (
                                    <InputText id="recommended_model_C" {...field} />
                                )} />
                                <label htmlFor="recommended_model_C" >recommended_model_C</label>
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

                        {/* Other parameters */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="air_flow" control={control} render={({ field }) => (
                                    <InputText id="air_flow" type="number" {...field} />
                                )} />
                                <label htmlFor="air_flow">Air Flow</label>
                            </span>
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
                            <Controller name="night_mode" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="night_mode" {...field} checked={field.value} />
                                    <label htmlFor="night_mode">מצב לילה</label>
                                </div>
                            )} />
                        </div>
                        <div className="field-checkbox">
                            <Controller name="timer" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="timer" {...field} checked={field.value} />
                                    <label htmlFor="timer">טיימר</label>
                                </div>
                            )} />
                        </div>
                        <div className="field-checkbox">
                            <Controller name="sabbath_command" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="sabbath_command" {...field} checked={field.value} />
                                    <label htmlFor="sabbath_command">פיקוד שבת</label>
                                </div>
                            )} />
                        </div>
                        <div className="field-checkbox">
                            <Controller name="onof_auto" control={control} render={({ field }) => (
                                <div>
                                    <input type="checkbox" id="onof_auto" {...field} checked={field.value} />
                                    <label htmlFor="onof_auto">On/Off Auto</label>
                                </div>
                            )} />
                        </div>

                        <Button type="submit" label="Add Air Conditioner" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddOverhead;


