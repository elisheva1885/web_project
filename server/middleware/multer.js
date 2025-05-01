const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save files to the 'public/uploads' directory in the project
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for each uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });


module.exports = upload;
