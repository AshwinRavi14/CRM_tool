const Joi = require('joi');

const registerSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ADMIN', 'SALES_MANAGER', 'SALES_REP', 'ACCOUNT_MANAGER', 'PROJECT_MANAGER', 'SUPPORT_STAFF'),
    manager: Joi.string().hex().length(24) // Optional manager ID
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

const createLeadSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    company: Joi.string(),
    source: Joi.string().valid('WEBSITE', 'REFERRAL', 'LINKEDIN', 'CONFERENCE', 'COLD_CALL', 'EMAIL', 'OTHER').required(),
    interestAreas: Joi.array().items(Joi.string())
});

module.exports = {
    registerSchema,
    loginSchema,
    createLeadSchema
};
