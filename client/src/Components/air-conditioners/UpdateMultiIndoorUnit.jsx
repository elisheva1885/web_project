import { useRef, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMultiIndoorUnits } from '../../store/air-conditioner/multiIndoorUnitsSlice'; // חשוב שתעדכני גם את הסלייס
import { Toast } from 'primereact/toast';

const UpdateMultiIndoorUnit = () => {
    const location = useLocation();
    const m = location.state?.type || {}; // שליפת היחידה לעדכון מה-state
    const { token } = useSelector((state) => state.token);
    const { multiIndoorUnits } = useSelector((state) => state.multiIndoorUnits);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toast = useRef(null);

    const [showMessage, setShowMessage] = useState(false);
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: m
    });
    const messages = {
        INVALID_UNIT_ID: "מזהה היחידה אינו תקין. ודא שהמזהה הוא מחרוזת באורך 24 תווים.",
        UNIT_NOT_FOUND: "לא נמצאה יחידה מתאימה במערכת.",
        INTERNAL_ERROR: "שגיאת שרת פנימית. נסה שוב מאוחר יותר.",
    };

    const showToast = (severity, summary, detail) => {
            toast.current.show({
                severity,
                summary,
                detail,
                life: 3000,
            });
        
    };
    const onSubmit = async (data) => {
        const updatedUnit = {
            _id: data._id,
            title: data.title,
            describe: data.describe,
            imagepath: data.imagepath,
            stock: data.stock,
            BTU_output: {
                cool: data.BTU_output?.cool,
                heat: data.BTU_output?.heat
            },
            CFM: data.CFM,
            pipe_connection: {
                a: data.pipe_connection?.a,
                b: data.pipe_connection?.b
            },
            evaporator_unit_dimensions: {
                width: data.evaporator_unit_dimensions?.width,
                depth: data.evaporator_unit_dimensions?.depth,
                height: data.evaporator_unit_dimensions?.height
            },
            energy_rating: data.energy_rating,
            quiet: data.quiet,
            wifi: data.wifi,
            speeds: data.speeds,
            air4d: data.air4d,
            sabbath_command: data.sabbath_command
        };

        try {
            const headers = { 'Authorization': `Bearer ${token}` };
            const res = await axios.put(`http://localhost:8000/api/air-conditioner/multiIndoorUnit`, updatedUnit, { headers });
            if (res.status === 200) {
                showToast('success', 'הצלחה', `${res.data.title} עודכן בהצלחה!`);
                setShowMessage(true);
                const updatedUnits = multiIndoorUnits.filter(u => u._id !== res.data._id);
                dispatch(setMultiIndoorUnits([...updatedUnits, res.data]));
                navigate('/multiindoorunits');
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage] || "שגיאה בלתי צפויה. נסה שוב מאוחר יותר.");
            console.error("Error updating Multi Indoor Unit:", error);
        }
    };

    return (
        <div style={{ paddingTop: '60px' }}>
<Toast ref={toast} />
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">עדכון מאייד מולטי</h5>
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

                        {/* CFM */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="CFM" control={control} render={({ field }) => (
                                    <InputText id="CFM" type="number" {...field} />
                                )} />
                                <label htmlFor="CFM">CFM</label>
                            </span>
                        </div>

                        {/* Pipe Connection */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="pipe_connection.a" control={control} render={({ field }) => (
                                            <InputText id="pipe_connection.a" {...field} />
                                        )} />
                                        <label htmlFor="pipe_connection.a">Pipe A</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="pipe_connection.b" control={control} render={({ field }) => (
                                            <InputText id="pipe_connection.b" {...field} />
                                        )} />
                                        <label htmlFor="pipe_connection.b">Pipe B</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Evaporator Unit Dimensions */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="evaporator_unit_dimensions.width" control={control} render={({ field }) => (
                                            <InputText id="evaporator_unit_dimensions.width" type="number" {...field} />
                                        )} />
                                        <label htmlFor="evaporator_unit_dimensions.width">Width</label>
                                    </span>
                                </div>
                                <div style={{ flex: 1, marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="evaporator_unit_dimensions.depth" control={control} render={({ field }) => (
                                            <InputText id="evaporator_unit_dimensions.depth" type="number" {...field} />
                                        )} />
                                        <label htmlFor="evaporator_unit_dimensions.depth">Depth</label>
                                    </span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span className="p-float-label">
                                        <Controller name="evaporator_unit_dimensions.height" control={control} render={({ field }) => (
                                            <InputText id="evaporator_unit_dimensions.height" type="number" {...field} />
                                        )} />
                                        <label htmlFor="evaporator_unit_dimensions.height">Height</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Speeds */}
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="speeds" control={control} render={({ field }) => (
                                    <InputText id="speeds" type="number" {...field} />
                                )} />
                                <label htmlFor="speeds">Speeds</label>
                            </span>
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

                        <Button type="submit" label="Update" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateMultiIndoorUnit;