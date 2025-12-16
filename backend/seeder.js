const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const products = require('./data/products');
const Product = require('./models/Product');
const connectDB = require('./config/db');
console.log('Product Model là:', Product);
dotenv.config();
connectDB();

const importData = async () => {
    try {
        await Product.deleteMany();
        await Product.insertMany(products);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
} else {
    importData();
}