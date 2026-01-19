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
    owner_email: { 
        type: String, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['active', 'suspended'], 
        default: 'active' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Organization', OrganizationSchema);