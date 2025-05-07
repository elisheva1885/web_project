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
import { Toast } from "primereact/toast";
import { useRef } from "react";

const UpdateUserDetails = () => {
    const { userDetails } = useSelector((state) => state.userDetails);
    const { token } = useSelector((state) => state.token);
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const messages = {
        // Error Messages
        INVALID_USER_ID: "מזהה משתמש לא תקין.",
        NO_FIELDS_TO_UPDATE: "אין שדות לעדכן.",
        USER_NOT_FOUND: "המשתמש לא נמצא.",
        INTERNAL_ERROR: "שגיאה פנימית בשרת. נסה שוב מאוחר יותר.",
        UNAUTHORIZED: "השם המשתמש או הסיסמה אינם נכונים. אנא בדוק ונסה שוב.",
        Access_denied: "אינך מורשה לבצע פעולה זו.",
        Forbidden: "אינך מורשה לבצע פעולה זו.",

        // Success Messages
        USER_UPDATED_SUCCESSFULLY: "הפרטים עודכנו בהצלחה.",

        // Default
        default: "אירעה שגיאה לא צפויה. נסה שוב."
    };
    const toast = useRef(null); // Initialize the Toast reference
    const showToast = (severity, summary, detail) => {
        toast.current.show({ severity, summary, detail, life: 3000 });
    };
    const defaultValues = {
        email: userDetails.email,
        phone: userDetails.phone,
    };

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({ defaultValues });

    const onSubmit = async (data) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            }
            const res = await axios.put(`http://localhost:8000/api/user`, data, { headers });
            if (res.status === 200) {
                showToast('success', 'הצלחה', messages.USER_UPDATED_SUCCESSFULLY);
                setShowMessage(true);
                dispatch(setUserDetails(res.data))
                navigate('/userAcount');
            }
        } catch (error) {
            const serverMessage = error.response?.data?.message || 'default';
            showToast('error', 'שגיאה', messages[serverMessage]);
            console.error("Error updating user details:", error);
        }
    };

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };

    return (
        <div style={{ paddingTop: "60px" }}>
            <Toast ref={toast} />
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