const mongoose = require('mongoose');

const billItemSchema = new mongoose.Schema({
    sareeId: { type: String },
    barcode: { type: String, required: true },
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    returnedQty: { type: Number, default: 0 },
    sellingPrice: { type: Number, required: true },
    mrp: { type: Number },
    total: { type: Number }
});

const billSchema = new mongoose.Schema({
    billNo: { type: String, unique: true },
    customerName: { type: String },
    customerMobile: { type: String },
    customerPlace: { type: String },
    customerType: { type: String, default: 'retail' },
    customerGst: { type: String },
    items: [billItemSchema],
    subtotal: { type: Number, required: true },
    discountPercent: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    gstAmount: { type: Number, default: 0 },
    roundOff: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, enum: ['Paid', 'Hold', 'Due', 'Cancelled'], default: 'Paid' },
    dueAmount: { type: Number, default: 0 },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

billSchema.pre('save', async function (next) {
    if (!this.billNo) {
        const count = await mongoose.model('Bill').countDocuments();
        this.billNo = `INV-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;
    }
    next();
});

billSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Bill', billSchema);
