import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, Image, FileText, Languages, GraduationCap, Briefcase, Clock, DollarSign, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';

export default function UpdateGuru() {
    const { guruId } = useParams();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: {
            city: '',
            state: '',
            country: '',
            zipCode: ''
        },
        skills: '',
        experience: '',
        aboutMe: '',
        languages: '',
        socialLinks: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: '',
            youtube: ''
        },
        category: 'arts and crafts',
        perHourRate: '',
        isOnline: false,
        availableTimes: '',
        education: ''
    });

    const [originalData, setOriginalData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const categoryOptions = [
        'arts and crafts',
        'academic',
        'professional skills',
        'languages',
        'technology',
        "handi craft"
    ];

    useEffect(() => {
        const fetchGuruData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`https://gurukul-backend-21h3.onrender.com/api/guru/${guruId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch guru data');
                }

                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.message || 'Failed to load guru data');
                }

                const guru = data.data;
                setOriginalData(guru);

                const formattedData = {
                    username: guru.username || '',
                    email: guru.email || '',
                    phone: guru.phone || '',
                    address: {
                        city: guru.address?.city || '',
                        state: guru.address?.state || '',
                        country: guru.address?.country || '',
                        zipCode: guru.address?.zipCode || ''
                    },
                    skills: Array.isArray(guru.skills) ? guru.skills.join(', ') : (guru.skills || ''),
                    experience: guru.experience || '',
                    aboutMe: guru.aboutMe || '',
                    languages: Array.isArray(guru.languages) ? guru.languages.join(', ') : (guru.languages || ''),
                    socialLinks: {
                        facebook: guru.socialLinks?.facebook || '',
                        twitter: guru.socialLinks?.twitter || '',
                        instagram: guru.socialLinks?.instagram || '',
                        linkedin: guru.socialLinks?.linkedin || '',
                        youtube: guru.socialLinks?.youtube || ''
                    },
                    category: guru.category || 'arts and crafts',
                    perHourRate: guru.perHourRate || '',
                    isOnline: guru.isOnline || false,
                    education: Array.isArray(guru.education) && guru.education.length > 0 ? guru.education.map(edu => edu.degree || '').join(', ') : ''
                };

                if (Array.isArray(guru.availableTimes) && guru.availableTimes.length > 0) {
                    const shortDays = {
                        'Monday': 'Mon',
                        'Tuesday': 'Tue',
                        'Wednesday': 'Wed',
                        'Thursday': 'Thu',
                        'Friday': 'Fri',
                        'Saturday': 'Sat',
                        'Sunday': 'Sun'
                    };

                    const timesByDay = {};
                    guru.availableTimes.forEach(slot => {
                        if (slot.day && slot.time) {
                            timesByDay[slot.day] = slot.time;
                        }
                    });

                    const formattedTimes = Object.entries(timesByDay)
                        .map(([day, time]) => `${shortDays[day] || day}: ${time}`)
                        .join(', ');

                    formattedData.availableTimes = formattedTimes;
                } else {
                    formattedData.availableTimes = '';
                }

                setFormData(formattedData);
            } catch (err) {
                console.error("Error fetching guru data:", err);
                setError(err.message || "Failed to load guru profile");
            } finally {
                setIsLoading(false);
            }
        };

        if (guruId) {
            fetchGuruData();
        }
    }, [guruId]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...formData[parent],
                    [child]: value
                }
            });
        } else if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (formData.phone && !formData.phone.startsWith('+')) {
            setError("Phone number must start with '+' followed by country code");
            setLoading(false);
            return;
        }

        try {
            const submissionData = {
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                address: { ...formData.address },
                skills: formData.skills ? formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
                experience: formData.experience,
                aboutMe: formData.aboutMe,
                languages: formData.languages ? formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang) : [],
                socialLinks: { ...formData.socialLinks },
                category: formData.category,
                perHourRate: formData.perHourRate,
                isOnline: formData.isOnline,
                availableTimes: formData.availableTimes,
                education: formData.education ? formData.education.split(',').map(edu => edu.trim()).filter(edu => edu) : []
            };


            const response = await fetch(`https://gurukul-backend-21h3.onrender.com/api/guru/updateguru/${guruId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submissionData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Update failed');
            }

            setSuccess(true);
            navigate(`/student/studentdashboard/${studentId}`);

            setTimeout(() => {
                setSuccess(false);
            }, 5000);

        } catch (err) {
            console.error("Update error:", err);
            setError(err.message || "An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Loading guru profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
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
                            Update Guru Profile
                        </motion.h2>
                        <motion.p
                            className="mt-2 text-sm text-gray-600 dark:text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            Update your information to keep your profile current
                        </motion.p>
                    </div>

                    {success && (
                        <motion.div
                            className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            Profile updated successfully!
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
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="guruji"
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
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="guru@example.com"
                                        value={formData.email}
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
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="+11234567890"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Category */}
                            <div className="relative">
                                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category *
                                </label>
                                <div className="relative">
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        className="block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        value={formData.category}
                                        onChange={handleChange}
                                    >
                                        {categoryOptions.map((category) => (
                                            <option key={category} value={category}>
                                                {category.charAt(0).toUpperCase() + category.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Per Hour Rate */}
                            <div className="relative">
                                <label htmlFor="perHourRate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Hourly Rate (USD) *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <DollarSign className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="perHourRate"
                                        name="perHourRate"
                                        type="number"
                                        required
                                        min="1"
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="40"
                                        value={formData.perHourRate}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Available Times */}
                            <div className="relative">
                                <label htmlFor="availableTimes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Available Times
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="availableTimes"
                                        name="availableTimes"
                                        type="text"
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
                                        value={formData.availableTimes}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Address Fields */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white font-inter">Address Information</h3>
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
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="Mumbai"
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
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="Maharashtra"
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
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="India"
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
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="400001"
                                            value={formData.address.zipCode}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Professional Information */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white font-inter">Professional Information</h3>

                            {/* Skills */}
                            <div className="relative">
                                <label htmlFor="skills" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Skills (comma separated) *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="skills"
                                        name="skills"
                                        type="text"
                                        required
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="Guitar, Piano, Music Theory"
                                        value={formData.skills}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Experience */}
                            <div className="relative">
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Years of Experience *
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="experience"
                                        name="experience"
                                        type="number"
                                        required
                                        min="0"
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="5"
                                        value={formData.experience}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Education */}
                            <div className="relative">
                                <label htmlFor="education" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Education (comma separated)
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <GraduationCap className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="education"
                                        name="education"
                                        type="text"
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="B.A. Music, M.A. Music Education"
                                        value={formData.education}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Languages */}
                            <div className="relative">
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
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="English, Hindi, Marathi"
                                        value={formData.languages}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* About Me */}
                            <div className="relative">
                                <label htmlFor="aboutMe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    About Me *
                                </label>
                                <div className="relative">
                                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                                        <FileText className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        id="aboutMe"
                                        name="aboutMe"
                                        required
                                        rows={4}
                                        className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                        placeholder="Tell us about yourself, your teaching style, and expertise..."
                                        value={formData.aboutMe}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Social Links */}
                        <motion.div variants={itemVariants} className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white font-inter">Social Media Links</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Facebook */}
                                <div className="relative">
                                    <label htmlFor="socialLinks.facebook" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Facebook
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Facebook className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="socialLinks.facebook"
                                            name="socialLinks.facebook"
                                            type="url"
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="https://facebook.com/username"
                                            value={formData.socialLinks.facebook}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Twitter */}
                                <div className="relative">
                                    <label htmlFor="socialLinks.twitter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Twitter
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Twitter className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="socialLinks.twitter"
                                            name="socialLinks.twitter"
                                            type="url"
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="https://twitter.com/username"
                                            value={formData.socialLinks.twitter}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* Instagram */}
                                <div className="relative">
                                    <label htmlFor="socialLinks.instagram" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Instagram
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Instagram className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="socialLinks.instagram"
                                            name="socialLinks.instagram"
                                            type="url"
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="https://instagram.com/username"
                                            value={formData.socialLinks.instagram}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* LinkedIn */}
                                <div className="relative">
                                    <label htmlFor="socialLinks.linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        LinkedIn
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Linkedin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="socialLinks.linkedin"
                                            name="socialLinks.linkedin"
                                            type="url"
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="https://linkedin.com/in/username"
                                            value={formData.socialLinks.linkedin}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                {/* YouTube */}
                                <div className="relative">
                                    <label htmlFor="socialLinks.youtube" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        YouTube
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Youtube className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            id="socialLinks.youtube"
                                            name="socialLinks.youtube"
                                            type="url"
                                            className="pl-10 block w-full border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-3"
                                            placeholder="https://youtube.com/channel/username"
                                            value={formData.socialLinks.youtube}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <div className='w-full flex justify-center items-center'>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                                        Updating...
                                    </>
                                ) : (
                                    'Update Profile'
                                )}
                            </button>
                        </div>
                    </motion.form>
                </div>
            </motion.div>
        </div>
    );
}