import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { setUserDetails } from "../store/userDetailsSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "primereact/dialog";

const UpdateUserDetails = () => {
    const { userDetails } = useSelector((state) => state.userDetails);
    const { token } = useSelector((state) => state.token);
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()

    const defaultValues = {

        email: userDetails.email ,
        phone: userDetails.phone ,
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const onSubmit = async(data) => {
        console.log("Updated Data:", data);
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.put(`http://localhost:8000/api/user`, data, {headers});
            if (res.status === 200) {
                setShowMessage(true);
                console.log(res.data);
                // const unUpdatedOverheads = userDetails.filter(overhead=> overhead._id != res.data._id)
                dispatch(setUserDetails(res.data))
                navigate('/userAcount');
            }
        } catch (error) {
            console.error(error);
        }

    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <div style={{ paddingTop: "60px" }}>
             <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={<Button label="Close" onClick={() => setShowMessage(false)} />} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '40vw' }}>
                <div className="flex justify-content-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>  {userDetails.name} עודכן בהצלחה! </h5>
                </div>
            </Dialog>
            <div className="form-demo">
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">עדכן פרטים</h5>
                        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                            <div className="field">
                                <span className="p-float-label p-input-icon-right">
                                    <Controller
                                        name="email"
                                        control={control}
                                        rules={{
                                            required: "Email is required.",
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                                message: "Invalid email address. E.g. example@email.com",
                                            },
                                        }}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                id={field.name}
                                                {...field}
                                                className={classNames({ "p-invalid": fieldState.invalid })}
                                            />
                                        )}
                                    />
                                    <label htmlFor="email" className={classNames({ "p-error": !!errors.email })}>
                                        Email
                                    </label>
                                </span>
                            </div>
                            <div className="field">
                                <span className="p-float-label">
                                    <Controller
                                        name="phone"
                                        control={control}
                                        render={({ field, fieldState }) => (
                                            <InputText
                                                id={field.email}
                                                {...field}
                                                autoFocus
                                                className={classNames({ "p-invalid": fieldState.invalid })}
                                            />
                                        )}
                                    />
                                    <label htmlFor="phone" className={classNames({ "p-error": errors.phone })}>
                                        Phone
                                    </label>
                                </span>
                            </div>
                            <div className="field-checkbox">
                                
                               
                            </div>
                            <Button type="submit" label="עדכן פרטים" className="mt-2" />
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateUserDetails;