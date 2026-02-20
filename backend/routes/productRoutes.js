const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Middleware to map sareeCode to productCode for backward compatibility
const mapSareeCode = (req, res, next) => {
    if (req.body.sareeCode && !req.body.productCode) {
        req.body.productCode = req.body.sareeCode;
    }
    // Also ensure barcode matches productCode if missing
    if (req.body.productCode && !req.body.barcode) {
        req.body.barcode = req.body.productCode;
    }
    next();
};

// GET all products (optionally filter by department/category)
router.get('/', async (req, res) => {
    try {
        const query = {};
        if (req.query.department) query.department = req.query.department;
        if (req.query.category) query.category = req.query.category;

        const products = await Product.find(query);
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET one product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE product
router.post('/', mapSareeCode, async (req, res) => {
    try {
        console.log('Adding product:', req.body.productCode);
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json(newProduct);
    } catch (err) {
        console.error('Error adding product:', err.message);
        res.status(400).json({ message: err.message });
    }
});

// UPDATE product
router.patch('/:id', mapSareeCode, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE product
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
