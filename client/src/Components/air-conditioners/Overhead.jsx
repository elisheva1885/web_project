// import { useLocation, useParams } from 'react-router-dom';
// import { useState, useEffect} from 'react'
// import axios from 'axios'
// import { Stepper } from 'primereact/stepper';
// import { StepperPanel } from 'primereact/stepperpanel';
// import { Button } from 'primereact/button';
// import React, { useRef } from "react";
// import { DataTable } from 'primereact/datatable';
// //          

// const Overhead = () => {
//     const {product} =  useParams();
//     const stepperRef = useRef(null);
//     const [overhead, setOverhead] = useState([])
//     const [products, setProducts] = useState([]);

//     const getOverheadById = async (_id) => {
//         try {
//             console.log(_id);
//             const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/overhead/${_id}`)
//             if (res.status === 200) {
//                 setOverhead(res.data)
//                 console.log(res.data);
//             }
            
//         }
//         catch (e) {
//             console.error(e)
//         }
//     }

//     const details = {
//         // "sku": "309666",
//         "מותג":overhead?.company?.name,
//         "כולל מצב שבת": overhead.sabbath_command? "✔": "X",
//         "תפוקת קירור (BTU)": overhead?.BTU_output?.cool,
//         "תפוקת חימום (BTU)": overhead?.BTU_output?.heat,
//         // "מדחס אינוורטר": "כולל",
//         "דירוג אנרגטי קירור":  overhead?.energy_rating?.cool,
//         "דירוג אנרגטי חימום":  overhead?.energy_rating?.cool,
//         "הספק יעילות בקירור (COP)": overhead?.working_current?.cool,
//         "הספק יעילות בחימום (COP)": overhead?.working_current?.heat,
//         "דגם": overhead.title,
//         // "תקופת אחריות": "שלוש שנות אחריות",
//         "טכנולוגיות Wi-Fi": overhead.wifi? "✔": "X"
//     };

//     const coolRating = overhead?.energy_rating?.cool;
//     console.log(coolRating);    

//     useEffect(() => {
//         getOverheadById(product);
//     }, [])

    
//     // useEffect(() => {
//     //     ProductService.getProductsMini().then(data => setProducts(data));
//     // }, []);

//     return (
//         <>
//         <br/><br/><br/><br/>
//          <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/${overhead?.company?.imagePath}`} />
//          <h1>{overhead.title}</h1>
//          {console.log(overhead)}
//                 <img className="w-9 sm:w-16rem xl:w-10rem shadow-2 block xl:block mx-auto border-round" src={`/overheads/${overhead.imagepath}`} />
//                 <h3>{overhead.describe}</h3>          
//                 <h4>{overhead.price}</h4>
//         <div className="card flex justify-content-center">
//             <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
//                 <StepperPanel header="מידע">
//                     <div className="flex flex-column h-12rem">
//                         {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content I</div> */}

//                     </div>
//                     <div className="flex pt-4 justify-content-end">
//                         <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
//                     </div>
//                 </StepperPanel>
//                 <StepperPanel header="מפרט טכני">
//                     <div className="flex flex-column h-12rem">
//                         {/* <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium"> */}
//                         <div className="card">
//                             <table  tableStyle={{ minWidth: '50rem' }}>
//                                 {Object.entries(details).map(([key,value])=> (
//                                <tr>
//                                 <td>
//                                     {key}:
//                                 </td>
//                                 <td>
//                                     {value}
//                                 </td>
//                                </tr>
//                                 ))}
//                             </table>
//                         </div>

//                         </div>
//                     {/* </div> */}
//                     <div className="flex pt-4 justify-content-between">
//                         <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
//                         <Button label="Next" icon="pi pi-arrow-right" iconPos="right" onClick={() => stepperRef.current.nextCallback()} />
//                     </div>
//                 </StepperPanel>
//                 <StepperPanel header="Header III">
//                     <div className="flex flex-column h-12rem">
//                         <div className="border-2 border-dashed surface-border border-round surface-ground flex-auto flex justify-content-center align-items-center font-medium">Content III</div>
//                     </div>
//                     <div className="flex pt-4 justify-content-start">
//                         <Button label="Back" severity="secondary" icon="pi pi-arrow-left" onClick={() => stepperRef.current.prevCallback()} />
//                     </div>
//                 </StepperPanel>
//             </Stepper>
//         </div>

        
//         </>
//     )
// }
// export default Overhead

// //מפרט טכני:
// //react stepper component




