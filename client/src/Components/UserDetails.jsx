import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from "primereact/card";
import { Tag } from "primereact/tag";

const UserDetails = () => {
    const { userDetails } = useSelector((state) => state.userDetails);
    console.log('userdetails:', userDetails);

    if (!userDetails.name) {
        return (
            <div style={{ textAlign: "center", padding: "2rem" }}>
                <h2 style={{ color: "#888" }}>No User Details Available</h2>
            </div>
        );
    }

    const roleColors = {
        admin: "danger",
        user: "info",
        official: "warning"
    };

    return (
        <Card
            title="פרטי משתמש"
            style={{
                maxWidth: "500px",
                margin: "2rem auto",
                textAlign: "center",
                padding: "1.5rem",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
            }}
        >
            <div style={{ marginBottom: "1rem" }}>
                <h3 style={{ margin: 0 }}>{userDetails.name}</h3>
                <span style={{ fontSize: "0.9rem", color: "#555" }}>
                    @{userDetails.username}
                </span>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <i className="pi pi-envelope" style={{ marginRight: "0.5rem" }}></i>
                <span>{userDetails.email}</span>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <i className="pi pi-phone" style={{ marginRight: "0.5rem" }}></i>
                <span>{userDetails.phone}</span>
            </div>
            <div style={{ marginBottom: "1rem" }}>
                <Tag
                    value={userDetails.role || 'No Role Assigned'}
                    severity={roleColors[userDetails.role] || "neutral"}
                    style={{ fontSize: "0.9rem" }}
                />
            </div>
        </Card>
    );
};

export default UserDetails;