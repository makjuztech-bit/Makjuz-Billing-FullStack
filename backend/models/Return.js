const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
    originalBillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill', required: true },
    originalBillNumber: { type: String, required: true },
    customerName: { type: String },
    customerMobile: { type: String },
    items: [{
        barcode: { type: String, required: true },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true }, // Original selling price
        refundAmount: { type: Number, required: true },
        condition: { type: String, enum: ['good', 'damaged', 'altered'], default: 'good' }
    }],
    totalRefundAmount: { type: Number, required: true },
    refundMethod: { type: String, enum: ['cash', 'upi', 'store_credit'], required: true },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ['completed', 'cancelled'], default: 'completed' },
    processedBy: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Return', returnSchema);
