const express = require('express');
const {
    register,
    login,
    getMe,
    refresh,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const { registerSchema, loginSchema } = require('../validators/crmValidator');
const validate = require('../middleware/validate');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 */
router.post('/register', validate(registerSchema), register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 */
router.post('/logout', logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 */
router.post('/refresh', refresh);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /auth/details:
 *   put:
 *     summary: Update user details
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.put('/details', protect, updateDetails);

/**
 * @swagger
 * /auth/password:
 *   put:
 *     summary: Update password
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
router.put('/password', protect, updatePassword);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     tags: [Auth]
 */
router.post('/forgot-password', forgotPassword);

/**
 * @swagger
 * /auth/reset-password/{token}:
 *   put:
 *     summary: Reset password
 *     tags: [Auth]
 */
router.put('/reset-password/:token', resetPassword);

/**
 * @swagger
 * /auth/verify-email/{token}:
 *   get:
 *     summary: Verify email
 *     tags: [Auth]
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Auth]
 */
router.post('/resend-verification', resendVerification);

module.exports = router;