// import { useParams } from 'react-router-dom';
// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { Stepper } from 'primereact/stepper';
// import { StepperPanel } from 'primereact/stepperpanel';
// import { Button } from 'primereact/button';

// const Overhead = () => {
//     const { product } = useParams();
//     const stepperRef = useRef(null);
//     const [overhead, setOverhead] = useState(null);

//     const getOverheadById = async (_id) => {
//         try {
//             const res = await axios.get(`http://localhost:8000/api/air-conditioner/overhead/overhead/${_id}`);
//             if (res.status === 200) {
//                 setOverhead(res.data);
//                 console.log(res.data, overhead)
//             }
//         } catch (e) {
//             console.error(e);
//         }
//     };
//     useEffect(() => {
        
//         getOverheadById(product);
//     }, [product]);

//     if (!overhead) return <p>Loading...</p>;

//     return (
//         <>
//             <br/><br/><br/><br/>
//             <img className="w-40rem shadow-2 border-round" src={`/overheads/${overhead.imagepath}`} alt="product" />
//             <div className="flex flex-column gap-3">
//                 <img className="w-10rem shadow-2 border-round" src={`/${overhead.company?.imagePath}`} alt="brand" />
//                 <h1>{overhead.title}</h1>
//                 <h3>{overhead.describe}</h3>
//                 <h4 className="text-2xl font-bold text-primary">₪{overhead.price}</h4>
//             </div>
//             {/* <i className="pi pi-star" style={{ color: 'slateblue' }}></i> */}
//             <img src="/BTU_heat.png" style={{ width: '24px', height: '24px' }} />
//             <img src="/BTU_cool.png" style={{ width: '24px', height: '24px' }} />

//             <div className="card flex justify-content-center">
//                 <Stepper ref={stepperRef} style={{ flexBasis: '50rem' }}>
//                     <StepperPanel header="תפוקה ונתונים טכניים">
//                         <table>
//                             <tbody>
//                                 <tr><td>תפוקת קירור (BTU):</td><td>{overhead.BTU_output?.cool}</td></tr>
//                                 <tr><td>תפוקת חימום (BTU):</td><td>{overhead.BTU_output?.heat}</td></tr>
//                                 <tr><td>דירוג אנרגטי קירור:</td><td>{overhead.energy_rating?.cool}</td></tr>
//                                 <tr><td>דירוג אנרגטי חימום:</td><td>{overhead.energy_rating?.heat}</td></tr>
//                                 <tr><td>זרם עבודה קירור:</td><td>{overhead.working_current?.cool}</td></tr>
//                                 <tr><td>זרם עבודה חימום:</td><td>{overhead.working_current?.heat}</td></tr>
//                                 <tr><td>קוטר חיבור צנרת א:</td><td>{overhead.pipe_connection?.a}</td></tr>
//                                 <tr><td>קוטר חיבור צנרת ב:</td><td>{overhead.pipe_connection?.b}</td></tr>
//                                 <tr><td>מידות פנימיות (רוחב x עומק x גובה):</td><td>{`${overhead.in_size?.width} x ${overhead.in_size?.depth} x ${overhead.in_size?.height}`}</td></tr>
//                                 <tr><td>מידות חיצוניות (רוחב x עומק x גובה):</td><td>{`${overhead.out_size?.width} x ${overhead.out_size?.depth} x ${overhead.out_size?.height}`}</td></tr>
//                                 <tr><td>זרימת אוויר:</td><td>{overhead.air_flow}</td></tr>
//                                 {/* <tr><td>שיטת התקנה מומלצת:</td><td>{overhead.recommended_method}</td></tr> */}
//                             </tbody>
//                         </table>
//                     </StepperPanel>
//                     {/* <StepperPanel header="מידות וחיבורים">
//                         <table>
//                             <tbody>
                                
