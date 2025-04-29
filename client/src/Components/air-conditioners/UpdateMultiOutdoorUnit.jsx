import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMultiOutdoorUnits } from '../../store/air-conditioner/multiOutdoorUnitsSlice'; // חשוב שתעדכני גם את הסלייס

const UpdateMultiOutdoorUnit = () => {
    const location = useLocation();
    const m = location.state?.type || {}; // Fetch the unit for update from state
    const { token } = useSelector((state) => state.token);
    const { multiOutdoorUnits } = useSelector((state) => state.multiOutdoorUnits);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: m
    });

    const onSubmit = async (data) => {
        const updatedUnit = {
            _id: data._id,
            company: data.company, // Ensure this is immutable
            title: data.title,
            describe: data.describe,
            imagepath: data.imagepath,
            stock: data.stock,
            price: data.price,
            BTU_output: {
                cool: data.BTU_output?.cool,
                heat: data.BTU_output?.heat
            },
            working_current: {
                cool: data.working_current?.cool,
                heat: data.working_current?.heat
            },
            condenser_unit_dimensions: {
                width: data.condenser_unit_dimensions?.width,
                depth: data.condenser_unit_dimensions?.depth,
                height: data.condenser_unit_dimensions?.height
            },
            quiet: data.quiet,
            wifi: data.wifi,
            timer: data.timer,
            sabbath_command: data.sabbath_command,
            onof_auto: data.onof_auto
        };

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const res = await axios.put(`http://localhost:8000/api/air-conditioner/multiOutdoorUnit`, updatedUnit, { headers });
            if (res.status === 200) {
                setShowMessage(true);
                console.log(res.data);
                const updatedUnits = multiOutdoorUnits.filter(u => u._id !== res.data._id);
                dispatch(setMultiOutdoorUnits([...updatedUnits, res.data]));
                navigate('/multiOutdoorunits');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div style={{ paddingTop: '60px' }}>
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={<Button label="Close" onClick={() => setShowMessage(false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '40vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>Multi Indoor Unit Updated Successfully!</h5>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Update Multi Indoor Unit</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

                        {/* Title */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="title" control={control} render={({ field }) => (
                                    <InputText id="title" {...field} />
                                )} />
                                <label htmlFor="title">Title</label>
                            </span>
                        </div>

                        {/* Description */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="describe" control={control} render={({ field }) => (
                                    <InputText id="describe" {...field} />
                                )} />
                                <label htmlFor="describe">Description</label>
                            </span>
                        </div>

                        {/* Image Path */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="imagepath" control={control} render={({ field }) => (
                                    <InputText id="imagepath" {...field} />
                                )} />
                                <label htmlFor="imagepath">Image Path</label>
                            </span>
                        </div>

                        {/* Stock */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <InputText id="stock" type="number" {...field} />
                                )} />
                                <label htmlFor="stock">Stock</label>
                            </span>
                        </div>

                        {/* Price */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="price" control={control} render={({ field }) => (
                                    <InputText id="price" type="number" {...field} />
                                )} />
                                <label htmlFor="price">Price</label>
                            </span>
                        </div>

                        {/* BTU Output */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="BTU_output.cool" control={control} render={({ field }) => (
                                            <InputText id="BTU_output.cool" type="number" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output.cool">BTU Output Cool</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="BTU_output.heat" control={control} render={({ field }) => (
                                            <InputText id="BTU_output.heat" type="number" {...field} />
                                        )} />
                                        <label htmlFor="BTU_output.heat">BTU Output Heat</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Working Current */}
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

                        {/* Condenser Unit Dimensions */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="condenser_unit_dimensions.width" control={control} render={({ field }) => (
                                            <InputText id="condenser_unit_dimensions.width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="condenser_unit_dimensions.width">Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="condenser_unit_dimensions.depth" control={control} render={({ field }) => (
                                            <InputText id="condenser_unit_dimensions.depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="condenser_unit_dimensions.depth">Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span className="p-float-label">
                                        <Controller name="condenser_unit_dimensions.height" control={control} render={({ field }) => (
                                            <InputText id="condenser_unit_dimensions.height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="condenser_unit_dimensions.height">Height</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Checkboxes */}
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

                        <Button type="submit" label="Update" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateMultiOutdoorUnit;