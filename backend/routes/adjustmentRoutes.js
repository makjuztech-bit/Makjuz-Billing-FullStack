const express = require('express');
const router = express.Router();
const Adjustment = require('../models/Adjustment');
const Product = require('../models/Product');

// GET all
router.get('/', async (req, res) => {
    try {
        const adjustments = await Adjustment.find();
        res.json(adjustments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE (And update Saree stock automatically)
router.post('/', async (req, res) => {
    const adjustment = new Adjustment(req.body);
    try {
        const newAdjustment = await adjustment.save();

        // Update linked Saree stock if barcode matches
        // Note: In real app, might want to do this in a transaction
        if (newAdjustment.status === 'approved' || newAdjustment.status === 'pending') { // Depending on logic, usually approved updates stock
            // For now, let's assume 'approved' updates stock, or if logic dictates 'pending' already reserves it?
            // The frontend logic seemingly updated it immediately. Let's start with just saving.
            // The User's previous code: updateSaree(saree.id, { stockQty: saree.stockQty + adjustment.adjustQty });
            // We should replicate that side-effect here or let frontend handle it via two calls?
            // Better to handle in backend.

            const product = await Product.findOne({ barcode: newAdjustment.barcode });
            if (product) {
                product.stockQty += newAdjustment.adjustQty;
                await product.save();
            }
        }

        res.status(201).json(newAdjustment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
