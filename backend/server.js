const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB connection error:', err));

// Routes
const productRoutes = require('./routes/productRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const adjustmentRoutes = require('./routes/adjustmentRoutes');
const purchaseRoutes = require('./routes/purchaseRoutes');
const alterationRoutes = require('./routes/alterationRoutes');
const orderRoutes = require('./routes/orderRoutes');
const staffRoutes = require('./routes/staffRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const billRoutes = require('./routes/billRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const reportRoutes = require('./routes/reportRoutes');
const customerRoutes = require('./routes/customerRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api/sarees', productRoutes); // Legacy support
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/adjustments', adjustmentRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/alterations', alterationRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/bills', billRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/returns', require('./routes/returnRoutes'));
app.use('/api/auth', authRoutes);
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/migration', require('./routes/migrationRoutes'));

app.get('/', (req, res) => {
    res.send('vv collection API is running');
});

// Create uploads directory if using local storage temporarily, but we use Cloudinary
// fs.existsSync('./uploads') || fs.mkdirSync('./uploads');

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
