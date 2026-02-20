const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// Summary Report
router.get('/summary', async (req, res) => {
    try {
        // Only include Paid and Due bills in sales totals
        const bills = await Bill.find({ status: { $in: ['Paid', 'Due'] } });
        const totalSales = bills.reduce((acc, bill) => acc + (bill.grandTotal || 0), 0);
        const billsCount = bills.length;
        const avgBillValue = billsCount > 0 ? Math.round(totalSales / billsCount) : 0;

        // Rough profit estimate: Total Sales - (assuming 80% cost if not available)
        // A better way would be to track purchasePrice in BillItems, but for now 20% margin is standard.
        const profitEstimate = Math.round(totalSales * 0.2);

        res.json({
            totalSales,
            billsCount,
            avgBillValue,
            profitEstimate
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Detailed Report
router.get('/detailed', async (req, res) => {
    try {
        const bills = await Bill.find({ status: { $in: ['Paid', 'Due'] } }).sort({ createdAt: -1 }).limit(50);

        const detailed = bills.map(bill => ({
            id: bill._id,
            date: bill.date || new Date(bill.createdAt).toISOString().split('T')[0],
            category: 'Sales',
            cash: (bill.paymentMethod === 'Cash') ? bill.grandTotal : 0,
            card: (bill.paymentMethod !== 'Cash') ? bill.grandTotal : 0,
            totalAmount: bill.grandTotal
        }));

        res.json(detailed);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GST Report
router.get('/gst', async (req, res) => {
    try {
        // Optional: Filter by month if query param exists
        const bills = await Bill.find({ status: { $ne: 'Cancelled' } });

        let totalTaxable = 0;
        let totalTax = 0;
        let b2bCount = 0;

        // Simple aggregation assuming HSN 5007 for now or based on category
        const hsnMap = {
            '5007': { description: 'Woven fabrics of Silk (Sarees)', taxable: 0, tax: 0, rate: 5 }
        };

        bills.forEach(bill => {
            // Assuming subtotal is taxable value
            const taxable = bill.subtotal || (bill.grandTotal - bill.gstAmount);

            totalTaxable += taxable;
            totalTax += bill.gstAmount;

            if (bill.customerGst || bill.customerType === 'Wholesale') {
                b2bCount++;
            }

            // Add to HSN bucket
            hsnMap['5007'].taxable += taxable;
            hsnMap['5007'].tax += bill.gstAmount;
        });

        res.json({
            totalTaxable,
            totalTax,
            b2bCount,
            hsnSummary: Object.entries(hsnMap).map(([code, data]) => ({
                code,
                ...data
            }))
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Best Selling Categories
router.get('/bestselling', async (req, res) => {
    try {
        const bills = await Bill.find({ status: { $ne: 'Cancelled' } });
        const Product = require('../models/Product');

        // Collect all saree IDs from bills
        const sareeIds = [];
        bills.forEach(bill => {
            bill.items.forEach(item => {
                if (item.sareeId) sareeIds.push(item.sareeId);
            });
        });

        // Fetch sarees to get categories
        const distinctIds = [...new Set(sareeIds)];
        const products = await Product.find({ _id: { $in: distinctIds } }).select('_id category');

        const sareeCategoryMap = {};
        products.forEach(s => {
            sareeCategoryMap[s._id.toString()] = s.category;
        });

        // Aggregate
        const categoryStats = {};

        bills.forEach(bill => {
            bill.items.forEach(item => {
                if (item.sareeId) {
                    const cat = sareeCategoryMap[item.sareeId] || 'Uncategorized';
                    if (!categoryStats[cat]) {
                        categoryStats[cat] = { sales: 0, revenue: 0 };
                    }
                    categoryStats[cat].sales += item.qty;
                    categoryStats[cat].revenue += item.total || (item.sellingPrice * item.qty);
                }
            });
        });

        // Convert to array and sort
        const sortedCategories = Object.entries(categoryStats)
            .map(([name, stats]) => ({
                name,
                sales: stats.sales,
                revenue: `₹${stats.revenue.toLocaleString('en-IN')}`
            }))
            .sort((a, b) => {
                // Parse back revenue to number for sorting if needed, or sort by sales
                // Simplified: sort by sales count or raw revenue number
                // Let's rely on sales count for now or better keep raw revenue in object for sort
                return 0;
            });

        // Fix sorting properly
        const result = Object.entries(categoryStats)
            .map(([name, stats]) => ({
                name,
                sales: stats.sales,
                rawRevenue: stats.revenue,
                revenue: `₹${stats.revenue.toLocaleString('en-IN')}`
            }))
            .sort((a, b) => b.rawRevenue - a.rawRevenue)
            .slice(0, 4)
            .map(({ name, sales, revenue }) => ({ name, sales, revenue }));

        res.json(result);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Backup Data (Full Export)
router.get('/backup', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let dateQuery = {};

        if (startDate && endDate) {
            dateQuery = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(new Date(endDate).setHours(23, 59, 59))
                }
            };
        } else {
            // Default to last 7 days if no range provided, or handle "all time" logic in frontend
            // Actually, for "backup", users might expect EVERYTHING if no date is given.
            // But the user said "1 week data", so we support range.
        }

        // If range is provided, filter transaction data. 
        // For Master data (Customers, Products), we usually export ALL or filter by added date.
        // Usually, backup implies ALL master data + filtered transaction data.

        const Customer = require('../models/Customer');
        const Product = require('../models/Product');
        const Expense = require('../models/Expense');

        const customers = await Customer.find({}); // Always backup all customers
        const products = await Product.find({});   // Always backup all products (current stock)

        // Filter transactions by date
        const bills = await Bill.find(dateQuery).sort({ createdAt: -1 });
        const expenses = await Expense.find(startDate && endDate ? {
            date: { $gte: startDate, $lte: endDate } // Expense uses string date YYYY-MM-DD usually
        } : {}).sort({ date: -1 });

        res.json({
            customers,
            inventory: products,
            bills,
            expenses,
            meta: {
                timestamp: new Date(),
                range: { startDate, endDate },
                counts: {
                    customers: customers.length,
                    inventory: products.length,
                    bills: bills.length,
                    expenses: expenses.length
                }
            }
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
