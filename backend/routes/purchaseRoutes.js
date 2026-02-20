const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');

// GET all
router.get('/', async (req, res) => {
    try {
        const purchases = await Purchase.find();
        res.json(purchases);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE Purchase and Update Inventory
router.post('/', async (req, res) => {
    const purchaseData = req.body;

    // Auto-calculate payment status if not provided
    const total = purchaseData.totalAmount;
    const paid = purchaseData.paidAmount || 0;

    if (paid >= total) purchaseData.paymentStatus = 'Paid';
    else if (paid > 0) purchaseData.paymentStatus = 'Partial';
    else purchaseData.paymentStatus = 'Credit';

    // If initial payment exists, add to history
    if (paid > 0) {
        purchaseData.paymentHistory = [{
            date: purchaseData.date,
            amount: paid,
            method: purchaseData.paymentMethod || 'Cash'
        }];
    }

    const purchase = new Purchase(purchaseData);
    try {
        const newPurchase = await purchase.save();

        // Process items into inventory
        for (const item of newPurchase.items) {
            const existingProduct = await Product.findOne({ barcode: item.barcode });
            if (existingProduct) {
                existingProduct.stockQty += item.qty;
                existingProduct.purchasePrice = item.costPrice;
                await existingProduct.save();
            } else {
                const newProduct = new Product({
                    productCode: item.barcode,
                    barcode: item.barcode,
                    name: item.name,
                    category: item.category,
                    brand: newPurchase.supplierName,
                    material: 'Unknown',
                    sellingPrice: item.sellingPrice || 0,
                    purchasePrice: item.costPrice,
                    mrp: item.mrp || 0,
                    stockQty: item.qty,
                    supplier: newPurchase.supplierName,
                    addedDate: new Date().toISOString().split('T')[0]
                });
                await newProduct.save();
            }
        }

        res.status(201).json(newPurchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE Payment for a Purchase
router.patch('/:id/payment', async (req, res) => {
    const { amount, method, date } = req.body;
    try {
        const purchase = await Purchase.findById(req.params.id);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        purchase.paidAmount += Number(amount);
        purchase.paymentHistory.push({
            date: date || new Date().toISOString().split('T')[0],
            amount: Number(amount),
            method: method || 'Cash'
        });

        if (purchase.paidAmount >= purchase.totalAmount) {
            purchase.paymentStatus = 'Paid';
        } else {
            purchase.paymentStatus = 'Partial';
        }

        await purchase.save();
        res.json(purchase);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PROCESS Purchase Return
router.post('/return', async (req, res) => {
    const { purchaseId, itemsToReturn } = req.body;

    try {
        const purchase = await Purchase.findById(purchaseId);
        if (!purchase) return res.status(404).json({ message: 'Purchase not found' });

        for (const returnItem of itemsToReturn) {
            const purchaseItem = purchase.items.find(i => i.barcode === returnItem.barcode);
            if (!purchaseItem) continue;

            // Ensure we don't return more than purchased
            if (purchaseItem.returnedQty + returnItem.qty > purchaseItem.qty) {
                return res.status(400).json({ message: `Cannot return more than purchased for ${purchaseItem.name}` });
            }

            purchaseItem.returnedQty += returnItem.qty;

            // Update Inventory (Decrease Stock)
            const product = await Product.findOne({ barcode: returnItem.barcode });
            if (product) {
                product.stockQty = Math.max(0, product.stockQty - returnItem.qty);
                await product.save();
            }
        }

        await purchase.save();
        res.json({ message: 'Purchase return processed successfully', purchase });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
