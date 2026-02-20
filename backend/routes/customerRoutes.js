const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const Bill = require('../models/Bill');

// Search customers (for autocomplete/quick search)
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.json([]);

        const customers = await Customer.find({
            $or: [
                { mobile: { $regex: query, $options: 'i' } },
                { name: { $regex: query, $options: 'i' } }
            ]
        }).limit(5);

        res.json(customers);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get all customers with aggregated stats
router.get('/', async (req, res) => {
    try {
        const customers = await Customer.aggregate([
            {
                $lookup: {
                    from: 'bills',
                    localField: 'mobile',
                    foreignField: 'customerMobile',
                    as: 'customerBills'
                }
            },
            {
                $addFields: {
                    validBills: {
                        $filter: {
                            input: '$customerBills',
                            as: 'bill',
                            cond: { $in: ['$$bill.status', ['Paid', 'Due']] }
                        }
                    }
                }
            },
            {
                $project: {
                    name: 1,
                    mobile: 1,
                    place: 1,
                    type: 1,
                    totalPurchase: { $sum: '$validBills.grandTotal' },
                    billsCount: { $size: '$validBills' },
                    pendingDue: { $sum: '$validBills.dueAmount' },
                    lastPurchase: { $max: '$validBills.createdAt' }
                }
            },
            { $sort: { name: 1 } }
        ]);

        const formatted = customers.map(cust => ({
            ...cust,
            id: cust._id,
            lastPurchase: cust.lastPurchase ? new Date(cust.lastPurchase).toLocaleDateString() : 'N/A'
        }));

        res.json(formatted);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get customer history (Bills)
router.get('/:mobile/bills', async (req, res) => {
    try {
        const bills = await Bill.find({
            customerMobile: req.params.mobile,
            status: { $in: ['Paid', 'Due', 'Hold'] } // Include Hold in history but not in stats totals
        }).sort({ createdAt: -1 });
        res.json(bills);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single customer
router.get('/:id', async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create customer
router.post('/', async (req, res) => {
    try {
        const { name, mobile, place, type } = req.body;

        // Check if mobile already exists
        const existing = await Customer.findOne({ mobile });
        if (existing) {
            return res.status(400).json({ message: 'Customer with this mobile already exists' });
        }

        const customer = new Customer({ name, mobile, place, type });
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update customer
router.put('/:id', async (req, res) => {
    try {
        const { name, mobile, place, type } = req.body;
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            { name, mobile, place, type },
            { new: true, runValidators: true }
        );

        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json(customer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete customer
router.delete('/:id', async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (!customer) return res.status(404).json({ message: 'Customer not found' });
        res.json({ message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

