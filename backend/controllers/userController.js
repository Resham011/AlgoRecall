import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Problem from '../models/problemModel.js';
import generateToken from '../utils/generateToken.js';
import UserSettings from '../models/userSettingsModel.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with that email already exists');
  }
  const user = await User.create({ name, email, password });
  
  if (user) {
    await UserSettings.create({ user: user._id });

    const verificationToken = user.generateVerificationToken();
    await user.save({ validateBeforeSave: false });
    const verificationURL = `${process.env.FRONTEND_URL}/verifyemail/${verificationToken}`;
    
    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email - AlgoRecall',
        template: 'verification',
        templateData: {
          name: user.name,
          verificationUrl: verificationURL,
          expirationTime: '15 minutes'
        }
      });
      
      res.status(201).json({ 
        success: true, 
        message: 'Registration successful. Please check your email to verify your account.' 
      });
    } catch (error) {
      user.emailVerificationToken = undefined;
      user.emailVerificationExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.error('Email sending error:', error);
      res.status(500);
      throw new Error('Email could not be sent. Please try registering again later.');
    }
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Verify user email
const verifyEmail = asyncHandler(async (req, res) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      type: "invalid",
      message: "Token is invalid or has expired.",
      email: null
    });
  }

  // If already verified
  if (user.isVerified) {
    return res.status(200).json({
      success: true,
      type: "alreadyVerified",
      message: "Email is already verified. You can log in.",
      email: user.email
    });
  }

  // If token expired
  if (user.emailVerificationExpires < Date.now()) {
    return res.status(400).json({
      success: false,
      type: "expired",
      message: "Token is invalid or has expired.",
      email: user.email
    });
  }

  // First-time verification
  user.isVerified = true;
  await user.save();

  return res.status(200).json({
    success: true,
    type: "verified",
    message: "Email verified successfully! You can now log in.",
    email: user.email
  });
});

// @desc    Resend verification email
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  const user = await User.findOne({ email });
  
  if (!user) {
    res.status(404);
    throw new Error('User with that email does not exist');
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error('Email is already verified');
  }

  // Generate new verification token
  const verificationToken = user.generateVerificationToken();
  await user.save({ validateBeforeSave: false });
  
  const verificationURL = `${process.env.FRONTEND_URL}/verifyemail/${verificationToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Verify Your Email - AlgoRecall',
      template: 'verification',
      templateData: {
        name: user.name,
        verificationUrl: verificationURL,
        expirationTime: '15 minutes'
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Verification email sent successfully!' 
    });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    
    console.error('Email sending error:', error);
    res.status(500);
    throw new Error('Email could not be sent. Please try again later.');
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (!(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid password');
  }

  if (!user.isVerified) {
    res.status(401);
    throw new Error('Your account is not verified. Please check your email.');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token: generateToken(user._id),
  });
});

// @desc    Forgot password - send reset token
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    res.status(404);
    throw new Error('There is no user with that email address.');
  }
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  
  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset Your Password - AlgoRecall',
      template: 'reset',
      templateData: {
        name: user.name,
        resetUrl: resetURL,
        expirationTime: '10 minutes'
      }
    });
    
    res.status(200).json({ 
      success: true, 
      message: 'Password reset instructions sent to your email!' 
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error(err);
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// @desc    Reset password using token
const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });
  if (!user) {
    res.status(400);
    throw new Error('Token is invalid or has expired');
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.status(200).json({ success: true, message: 'Password reset successful!', token: generateToken(user._id) });
});

// @desc    Get user profile
const getUserProfile = asyncHandler(async (req, res) => {
  res.json({ _id: req.user._id, name: req.user.name, email: req.user.email });
});

// @desc    Change user password (when logged in)
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user || !(await user.matchPassword(currentPassword))) {
        res.status(401);
        throw new Error('Incorrect current password');
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
});

// @desc    Delete user account and all their data
const deleteUserAccount = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    await Problem.deleteMany({ user: userId });
    await User.findByIdAndDelete(userId);
    res.json({ success: true, message: 'Account and all associated data have been deleted.' });
});

// @desc    Update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
     const user = await User.findById(req.user._id);

     if (user) {
     user.name = req.body.name || user.name;
     user.email = req.body.email || user.email;

     const updatedUser = await user.save();

     res.json({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          token: generateToken(updatedUser._id),
     });
     } else {
     res.status(404);
     throw new Error('User not found');
     }
});

export { 
     registerUser, 
     verifyEmail, 
     resendVerification, 
     updateUserProfile, 
     loginUser, 
     forgotPassword, 
     resetPassword, 
     getUserProfile, 
     changePassword, 
     deleteUserAccount 
};