import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Image, FileText, Languages } from 'lucide-react';

export default function RegisterStudent() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: {
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        aboutMe: '',
        languages: ''
    });

    // Separate state for file input
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fileInputRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.match('image.*')) {
                setError("Please select an image file (JPG, PNG, etc.)");
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setError("Image size should be less than 5MB");
                return;
            }

            setProfileImage(file);
            setError(null);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const removeImage = (e) => {
        e.stopPropagation();
        setProfileImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Basic validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        if (!formData.phone.startsWith('+')) {
            setError("Phone number must start with '+' followed by country code");
            return;
        }

        const submissionFormData = new FormData();

        submissionFormData.append('username', formData.username);
        submissionFormData.append('email', formData.email);
        submissionFormData.append('password', formData.password);
        submissionFormData.append('phone', formData.phone);

        submissionFormData.append('address[city]', formData.address.city);
        submissionFormData.append('address[state]', formData.address.state);
        submissionFormData.append('address[country]', formData.address.country);
        submissionFormData.append('address[zipCode]', formData.address.zipCode);

        submissionFormData.append('aboutMe', formData.aboutMe);

        if (formData.languages) {
            const languagesArray = formData.languages.split(',').map(lang => lang.trim());
            languagesArray.forEach(language => {
                submissionFormData.append('languages[]', language);
            });
        }

        // Handle profile image
        let profileImagePath = null;
        if (profileImage) {
            profileImagePath = profileImage;
            submissionFormData.append('profileImage', profileImagePath);
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/student', {
                method: 'POST',
                body: submissionFormData,
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            setSuccess(true);
            // Reset form only after success
            setFormData({
                username: '',
                email: '',
                password: '',
                confirmPassword: '',
                phone: '',
                address: {
                    city: '',
                    state: '',
                    country: '',
                    zipCode: ''
                },
                aboutMe: '',
                languages: ''
            });
            setProfileImage(null);
            setImagePreview(null);
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };


    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    return (
        <div className="min-h-screen font-poppins bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <motion.div
                className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="px-4 py-8 sm:px-10">
                    <div className="text-center">
                        <motion.h2
                            className="text-3xl font-extrabold font-poppins text-gray-900 dark:text-white"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            Student Registration
                        </motion.h2>
                        <motion.p
                            className="mt-2 text-sm text-gray-600 dark:text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Join our learning platform as a student
                        </motion.p>
                    </div>

                    {success && (
                        <motion.div
                            className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            Registration successful! You can now <Link to="/login" className="font-medium underline">login</Link> to your account.
                        </motion.div>
                    )}

                    {error && (
                        <motion.div
                            className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.form
                        className="mt-8 space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        onSubmit={handleSubmit}
                        encType="multipart/form-data"
                    >
                        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Username */}
                            <div className="relative">
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Username *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        required
                                        minLength={3}
                                        maxLength={50}
                                        className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="johndoe"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="relative">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Email *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        required
                                        className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="******"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="relative">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Confirm Password *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        required
                                        minLength={6}
                                        className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="******"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="relative">
                                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Phone Number * (format: +[country code][number])
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Phone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="+11234567890"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Profile Image Upload */}
                            <div className="relative">
                                <label htmlFor="profileImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Profile Image
                                </label>
                                <div className="relative">
                                    <input
                                        ref={fileInputRef}
                                        id="profileImage"
                                        name="profileImage"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />

                                    <div
                                        onClick={handleImageClick}
                                        className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md py-6 cursor-pointer hover:border-blue-500 transition-colors"
                                    >
                                        {imagePreview ? (
                                            <div className="relative w-full">
                                                <img
                                                    src={imagePreview}
                                                    alt="Profile preview"
                                                    className="mx-auto h-32 object-contain rounded"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <Image className="mx-auto h-12 w-12 text-gray-400" />
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    Click to upload profile image
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    JPG, PNG, GIF up to 5MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Address Fields */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Address Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="relative">
                                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        City
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="address.city"
                                            name="address.city"
                                            type="text"
                                            className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="New York"
                                            value={formData.address.city}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="address.state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        State/Province
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="address.state"
                                            name="address.state"
                                            type="text"
                                            className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="NY"
                                            value={formData.address.state}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="address.country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Country
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="address.country"
                                            name="address.country"
                                            type="text"
                                            className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="United States"
                                            value={formData.address.country}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="relative">
                                    <label htmlFor="address.zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Zip/Postal Code
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="address.zipCode"
                                            name="address.zipCode"
                                            type="text"
                                            className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                            placeholder="10001"
                                            value={formData.address.zipCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* About Me */}
                        <motion.div variants={itemVariants} className="relative">
                            <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                About Me
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                    <FileText className="h-5 w-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="aboutMe"
                                    name="aboutMe"
                                    rows={4}
                                    className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="Tell us a bit about yourself, your background, interests, and learning goals..."
                                    value={formData.aboutMe}
                                    onChange={handleChange}
                                />
                            </div>
                        </motion.div>

                        {/* Languages */}
                        <motion.div variants={itemVariants} className="relative">
                            <label htmlFor="languages" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Languages (comma separated)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Languages className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="languages"
                                    name="languages"
                                    type="text"
                                    className="pl-10 py-3 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    placeholder="English, Spanish, French"
                                    value={formData.languages}
                                    onChange={handleChange}
                                />
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div variants={itemVariants}>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Register'
                                )}
                            </button>
                        </motion.div>

                        {/* Login Link */}
                        <motion.div variants={itemVariants} className="text-center mt-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an account?{' '}
                                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                    Sign in
                                </Link>
                            </p>
                        </motion.div>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
}