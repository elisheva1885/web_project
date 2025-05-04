import React from "react";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const Official = () => {
    const navigate = useNavigate();

    const toAddCompany = () => {  
        navigate("./addCompany");
    };

    const toUpdateDeliveryStatus = () => {
        navigate("./updateDeliveryStatus");
    };

    return (
        <div style={{ textAlign: "center", padding: "2rem" }}>
            <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#2C3E50" }}>
                דלפק המזכירות
            </h1>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
                {/* Button for Adding Company */}
                <Button
                    label="להוספת חברה"
                    icon="pi pi-building" // PrimeIcons for a building icon
                    className="p-button-info"
                    onClick={toAddCompany}
                    style={{ fontSize: "1rem", padding: "1rem 2rem" }}
                />

                {/* Button for Updating Delivery Status */}
                <Button
                    label="לעדכון סטטוס משלוחים"
                    icon="pi pi-truck" // PrimeIcons for a truck icon
                    className="p-button-success"
                    onClick={toUpdateDeliveryStatus}
                    style={{ fontSize: "1rem", padding: "1rem 2rem" }}
                />
            </div>
        </div>
    );
};

export default Official;