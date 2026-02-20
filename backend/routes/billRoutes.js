const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

// GET all bills
router.get('/', async (req, res) => {
    try {
        const bills = await Bill.find().sort({ createdAt: -1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// SEARCH Bills by number or mobile
router.get('/search', async (req, res) => {
    const { query } = req.query;
    try {
        const bills = await Bill.find({
            $or: [
                { billNo: query },
                { customerMobile: query },
                { 'items.barcode': query }
            ]
        }).sort({ createdAt: -1 }).limit(10);
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET active bill by ID (or billNumber)
router.get('/:id', async (req, res) => {
    try {
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });
        res.json(bill);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// CREATE Bill
router.post('/', async (req, res) => {
    try {
        const bill = new Bill(req.body);
        const newBill = await bill.save();

        // Update or Create Customer record automatically
        if (newBill.customerMobile) {
            await Customer.findOneAndUpdate(
                { mobile: newBill.customerMobile },
                {
                    name: newBill.customerName,
                    place: newBill.customerPlace,
                    type: newBill.customerType || 'Retail'
                },
                { upsert: true, new: true }
            );
        }

        // Deduct stock if bill is confirmed (Paid or Due, not Hold/Cancelled)
        if (newBill.status === 'Paid' || newBill.status === 'Due') {
            for (const item of newBill.items) {
                const product = await Product.findOne({ barcode: item.barcode });
                if (product) {
                    product.stockQty = Math.max(0, product.stockQty - item.qty);
                    if (product.stockType === 'unique' && product.stockQty === 0) {
                        product.status = 'sold';
                    }
                    await product.save();
                }
            }
        }

        res.status(201).json(newBill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE Bill Status (Collect Payment / Cancel)
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, dueAmount } = req.body;
        const bill = await Bill.findById(req.params.id);
        if (!bill) return res.status(404).json({ message: 'Bill not found' });

        const oldStatus = bill.status;
        bill.status = status || bill.status;
        if (dueAmount !== undefined) bill.dueAmount = dueAmount;

        await bill.save();

        // If status changed from Hold to Paid/Due, deduct stock (if not already deducted)
        if ((oldStatus === 'Hold' || oldStatus === 'Cancelled') && (bill.status === 'Paid' || bill.status === 'Due')) {
            for (const item of bill.items) {
                const product = await Product.findOne({ barcode: item.barcode });
                if (product) {
                    product.stockQty = Math.max(0, product.stockQty - item.qty);
                    await product.save();
                }
            }
        }

        res.json(bill);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;

