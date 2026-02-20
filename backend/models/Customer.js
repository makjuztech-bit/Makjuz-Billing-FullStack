const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    mobile: { type: String, required: true, unique: true },
    place: { type: String },
    type: { type: String, enum: ['Retail', 'Wholesale', 'VIP'], default: 'Retail' },
    // Derived fields could be calculated or updated, asking for simplicity I will leave them out of base schema 
    // and calculate them in aggregation if needed, or just store basic info.
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
