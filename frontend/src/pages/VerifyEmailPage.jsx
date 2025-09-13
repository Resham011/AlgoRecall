import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/common/Spinner.jsx";
import Button from "../components/common/Button.jsx";
import { CheckCircle, XCircle, Info, Mail, Clock, AlertCircle } from "lucide-react";

const VerifyEmailPage = () => {
     const { token } = useParams();
     const navigate = useNavigate();
     const [status, setStatus] = useState("verifying");
     const [message, setMessage] = useState("");
     const [email, setEmail] = useState("");
     const [cooldown, setCooldown] = useState(0);
     const [detailedMessage, setDetailedMessage] = useState("");
     const [isResending, setIsResending] = useState(false);
     const calledRef = useRef(false);
     const cooldownRef = useRef(null);

     // Clear interval on unmount
     useEffect(() => {
     return () => {
          if (cooldownRef.current) {
          clearInterval(cooldownRef.current);
          }
     };
     }, []);

     // Start cooldown timer (60 seconds)
     const startCooldown = (seconds = 60) => {
     setCooldown(seconds);
     
     if (cooldownRef.current) {
          clearInterval(cooldownRef.current);
     }
     
     cooldownRef.current = setInterval(() => {
          setCooldown(prev => {
          if (prev <= 1) {
               clearInterval(cooldownRef.current);
               return 0;
          }
          return prev - 1;
          });
     }, 1000);
     };

     // Check if we have email in localStorage on component mount
     useEffect(() => {
     const storedEmail = localStorage.getItem('verificationEmail');
     if (storedEmail) {
          setEmail(storedEmail);
     }
     }, []);

     // Verify email with token
     useEffect(() => {
     const verify = async () => {
          if (calledRef.current) return;
          calledRef.current = true;

          try {
          const { data } = await axios.get(`/api/users/verifyemail/${token}`);

          if (data.type === "verified") {
               setStatus("success");
               setMessage("Email verified successfully!");
               setDetailedMessage("Your email has been verified. You can now log in to your account.");
               if (data.email) {
               setEmail(data.email);
               localStorage.removeItem('verificationEmail');
               }
          } else if (data.type === "alreadyVerified") {
               setStatus("alreadyVerified");
               setMessage("Email already verified");
               setDetailedMessage("Your email was already verified. You can proceed to login.");
               if (data.email) {
               setEmail(data.email);
               localStorage.removeItem('verificationEmail');
               }
          } else {
               setStatus("error");
               setMessage("Verification failed");
               setDetailedMessage(data.message || "The verification link is invalid or has expired.");
               if (data.email) {
               setEmail(data.email);
               localStorage.setItem('verificationEmail', data.email);
               }
          }
          } catch (error) {
          const errorData = error.response?.data || {};
          const errorMessage = errorData.message || "Verification failed.";
          const errorEmail = errorData.email;
          const errorType = errorData.type;
          
          setStatus("error");
          setMessage("Verification failed");
          
          // Set appropriate message based on error type
          if (errorType === "expired" || errorMessage.toLowerCase().includes("expired")) {
               setDetailedMessage("This verification link has expired. Please request a new one.");
          } else {
               setDetailedMessage(errorMessage);
          }
          
          if (errorEmail) {
               setEmail(errorEmail);
               localStorage.setItem('verificationEmail', errorEmail);
          }
          
          // Start cooldown if error response indicates rate limiting
          if (error.response?.status === 429) {
               const retryAfter = error.response.headers['retry-after'] || 60;
               startCooldown(parseInt(retryAfter));
          }
          }
     };

     if (token) verify();
     else {
          // If no token, check if we have email for resend
          const storedEmail = localStorage.getItem('verificationEmail');
          if (storedEmail) {
          setEmail(storedEmail);
          setStatus("error");
          setMessage("Verification required");
          setDetailedMessage("Please check your email for the verification link or request a new one.");
          } else {
          navigate('/register');
          }
     }
     }, [token, navigate]);

     // Handle resend verification
     const handleResendVerification = async () => {
     if (!email || cooldown > 0 || isResending) return;
     
     setIsResending(true);
     try {
          const response = await axios.post('/api/users/resend-verification', { email });
          setDetailedMessage(response.data.message || "A new verification email has been sent to your inbox.");
          
          // Start cooldown timer after successful resend
          startCooldown(60);
          
          // Show success message temporarily
          setStatus("resendSuccess");
          setTimeout(() => {
          setStatus("error");
          }, 3000);
          
     } catch (error) {
          const errorMessage = error.response?.data?.message || "Failed to resend verification email. Please try again.";
          setDetailedMessage(errorMessage);
          
          // Start cooldown if error response indicates rate limiting
          if (error.response?.status === 429) {
          const retryAfter = error.response.headers['retry-after'] || 60;
          startCooldown(parseInt(retryAfter));
          }
     } finally {
          setIsResending(false);
     }
     };

     // Show fullscreen spinner during verification
     if (status === "verifying") {
     return (
          <div className="flex items-center justify-center p-4 w-full h-full">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mx-auto my-auto">
               <div className="text-center">
               <Spinner size="lg" />
               <p className="mt-4 text-md font-medium text-gray-900 dark:text-white">Verifying your email</p>
               <p className="mt-1 text-gray-600 dark:text-gray-400 text-sm">This may take a moment...</p>
               </div>
          </div>
          </div>
     );
     }

     return (
     <div className="flex items-center justify-center p-4 w-full h-full">
          <div className="relative w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mx-auto my-auto">
          
          {/* Spinner overlay for resend operation */}
          {isResending && (
               <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl">
               <Spinner size="lg" />
               </div>
          )}
          
          {/* Success State */}
          {status === "success" && (
               <div className="text-center">
               <div className="mb-4">
               <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
               </div>
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
               {message}
               </h1>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{detailedMessage}</p>
               <Link to="/login" className="block">
               <Button variant="primary" className="w-full !py-2">Proceed to Login</Button>
               </Link>
               </div>
          )}

          {/* Already Verified State */}
          {status === "alreadyVerified" && (
               <div className="text-center">
               <div className="mb-4">
               <Info className="h-12 w-12 text-blue-500 mx-auto" />
               </div>
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">{message}</h1>
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{detailedMessage}</p>
               <Link to="/login" className="block">
               <Button variant="primary" className="w-full !py-2">Go to Login</Button>
               </Link>
               </div>
          )}

          {/* Error and Resend Success States */}
          {(status === "error" || status === "resendSuccess") && (
               <div className="text-center">
               {status === "error" ? (
               <div className="mb-4">
                    <XCircle className="h-12 w-12 text-red-500 mx-auto" />
               </div>
               ) : (
               <div className="mb-4">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
               </div>
               )}
               
               <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
               {status === "resendSuccess" ? "Email Sent!" : message}
               </h1>
               
               <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{detailedMessage}</p>
               
               {status === "resendSuccess" && (
               <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-6">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>You can request another email in {cooldown} seconds</span>
               </div>
               )}
               
               {email && (
               <div className="space-y-4">
                    {status === "error" && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-lg">
                         <div className="flex items-start">
                         <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                         <p className="text-xs text-yellow-700 dark:text-yellow-300">
                         Verification links are valid for 15 minutes. If yours expired, request a new one.
                         </p>
                         </div>
                    </div>
                    )}

                    <Button 
                    variant={cooldown > 0 ? "secondary" : "primary"}
                    onClick={handleResendVerification}
                    disabled={cooldown > 0 || isResending}
                    className="w-full !py-2 flex items-center justify-center"
                    >
                    {cooldown > 0 ? (
                         <>
                         <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                         <span>Resend available in {cooldown}s</span>
                         </>
                    ) : (
                         <>
                         <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
                         <span>Send New Verification Email</span>
                         </>
                    )}
                    </Button>
               </div>
               )}
               
               {!email && (
               <Link to="/register" className="block">
                    <Button variant="secondary" className="w-full !py-2">Try Signing Up Again</Button>
               </Link>
               )}
               </div>
          )}
          </div>
     </div>
     );
};

export default VerifyEmailPage;