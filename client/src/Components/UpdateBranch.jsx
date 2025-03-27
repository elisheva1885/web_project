import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Branches from './Branch';


const UpdateBranch = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    // const {companies} = useSelector((state) => state.companies)
    const location = useLocation();
    const { type } = location.state || {};
    const navigate = useNavigate();
    console.log(control);

    // console.log(type);
    const onSubmit = async (data) => {
        if(data.openingHour<7 || data.openingHour>9){
            alert("openingHour is not fitting")
        }
        if(data.closingHour.weekdays<16 || data.closingHour.fridays>13){
            alert("closingHour is not fitting")
        }
        const branch = {
            _id: type._id,
            address: data.address,
            phoneNumber: data.phoneNumber,
            openingHour: data.openingHour,
            closingHour : data.closingHour
        }
        try {
            const response = await axios.put('http://localhost:8000/api/branches', branch);
            if(response.status===201)
            {
            setFormData(data);
            setShowMessage(true);
            const navigationData = {
                data: response.data,
                // You can add any other data you may want to send
            };
            navigate('/branch' , { state: navigationData })
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
                    <h5>Branch Updated Successfully!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Branch  has been successfully update.
                    </p>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Add Branch</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address.city" control={control}  render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address.city" className={classNames({ 'p-error': errors.address?.city })}>{type?.address?.city}</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address.street" control={control}  render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address.street" className={classNames({ 'p-error': errors.address?.street })}>{type?.address?.street}</label>
                            </span>
                        </div>



                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address.streetNum" control={control}  render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address.streetNum" className={classNames({ 'p-error': errors.address?.streetNum })}>{type?.address?.streetNum}</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phoneNumber" control={control} render={({ field }  ) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="phoneNumber">{type?.phoneNumber}</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="openingHour" control={control}  render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="openingHour" className={classNames({ 'p-error': errors.openingHour })}>{type?.openingHour}</label>
                            </span>
                        </div>

                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="closingHour.weekdays" control={control} render={({ field }) => (
                                            <InputText id="closingHour.weekdays" {...field} />
                                        )} />
                                        <label htmlFor="closingHour.weekdays">{type?.closingHour?.weekdays}</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="closingHour.fridays" control={control} render={({ field }) => (
                                            <InputText id="closingHour.fridays" {...field} />
                                        )} />
                                        <label htmlFor="closingHour.fridays">{type?.closingHour?.fridays}</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        

                        <Button type="submit" label="Update Branch" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateBranch