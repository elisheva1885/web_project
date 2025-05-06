import { FileUpload } from "primereact/fileupload";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from "react-hook-form";
import classNames from 'classnames';
import axios from "axios";
import { setCompanies } from "../../store/companySlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRef } from "react";

const AddCompany = () => {
    const { companies } = useSelector((state) => state.companies);
    const { token } = useSelector((state) => state.token)

    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const toast = useRef(null);
    const messages = {
        // Error Messages
        INVALID_NAME: "שם החברה אינו תקין. השם חייב להכיל לפחות 3 תווים.",
        INVALID_IMAGE_PATH: "תמונת החברה אינה תקינה.",
        NAME_ALREADY_EXISTS: "שם החברה כבר קיים במערכת.",
        NO_COMPANIES_FOUND: "לא נמצאו חברות.",
        INVALID_COMPANY_ID: "מזהה החברה אינו תקין.",
        COMPANY_NOT_FOUND: "החברה לא נמצאה.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסה שוב מאוחר יותר.",

        // Success Messages
        COMPANY_CREATED_SUCCESSFULLY: "החברה נוספה בהצלחה.",

        // Default
        default: "אירעה שגיאה לא צפויה. נסה שוב."
    };
    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        if (data.imagepath instanceof File) {
            formData.append('imagepath', data.imagepath);
        }
        else {
            showToast('error', 'שגיאה', messages.INVALID_IMAGE_PATH);
            return;
        }
        formData.append('name', data.name);

        try {
            const headers = {
                'Authorization': `Bearer ${token}`, // If you have authentication
            };
            const res = await axios.post('http://localhost:8000/api/company', formData, { headers });
            if (res.status === 201) {
                showToast('success', 'הצלחה', messages.COMPANY_CREATED_SUCCESSFULLY);
                setShowMessage(true);
                dispatch(setCompanies([...companies, res.data]));
                navigate("/official");
            }

        }
        catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage]);
            console.error("Error adding company:", error);
        }
    }
    return (
        <>
            <Toast ref={toast} />
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                <div className="field">
                    <span className="p-float-label">
                        <Controller name="name" control={control} rules={{ required: 'Title is required.' }} render={({ field, fieldState }) => (
                            <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                        )} />
                        <label htmlFor="name" className={classNames({ 'p-error': errors.name })}>*Title</label>
                    </span>
                    {getFormErrorMessage('name')}
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
                <Button type="submit" label="Add Company" className="mt-2" />
            </form>
            {showMessage && (
                <div className="p-message p-message-success">
                    <span>Company added successfully!</span>
                </div>
            )}
        </>
    )
}
export default AddCompany;