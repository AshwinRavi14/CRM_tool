const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { success } = require('../utils/apiResponse');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const crypto = require('crypto');
const sendEmail = require('../utils/email');

/**
 * Generate Access Token
 */
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m'
    });
};

/**
 * Generate Refresh Token
 */
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });
};

/**
 * Send token in response and cookie
 */
const sendTokenResponse = async (user, statusCode, res, message) => {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
    };

    res.status(statusCode)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(success({
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            },
            accessToken
        }, message));
};

/**
 * Register user
 */
const register = asyncHandler(async (req, res, next) => {
    const { firstName, lastName, email, password, role, manager } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new AppError('User already exists', 400));
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        role,
        isVerified: true // Auto-verify for easy initial setup/demo
    });

    res.status(201).json(success(null, 'User registered successfully. You can now log in.'));
});

/**
 * Login user
 */
const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide an email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new AppError('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new AppError('Invalid credentials', 401));
    }

    await sendTokenResponse(user, 200, res, 'Login successful');
});

/**
 * Refresh Token
 */
const refresh = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(new AppError('No refresh token provided', 401));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('+refreshToken');

        if (!user || user.refreshToken !== refreshToken) {
            return next(new AppError('Invalid refresh token', 401));
        }

        // Generate new tokens
        await sendTokenResponse(user, 200, res, 'Token refreshed');
    } catch (err) {
        return next(new AppError('Invalid refresh token', 401));
    }
});

/**
 * Logout
 */
const logout = asyncHandler(async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const user = await User.findOne({ refreshToken });
        if (user) {
            user.refreshToken = undefined;
            await user.save({ validateBeforeSave: false });
        }
    }

    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    });

    res.status(200).json(success(null, 'Logged out successfully'));
});

/**
 * Get current logged in user
 */
const getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json(success(user));
});

/**
 * Verify Email
 */
const verifyEmail = asyncHandler(async (req, res, next) => {
    const verificationToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        verificationToken,
        isVerified: false
    });

    if (!user) {
        return next(new AppError('Invalid or expired token', 400));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    await sendTokenResponse(user, 200, res, 'Email verified successfully');
});

/**
 * Resend Verification Email
 */
const resendVerification = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    if (user.isVerified) {
        return next(new AppError('Email already verified', 400));
    }

    const verificationToken = user.getVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/verify-email/${verificationToken}`;
    const message = `Please verify your email via this link:\n\n${verifyUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Wersel CRM - Verify your email',
            message
        });

        res.status(200).json(success(null, 'Verification email sent'));
    } catch (err) {
        user.verificationToken = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Email could not be sent', 500));
    }
});

/**
 * Forgot Password
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('User not found', 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:\n\n${resetUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Wersel CRM - Password Reset Token',
            message
        });

        res.status(200).json(success(null, 'Email sent'));
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError('Email could not be sent', 500));
    }
});

/**
 * Reset Password
 */
const resetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new AppError('Invalid token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    await sendTokenResponse(user, 200, res, 'Password reset successful');
});

/**
 * Update User Details
 */
const updateDetails = asyncHandler(async (req, res, next) => {
    const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json(success(user));
});

/**
 * Update Password
 */
const updatePassword = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (!(await user.matchPassword(req.body.currentPassword))) {
        return next(new AppError('Incorrect current password', 401));
    }

    user.password = req.body.newPassword;
    await user.save();

    await sendTokenResponse(user, 200, res, 'Password updated successfully');
});

module.exports = {
    register,
    login,
    refresh,
    logout,
    getMe,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
    updateDetails,
    updatePassword
};
