const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dbConnect  = require('./config/dbConnect');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const txnRoutes = require('./routes/transaction');
const maintenanceRoutes = require('./routes/maintenance');
const reportRoutes = require('./routes/report');
//const reportRoutes =  require('./routes/report');




const app = express();

app.use(cors({
    origin: 'http://localhost:5173', // <--- Change this to your React app's port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transaction', txnRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/report', reportRoutes);
//app.use('/api/reports', reportRoutes);





const PORT = process.env.PORT || 3000;


app.listen(PORT, () => console.log('Server running on ' + PORT));
dbConnect();