import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';


const AddBranch = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    // const {companies} = useSelector((state) => state.companies)
    console.log("hello");

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:8000/api/branches', data);
            if(response.status===201)
            {
            setFormData(data);
            setShowMessage(true);
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
                    <h5>Branch Added Successfully!</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        Branch  has been successfully added.
                    </p>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Add Branch</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address.city" control={control} rules={{ required: 'city is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address.city" className={classNames({ 'p-error': errors.address?.city })}>*city</label>
                            </span>
                            {getFormErrorMessage('address.city')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address.street" control={control} rules={{ required: 'street is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address.street" className={classNames({ 'p-error': errors.address?.street })}>*street</label>
                            </span>
                            {getFormErrorMessage('address.street')}
                        </div>



                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="address.streetNum" control={control} rules={{ required: 'streetNum is required.' }} render={({ field, fieldState }) => (
                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                )} />
                                <label htmlFor="address.streetNum" className={classNames({ 'p-error': errors.address?.streetNum })}>*streetNum</label>
                            </span>
                            {getFormErrorMessage('address.streetNum')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phoneNumber" control={control}rules={{ required: 'phoneNumber is required.' }} render={({ field }  ) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="phoneNumber">phoneNumber</label>
                            </span>
                            {getFormErrorMessage('phoneNumber')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="openingHour" control={control}  render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="openingHour" className={classNames({ 'p-error': errors.openingHour })}>*openingHour</label>
                            </span>
                            {getFormErrorMessage('openingHour')}
                        </div>

                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="closingHour.weekdays" control={control} render={({ field }) => (
                                            <InputText id="closingHour.weekdays" {...field} />
                                        )} />
                                        <label htmlFor="closingHour.weekdays">closingHour</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="closingHour.fridays" control={control} render={({ field }) => (
                                            <InputText id="closingHour.fridays" {...field} />
                                        )} />
                                        <label htmlFor="closingHour.fridays">Friday_closingHour</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        

                        <Button type="submit" label="Add Air Conditioner" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBranch;


