const Product = require('../models/product');

class ProductService {
    async getAllProducts() {
        // Logic to fetch all products from the database
        return await Product.find({});
    }

    async getProductById(productId) {
        // Logic to fetch a single product by its ID
        return await Product.findById(productId);
    }

    async createProduct(productData) {
        // Logic to create a new product
        const newProduct = new Product(productData);
        return await newProduct.save();
    }

    async updateProduct(productId, productData) {
        // Logic to update an existing product
        return await Product.findByIdAndUpdate(productId, productData, { new: true });
    }

    async deleteProduct(productId) {
        // Logic to delete a product
        return await Product.findByIdAndDelete(productId);
    }
}

module.exports = new ProductService();