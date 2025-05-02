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
    const {companies} = useSelector((state) => state.companies);
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
        formData.append('title', data.title);

        try{
            const headers = {
                'Authorization': `Bearer ${token}`, // If you have authentication
                'Content-Type': 'multipart/form-data'
            };
            const res = await axios.post('http://localhost:8080/api/company', formData, { headers });
             if (res.status === 201) {
                // setFormData(data);
                setShowMessage(true);
                dispatch(setCompanies([...companies, res.data]));
                navigate("/official");
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    return (
        <>
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

        </>
    )
}
export default AddCompany;