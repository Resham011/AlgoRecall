import express from 'express';
const router = express.Router();
import {
  registerUser,
  verifyEmail,
  resendVerification,
  loginUser,
  forgotPassword,
  resetPassword,
  getUserProfile,
  updateUserProfile,
  changePassword, 
  deleteUserAccount, 
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/verifyemail/:token', verifyEmail);
router.post('/resend-verification', resendVerification);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

// --- Private Routes (require a valid token) ---
router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/changepassword', protect, changePassword); 
router.delete('/delete', protect, deleteUserAccount); 

export default router;
