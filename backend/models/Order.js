const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerMobile: { type: String, required: true },
    description: { type: String },
    deliveryDate: { type: String },
    totalEstimated: { type: Number },
    advancePaid: { type: Number, default: 0 },
    status: { type: String, enum: ['Booked', 'Ready', 'Delivered', 'Cancelled'], default: 'Booked' },
    orderDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

orderSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Order', orderSchema);
