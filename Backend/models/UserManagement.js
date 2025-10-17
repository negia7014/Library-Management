const mongoose = require('mongoose');


const userManagementSchema = new mongoose.Schema({
    name: { type: String, required: true },
     statusActive: { type: Boolean, default: true }, // Corresponds to 'Checkbox - Active'
    isAdmin: { type: Boolean, default: false }, 
    
});



const UserManagement = mongoose.model('UserManagement', userManagementSchema);
module.exports = UserManagement;