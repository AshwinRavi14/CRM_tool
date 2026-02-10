const Company = require('../models/Company');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');

// @desc    Save billing information
// @route   POST /api/billing
// @access  Private (Admin/Founder)
exports.saveBillingInfo = asyncHandler(async (req, res, next) => {
    const { cardDetails, plan } = req.body;

    // In a real app, you'd integrate with Stripe/Square here
    // For this demo, we'll just save the non-sensitive info

    const company = await Company.findById(req.user.company);

    if (!company) {
        return next(new AppError('No company found for this user', 404));
    }

    company.billingDetails = {
        last4: cardDetails.cardNumber.slice(-4),
        cardBrand: 'Visa', // Mock brand
        expiryMonth: parseInt(cardDetails.expiryDate.split('/')[0]),
        expiryYear: parseInt(cardDetails.expiryDate.split('/')[1]),
        billingEmail: req.user.email,
        country: cardDetails.billingCountry
    };

    if (plan) {
        company.subscriptionPlan = plan;
        company.subscriptionStatus = 'ACTIVE';
        company.status = 'ACTIVE';
    }

    await company.save();

    res.status(200).json({
        status: 'success',
        data: {
            billingDetails: company.billingDetails,
            subscriptionPlan: company.subscriptionPlan,
            subscriptionStatus: company.subscriptionStatus
        }
    });
});

// @desc    Get billing information
// @route   GET /api/billing
// @access  Private
exports.getBillingInfo = asyncHandler(async (req, res, next) => {
    const company = await Company.findById(req.user.company);

    if (!company) {
        return next(new AppError('No company found', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            billingDetails: company.billingDetails,
            subscriptionPlan: company.subscriptionPlan,
            subscriptionStatus: company.subscriptionStatus,
            trialEndsAt: company.trialEndsAt
        }
    });
});
