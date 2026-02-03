const crypto = require('crypto');
const Invitation = require('../models/Invitation');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');
const AppError = require('../utils/AppError');
const { success } = require('../utils/apiResponse');
const sendEmail = require('../utils/email');

/**
 * @desc    Invite a new user
 * @route   POST /api/v1/invitations
 * @access  Private/Admin
 */
exports.inviteUser = asyncHandler(async (req, res, next) => {
    const { email, role } = req.body;

    if (!email || !role) {
        return next(new AppError('Please provide email and role', 400));
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        return next(new AppError('User with this email already exists', 400));
    }

    // Check if a pending invitation already exists
    const pendingInvite = await Invitation.findOne({ email, status: 'PENDING' });
    if (pendingInvite) {
        // Check if expired
        if (pendingInvite.expiresAt > Date.now()) {
            return next(new AppError('A pending invitation already exists for this email', 400));
        } else {
            // Update expired one
            await Invitation.findByIdAndDelete(pendingInvite._id);
        }
    }

    // Generate raw token
    const inviteToken = crypto.randomBytes(32).toString('hex');

    // Hash token for DB storage
    const hashedToken = crypto
        .createHash('sha256')
        .update(inviteToken)
        .digest('hex');

    // Create invitation in DB
    const invitation = await Invitation.create({
        email,
        role,
        token: hashedToken,
        invitedBy: req.user.id,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000) // 48 hours
    });

    // Send Email
    const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/onboarding/${inviteToken}`;
    const message = `You have been invited to join Wersel CRM team as a ${role.replace('_', ' ')}.\n\nPlease click on the link below to complete your registration:\n\n${inviteUrl}\n\nThis link will expire in 48 hours.`;

    try {
        await sendEmail({
            email: invitation.email,
            subject: 'Wersel CRM - Team Invitation',
            message
        });

        res.status(201).json(success(null, `Invitation sent to ${email}`));
    } catch (err) {
        await Invitation.findByIdAndDelete(invitation._id);
        return next(new AppError('Invitation email could not be sent', 500));
    }
});

/**
 * @desc    Get invitation details for onboarding
 * @route   GET /api/v1/invitations/:token
 * @access  Public
 */
exports.getInvitation = asyncHandler(async (req, res, next) => {
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const invitation = await Invitation.findOne({
        token: hashedToken
    });

    if (!invitation) {
        return next(new AppError('Invalid invitation link', 400));
    }

    if (invitation.status === 'ACCEPTED') {
        return next(new AppError('This invitation has already been used. Please log in.', 400));
    }

    if (invitation.expiresAt < Date.now()) {
        return next(new AppError('This invitation link has expired. Please contact your administrator for a new one.', 400));
    }

    res.status(200).json(success({
        email: invitation.email,
        role: invitation.role
    }));
});

/**
 * @desc    Accept invitation and create user
 * @route   POST /api/v1/invitations/accept
 * @access  Public
 */
exports.acceptInvitation = asyncHandler(async (req, res, next) => {
    const { token, firstName, lastName, password } = req.body;

    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    const invitation = await Invitation.findOne({
        token: hashedToken,
        status: 'PENDING',
        expiresAt: { $gt: Date.now() }
    });

    if (!invitation) {
        return next(new AppError('Invalid or expired invitation token', 400));
    }

    // Create User
    const user = await User.create({
        firstName,
        lastName,
        email: invitation.email,
        password,
        role: invitation.role,
        isVerified: true
    });

    // Mark invitation as accepted
    invitation.status = 'ACCEPTED';
    await invitation.save();

    res.status(201).json(success(null, 'Account created successfully. You can now log in.'));
});

/**
 * @desc    Get all invitations
 * @route   GET /api/v1/invitations
 * @access  Private/Admin
 */
exports.getInvitations = asyncHandler(async (req, res, next) => {
    const invitations = await Invitation.find().populate('invitedBy', 'firstName lastName');
    res.status(200).json(success(invitations));
});

/**
 * @desc    Delete/Revoke invitation
 * @route   DELETE /api/v1/invitations/:id
 * @access  Private/Admin
 */
exports.deleteInvitation = asyncHandler(async (req, res, next) => {
    const invitation = await Invitation.findByIdAndDelete(req.params.id);
    if (!invitation) {
        return next(new AppError('Invitation not found', 404));
    }
    res.status(200).json(success(null, 'Invitation revoked successfully'));
});
