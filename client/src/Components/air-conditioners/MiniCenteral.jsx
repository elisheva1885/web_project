import React, { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { setBasket } from '../../store/basketSlice';
import { useDispatch, useSelector } from 'react-redux';
import useGetFilePath from '../../hooks/useGetFilePath';
import useAddToBasket from "../../hooks/useAddToBasket";
import { Toast } from 'primereact/toast';

const MiniCenteral = () => {
    const { product: productId } = useParams();
    const stepperRef = useRef(null);
    // const [miniCenteral, setMiniCenteral] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const { basket } = useSelector((state) => state.basket);
    const { token } = useSelector((state) => state.token);
    const { getFilePath } = useGetFilePath()
    const [product, setProduct] = useState(null);
    const { addToBasket, toast } = useAddToBasket();

    const addtoBasket = async () => {
        addToBasket(product, "MiniCenteral");
    }

    const getMiniCenteral = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(`http://localhost:8000/api/air-conditioner/miniCenteral/miniCenteral/${productId}`);
            if (!res.status === 200) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.data;
            setProduct(data);
            console.log("product", res.data);

        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMiniCenteral();
    }, [productId]);

    if (loading) {
        return <p style={styles.loading}>טוען פרטי מוצר...</p>;
    }

    if (error) {
        return <p style={styles.error}>שגיאה בטעינת המוצר: {error}</p>;
    }

    if (!product) {
        return null;
    }

    return (
        <div style={styles.container}>
            <Toast ref={toast} />
            <div style={styles.imageContainer}>
                <img src={getFilePath(product.imagepath)} alt={product.title} style={styles.productImage} />
                {product.company?.imagePath && (
                    <img src={getFilePath(product.company.imagePath)} alt={product.company.name} style={styles.companyImage} />
                )}
            </div>

            <div style={styles.detailsContainer}>
                <h1 style={styles.title}>{product.title}</h1>
                <p style={styles.description}>{product.describe}</p>
                <div style={styles.featuresRow}>
                    {product.BTU_output?.cool && (
                        <div style={styles.featureItem}>
                            <img src="/BTU_cool.png" alt="cool" style={styles.featureIcon} />
                            <span>{product.BTU_output.cool}</span>
                            <span style={styles.featureUnit}>BTU</span>
                        </div>
                    )}
                    {product.BTU_output?.heat && (
                        <div style={styles.featureItem}>
                            <img src="/BTU_heat.png" alt="heat" style={styles.featureIcon} />
                            <span>{product.BTU_output.heat}</span>
                            <span style={styles.featureUnit}>BTU</span>
                        </div>
                    )}
                              <div style={styles.emptyLine}></div>

                    {product.energy_rating && (
                        <div style={styles.featureItem}>
                            <span style={styles.energyRating}>{product.energy_rating}</span>
                            <span>דירוג אנרגיה</span>
                        </div>
                    )}
                </div>
                <h2 style={styles.price}>₪{product.price}</h2>
                <Button style={styles.addToCartButton} onClick={addtoBasket} disabled={
                    product.stock === 0
                }>הוספה לסל</Button>            
                </div>

            {/* Stepper for Tables */}
            <div style={styles.stepperContainer}>
                <Stepper ref={stepperRef} style={{ direction: 'rtl' }} activeIndex={0}>
                    <StepperPanel header="תפוקה ונתונים טכניים">
                        <table style={{ ...styles.table, direction: 'rtl' }}>
                            <tbody>
                                <TableRow label="תפוקת קירור (BTU)" value={product.BTU_output?.cool} />
                                <TableRow label="תפוקת חימום (BTU)" value={product.BTU_output?.heat} />
                                <TableRow label="מקדם יעילות קירור" value={product.efficiency_factor?.cool} />
                                <TableRow label="מקדם יעילות חימום" value={product.efficiency_factor?.heat} />
                                <TableRow label="דירוג אנרגטי" value={product.energy_rating} />
                                <TableRow label="זרם עבודה קירור" value={product.working_current?.cool} />
                                <TableRow label="זרם עבודה חימום" value={product.working_current?.heat} />
                                <TableRow label="CFM" value={product.CFM} />
                                <TableRow label="Pa (לחץ סטטי)" value={product.Pa} />
                                <TableRow label="קוטר חיבורי צנרת" value={<span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>
                                    {`${product.pipe_connection?.a} x ${product.pipe_connection?.b}`}
                                </span>} />                                <TableRow label="מידות פנימיות" value={<span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>
                                    {`${product.in_size?.width} x ${product.in_size?.depth} x ${product.in_size?.height}`}
                                </span>} />
                                <TableRow label="מידות חיצוניות" value={<span style={{ direction: 'ltr', unicodeBidi: 'embed' }}>
                                    {`${product.out_size?.width} x ${product.out_size?.depth} x ${product.out_size?.height}`}
                                </span>} />
                                <FeatureRow label="מהירויות" value={product.speeds} isBoolean={false} />
                            </tbody>
                        </table>
                    </StepperPanel>

                    <StepperPanel header="מאפיינים">
                        <table style={{ ...styles.table, direction: 'rtl' }}>
                            <tbody>
                                <FeatureRow label="מצב שקט" value={product.quiet} />
                                <FeatureRow label="WiFi" value={product.wifi} />
                                <FeatureRow label="תלת מימד" value={product.air4d} />
                                <FeatureRow label="פיקוד שבת" value={product.sabbath_command} />
                            </tbody>
                        </table>
                    </StepperPanel>
                </Stepper>
            </div>
        </div>
    );
};

