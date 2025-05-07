import React from 'react';

const About = () => {
    return (
        <div style={{
            paddingTop: '60px',
            padding: '20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #d0f0fd, #b0e0f8)', // Light blue gradient
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Arial, sans-serif',
            color: '#333',
            direction: 'rtl', 
        }}>
            <h1 style={{ fontSize: '2.5rem', color: '#007bff', marginBottom: '20px' }}>
                ברוכים הבאים למחסני מיזוג
            </h1>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.8', marginBottom: '20px' }}>
                מחסני מיזוג מתמחים במתן פתרונות מיזוג מקצועיים לכל לקוח, תוך דגש על <strong>איכות</strong>, <strong>שירות</strong>, ו<strong>אמינות</strong>.
                אנו מציעים מגוון רחב של מזגנים מהמותגים המובילים בעולם, עם מחירים משתלמים לכל כיס.
            </p>

            <h2 style={{ fontSize: '1.8rem', color: '#007bff', marginBottom: '15px' }}>
                למה לבחור בנו?
            </h2>
            <ul style={{
                listStyleType: 'none',
                padding: 0,
                fontSize: '1.2rem',
                lineHeight: '1.8',
                color: '#555',
                textAlign: 'right', // For RTL alignment
            }}>
                <li>✔️ מבחר מותגים מובילים במחירים ללא תחרות</li>
                <li>✔️ שירות לקוחות אישי ומקצועי</li>
                <li>✔️ התקנה ואחזקה ברמה הגבוהה ביותר</li>
                <li>✔️ אחריות מקיפה על כל המוצרים</li>
            </ul>
            <p style={{ fontSize: '1.2rem', marginTop: '20px', color: '#555' }}>
                בואו לחוות את ההבדל עם מחסני מיזוג – המקום שלכם למיזוג מושלם!
            </p>
        </div>
    );
};

export default About;