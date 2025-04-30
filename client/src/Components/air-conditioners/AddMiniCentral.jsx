
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

const AddMiniCentral = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const { companies } = useSelector((state) => state.companies);
    const { miniCenterals } = useSelector((state) => state.miniCenterals)
    const { token } = useSelector((state) => state.token)

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const onSubmit = async (data) => {
        const formData = new FormData(); // Create an empty FormData object
        console.log(data);
      
        // Append the file to the FormData object
        if (data.imagepath instanceof File) {
          formData.append('imagepath', data.imagepath);
        } else {
          console.error("Error: imagepath is not a valid file.");
          return;
        }
        const otherData = {
            company: data.company,
            title: data.title,
            describe: data.describe,
            imagepath: data.imagepath, // Include the imagepath
            stock: data.stock,
            price: data.price,
            BTU_output: data.BTU_output_cool, // Use BTU_output as in your create call
            efficiency_factor: data.efficiency_factor_cool, // Use efficiency_factor
            energy_rating: data.energy_rating,
            working_current: data.working_current_cool, // Use working_current
            CFM: data.CFM,
            Pa: data.Pa,
            pipe_connection: data.pipe_connection_a, // Use pipe_connection
            in_size: data.in_size_width, // Use in_size
            out_size: data.out_size_width, // Use out_size
            quiet: data.quiet,
            wifi: data.wifi,
            speeds: data.speeds,
            air4d: data.air4d,
            sabbath_command: data.sabbath_command,
            onof_auto: data.onof_auto, // Assuming 'onof_auto' exists in your 'data'
          };
        formData.append('otherData', JSON.stringify(otherData));


        // Append other fields to the FormData object
        // for (const key in data) {
        //     if (key !== 'imagepath') {
        //         let value = data[key];
        
        //         // המרת שדות מספריים למספרים
        //         if (['stock', 'price', 'BTU_output_cool', 'BTU_output_heat', 'efficiency_factor_cool', 'efficiency_factort_heat', 'energy_rating', 'working_current_cool', 'working_current_heat', 'CFM', 'Pa', 'speeds', 'in_size_width', 'in_size_depth', 'in_size_height', 'out_size_width', 'out_size_depth', 'out_size_height', 'pipe_connection_a', 'pipe_connection_b'].includes(key)) {
        //             value = value ? Number(value) : 0; // ברירת מחדל: 0
        //         }
        //         if (['quiet', 'wifi', 'air4d', 'sabbath_command'].includes(key)) {
        //             value = Boolean(value); // המרת לערך בוליאני
        //         }
        //         formDataObj.append(key, value);
        //     }
            
        // }
        // for (let [key, value] of formDataObj.entries()) {
        //     console.log(`${key}: ${value}`);
        // }
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
                // navigate("/miniCenterals");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    };

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={<Button label="Close" onClick={() => setShowMessage(false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '40vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>MiniCenteral Air Conditioner Added Successfully!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Air Conditioner <b>{formData.title}</b> has been successfully added.
                    </p>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Add MiniCenteral Air Conditioner</h5>
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
                                        <Controller name="BTU_output_cool" control={control} render={({ field }) => (
                                            <InputText id="BTU_output_cool" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output_cool">BTU Output Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="BTU_output_heat" control={control} render={({ field }) => (
                                            <InputText id="BTU_output_heat" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output_heat">BTU Output Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="efficiency_factor_cool" control={control} render={({ field }) => (
                                            <InputText id="efficiency_factor_cool" {...field} />
                                        )} />
                                        <label htmlFor="efficiency_factor_cool">Efficiency Factor Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="efficiency_factort_heat" control={control} render={({ field }) => (
                                            <InputText id="efficiency_factor_heat" {...field} />
                                        )} />
                                        <label htmlFor="efficiency_factor_heat">Efficiency Factor Heat</label>
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
                                        <Controller name="working_current_cool" control={control} render={({ field }) => (
                                            <InputText id="working_current_cool" {...field} />
                                        )} />
                                        <label htmlFor="working_current_cool">Working Current Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="working_current_heat" control={control} render={({ field }) => (
                                            <InputText id="working_current_heat" {...field} />
                                        )} />
                                        <label htmlFor="working_current_heat">Working Current Heat</label>
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
                                        <Controller name="pipe_connection_a" control={control} render={({ field }) => (
                                            <InputText id="pipe_connection_a" {...field} />
                                        )} />
                                        <label htmlFor="pipe_connection_a">Pipe Connection A</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="pipe_connection_b" control={control} render={({ field }) => (
                                            <InputText id="pipe_connection_b" {...field} />
                                        )} />
                                        <label htmlFor="pipe_connection_b">Pipe Connection B</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* In Size */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="in_size_width" control={control} render={({ field }) => (
                                            <InputText id="in_size_width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="in_size_width">In Size Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="in_size_depth" control={control} render={({ field }) => (
                                            <InputText id="in_size_depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="in_size_depth">In Size Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="in_size_height" control={control} render={({ field }) => (
                                            <InputText id="in_size_height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="in_size_height">In Size Height</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Out Size */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="out_size_width" control={control} render={({ field }) => (
                                            <InputText id="out_size_width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="out_size_width">Out Size Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="out_size_depth" control={control} render={({ field }) => (
                                            <InputText id="out_size_depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="out_size_depth">Out Size Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="out_size_height" control={control} render={({ field }) => (
                                            <InputText id="out_size_height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="out_size_height">Out Size Height</label>
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

                        <Button type="submit" label="Add Air Conditioner" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMiniCentral;