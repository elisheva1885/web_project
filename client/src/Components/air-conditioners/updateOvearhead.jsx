import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import classNames from 'classnames';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UpdateOverheadAC = () => {
    const location = useLocation();
    const o = location.state?.type || {}; // Extract 'type' from the state
    const {token }= useSelector((state)=> state.token)
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: o // Set defaultValues to o
    });
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        const overheadAC = {
            _id: data._id,
            company: data.company,
            title: data.title,
            describe: data.describe,
            imagepath: data.imagepath,
            stock: data.stock,
            price: data.price,
            BTU_output: {
                cool: data.BTU_output?.cool,
                heat: data.BTU_output?.heat
            },
            energy_rating: {
                cool: data.energy_rating?.cool,
                heat: data.energy_rating?.heat
            },
            working_current: {
                cool: data.working_current?.cool,
                heat: data.working_current?.heat
            },
            recommended_model_C: data.recommended_model_C,
            pipe_connection: {
                a: data.pipe_connection?.a,
                b: data.pipe_connection?.b
            },
            in_size: {
                width: data.in_size?.width,
                depth: data.in_size?.depth,
                height: data.in_size?.height
            },
            out_size: {
                width: data.out_size?.width,
                depth: data.out_size?.depth,
                height: data.out_size?.height
            },
            air_flow: data.air_flow,
            quiet: data.quiet,
            wifi: data.wifi,
            speeds: data.speeds,
            air4d: data.air4d,
            night_mode: data.night_mode,
            timer: data.timer,
            sabbath_command: data.sabbath_command,
            onof_auto: data.onof_auto
        };

        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const response = await axios.put(`http://localhost:8000/api/air-conditioner/overhead`, overheadAC, {headers});
            if (response.status === 200) {
                setShowMessage(true);
                navigate('/overhead', { state: { data: response.data } });
            }
        } catch (error) {
            console.error(error);
        }
    };

    // const getFormErrorMessage = (name) => {
    //     return errors[name] ? <small className="p-error">{errors[name].message}</small> : null;
    // };

    return (
        <div style={{ paddingTop: '60px' }}>
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={<Button label="Close" onClick={() => setShowMessage(false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '40vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Overhead AC Updated Successfully!</h5>
                </div>
            </Dialog>
            {/* <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Update Overhead AC</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="title" control={control} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="title">Title</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="describe" control={control} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="describe">Description</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="imagepath" control={control} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="imagepath">Image Path</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="stock">Stock</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="price" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="price">Price</label>
                            </span>
                        </div>
                        <div className="field">
                            <Controller name="BTU_output.cool" control={control} render={({ field }) => (
                                <InputText id="BTU_output.cool" type="number" {...field} />
                            )} />
                            <label htmlFor="BTU_output.cool">BTU Output (Cool)</label>
                        </div>
                        <div className="field">
                            <Controller name="BTU_output.heat" control={control} render={({ field }) => (
                                <InputText id="BTU_output.heat" type="number" {...field} />
                            )} />
                            <label htmlFor="BTU_output.heat">BTU Output (Heat)</label>
                        </div>
                        <div className="field">
                            <Controller name="energy_rating.cool" control={control} render={({ field }) => (
                                <InputText id="energy_rating.cool" {...field} />
                            )} />
                            <label htmlFor="energy_rating.cool">Energy Rating (Cool)</label>
                        </div>
                        <div className="field">
                            <Controller name="energy_rating.heat" control={control} render={({ field }) => (
                                <InputText id="energy_rating.heat" {...field} />
                            )} />
                            <label htmlFor="energy_rating.heat">Energy Rating (Heat)</label>
                        </div>
                        <div className="field">
                            <Controller name="working_current.cool" control={control} render={({ field }) => (
                                <InputText id="working_current.cool" {...field} />
                            )} />
                            <label htmlFor="working_current.cool">Working Current (Cool)</label>
                        </div>
                        <div className="field">
                            <Controller name="working_current.heat" control={control} render={({ field }) => (
                                <InputText id="working_current.heat" {...field} />
                            )} />
                            <label htmlFor="working_current.heat">Working Current (Heat)</label>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="recommended_model_C" control={control} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="recommended_model_C">Recommended Model C</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="pipe_connection.a" control={control} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="pipe_connection.a">Pipe Connection A</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="pipe_connection.b" control={control} render={({ field }) => (
                                    <InputText id={field.name} {...field} />
                                )} />
                                <label htmlFor="pipe_connection.b">Pipe Connection B</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="in_size.width" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="in_size.width">In Size Width</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="in_size.depth" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="in_size.depth">In Size Depth</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="in_size.height" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="in_size.height">In Size Height</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="out_size.width" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="out_size.width">Out Size Width</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="out_size.depth" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="out_size.depth">Out Size Depth</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="out_size.height" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="out_size.height">Out Size Height</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="air_flow" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="air_flow">Air Flow</label>
                            </span>
                        </div>
                        <div className="field-checkbox">
                            <Controller name="quiet" control={control} render={({ field }) => (
                                <InputText type="checkbox" id="quiet" {...field} checked={field.value} />
                            )} />
                            <label htmlFor="quiet">Quiet</label>
                        </div>
                        <div className="field-checkbox">
                            <Controller name="wifi" control={control} render={({ field }) => (
                                <InputText type="checkbox" id="wifi" {...field} checked={field.value} />
                            )} />
                            <label htmlFor="wifi">WiFi</label>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="speeds" control={control} render={({ field }) => (
                                    <InputText id={field.name} type="number" {...field} />
                                )} />
                                <label htmlFor="speeds">Speeds</label>
                            </span>
                        </div>
                        <div className="field-checkbox">
                            <Controller name="air4d" control={control} render={({ field }) => (
                                <InputText type="checkbox" id="air4d" {...field} checked={field.value} />
                            )} />
                            <label htmlFor="air4d">Air 4D</label>
                        </div>
                        <div className="field-checkbox">
                            <Controller name="night_mode" control={control} render={({ field }) => (
                                <InputText type="checkbox" id="night_mode" {...field} checked={field.value} />
                            )} />
                            <label htmlFor="night_mode">Night Mode</label>
                        </div>
                        <div className="field-checkbox">
                            <Controller name="timer" control={control} render={({ field }) => (
                                <InputText type="checkbox" id="timer" {...field} checked={field.value} />
                            )} />
                            <label htmlFor="timer">Timer</label>
                        </div>
                        <div className="field-checkbox">
                            <Controller name="sabbath_command" control={control} render={({ field }) => (
                                <InputText type="checkbox" id="sabbath_command" {...field} checked={field.value} />
                            )} />
                            <label htmlFor="sabbath_command">Sabbath Command</label>
                        </div>
                        <div className="field-checkbox">
                            <Controller name="onof_auto" control={control} render={({ field }) => (
                                <InputText type="checkbox" id="onof_auto" {...field} checked={field.value} />
                            )} />
                            <label htmlFor="onof_auto">On/Off Auto</label>
                        </div>
                        
                        <Button type="submit" label="Update Overhead AC" className="mt-2" />
                    </form>
                </div>
            </div> */}
            {/* <div className="flex justify-content-center">
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h5 className="text-center">Update Overhead AC</h5>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="title" control={control} render={({ field }) => (
                                <InputText id={field.name} {...field} />
                            )} />
                            <label htmlFor="title">Title</label>
                        </span>
                    </div>
                    {/* Repeat similar structure for your other fields */}
                    {/* Example for another field */}
                    {/* <div className="field">
                        <span className="p-float-label">
                            <Controller name="describe" control={control} render={({ field }) => (
                                <InputText id={field.name} {...field} />
                            )} />
                            <label htmlFor="describe">Description</label>
                        </span>
                    </div> */}
                    {/* Add other form fields here, based on your original structure */}
                    
                    {/* <Button type="submit" label="Update Overhead AC" className="mt-2" />
                </form>
            </div>
        </div>  */}
        <div className="flex justify-content-center">
            <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                <h5 className="text-center">Update Overhead AC</h5>
                <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="title" control={control} render={({ field }) => (
                                <InputText id={field.name} {...field} />
                            )} />
                            <label htmlFor="title">Title</label>
                        </span>
                    </div>

                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="describe" control={control} render={({ field }) => (
                                <InputText id={field.name} {...field} />
                            )} />
                            <label htmlFor="describe">Description</label>
                        </span>
                    </div>

                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="imagepath" control={control} render={({ field }) => (
                                <InputText id={field.name} {...field} />
                            )} />
                            <label htmlFor="imagepath">Image Path</label>
                        </span>
                    </div>

                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="stock" control={control} render={({ field }) => (
                                <InputText id={field.name} type="number" {...field} />
                            )} />
                            <label htmlFor="stock">Stock</label>
                        </span>
                    </div>

                    <div className="field">
                        <span className="p-float-label">
                            <Controller name="price" control={control} render={({ field }) => (
                                <InputText id={field.name} type="number" {...field} />
                            )} />
                            <label htmlFor="price">Price</label>
                        </span>
                    </div>

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
                            <label htmlFor="recommended_model_C">Recommended Model C</label>
                        </span>
                    </div>

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
                                <label htmlFor="night_mode">Night Mode</label>
                            </div>
                        )} />
                    </div>

                    <div className="field-checkbox">
                        <Controller name="timer" control={control} render={({ field }) => (
                            <div>
                                <input type="checkbox" id="timer" {...field} checked={field.value} />
                                <label htmlFor="timer">Timer</label>
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

                    <div className="field-checkbox">
                        <Controller name="onof_auto" control={control} render={({ field }) => (
                            <div>
                                <input type="checkbox" id="onof_auto" {...field} checked={field.value} />
                                <label htmlFor="onof_auto">On/Off Auto</label>
                            </div>
                        )} />
                    </div>

                    <Button type="submit" label="Update Overhead AC" className="mt-2" />
                </form>
            </div>
        </div>
        </div>
    );
}

export default UpdateOverheadAC;