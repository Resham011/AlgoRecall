import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import  {forgotPassword}  from '../features/auth/authSlice';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ForgotPasswordPage = () => {
     const [email, setEmail] = useState('');
     const dispatch = useDispatch();

     const onSubmit = (e) => {
          e.preventDefault();
          dispatch(forgotPassword(email));
          toast.success('If an account with that email exists, a password reset link has been sent.');
          setEmail('');
     };

     return (
          <div className="min-h-[80vh] flex items-center justify-center p-4">
               <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
                    <div className="text-center mb-8">
                         <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                         Forgot Password
                         </h1>
                         <p className="text-gray-500 dark:text-gray-400 mt-2">
                         Enter your email and we'll send you a link to reset your password.
                         </p>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-6">
                         <div className="relative">
                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                         <Input
                              type="email"
                              id="email"
                              name="email"
                              value={email}
                              placeholder="Email Address"
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              autoComplete="email"
                              className="pl-10"
                         />
                         </div>
                         <Button type="submit" variant="primary" className="w-full !py-3">
                         Send Reset Link
                         </Button>
                    </form>
                    <p className="text-center mt-6 text-sm text-gray-600 dark:text-gray-400">
                         Remember your password?{' '}
                         <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                         Login
                         </Link>
                    </p>
               </div>
          </div>
     );
};

export default ForgotPasswordPage;
