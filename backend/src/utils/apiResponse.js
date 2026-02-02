/**
 * Standardized API Response Helper
 */

const success = (data, message = 'Success', statusCode = 200) => {
    return {
        success: true,
        message,
        data,
        timestamp: new Date().toISOString()
    };
};

const error = (message = 'Error', statusCode = 500, errors = null) => {
    return {
        success: false,
        message,
        errors,
        timestamp: new Date().toISOString()
    };
};

module.exports = {
    success,
    error
};
