const express = require('express');
const router = express.Router();
const Return = require('../models/Return');
const Bill = require('../models/Bill');
const Product = require('../models/Product');

// Process a return
router.post('/', async (req, res) => {
    const { originalBillId, itemsToReturn, totalRefundAmount, refundMethod } = req.body;

    try {
        const bill = await Bill.findById(originalBillId);
        if (!bill) return res.status(404).json({ message: 'Original bill not found' });

        const returnedItems = [];

        for (const returnItem of itemsToReturn) {
            // Find the item in the original bill
            const billItem = bill.items.find(i => i.barcode === returnItem.barcode);
            if (!billItem) continue;

            // Ensure we don't return more than what was bought
            if (billItem.returnedQty + returnItem.qty > billItem.qty) {
                return res.status(400).json({ message: `Cannot return more than purchased for ${billItem.name}` });
            }

            // Update returned qty in bill
            billItem.returnedQty += returnItem.qty;

            // Update Product stock
            const product = await Product.findOne({ barcode: returnItem.barcode });
            if (product) {
                product.stockQty += returnItem.qty;
                // If it was unique and sold, make it active again
                if (product.stockType === 'unique' && product.status === 'sold') {
                    product.status = 'available';
                }
                await product.save();
            }

            returnedItems.push({
                barcode: billItem.barcode,
                name: billItem.name,
                qty: returnItem.qty,
                price: billItem.sellingPrice,
                refundAmount: returnItem.refundAmount,
                condition: returnItem.condition || 'good'
            });
        }

        await bill.save();

        const newReturn = new Return({
            originalBillId,
            originalBillNumber: bill.billNo,
            customerName: bill.customerName,
            customerMobile: bill.customerMobile,
            items: returnedItems,
            totalRefundAmount,
            refundMethod,
            processedBy: req.body.processedBy
        });

        await newReturn.save();

        res.status(201).json({
            message: 'Return processed successfully',
            return: newReturn
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET all returns
router.get('/', async (req, res) => {
    try {
        const returns = await Return.find().sort({ createdAt: -1 });
        res.json(returns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
