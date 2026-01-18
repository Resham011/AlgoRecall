import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../features/auth/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-hot-toast';
import { Lock, Eye, EyeOff, RefreshCw } from 'lucide-react';

const ResetPasswordPage = () => {
     const [formData, setFormData] = useState({ password: '', password2: '' });
     const [showPassword, setShowPassword] = useState(false);
     const [showPassword2, setShowPassword2] = useState(false);
     const [isTokenExpired, setIsTokenExpired] = useState(false);
     const [resendLoading, setResendLoading] = useState(false);
     const [email, setEmail] = useState('');
     
     const { password, password2 } = formData;
     const passwordMismatch = password && password2 && password !== password2;

     const { token } = useParams();
     const navigate = useNavigate();
     const dispatch = useDispatch();

     const onChange = (e) => {
          setFormData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
     };

     const onEmailChange = (e) => {
          setEmail(e.target.value);
     };

     const onSubmit = (e) => {
          e.preventDefault();
          if (passwordMismatch) {
               toast.error('Passwords do not match');
          } else {
               dispatch(resetPassword({ token, password }))
                    .unwrap()
                    .then(() => {
                         toast.success('Password reset successfully! You can now log in.');
                         navigate('/login');
                    })
                    .catch((err) => {
                         if (err.includes('expired') || err.includes('invalid')) {
                         setIsTokenExpired(true);
                         toast.error('Password reset link has expired');
                         } else {
                         toast.error(err || 'Failed to reset password.');
                         }
                    });
          }
     };

     const handleResendResetLink = () => {
          if (!email) {
               toast.error('Please enter your email address');
               return;
          }
          
          setResendLoading(true);
          dispatch(forgotPassword(email))
               .unwrap()
               .then(() => {
                    toast.success('Password reset link sent to your email!');
                    setResendLoading(false);
               })
               .catch((err) => {
                    toast.error(err || 'Failed to send reset link.');
                    setResendLoading(false);
               });
     };

     return (
          <div className="min-h-[80vh] flex items-center justify-center p-4">
               <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    {isTokenExpired ? (
                         <div className="text-center">
                         <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                              Link Expired
                         </h1>
                         <p className="text-gray-600 dark:text-gray-300 mb-6">
                              Your password reset link has expired. Please enter your email to receive a new one.
                         </p>
                         <div className="space-y-4">
                              <Input
                                   type="email"
                                   id="email"
                                   name="email"
                                   value={email}
                                   placeholder="Enter your email"
                                   onChange={onEmailChange}
                                   required
                                   className="w-full"
                              />
                              <Button
                                   onClick={handleResendResetLink}
                                   variant="primary"
                                   className="w-full !py-3"
                                   disabled={resendLoading}
                              >
                                   {resendLoading ? (
                                        <RefreshCw className="w-5 h-5 animate-spin mx-auto" />
                                   ) : (
                                        'Send Reset Link'
                                   )}
                              </Button>
                         </div>
                         </div>
                    ) : (
                         <>
                         <div className="text-center mb-8">
                              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                                   Reset Your Password
                              </h1>
                         </div>
                         <form onSubmit={onSubmit} className="space-y-4">
                              <div className="relative">
                                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                   <Input type={showPassword ? 'text' : 'password'} id="password" name="password" value={password} placeholder="New Password" onChange={onChange} required autoComplete="new-password" className="pl-10" />
                                   <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                   </button>
                              </div>
                              <div className="relative">
                                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                   <Input type={showPassword2 ? 'text' : 'password'} id="password2" name="password2" value={password2} placeholder="Confirm New Password" onChange={onChange} required autoComplete="new-password" className={`pl-10 ${passwordMismatch ? 'border-red-500 focus:ring-red-500' : ''}`} />
                                   <button type="button" onClick={() => setShowPassword2(!showPassword2)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                        {showPassword2 ? <EyeOff size={20} /> : <Eye size={20} />}
                                   </button>
                              </div>
                              {passwordMismatch && <p className="text-red-500 text-xs mt-1">Passwords do not match.</p>}
                              <Button type="submit" variant="primary" className="w-full !py-3 mt-6">
                                   Reset Password
                              </Button>
                         </form>
                         </>
                    )}
               </div>
          </div>
     );
};

export default ResetPasswordPage;