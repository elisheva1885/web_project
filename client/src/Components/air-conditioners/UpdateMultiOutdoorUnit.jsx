import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMultiOutdoorUnits } from '../../store/air-conditioner/multiOutdoorUnitsSlice'; // חשוב שתעדכני גם את הסלייס
import { Toast } from 'primereact/toast';

const UpdateMultiOutdoorUnit = () => {
    const location = useLocation();
    const m = location.state?.type || {}; // Fetch the unit for update from state
    const { token } = useSelector((state) => state.token);
    const { multiOutdoorUnits } = useSelector((state) => state.multiOutdoorUnits);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(false);
    const toast = useRef(null); // Reference for Toast

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: m
    });
    const messages = {
        INVALID_MULTIOUTDOORUNIT_ID: "מזהה היחידה אינו תקין. ודא שהמזהה הוא מחרוזת באורך 24 תווים.",
        MULTIOUTDOORUNIT_NOT_FOUND: "לא נמצאה יחידה תואמת במערכת.",
        INTERNAL_ERROR: "שגיאת שרת פנימית. נסה שוב מאוחר יותר.",
    };

    const showToast = (severity, summary, detail) => {
        toast.current.show({
            severity, // סוג ההודעה: success, info, warn, error
            summary, // כותרת ההודעה
            detail, // תוכן ההודעה
            life: 3000, // משך זמן הצגת ההודעה במילישניות
        });
    };
    const onSubmit = async (data) => {
        const updatedUnit = {
            _id: data._id,
            company: data.company, // Ensure this is immutable
            title: data.title,
            describe: data.describe,
            stock: data.stock,
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
                showToast('success', 'הצלחה', `${res.data.title} עודכנה בהצלחה!`);
                const updatedUnits = multiOutdoorUnits.filter(u => u._id !== res.data._id);
                dispatch(setMultiOutdoorUnits([...updatedUnits, res.data]));
                navigate('/multiOutdoorunits');
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage] || "שגיאה בלתי צפויה. נסה שוב מאוחר יותר.");
            console.error("Error updating Multi Outdoor Unit:", error);
        }
    };

    return (
        <div style={{ paddingTop: '60px' }}>
            <Toast ref={toast} />



            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">עדכון מעבה מולטי</h5>
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

                        {/* Stock */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <InputText id="stock" type="number" {...field} />
                                )} />
                                <label htmlFor="stock">Stock</label>
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