const Product = require('../models/Product');

const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
};

const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Đã xóa sản phẩm' });
    } else {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
};

const createProduct = async (req, res) => {
    const product = new Product({
        name: 'Sản phẩm mẫu ' + Date.now(),
        price: 0,
        user: req.user._id,
        image: 'https://via.placeholder.com/150',
        brand: 'Brand mẫu',
        category: 'Danh mục mẫu',
        countInStock: 0,
        numReviews: 0,
        description: 'Mô tả mẫu',
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

const updateProduct = async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
};