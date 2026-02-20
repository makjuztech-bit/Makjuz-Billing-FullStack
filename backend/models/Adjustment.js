const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
    barcode: { type: String, required: true },
    name: { type: String, required: true },
    currentStock: { type: Number },
    adjustQty: { type: Number, required: true },
    reason: { type: String },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
}, { timestamps: true });

adjustmentSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Adjustment', adjustmentSchema);
