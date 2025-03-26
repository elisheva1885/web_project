// import React, { useState } from 'react';
// import { Card } from 'primereact/card';
// import { Button } from 'primereact/button';
// import { InputText } from 'primereact/inputtext';

// const SideBasket = () => {
//   const [basketItems, setBasketItems] = useState([
//     { id: 1, name: 'Product A', price: 25.99, quantity: 2 },
//     { id: 2, name: 'Product B', price: 15.50, quantity: 1 },
//   ]);

//   const [couponCode, setCouponCode] = useState('');

//   const calculateTotal = () => {
//     return basketItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
//   };

//   const calculateDiscount = () => {
//     // Add your discount logic here (e.g., based on couponCode)
//     // For now, let's just return a fixed discount
//     return 4.00; 
//   };

//   const finalTotal = (parseFloat(calculateTotal()) - calculateDiscount()).toFixed(2);

//   return (
//     <div style={{ width: '300px', padding: '20px', backgroundColor: '#f0f0f0' }}> 
//       <Card title="סיכום">
//         <div>סיכום ביניים: {calculateTotal()} ₪</div>
//         <div>
//           <span style={{ color: 'red' }}>- {calculateDiscount()} ₪</span> נחסכו
//         </div>
//         <div>
//           קוד מבצע:
//           <InputText value={couponCode} onChange={(e) => setCouponCode(e.target.value)} />
//         </div>
//         <div>דמי משלוח: חינם</div>
//         <div>סך הכל: {finalTotal} ₪</div>

//         <Button label="בצע הזמנה" className="p-button-success" style={{ marginTop: '20px' }} />
//         <div style={{ fontSize: '0.8em', marginTop: '10px' }}>
//           לתנאים ולהתניות לחיצה על 'בצע הזמנה' עם אישור שקראתם והסכמתם
//         </div>
//       </Card>
//       <div style={{ marginTop: '20px' }}>
//         <img src="https://ae01.alicdn.com/kf/H983637e1081f4560b0e3522a46c31041L.png" alt="AliExpress" style={{ maxWidth: '100%' }} />
//         <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
//           אתר AliExpress שומר על בטחון התשלומים שלכם
//         </div>
//       </div>
//       <div style={{ marginTop: '20px' }}>
//         <div style={{ fontWeight: 'bold' }}>אספקה מהירה <span style={{ float: 'right' }}>&gt;</span></div>
//         <ul style={{ listStyleType: 'none', padding: 0 }}>
//           <li>- ₪4.00 קוד קופון בבקשה מאוחר יותר</li>
//           <li>- החזר כספי הפריטים הגיעו פגומים</li>
//           <li>- אם החזר כספי אם החבילה אבדה</li>
//           <li>- החזר כספי במקרה שההזמנה לא נמסרה לאחר 45 יום</li>
//         </ul>
//       </div>
//       <div style={{ marginTop: '20px' }}>
//         <div style={{ fontWeight: 'bold' }}>אבטחה ופרטיות <span style={{ float: 'right' }}>&gt;</span></div>
//         <div>תשלומים בטוחים - אבטחת פרטים אישיים</div>
//       </div>
//       <div style={{ marginTop: '20px' }}>
//         <div style={{ fontWeight: 'bold' }}>תשלומים בטוחים</div>
//         <img src="https://ae01.alicdn.com/kf/H983637e1081f4560b0e3522a46c31041L.png" alt="Payment Icons" style={{ maxWidth: '100%' }} />
//         <div style={{ fontSize: '0.9em', marginTop: '5px' }}>
//           עם ביטוחי הביטוח הפופולריים שלך , פרטיים אישיים .
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SideBasket;