const TableRow = ({ label, value }) => (
    <tr style={styles.tableRow}>
        <td style={styles.tableCellValue}>{value}</td>
        <td style={styles.tableCellLabel}>{label}</td>
    </tr>
);

const FeatureRow = ({ label, value, isBoolean = true }) => (
    <tr style={styles.tableRow}>
        <td style={styles.tableCellValue}>
            {isBoolean ? (
                value ? <span style={styles.featureCheck}>&#10004;</span> : <span style={styles.featureCross}>&#10006;</span>
            ) : (
                value
            )}
        </td>
        <td style={styles.tableCellLabel}>{label}</td>
    </tr>
);

const styles = {
    emptyLine: {
        width: '100%',
        height: '1px', // Adjust the height as needed for spacing
      },
    container: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        margin: '16px',
        padding: '16px',
    },
    imageContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px',
    },
    productImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
        marginBottom: '16px',
    },
    companyImage: {
        width: '25%', // Increased width
        height: 'auto', // Maintain aspect ratio
        marginBottom: '8px', // Add some space below the logo if needed
    },
    detailsContainer: {
        padding: '16px',
        textAlign: 'right',
        borderBottom: '1px solid #eee',
        marginBottom: '16px',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: '8px',
    },
    description: {
        color: '#6c757d',
        marginBottom: '16px',
        lineHeight: '1.5',
    },
    featuresRow: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '16px',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    featureItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '0.9rem',
        color: '#495057',
    },
    featureIcon: {
        width: '20px',
        height: '20px',
    },
    featureUnit: {
        marginLeft: '2px',
    },
    energyRating: {
        backgroundColor: '#ffc107',
        color: '#fff',
        borderRadius: '4px',
        padding: '2px 6px',
        fontWeight: 'bold',
    },
    price: {
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#28a745',
        marginBottom: '16px',
    },
    addToCartButton: {
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        padding: '12px 24px',
        cursor: 'pointer',
        fontSize: '1.1rem',
    },
    stepperContainer: {
        padding: '16px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '16px',
    },
    tableRow: {
        borderBottom: '1px solid #eee',
        display: 'flex',
        flexDirection: 'row-reverse',
        gap: '2px', // Reduced gap for tighter spacing
    },
    tableCellLabel: {
        padding: '6px', // Slightly reduced padding to bring the label closer to the value
        fontWeight: 'bold',
        textAlign: 'right',
        flex: '0.4', // Adjusted flex for tighter layout
    },
    tableCellValue: {
        padding: '6px', // Keep the padding reduced as needed
        textAlign: 'center', // Center the text horizontally
        display: 'flex', // Use flexbox for centering
        // alignItems: 'center', // Center content vertically
        // justifyContent: 'center', // Center content horizontally
        flex: '0.6',
    },
    featureCheck: {
        color: '#28a745',
        fontSize: '1rem',
    },
    featureCross: {
        color: '#dc3545',
        fontSize: '1rem',
    },
    loading: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '1rem',
        color: '#6c757d',
    },
    error: {
        textAlign: 'center',
        padding: '20px',
        fontSize: '1rem',
        color: '#dc3545',
    },

};

export default MiniCenteral;