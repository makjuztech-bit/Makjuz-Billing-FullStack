const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productCode: { type: String, required: true, unique: true },
    barcode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    nameTamil: { type: String },
    category: { type: String, required: true },
    department: { type: String, enum: ['Saree', 'Mens', 'Kids', 'Womens', 'Other'], default: 'Saree' }, // Department/Type
    brand: { type: String },
    material: { type: String },
    color: { type: String },

    // Saree Specific (Optional)
    zariType: { type: String },
    borderType: { type: String },
    designType: { type: String },
    length: { type: String },
    weight: { type: String },
    blouseIncluded: { type: Boolean, default: true },
    blousePiece: { type: String },

    // Generic Pricing
    purchasePrice: { type: Number, required: true },
    sellingPrice: { type: Number, required: true },
    mrp: { type: Number, required: true },
    gstPercent: { type: Number, default: 5 },

    // Stock
    stockType: { type: String, enum: ['unique', 'bulk'], default: 'unique' },
    stockQty: { type: Number, default: 1 },
    rackLocation: { type: String },
    supplier: { type: String },

    images: [{ type: String }],
    description: { type: String },
    status: { type: String, enum: ['available', 'sold', 'reserved', 'damaged'], default: 'available' },
    addedDate: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

// Normalize id and handle backward compatibility
productSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        // Backward compatibility for frontend expecting sareeCode
        if (ret.productCode && !ret.sareeCode) {
            ret.sareeCode = ret.productCode;
        }
    }
});

module.exports = mongoose.model('Product', productSchema, 'sarees');
