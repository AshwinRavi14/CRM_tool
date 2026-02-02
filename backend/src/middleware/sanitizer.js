const sanitizeHtml = require('sanitize-html');

const sanitizeValue = (val) => {
    if (typeof val !== 'string') return val;
    return sanitizeHtml(val, {
        allowedTags: [], // Strip all tags
        allowedAttributes: {}
    });
};

const sanitizeObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;

    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'string') {
            obj[key] = sanitizeValue(obj[key]);
        } else if (typeof obj[key] === 'object') {
            sanitizeObject(obj[key]);
        }
    });
    return obj;
};

const sanitize = (req, res, next) => {
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }
    next();
};

module.exports = sanitize;
