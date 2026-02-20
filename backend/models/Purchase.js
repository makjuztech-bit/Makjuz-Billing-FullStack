const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
    barcode: { type: String, required: true },
    name: { type: String, required: true },
    category: { type: String },
    qty: { type: Number, required: true },
    costPrice: { type: Number, required: true },
    mrp: { type: Number },
    sellingPrice: { type: Number },
    totalCost: { type: Number, required: true },
    returnedQty: { type: Number, default: 0 }
});

const purchaseSchema = new mongoose.Schema({
    billNo: { type: String, required: true },
    date: { type: String, required: true },
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier' },
    supplierName: { type: String, required: true },
    items: [purchaseItemSchema],
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    paymentStatus: { type: String, enum: ['Paid', 'Partial', 'Credit'], default: 'Credit' },
    paymentHistory: [{
        date: { type: String },
        amount: { type: Number },
        method: { type: String }
    }],
    status: { type: String, enum: ['completed', 'pending'], default: 'completed' },
    purchaseType: { type: String, enum: ['gst', 'nongst'], default: 'gst' }
}, { timestamps: true });

purchaseSchema.virtual('dueAmount').get(function () {
    return this.totalAmount - this.paidAmount;
});

purchaseSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Purchase', purchaseSchema);
