const mongoose = require('mongoose');

const alterationSchema = new mongoose.Schema({
    customer: { type: String, required: true },
    mobile: { type: String },
    items: { type: String, required: true },
    services: [{ type: String }],
    status: { type: String, enum: ['Pending', 'In Progress', 'Ready', 'Delivered'], default: 'Pending' },
    deliveryDate: { type: String },
    amount: { type: Number, default: 0 }
}, { timestamps: true });

alterationSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Alteration', alterationSchema);
