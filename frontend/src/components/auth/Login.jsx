import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import AuthCTA from './AuthCTA';
import { InterviewCTA } from "./InterviewCTA";
import { successToast, errorToast } from '@/utils/toast';
//Google OAuth/OpenID Connect Implementation
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});

    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const validateField = (name, value) => {
        switch (name) {
            case 'email':
                return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Invalid email address' : '';
            case 'password':
                return value.length < 6 ? 'Password must be at least 6 characters' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(input).forEach(key => {
            const error = validateField(key, input[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            errorToast('Please fill in all fields correctly.');
            return;
        }

        try {
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json"
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                successToast(res.data.message || 'Successfully logged in!');
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
            errorToast(error.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    //Google OAuth/OpenID Connect Implementation
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${USER_API_END_POINT}/google-login`, {
                credential: credentialResponse.credential
            }, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                successToast(res.data.message || 'Successfully logged in with Google!');
                if (res.data.user.role === 'recruiter') {
                    navigate("/admin");
                } else {
                    navigate("/");
                }
            }
        } catch (error) {
            console.error(error);
            errorToast(error.response?.data?.message || 'Google Login failed. Please try again.');
        }
    };

    useEffect(() => {
        if (user) {
            if (user.role === 'recruiter') {
                navigate("/admin");
            } else {
                navigate("/");
            }
        }
    }, [user, navigate]);

    return (
        <div className='min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden'>
            <div className='w-[100%] max-w-[1920px] mx-auto px-4 py-8 sm:py-12'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="w-full"
                    >
                        <div className='w-full max-w-md mx-auto'>
                            <div className='bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-4 sm:p-6 lg:p-8'>
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className='text-center mb-6'
                                >
                                    <h2 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                                        Welcome back
                                    </h2>
                                    <p className='mt-2 text-gray-600 dark:text-gray-400'>
                                        Sign in to continue your journey
                                    </p>
                                </motion.div>

                                <form onSubmit={submitHandler} className='space-y-4 sm:space-y-6'>
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.3 }}
                                        className='space-y-3 sm:space-y-4'
                                    >
                                        {/* Email */}
                                        <div>
                                            <Label htmlFor='email' className='text-gray-700 dark:text-gray-300'>Email Address</Label>
                                            <div className='relative mt-1 group'>
                                                <Input
                                                    id='email'
                                                    name='email'
                                                    type='email'
                                                    className={cn(
                                                        'border-2 transition-all duration-200 w-full',
                                                        'focus:ring-2 focus:ring-offset-2',
                                                        errors.email
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500',
                                                        'group-hover:border-indigo-400'
                                                    )}
                                                    value={input.email}
                                                    onChange={handleInputChange}
                                                    placeholder='you@example.com'
                                                />
                                                {errors.email && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className='text-red-500 text-xs mt-1'
                                                    >
                                                        {errors.email}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Password */}
                                        <div>
                                            <Label htmlFor='password' className='text-gray-700 dark:text-gray-300'>Password</Label>
                                            <div className='relative mt-1 group'>
                                                <Input
                                                    id='password'
                                                    name='password'
                                                    type='password'
                                                    className={cn(
                                                        'border-2 transition-all duration-200 w-full',
                                                        'focus:ring-2 focus:ring-offset-2',
                                                        errors.password
                                                            ? 'border-red-500 focus:ring-red-500'
                                                            : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-500',
                                                        'group-hover:border-indigo-400'
                                                    )}
                                                    value={input.password}
                                                    onChange={handleInputChange}
                                                    placeholder='••••••••'
                                                />
                                                {errors.password && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className='text-red-500 text-xs mt-1'
                                                    >
                                                        {errors.password}
                                                    </motion.p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center">
                                                <input
                                                    id="remember-me"
                                                    name="remember-me"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                />
                                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                                    Remember me
                                                </label>
                                            </div>

                                            <div className="text-sm">
                                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                                    Forgot password?
                                                </a>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <motion.div
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <Button
                                                type='submit'
                                                className='w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                                            >
                                                <span>Sign in</span>
                                                <ArrowRight size={18} />
                                            </Button>
                                        </motion.div>

                                        <div className="relative mt-6">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-300"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
                                            </div>
                                        </div>

                                        {/*Google OAuth/OpenID Connect Implementation */}
                                        <div className="mt-6 flex justify-center">
                                            <GoogleLogin
                                                onSuccess={handleGoogleSuccess}
                                                onError={() => {
                                                    errorToast('Google Login Failed');
                                                }}
                                            />
                                        </div>
                                    </motion.div>
                                </form>

                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className='mt-6 text-center text-sm text-gray-600 dark:text-gray-400'
                                >
                                    Don't have an account?{' '}
                                    <Link
                                        to='/signup'
                                        className='font-medium text-indigo-600 hover:text-indigo-500 transition-colors'
                                    >
                                        Sign up
                                    </Link>
                                </motion.p>
                            </div>
                            <InterviewCTA className="mt-6" />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <AuthCTA />
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Login;
