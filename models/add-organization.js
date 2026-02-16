const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },
    api_token: { 
        type: String, 
        required: true 
    },
    organization_id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive'], 
        default: 'active' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);