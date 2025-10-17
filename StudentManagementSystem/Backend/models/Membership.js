const mongoose = require('mongoose');


const membershipSchema = new mongoose.Schema({
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
startDate: { type: Date, required: true },
endDate: { type: Date, required: true },
active: { type: Boolean, default: true }
});


module.exports = mongoose.model('Membership', membershipSchema);