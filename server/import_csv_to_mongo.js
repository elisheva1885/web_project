require("dotenv").config()
const mongoose = require('mongoose');
const fs = require('fs');
const Overhead = require('./models/airconditioners/Overhead'); // עדכון הנתיב לפי הצורך
const dbconnect = require("./config/dbconnect")

// חיבור ל-MongoDB עם טיפול בשגיאות
// mongoose.connect(process.env.DB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('Connected to MongoDB'))
//   .catch(err => {
//       console.error('MongoDB connection error:', err);
//       process.exit(1);
//   });

dbconnect()
const overheads = [];

// בדיקה אם הקובץ קיים לפני קריאתו
if (!fs.existsSync('C:\\Users\\משפחת ספראי\\Documents\\final project\\data\\overhead_data.csv')) {
    console.error('Error: File "overhead_data.csv" not found.');
    process.exit(1);
}


// קריאת הקובץ וטעינת הנתונים
fs.readFile('C:\\Users\\משפחת ספראי\\Documents\\final project\\data\\overhead_data.csv', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        process.exit(1);
    }

    const lines = data.split('\n');
    const headers = lines[0].split(','); // המניחים שהשורות מופרדות ב-,

    // עיבוד כל שורה
    lines.slice(1).forEach((line) => {
        if (line.trim() === '') return; // מתעלמים משורות ריקות

        const row = line.split(',');

        try {
            // המרת ערכים למספרים רק אם הם מספרים חוקיים
            const convertToNumber = (value) => isNaN(Number(value)) ? 0 : Number(value);

            const rowData = {};

            headers.forEach((header, index) => {
                let value = row[index];

                if (header === 'stock' || header === 'price' || header === 'recommended_methom' || header === 'air_flow' ||
                    header === 'pipe_connection_a1' || header === 'pipe_connection_a2' || header === 'pipe_connection_b1' || 
                    header === 'pipe_connection_b2' || header === 'in_size_width' || header === 'in_size_depth' || 
                    header === 'in_size_height' || header === 'out_size_width' || header === 'out_size_depth' || 
                    header === 'out_size_height' || header === 'speeds') {
                    value = convertToNumber(value);
                }

                if (header === 'quiet' || header === 'wifi' || header === 'air4d' || header === 'night_mode' || 
                    header === 'timer' || header === 'sabbath_command' || header === 'onof_auto') {
                    value = value?.toString().trim().toLowerCase() === 'true';
                }

                rowData[header] = value;
            });

            overheads.push(rowData);
        } catch (error) {
            console.error('Error processing row:', error);
        }
    });

    // סיום הקריאה וההכנסה למסד נתונים
    if (overheads.length === 0) {
        console.log('No data to insert.');
        mongoose.connection.close();
        return;
    }

    Overhead.insertMany(overheads)
        .then(() => {
            console.log('Data imported successfully');
            mongoose.connection.close();
        })
        .catch((error) => {
            console.error('Error importing data:', error);
            mongoose.connection.close();
        });
});