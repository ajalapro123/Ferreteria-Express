const productService = require('../services/productService');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.fetchAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error });
    }
};

exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await productService.fetchProductById(id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error });
    }
};

exports.createProduct = async (req, res) => {
    const newProduct = req.body;
    try {
        const createdProduct = await productService.addProduct(newProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    try {
        const result = await productService.updateProduct(id, updatedProduct);
        if (result) {
            res.status(200).json({ message: 'Product updated successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await productService.deleteProduct(id);
        if (result) {
            res.status(200).json({ message: 'Product deleted successfully' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error });
    }
};