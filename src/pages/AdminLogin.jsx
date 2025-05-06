import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Mail,
    Lock,
    ArrowRight,
    CheckCircle,
    ShieldAlert,
    Shield,
    User,
    Eye,
    EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 100, damping: 15 }
    },
};

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setIsLoading(true);
            toast("Validating credentials...");

            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    role: "admin",
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Authentication failed");
            }
            if (data.error === 0) {
                toast.success("Login successful!");
                localStorage.setItem("token", data.data.token);
                localStorage.setItem("user", JSON.stringify(data.data.user));
                console.log("Login successful", data);
                navigate("/admin/dashboard", { replace: true });
            }

        } catch (error) {
            toast.error(error.message || "Login failed. Please check your credentials.");
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const adminBenefits = [
        "Complete access to user management system",
        "Advanced analytics and reporting tools",
        "Content moderation and quality control",
        "System configuration and maintenance"
    ];

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="w-full max-w-4xl">
                <motion.div
                    className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden"
                    variants={itemVariants}
                >
                    <div className="grid md:grid-cols-2">
                        <div className="p-8">
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-inter">
                                    Admin Portal
                                </h1>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Secure login for Guruqool administrators
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="admin@guruqool.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword((prev) => !prev)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input
                                            id="remember-me"
                                            name="remember-me"
                                            type="checkbox"
                                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                            Remember me
                                        </label>
                                    </div>

                                    <div className="text-sm">
                                        <Link to="/admin/reset-password" className="font-medium text-red-600 hover:text-red-500">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex justify-center items-center w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                                </svg>
                                                Processing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                Sign in <ArrowRight className="ml-2 h-4 w-4" />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6">
                                <div className="flex items-center py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-100 dark:border-gray-600">
                                    <ShieldAlert className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        This is a secure area. Only authorized administrators have access.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-600 to-red-800 dark:from-red-900 dark:to-red-950 p-8 text-white flex flex-col justify-center">
                            <div className="flex items-center mb-6">
                                <Shield className="h-8 w-8 mr-3" />
                                <h2 className="text-2xl font-bold font-inter">Admin Dashboard</h2>
                            </div>

                            <ul className="space-y-4">
                                {adminBenefits.map((benefit, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-start"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 0.3 }}
                                    >
                                        <CheckCircle className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                                        <span>{benefit}</span>
                                    </motion.li>
                                ))}
                            </ul>

                            <div className="mt-8">
                                <div className="p-4 bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm rounded-lg">
                                    <p className="text-sm mb-2 opacity-90">
                                        Welcome back to the administrator portal. Manage and monitor all platform activities from one centralized dashboard.
                                    </p>
                                    <div className="flex items-center mt-4">
                                        <User className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium">Admin team access only</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminLogin;
