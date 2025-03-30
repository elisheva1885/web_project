import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Divider } from "primereact/divider";

const Payment = () => {
    const { token } = useSelector((state) => state.token);
    const [address, setAddress] = useState();

    const createAddress = async (address) => {
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };
            const res = await axios.post("http://localhost:8000/api/user/address", address, { headers });
            if (res.status === 201) {
                setAddress(res.data);
                console.log(res.data);
            }
        } catch (error) {
            console.log(error);
            if (error.response?.status === 400) {
                alert("Error");
            }
        }
    };
    const createPurchase = async(paymentType)=> {
        
    }

    const [form, setForm] = useState({
        country: "ישראל",
        city: "",
        street: "",
        building_num: "",
        apartment_num: "",
        floor: "",
        zip_code: "",
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validate = () => {
        let newErrors = {};
        for (let key in form) {
            if (!form[key]) newErrors[key] = "Required";
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            createAddress(form);
        }
        setErrors(newErrors);
    };

    return (
        <div style={{ display: "flex", width: "100vw", height: "100vh", padding: "20px" }}>
            {/* Left: Payment Square */}
            <div
                style={{
                    width: "30%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    border: "2px solid #ccc",
                    borderRadius: "10px",
                    padding: "20px",
                    height: "300px",
                    boxShadow: "2px 2px 10px rgba(0,0,0,0.1)",
                }}
            >
                <h3>Choose Payment</h3>
                <Button label="Pay with PayPal" icon="pi pi-paypal" className="p-button-info p-mb-2" onClick={()=>createPurchase("paypal")} />
                <Button label="Pay with Google Pay" icon="pi pi-google" className="p-button-warning" onClick={()=>createPurchase("google")}/>
            </div>

            <Divider layout="vertical" />

            {/* Right: Address Form */}
            <div style={{ width: "65%", marginLeft: "auto" }}>
                <form onSubmit={handleSubmit} className="p-fluid">
                    {["country", "city", "street", "zip_code"].map((field) => (
                        <div key={field} className="p-field">
                            <label htmlFor={field}>{field.replace("_", " ")}</label>
                            <InputText id={field} name={field} value={form[field]} onChange={handleChange} />
                            {errors[field] && <small className="p-error">{errors[field]}</small>}
                        </div>
                    ))}
                    {["building_num", "apartment_num", "floor"].map((field) => (
                        <div key={field} className="p-field">
                            <label htmlFor={field}>{field.replace("_", " ")}</label>
                            <InputText id={field} name={field} type="number" value={form[field]} onChange={handleChange} />
                            {errors[field] && <small className="p-error">{errors[field]}</small>}
                        </div>
                    ))}
                    <Button type="submit" label="Submit" className="p-mt-2" />
                </form>
            </div>
        </div>
    );
};

export default Payment;