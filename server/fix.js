const mongoose = require('mongoose');
require('dotenv').config();

// Connect to your MongoDB database
const DATABASE_URL = process.env.DB_URI; // Replace with your database URL
mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ShoppingBag = require('./models/ShoppingBag'); // Adjust the path to your ShoppingBag model
const Overhead = require('./models/airconditioners/Overhead'); // Adjust the path to your Overhead model
const MiniCenteral = require('./models/airconditioners/MiniCenteral'); // Adjust the path to your MiniCenteral model
const MultiIndoorUnit = require('./models/airconditioners/MultiIndoorUnit'); // Adjust the path to your MultiIndoorUnit model
const MultiOutdoorUnit = require('./models/airconditioners/MultiOutdoorUnit'); // Adjust the path to your MultiOutdoorUnit model

// Helper function to normalize the `type` field
const normalizeType = (type) => {
    if (!type) return null;
    const typeMapping = {
        overhead: 'Overhead',
        minicenteral: 'MiniCenteral',
        multiindoorunit: 'MultiIndoorUnit',
        multioutdoorunit: 'MultiOutdoorUnit',
    };
    return typeMapping[type.toLowerCase()] || type;
};

// Main migration function
const fixShoppingBags = async () => {
    try {
        console.log('Starting migration...');

        // Fetch all ShoppingBag documents
        const shoppingBags = await ShoppingBag.find({}).lean();

        for (const bag of shoppingBags) {
            const normalizedType = normalizeType(bag.type);

            if (!normalizedType) {
                console.error(`Skipping ShoppingBag with invalid type: ${bag.type}`);
                continue;
            }

            // Find the correct product based on `type` and `product_id`
            let productModel;
            switch (normalizedType) {
                case 'Overhead':
                    productModel = Overhead;
                    break;
                case 'MiniCenteral':
                    productModel = MiniCenteral;
                    break;
                case 'MultiIndoorUnit':
                    productModel = MultiIndoorUnit;
                    break;
                case 'MultiOutdoorUnit':
                    productModel = MultiOutdoorUnit;
                    break;
                default:
                    console.error(`Unknown type: ${normalizedType}`);
                    continue;
            }

            const product = await productModel.findById(bag.product_id).lean();

            if (!product) {
                console.error(`No product found for product_id: ${bag.product_id} and type: ${normalizedType}`);
                continue;
            }

            // Update the ShoppingBag document
            await ShoppingBag.updateOne(
                { _id: bag._id },
                {
                    $set: {
                        type: normalizedType,
                        product_id: product._id,
                    },
                }
            );

            console.log(`Updated ShoppingBag ${bag._id} with normalized type and valid product_id.`);
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Error during migration:', error);
    } finally {
        mongoose.connection.close();
    }
};

// Run the migration
fixShoppingBags();