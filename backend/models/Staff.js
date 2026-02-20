const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    name: { type: String, required: true },
    role: { type: String, required: true },
    commissionType: { type: String, enum: ['Percentage', 'Fixed'], default: 'Percentage' },
    commissionValue: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    salesThisMonth: { type: Number, default: 0 }
}, { timestamps: true });

staffSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Staff', staffSchema);
