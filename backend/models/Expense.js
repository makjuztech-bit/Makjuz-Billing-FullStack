const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ['Rent', 'Salary', 'Electricity', 'Transport', 'Packaging', 'Tea/Coffee', 'Marketing', 'Others']
    },
    amount: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
