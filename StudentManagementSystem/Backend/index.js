const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const dbConnect  = require('./config/dbConnect');

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const txnRoutes = require('./routes/transaction');
const maintenanceRoutes = require('./routes/maintenance');
const reportRoutes =  require('./routes/report');



const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/transactions', txnRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/reports', reportRoutes);;


const PORT = process.env.PORT || 5000;


app.listen(PORT, () => console.log('Server running on ' + PORT));
dbConnect();