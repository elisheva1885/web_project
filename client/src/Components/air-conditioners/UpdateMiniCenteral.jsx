import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateMiniCenteral = () => {
    const location = useLocation();
    const mc = location.state?.type || {}; // Extract 'type' from the state

    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: mc // Set defaultValues to o
    });
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    
    const onSubmit = async (data) => {
        const minicenteral = {
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
            efficiency_factor: {
                cool: data.efficiency_factor?.cool,
                heat: data.efficiency_factor?.heat
            },
            energy_rating: data.energy_rating,
            working_current: {
                cool: data.working_current?.cool,
                heat: data.working_current?.heat
            },
            CFM: data.CFM,
            Pa: data.Pa,
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
            quiet: data.quiet,
            wifi: data.wifi,
            speeds: data.speeds,
            air4d: data.air4d,
            sabbath_command: data.sabbath_command
        };

        try {
            const response = await axios.put(`http://localhost:8000/api/air-conditioner/minicenteral`, minicenteral);
            if (response.status === 200) {
                setShowMessage(true);
                navigate('/minicenteral', { state: { data: response.data } });
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
                    <h5>MiniCentral AC Updated Successfully!</h5>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card" style={{ width: '100%', maxWidth: '600px' }}>
                    <h5 className="text-center">Update MiniCenteral</h5>
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="title" control={control} render={({ field }) => (
                                    <InputText id="title" {...field} />
                                )} />
                                <label htmlFor="title">Title</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="describe" control={control} render={({ field }) => (
                                    <InputText id="describe" {...field} />
                                )} />
                                <label htmlFor="describe">Description</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="imagepath" control={control} render={({ field }) => (
                                    <InputText id="imagepath" {...field} />
                                )} />
                                <label htmlFor="imagepath">Image Path</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="stock" control={control} render={({ field }) => (
                                    <InputText id="stock" type="number" {...field} />
                                )} />
                                <label htmlFor="stock">Stock</label>
                            </span>
                        </div>

                        <div className="field">
                            <span className="p-float-label">
                                <Controller name="price" control={control} render={({ field }) => (
                                    <InputText id="price" type="number" {...field} />
                                )} />
                                <label htmlFor="price">Price</label>
                            </span>
                        </div>

                        {/* Repeat for other fields similar to the schema */}
                        {/* Example for efficiency_factor */}
                        <div className="field">
                            <div className="flex">
                                <div style={{ flex: '1', marginRight: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="efficiency_factor.cool" control={control} render={({ field }) => (
                                            <InputText id="efficiency_factor.cool" {...field} />
                                        )} />
                                        <label htmlFor="efficiency_factor.cool">Efficiency Factor (Cool)</label>
                                    </span>
                                </div>
                                <div style={{ flex: '1', marginLeft: '10px' }}>
                                    <span className="p-float-label">
                                        <Controller name="efficiency_factor.heat" control={control} render={({ field }) => (
                                            <InputText id="efficiency_factor.heat" {...field} />
                                        )} />
                                        <label htmlFor="efficiency_factor.heat">Efficiency Factor (Heat)</label>
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Add fields for remaining schema properties */}

                        <Button type="submit" label="Update MiniCenteral" className="mt-2" />
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateMiniCenteral;