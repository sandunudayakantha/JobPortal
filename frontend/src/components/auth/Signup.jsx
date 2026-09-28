import React, { useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { User, Mail, Phone, Lock, Upload, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AuthCTA from './AuthCTA';
import { motion } from 'framer-motion';
import { successToast, errorToast } from '@/utils/toast';

const Signup = () => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        inviteCode: "",
        file: null
    });

    const [errors, setErrors] = useState({});
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateField = (name, value) => {
        switch (name) {
            case 'fullname':
                return value.trim() === '' ? 'Full name is required' : '';
            case 'email':
                return !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ? 'Invalid email address' : '';
            case 'phoneNumber':
                return !value.match(/^\d{10}$/) ? 'Invalid phone number (10 digits required)' : '';
            case 'password':
                return value.length < 6 ? 'Password must be at least 6 characters' : '';
            case 'file':
                return !value ? 'Profile picture is required' : '';
            default:
                return '';
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setErrors(prev => ({ ...prev, file: 'File size should be less than 5MB' }));
                return;
            }
            if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
                setErrors(prev => ({ ...prev, file: 'Please upload an image file' }));
                return;
            }
            setInput(prev => ({ ...prev, file }));
            setPreviewUrl(URL.createObjectURL(file));
            setErrors(prev => ({ ...prev, file: '' }));
        }
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

        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        if (input.inviteCode) {
            formData.append("inviteCode", input.inviteCode);
        }
        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            const registerRes = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });

            if (registerRes.data.success) {
                const loginRes = await axios.post(`${USER_API_END_POINT}/login`, {
                    email: input.email,
                    password: input.password
                }, {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                });

                if (loginRes.data.success) {
                    dispatch(setUser(loginRes.data.user));
                    successToast('Account created and logged in successfully!');
                    
                    if (loginRes.data.user.role === 'recruiter') {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                }
            }
        } catch (error) {
            console.error(error);
            errorToast(error.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user]);

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
                                    className='text-center mb-6 sm:mb-8'
                                >
                                    <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                                        Create your account
                                    </h2>
                                    <p className='mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400'>
                                        Join us to explore opportunities
                                    </p>
                                </motion.div>
                                <form onSubmit={submitHandler} className='space-y-4 sm:space-y-6'>
                                    <div className='space-y-3 sm:space-y-4'>
                                        <div>
                                            <Label htmlFor='fullname' className='text-gray-700 dark:text-gray-300'>Full Name</Label>
                                            <div className='relative mt-1'>
                                                <Input
                                                    id='fullname'
                                                    name='fullname'
                                                    type='text'
                                                    className={cn(
                                                        'w-full',
                                                        errors.fullname && 'border-red-500 focus:ring-red-500'
                                                    )}
                                                    value={input.fullname}
                                                    onChange={handleInputChange}
                                                    placeholder="John Doe"
                                                />
                                                {errors.fullname && (
                                                    <p className='text-red-500 text-xs mt-1'>{errors.fullname}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor='email' className='text-gray-700 dark:text-gray-300'>Email Address</Label>
                                            <div className='relative mt-1'>
                                                <Input
                                                    id='email'
                                                    name='email'
                                                    type='email'
                                                    className={cn(
                                                        'w-full',
                                                        errors.email && 'border-red-500 focus:ring-red-500'
                                                    )}
                                                    value={input.email}
                                                    onChange={handleInputChange}
                                                    placeholder="you@example.com"
                                                />
                                                {errors.email && (
                                                    <p className='text-red-500 text-xs mt-1'>{errors.email}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor='phoneNumber' className='text-gray-700 dark:text-gray-300'>Phone Number</Label>
                                            <div className='relative mt-1'>
                                                <Input
                                                    id='phoneNumber'
                                                    name='phoneNumber'
                                                    type='tel'
                                                    className={cn(
                                                        'w-full',
                                                        errors.phoneNumber && 'border-red-500 focus:ring-red-500'
                                                    )}
                                                    value={input.phoneNumber}
                                                    onChange={handleInputChange}
                                                    placeholder="1234567890"
                                                />
                                                {errors.phoneNumber && (
                                                    <p className='text-red-500 text-xs mt-1'>{errors.phoneNumber}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor='password' className='text-gray-700 dark:text-gray-300'>Password</Label>
                                            <div className='relative mt-1'>
                                                <Input
                                                    id='password'
                                                    name='password'
                                                    type='password'
                                                    className={cn(
                                                        'w-full',
                                                        errors.password && 'border-red-500 focus:ring-red-500'
                                                    )}
                                                    value={input.password}
                                                    onChange={handleInputChange}
                                                    placeholder="••••••••"
                                                />
                                                {errors.password && (
                                                    <p className='text-red-500 text-xs mt-1'>{errors.password}</p>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Must be at least 6 characters long
                                            </p>
                                        </div>

                                        <div>
                                            <Label htmlFor='inviteCode' className='text-gray-700 dark:text-gray-300'>Recruiter Invite Code (Optional)</Label>
                                            <div className='relative mt-1'>
                                                <Input
                                                    id='inviteCode'
                                                    name='inviteCode'
                                                    type='text'
                                                    className='w-full'
                                                    value={input.inviteCode}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter code to register as recruiter"
                                                />
                                            </div>
                                        </div>

                                        <div className='space-y-2 flex flex-col items-center pt-2'>
                                            <Label className='text-gray-700 dark:text-gray-300 mb-2'>Profile Photo (Optional)</Label>
                                            <div className='flex justify-center'>
                                                <div className='relative group'>
                                                    <div className={cn(
                                                        'w-24 h-24 rounded-full overflow-hidden border-4 border-gray-200 hover:border-indigo-500 transition-colors',
                                                        errors.file && 'border-red-500'
                                                    )}>
                                                        {previewUrl ? (
                                                            <img src={previewUrl} alt="Profile preview" className='w-full h-full object-cover' />
                                                        ) : (
                                                            <div className='w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center'>
                                                                <Upload className='w-8 h-8 text-gray-400' />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        onChange={handleFileChange}
                                                        className='absolute inset-0 w-full h-full opacity-0 cursor-pointer'
                                                        accept="image/*"
                                                    />
                                                    {errors.file && (
                                                        <p className='text-red-500 text-xs mt-1 text-center'>{errors.file}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-2">
                                            <div className="flex items-center h-5">
                                                <input
                                                    id="terms"
                                                    type="checkbox"
                                                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800"
                                                    required
                                                />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label htmlFor="terms" className="font-light text-gray-500 dark:text-gray-300">
                                                    I accept the <a className="font-medium text-blue-600 hover:underline" href="#">Terms and Conditions</a>
                                                </label>
                                            </div>
                                        </div>

                                        <Button
                                            type='submit'
                                            className='w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2'
                                        >
                                            <span>Create Account</span>
                                            <CheckCircle2 size={18} />
                                        </Button>
                                    </div>
                                </form>

                                <p className='mt-4 text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400'>
                                Already have an account?{' '}
                                <Link to='/login' className='font-medium text-indigo-600 hover:text-indigo-500'>
                                    Sign in
                                </Link>
                            </p>
                            </div>
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

export default Signup;
