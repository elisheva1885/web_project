const Delivery = require("../models/Delivery")
const User = require("../models/User")
const Address = require("../models/Address")
const Purchase = require("../models/Purchase")
const ShoppingBag = require("../models/ShoppingBag")
const Overhead = require("../models/airconditioners/Overhead")
const MiniCenteral = require("../models/airconditioners/MiniCenteral")
const MultiIndoorUnit = require("../models/airconditioners/MultiIndoorUnit")
const MultiOutdoorUnit = require("../models/airconditioners/MultiOutdoorUnit")

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "eli7saf@gmail.com",
        pass: 'dlos zelp opcn icli',
    }
})

const mailOptions = {
    from: 'eli7saf@gmail.com',
    to: 'elisheva1885@gmail.com',
    subject: 'נושא ההודעה',
    text: 'תוכן ההודעה',
};

const createDelivery = async (req, res) => {
    const user_id = req.user?._id
    const { address, purchase, status } = req.body
    if (!user_id) {
        return res.status(400).json({ message: "USER_REQUIRED" });
    }
    if (!address || typeof address !== "object" || !address.city || !address.street || !address.zipCode) {
        return res.status(400).json({ message: "INVALID_ADDRESS" });
    }
    if (!purchase || typeof purchase !== "string" || purchase.length !== 24) {
        return res.status(400).json({ message: "INVALID_PURCHASE_ID" });
    }
    if (status && typeof status !== "string") {
        return res.status(400).json({ message: "INVALID_STATUS" });
    }
    try {
        const delivery = await Delivery.create({ user_id, address, purchase, status });
        if (delivery) {
            sendDeliveryCreatedEmail(delivery._id);
            return res.status(201).json(delivery);
        } else {
            return res.status(400).json({ message: "DELIVERY_CREATION_FAILED" });
        }
    } catch (error) {
        console.error("Error creating delivery:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const sendDeliveryCreatedEmail = async (deliveryId) => {
    try {
        const delivery = await Delivery.findById(deliveryId)
            .populate('user_id') // שליפת פרטי המשתמש
            .populate('address') // שליפת פרטי הכתובת
            .populate({
                path: 'purchase',
                populate: {
                    path: 'products', // שליפת פרטי המוצרים
                    model: 'ShoppingBag'
                }
            });
        if (!delivery) {
            throw new Error("ההזמנה לא נמצאה");
        }

        // שליפת המשתמש מההזמנה
        const user = delivery.user_id;
        const address = delivery.address;
        const purchase = delivery.purchase;

        // מבנה תוכן המייל
        console.log("products", purchase.products)
        const mailOptions = {
            from: 'eli7saf@gmail.com',
            to: user.email,
            subject: 'ההזמנה שלך נכנסה למערכת ותשלח אליך בקרוב',
            text: `שלום ${user.name},\n\nההזמנה שלך נכנסה למערכת ותשלח אליך בקרוב.\n\nפרטי ההזמנה:\nכתובת: ${address.street}, ${address.city}, ${address.zipCode}\nסטטוס: ${delivery.status}\n\nפרטי רכישה:\nמוצרים: ${delivery.purchase.products.map(p => `• ${p.productName} - כמות: ${p.quantity}`).join('\n')}\nסכום כולל: ${""} ש"ח\n\nתודה על רכישתך!\nצוות השירות שלנו`
        };

        // שלח את המייל
        await transporter.sendMail(mailOptions);
        console.log("הודעת דואר נשלחה בהצלחה!");
    }

    catch (error) {
        console.error("אירעה שגיאה בשליחת האימייל:", error);

    }
}

const sendDeliveryUpdatedEmail = async (deliveryId) => {
    try {
        const delivery = await Delivery.findById(deliveryId)
            .populate('user_id') // שליפת פרטי המשתמש
            .populate('address') // שליפת פרטי הכתובת
            .populate({
                path: 'purchase',
                populate: {
                    path: 'products', // שליפת פרטי המוצרים
                    model: 'ShoppingBag'
                }
            });
        if (!delivery) {
            throw new Error("ההזמנה לא נמצאה");
        }

        // שליפת המשתמש מההזמנה
        const user = delivery.user_id;
        const address = delivery.address;
        const purchase = delivery.purchase;

        // מבנה תוכן המייל
        console.log("products", purchase.products)
        const mailOptions = {
            from: 'eli7saf@gmail.com',
            to: user.email,
            subject: 'ההזמנה שלך מתקרבת אליך :)',
            text: `שלום ${user.name},\nסטטוס ההזמנה שלך השתנה. .\n\nפרטי ההזמנה:\nכתובת: ${address.street}, ${address.city}, ${address.zipCode}\nסטטוס: ${delivery.status}\n\nפרטי רכישה:\nמוצרים: ${delivery.purchase.products.map(p => `• ${p.productName} - כמות: ${p.quantity}`).join('\n')}\nסכום כולל: ${""} ש"ח\n\nתודה על רכישתך!\nצוות השירות שלנו`
        };

        // שלח את המייל
        await transporter.sendMail(mailOptions);
        console.log("הודעת דואר נשלחה בהצלחה!");
    }

    catch (error) {
        console.error("אירעה שגיאה בשליחת האימייל:", error);

    }
}

const readDeliveries = async (req, res) => {
    try {
        const deliveries = await Delivery.find()
            .populate('user_id', 'username') // Populate user details (fetch only username)
            .populate('address') // Populate delivery address details
            .populate({
                path: 'purchase',
                populate: {
                    path: 'products',
                    populate: {
                        path: 'product_id', // Populate product details
                    },
                },
            })
            .lean();

        if (!deliveries?.length) {
            return res.status(404).json({ message: "NO_DELIVERIES_FOUND" });
        }

        return res.status(200).json(deliveries);
    } catch (error) {
        console.error("Error fetching deliveries:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

const readDeliveriesByUserId = async (req, res) => {
    const user_id = req.user?._id
    if (!user_id || typeof user_id !== "string" || user_id.length !== 24) {
        return res.status(400).json({ message: "INVALID_USER_ID" });
    }
    try {
        const deliveries = await Delivery.find({ user_id: user_id })
            .populate('user_id', 'username')
            .populate({
                path: 'purchase',
                populate: {
                    path: 'products',
                    populate: {
                        path: 'product_id',
                    },
                },
            })
            .populate('address')
            .lean()

        if (!deliveries?.length) {
            return res.status(404).json({ message: "NO_DELIVERIES_FOR_USER" });
        }
        return res.status(200).json(deliveries)
    } catch (error) {
        console.error("Error fetching deliveries for user:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

// const readDeliveriesByUserName = async (req, res) => {
//     const { username } = req.params
//     console.log("username ", username)
//     if (!username) {
//         return res.status(400).json({ message: "user required" })
//     }
//     const user = await User.findOne({ username: username });
//     console.log("user ", user)
//     if (!user) {
//         return res.status(401).json({ message: "user anauthorized" })
//     }
//     const deliveries = await Delivery.find({ user_id: user._id }).populate('address').populate('purchase').lean()
//     if (!deliveries)
//         return res.status(404).json({ message: "no deliveries for this user" })
//     return res.status(200).json(deliveries)
// }

const updateDelivery = async (req, res) => {
    const { _id, address, purchase, status } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_DELIVERY_ID" });
    }

    if (address && (typeof address !== "object" || !address.city || !address.street || !address.zipCode)) {
        return res.status(400).json({ message: "INVALID_ADDRESS" });
    }

    if (purchase && (typeof purchase !== "string" || purchase.length !== 24)) {
        return res.status(400).json({ message: "INVALID_PURCHASE_ID" });
    }

    if (status && typeof status !== "string") {
        return res.status(400).json({ message: "INVALID_STATUS" });
    }

    try {
        const delivery = await Delivery.findById(_id).exec()
        if (!delivery) {
            return res.status(400).json({ message: "DELIVERY_NOT_FOUND" })
        }
        delivery.address = address || delivery.address;
        delivery.purchase = purchase || delivery.purchase;
        delivery.status = status || delivery.status;

        const updateddelivery = await delivery.save()
        if (updateddelivery && status) {
            sendDeliveryUpdatedEmail(_id)
        }
        const deliveries = await Delivery.find().lean()
        return res.status(200).json(deliveries)
    } catch (error) {
        console.error("Error updating delivery:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR"});
    }

}

const deleteDelivery = async (req, res) => {
    const { _id } = req.body
    if (!_id || typeof _id !== "string" || _id.length !== 24) {
        return res.status(400).json({ message: "INVALID_DELIVERY_ID" });
    }
    try {
    const delivery = await Delivery.findById(_id).exec()
    if (!delivery) {
        return res.status(404).json({ message: "DELIVERY_NOT_FOUND" });
    }
    const result = await delivery.deleteOne()
    const deliveries = await Delivery.find().lean()
    if (!deliveries?.length)
        return res.status(404).json({ message: "NO_DELIVERIES_FOUND" });
    return res.status(200).json(deliveries)
    } catch (error) {
        console.error("Error deleting delivery:", error);
        return res.status(500).json({ message: "INTERNAL_ERROR" });
    }
}

module.exports = { createDelivery, readDeliveries, readDeliveriesByUserId, updateDelivery, deleteDelivery }