//                             </tbody>
//                         </table>
//                     </StepperPanel> */}
//                     <StepperPanel header="מאפיינים">
//                         <table>
//                             <tbody>
//                                 <tr><td>מצב שקט:</td><td>{overhead.quiet ? '✔' : 'X'}</td></tr>
//                                 <tr><td>WiFi:</td><td>{overhead.wifi ? '✔' : 'X'}</td></tr>
//                                 <tr><td>מהירויות:</td><td>{overhead.speeds}</td></tr>
//                                 <tr><td>תלת מימד:</td><td>{overhead.air4d ? '✔' : 'X'}</td></tr>
//                                 <tr><td>מצב לילה:</td><td>{overhead.night_mode ? '✔' : 'X'}</td></tr>
//                                 <tr><td>טיימר:</td><td>{overhead.timer ? '✔' : 'X'}</td></tr>
//                                 <tr><td>פיקוד שבת:</td><td>{overhead.sabbath_command ? '✔' : 'X'}</td></tr>
//                                 <tr><td>הדלקה וכיבוי אוטומטיים:</td><td>{overhead.onof_auto ? '✔' : 'X'}</td></tr>
//                             </tbody>
//                         </table>
//                     </StepperPanel>
//                 </Stepper>
//             </div>
//         </>
//     );
// };

// export default Overhead;

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Stepper } from 'primereact/stepper';
import { StepperPanel } from 'primereact/stepperpanel';
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

const Overhead = () => {
  const { product: productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stepperRef = useRef(null);

  useEffect(() => {
    const getOverhead = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:8000/api/air-conditioner/overhead/overhead/${productId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    getOverhead();
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
      <div style={styles.imageContainer}>
        <img src={`/overheads/${product.imagepath}`} alt={product.title} style={styles.productImage} />
        {product.company?.imagePath && (
          <img src={`/${product.company.imagePath}`} alt={product.company.name} style={styles.companyImage} />
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
          {/* <br/> */}
          {product.energy_rating?.cool && (
            <div style={styles.featureItem}>
              <span style={styles.energyRating}>{product.energy_rating.cool}</span>
              <span>דירוג אנרגיה קירור</span>
            </div>
          )}
          {product.energy_rating?.heat && (
            <div style={styles.featureItem}>
              <span style={styles.energyRating}>{product.energy_rating.heat}</span>
              <span>דירוג אנרגיה חימום</span>
            </div>
          )}
        </div>
        <h2 style={styles.price}>₪{product.price}</h2>
        <button style={styles.addToCartButton}>הוספה לסל</button>
      </div>

      {/* Stepper for Tables */}
      <div style={styles.stepperContainer}>
        <Stepper ref={stepperRef} style={{ direction: 'rtl' }} activeIndex={0}>
          <StepperPanel header="תפוקה ונתונים טכניים">
            <table style={{ ...styles.table, direction: 'rtl' }}>
              <tbody>
                <TableRow label="תפוקת קירור (BTU)" value={product.BTU_output?.cool} />
                <TableRow label="תפוקת חימום (BTU)" value={product.BTU_output?.heat} />
                <TableRow label="דירוג אנרגטי קירור" value={product.energy_rating?.cool} />
                <TableRow label="דירוג אנרגטי חימום" value={product.energy_rating?.heat} />
                <TableRow label="זרם עבודה קירור" value={product.working_current?.cool} />
                <TableRow label="זרם עבודה חימום" value={product.working_current?.heat} />
                <TableRow label="קוטר חיבור צנרת א" value={product.pipe_connection?.a} />
                <TableRow label="קוטר חיבור צנרת ב" value={product.pipe_connection?.b} />
                <TableRow label="מידות פנימיות" value={`${product.in_size?.width} x ${product.in_size?.depth} x ${product.in_size?.height}`} />
                <TableRow label="מידות חיצוניות" value={`${product.out_size?.width} x ${product.out_size?.depth} x ${product.out_size?.height}`} />
                <TableRow label="זרימת אוויר" value={product.air_flow} />
              </tbody>
            </table>
          </StepperPanel>
          <StepperPanel header="מאפיינים">
            <table style={{ ...styles.table, direction: 'rtl' }}>
              <tbody>
                <FeatureRow label="מצב שקט" value={product.quiet} />
                <FeatureRow label="WiFi" value={product.wifi} />
                <FeatureRow label="מהירויות" value={product.speeds} isBoolean={false} />
                <FeatureRow label="תלת מימד" value={product.air4d} />
                <FeatureRow label="מצב לילה" value={product.night_mode} />
                <FeatureRow label="טיימר" value={product.timer} />
                <FeatureRow label="פיקוד שבת" value={product.sabbath_command} />
                <FeatureRow label="הדלקה וכיבוי אוטומטיים" value={product.onof_auto} />
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
    },
    tableCellLabel: {
      padding: '8px',
      fontWeight: 'bold',
      textAlign: 'right',
      flex: '1',
    },
    tableCellValue: {
      padding: '8px',
      textAlign: 'left',
      flex: '1',
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

export default Overhead;