import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const AddBranch = () => {
    const { control, handleSubmit, formState: { errors } } = useForm();
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate()
    // const {companies} = useSelector((state) => state.companies)
    const onSubmit = async (data) => {
        try {
            if(data.openingHour<7 || data.openingHour>9){
                alert("openingHour is not fitting")
            }
            if(data.closingHour.weekdays<16 || data.closingHour.fridays>13){
                alert("closingHour is not fitting")
            }
            const res = await axios.post('http://localhost:8000/api/branches', data);
            console.log(res);
            if(res.status===201)
            {
            setFormData(data);
            setShowMessage(true);
            navigate('/branch')
            }
        } 
        catch (error) {
            if(error.status === 409){
                alert("הסניף כבר קיים באתר")
            }
            navigate('/branch')
        }
    };

    // const getFormErrorMessage = (name) => {
    //     return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    // };

    const getFormErrorMessage = (name) => {
        const error = name.split('.').reduce((acc, part) => acc && acc[part], errors);
        return error ? <small className="p-error">{error.message}</small> : null;
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
                                    <InputText id={field.name} type="number" {...field}/>
                                )} />
                                <label htmlFor="address.streetNum" className={classNames({ 'p-error': errors.address?.streetNum })}>*streetNum</label>
                            </span>
                            {getFormErrorMessage('address.streetNum')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="phoneNumber" control={control}rules={{ required: 'phoneNumber is required.' ,validate: {validHour: value => value.length == 9  || 'מספר הטלפון חייב להיות באורך 9 ספרות ' }}} render={({ field }  ) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="phoneNumber">phoneNumber</label>
                            </span>
                            {getFormErrorMessage('phoneNumber')}
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="openingHour" control={control}  rules={{ required: 'openingHour is required.' ,validate: {validHour: value => value > 6 && value <10 || 'שעות הפתיחה חייבות להיות ב7 ל9 בבוקר'  }} } render={({ field }) => (
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
                                        <Controller name="closingHour.weekdays" control={control} rules={{ required: 'closingHour is required.' ,validate: {validHour: value => value >= 16 && value <= 17 || 'שעות הסגירה חייבות להיות בין 16 ל17' }} }  render={({ field }) => (
                                            <InputText id={field.name} type="number"  {...field} />
                                        )} />
                                        <label htmlFor="closingHour.weekdays" className={classNames({ 'p-error': errors.closingHour?.weekdays })}>closingHour</label>
                                    </span>
                                    {getFormErrorMessage('closingHour.weekdays')}

                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="closingHour.fridays" control={control} rules={{ required: 'closingHour is required.',validate: {validHour: value => value >= 11 && value <= 13 || 'שעות הסגירה בימי שישי וערבי חגים חייבות להיות בין 11 ל13 ' }} }  render={({ field }) => (
                                            <InputText  id={field.name} type="number"  {...field} />
                                        )} />
                                        <label htmlFor="closingHour.fridays"  className={classNames({ 'p-error': errors.closingHour?.fridays })}>Friday_closingHour</label>
                                    </span>
                                    {getFormErrorMessage('closingHour.fridays')}
                                </div>
                            </div>
                        </div>

                        

                        <Button type="submit" label="Add Branch" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddBranch;


