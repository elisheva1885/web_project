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

const AddCompany = () => {
    const { companies } = useSelector((state) => state.companies);
    const { token } = useSelector((state) => state.token)

    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    };
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const onSubmit = async (data) => {
        const formData = new FormData();
        if (data.imagepath instanceof File) {
            formData.append('imagepath', data.imagepath);
        }
        else {
            console.error("Error: imagepath is not a valid file.");
            return;
        }
        formData.append('name', data.name);

        try {
            const headers = {
                'Authorization': `Bearer ${token}`, // If you have authentication
                // 'Content-Type': 'multipart/form-data'
            };
            const res = await axios.post('http://localhost:8000/api/company', formData, { headers });
            console.log(res);
            if (res.status === 201) {

                // setFormData(data);
                setShowMessage(true);
                dispatch(setCompanies([...companies, res.data]));
                navigate("/official");
            }

        }
        catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
               alert('Error:', error.response.data.message);
            } else if (error.request) {
                // The request was made but no response was received
                alert('Error:', error.request.message);
            } else {
                // Something happened in setting up the request that triggered an Error
            console.error(error);
        }
    }
}
    return (
        <>
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