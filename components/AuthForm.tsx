'use client';

import { useEffect, useState } from 'react';
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";
import { Input } from './ui/input';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, getProviders, useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type FormType = 'login' | 'register';

const AuthForm = ({ type }: { type: FormType }) => {
    const { data: session, status: sessionStatus } = useSession();
    const isLogin = type === 'login';

    const router = useRouter();

    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [isLoading, setIsloading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({
        name: '',
        password: '',
        general: ''
    });

    // Clear field errors when user starts typing
    const clearFieldError = (field: string) => {
        setFieldErrors(prev => ({ ...prev, [field]: '', general: '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsloading(true);
        setFieldErrors({ name: '', password: '', general: '' });

        // Client-side validation
        if (!password || (!isLogin && (!name || !confirmPassword))) {
            toast.error("All fields are required");
            setIsloading(false);
            return;
        }

        if (!isLogin && password !== confirmPassword) {
            toast.error("Passwords do not match");
            setIsloading(false);
            return;
        }

        try {
            if (!isLogin) {
                // REGISTER HERE
                const res = await fetch('/api/register', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name, password, confirmPassword
                    })
                });

                const data = await res.json();
                setIsloading(false);

                if (res.ok) {
                    toast.success("Account created successfully! Please log in.");
                    router.push('/login');
                } else {
                    // Handle specific registration errors
                    if (data.error) {
                        if (data.error.includes('password') || data.error.includes('Password')) {
                            setFieldErrors(prev => ({ ...prev, password: data.error }));
                            toast.error("Password requirements not met");
                        } else if (data.error.includes('name') || data.error.includes('Name')) {
                            setFieldErrors(prev => ({ ...prev, name: data.error }));
                            toast.error("Name is required");
                        } else {
                            setFieldErrors(prev => ({ ...prev, general: data.error }));
                            toast.error(data.error);
                        }
                    } else {
                        toast.error("Registration failed. Please try again.");
                    }
                }
            } else {
                // LOGIN HERE
                const res = await signIn("credentials", {
                    name,
                    password,
                    redirect: false
                });

                if (res?.ok) {
                    // Login successful
                    toast.success("Logged in successfully!");

                    // Force session update and redirect
                    await new Promise(resolve => setTimeout(resolve, 500));
                    window.location.href = "/"; // Hard redirect to ensure session is fresh
                } else {
                    setIsloading(false);

                    // Handle login errors
                    if (res?.error === 'CredentialsSignin') {
                        setFieldErrors(prev => ({
                            ...prev,
                            name: 'Invalid name or password',
                            password: 'Invalid name or password'
                        }));
                        toast.error("Invalid name or password");
                    } else if (res?.error === 'CallbackRouteError') {
                        setFieldErrors(prev => ({ ...prev, general: 'Server error during login' }));
                        toast.error("Server error during login. Please try again.");
                    } else if (res?.error) {
                        setFieldErrors(prev => ({ ...prev, general: res.error }));
                        toast.error(res.error);
                    } else {
                        toast.error("Login failed. Please try again.");
                    }
                }
            }
        } catch (error) {
            console.error("Error during authentication", error);
            setIsloading(false);
            toast.error("Something went wrong. Please try again.");
        }
    };

    const [providers, setProviders] = useState(null);

    useEffect(() => {
        const setUpProviders = async () => {
            const response = await getProviders();
            setProviders(response);
        }

        setUpProviders();
    }, []);

    useEffect(() => {
        if (confirmPassword && password !== confirmPassword) {
            setPasswordError("Passwords do not match");
        } else {
            setPasswordError("");
        }
    }, [password, confirmPassword]);

    // Redirect if already logged in
    useEffect(() => {
        if (sessionStatus === 'authenticated') {
            router.push('/');
        }
    }, [sessionStatus, router]);

    if (sessionStatus === 'loading' || isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
                <div className="flex justify-center items-center w-full py-20 max-w-2xl p-10 bg-slate-800/20 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-purple-500 border-r-blue-500"></div>
                        <div className="absolute inset-0 animate-pulse rounded-full h-16 w-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="relative flex flex-col w-full max-w-2xl gap-6 p-8 bg-slate-800/20 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl animate-in fade-in-0 slide-in-from-bottom-4 duration-1000"
            >
                {/* Logo and Header */}
                <div className='flex flex-col items-center gap-6'>
                    <Link href="/" className="group">
                        <div className="relative p-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-purple-500/30 transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-purple-500/25">
                            <Image
                                src="/logo.png"
                                alt='logo'
                                priority
                                width={120}
                                height={120}
                                className="drop-shadow-lg"
                            />
                        </div>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="text-slate-400 mt-2">
                            {isLogin ? 'Sign in to your account' : 'Join us today'}
                        </p>
                    </div>
                </div>

                {/* General error message */}
                {fieldErrors.general && (
                    <div className="p-4 text-sm text-red-300 bg-red-900/20 backdrop-blur-sm border border-red-500/30 rounded-xl animate-in fade-in-0 slide-in-from-top-2">
                        {fieldErrors.general}
                    </div>
                )}

                {/* Form Fields */}
                <div className="space-y-4">
                    {/* Name field for registration */}
                    <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <div className="relative group">
                                <Input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={e => {
                                        setName(e.target.value);
                                        clearFieldError('name');
                                    }}
                                    className={`bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 h-12 rounded-xl focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ${
                                        fieldErrors.name ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''
                                    }`}
                                    required
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {fieldErrors.name && (
                                <p className='text-sm text-red-400 animate-in fade-in-0 slide-in-from-left-2'>{fieldErrors.name}</p>
                            )}
                    </div>

                    {/* Password field */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Password</label>
                        <div className="relative group">
                            <Input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => {
                                    setPassword(e.target.value);
                                    clearFieldError('password');
                                }}
                                className={`bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 h-12 rounded-xl pr-12 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 ${
                                    fieldErrors.password ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20' : ''
                                }`}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-purple-400 transition-colors duration-200"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                            </button>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                        {fieldErrors.password && (
                            <p className='text-sm text-red-400 animate-in fade-in-0 slide-in-from-left-2'>{fieldErrors.password}</p>
                        )}
                    </div>

                    {/* Confirm Password field */}
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Confirm Password</label>
                            <div className="relative group">
                                <Input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={e => setconfirmPassword(e.target.value)}
                                    className="bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-400 h-12 rounded-xl pr-12 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 hover:text-purple-400 transition-colors duration-200"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                </button>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                            </div>
                            {passwordError && (
                                <p className='text-sm text-red-400 animate-in fade-in-0 slide-in-from-left-2'>{passwordError}</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    className="w-full h-12 font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    type='submit'
                    disabled={isLoading || (!isLogin && password !== confirmPassword)}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                            {isLogin ? 'Signing In...' : 'Creating Account...'}
                        </div>
                    ) : (
                        isLogin ? 'Sign In' : 'Create Account'
                    )}
                </Button>

                {/* Divider */}
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-slate-600/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-slate-800/50 text-slate-400">or continue with</span>
                    </div>
                </div>

                {/* Google Auth Button */}
                <Button
                    variant="outline"
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                    className="flex items-center justify-center w-full h-12 font-semibold text-white bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 hover:border-slate-500/50 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                    disabled={isLoading}
                >
                    <FaGoogle size={20} className="mr-3 text-red-400"/>
                    Continue with Google
                </Button>

                {/* Footer Link */}
                <p className="text-center text-slate-400 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <Link
                        href={isLogin ? '/register' : '/login'}
                        className='font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-200 hover:underline'
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default AuthForm;
