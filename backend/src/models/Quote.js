const mongoose = require('mongoose');

const quoteItemSchema = new mongoose.Schema({
    product: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: String,
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 0
    },
    discount: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    total: {
        type: Number,
        default: 0
    }
});

const quoteSchema = new mongoose.Schema({
    quoteNumber: {
        type: String,
        unique: true,
        required: true
    },
    lead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lead'
    },
    opportunity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Opportunity'
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    contactName: {
        type: String,
        trim: true
    },
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true
    },
    companyName: String,
    items: [quoteItemSchema],
    subtotal: {
        type: Number,
        default: 0
    },
    taxRate: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    taxAmount: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        default: 0
    },
    validUntil: {
        type: Date,
        default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days
    },
    status: {
        type: String,
        enum: ['DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'],
        default: 'DRAFT'
    },
    notes: String,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

// Auto-calculate totals before save
quoteSchema.pre('save', function () {
    this.items.forEach(item => {
        item.total = item.quantity * item.unitPrice * (1 - item.discount / 100);
    });
    this.subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
    this.taxAmount = this.subtotal * (this.taxRate / 100);
    this.totalAmount = this.subtotal + this.taxAmount;
});

module.exports = mongoose.model('Quote', quoteSchema);
