/**
 * Middleware to validate request body using Joi schema
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorDetails = error.details.map(d => d.message);
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errorDetails
        });
    }

    next();
};

module.exports = validate;
