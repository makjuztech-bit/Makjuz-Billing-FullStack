const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
    shopName: { type: String, default: 'Durgas Jewelry' },
    phone: { type: String, default: '9876543210' },
    address1: { type: String, default: '123, Jewel Street' },
    address2: { type: String, default: 'Chennai - 600001' },
    gstin: { type: String, default: '' },
    enableGst: { type: Boolean, default: true },
    tamilDescription: { type: Boolean, default: true },
    defaultPrinter: { type: String, default: 'Thermal 80mm' },
    billPrefix: { type: String, default: 'DURGAS-' },
    autoBackup: { type: Boolean, default: true },
    primaryColor: { type: String, default: '#7c2d12' },
    backgroundPattern: { type: String, default: 'jewels' },
    visibleWidgets: {
        todaySales: { type: Boolean, default: true },
        pendingDues: { type: Boolean, default: true },
        fastMoving: { type: Boolean, default: true },
        lowStock: { type: Boolean, default: true }
    },
    footerMessage: { type: String, default: 'Thank you! Visit Again.' },
    termsConditions: { type: String, default: 'Goods once sold cannot be returned. Exchange within 7 days.' }
}, { timestamps: true });

settingsSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id; }
});

module.exports = mongoose.model('Settings', settingsSchema);
