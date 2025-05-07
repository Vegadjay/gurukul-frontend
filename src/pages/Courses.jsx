import React, { useState, useEffect } from "react";
import { Search, MapPin, Filter, X, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
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
        transition: { duration: 0.5 }
    },
};

const CategoryCoursePage = () => {
    const { category } = useParams(); // Extract category from URL
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        location: "",
        lessonType: "",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [tutors, setTutors] = useState([]);
    const [filteredTutors, setFilteredTutors] = useState([]);
    const [error, setError] = useState(null);

    // Format the category name from URL
    const formatCategoryName = (categorySlug) => {
        if (!categorySlug) return "";

        // Extract category name (e.g., "learn-dance" -> "Dance")
        const baseName = categorySlug.startsWith("learn-")
            ? categorySlug.substring(6)
            : categorySlug;

        return baseName
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const categoryName = formatCategoryName(category);

    // Fetch all tutors first
    useEffect(() => {
        const fetchTutors = async () => {
            setIsLoading(true);
            try {
                const response = await fetch('https://gurukul-backend-21h3.onrender.com/api/guru');

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.message || 'Failed to fetch tutors');
                }

                const transformedData = result.data.map(guru => ({
                    id: guru._id,
                    name: guru.username,
                    image: guru.profileImage ? `https://gurukul-backend-21h3.onrender.com/${guru.profileImage}` : "https://randomuser.me/api/portraits/men/1.jpg",
                    location: guru.address?.city || "Unknown",
                    subject: guru.category || "General",
                    title: guru.skills?.length > 0 ? `${guru.skills[0]} Specialist` : "Instructor",
                    description: guru.aboutMe || `${guru.username} is an experienced instructor.`,
                    hourlyRate: guru.perHourRate || 25,
                    status: guru.isOnline ? "online" : "offline",
                    reviewCount: Math.floor(Math.random() * 100) + 10,
                    rating: (Math.random() * 1 + 4).toFixed(1),
                    lessonType: "Both",
                    skills: guru.skills || []
                }));

                setTutors(transformedData);
                setError(null);
            } catch (err) {
                console.error("Error fetching tutors:", err);
                setError("Failed to load tutors. Please try again later.");
                toast.error("Failed to load tutors. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchTutors();
    }, []);

    // Filter tutors based on category after fetching all tutors
    useEffect(() => {
        if (tutors.length > 0) {
            filterTutorsByCategory();
        }
    }, [tutors, category]);

    // Filter tutors by category
    const filterTutorsByCategory = () => {
        const categoryFormatted = formatCategoryName(category).toLowerCase();

        const filtered = tutors.filter(tutor => {
            // Check if category matches tutor's main subject
            const subjectMatch = tutor.subject.toLowerCase() === categoryFormatted;

            // Check if category is mentioned in tutor's skills
            const skillsMatch = tutor.skills.some(skill =>
                skill.toLowerCase().includes(categoryFormatted)
            );

            return subjectMatch || skillsMatch;
        });

        setFilteredTutors(filtered);
    };

    // Apply additional search and filters
    useEffect(() => {
        if (tutors.length === 0) return;

        const categoryFormatted = formatCategoryName(category).toLowerCase();

        // First filter by category
        let results = tutors.filter(tutor => {
            const subjectMatch = tutor.subject.toLowerCase() === categoryFormatted;
            const skillsMatch = tutor.skills.some(skill =>
                skill.toLowerCase().includes(categoryFormatted)
            );
            return subjectMatch || skillsMatch;
        });

        // Then apply search term
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            results = results.filter(tutor =>
                tutor.name.toLowerCase().includes(searchLower) ||
                tutor.title.toLowerCase().includes(searchLower) ||
                (tutor.description && tutor.description.toLowerCase().includes(searchLower)) ||
                tutor.skills.some(skill => skill.toLowerCase().includes(searchLower))
            );
        }

        // Apply location filter
        if (filters.location) {
            results = results.filter(tutor =>
                tutor.location.toLowerCase() === filters.location.toLowerCase()
            );
        }

        // Apply lesson type filter
        if (filters.lessonType) {
            if (filters.lessonType === "in-person") {
                results = results.filter(tutor =>
                    tutor.lessonType === "In Person" || tutor.lessonType === "Both"
                );
            } else if (filters.lessonType === "online") {
                results = results.filter(tutor =>
                    tutor.lessonType === "Online" || tutor.lessonType === "Both"
                );
            } else if (filters.lessonType === "both") {
                results = results.filter(tutor => tutor.lessonType === "Both");
            }
        }

        setFilteredTutors(results);
    }, [searchTerm, filters, tutors, category]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const clearFilters = () => {
        setFilters({
            location: "",
            lessonType: "",
        });
        setSearchTerm("");
    };

    // Extract unique locations from API data
    const locations = Array.from(new Set(tutors.map(tutor => tutor.location).filter(Boolean)));

    return (
        <motion.div
            className="pt-20 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <div className="container-custom">
                <motion.div variants={itemVariants} className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center text-guru-blue dark:text-blue-400 hover:underline mb-4"
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Back to all courses
                    </button>
                    <h1 className="text-3xl font-poppins md:text-4xl font-bold text-guru-dark dark:text-white mb-4">
                        {categoryName} Tutors
                    </h1>
                    <p className="text-gray-600 font-inter dark:text-gray-300 text-lg max-w-3xl">
                        Find expert {categoryName.toLowerCase()} tutors who can help you master new skills and achieve your learning goals
                    </p>
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 mb-8"
                    variants={itemVariants}
                >
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder={`Search for ${categoryName.toLowerCase()} tutors...`}
                                className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>

                        {/* Filter Button */}
                        <button
                            className="btn-outline flex items-center justify-center"
                            onClick={() => setShowFilters(!showFilters)}
                        >
                            <Filter className="mr-2 h-5 w-5" />
                            Filters
                        </button>
                    </div>

                    {/* Filter Options */}
                    {showFilters && (
                        <motion.div
                            className="mt-4 border-t pt-4 dark:border-gray-700"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="flex flex-wrap gap-4">
                                {/* Location Filter */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Location
                                    </label>
                                    <select
                                        name="location"
                                        value={filters.location}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                                    >
                                        <option value="">All Locations</option>
                                        {locations.map((location, index) => (
                                            <option key={index} value={location}>{location}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Lesson Type Filter */}
                                <div className="flex-1 min-w-[200px]">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Lesson Type
                                    </label>
                                    <select
                                        name="lessonType"
                                        value={filters.lessonType}
                                        onChange={handleFilterChange}
                                        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                                    >
                                        <option value="">All Types</option>
                                        <option value="in-person">In Person</option>
                                        <option value="online">Online</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button
                                    className="flex items-center text-gray-600 dark:text-gray-300 hover:text-guru-blue dark:hover:text-blue-400"
                                    onClick={clearFilters}
                                >
                                    <X className="mr-1 h-4 w-4" />
                                    Clear all filters
                                </button>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <motion.div variants={itemVariants}>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold font-inter text-gray-900 dark:text-white mb-2">
                                {isLoading ? `Searching for ${categoryName.toLowerCase()} tutors...` : `${filteredTutors.length} ${categoryName} Tutors Available`}
                            </h2>
                            <p className="text-gray-600 font-inter dark:text-gray-300">
                                {isLoading ? "Please wait..." :
                                    error ? "Error loading tutors" :
                                        filteredTutors.length > 0 ? "Showing tutors that match your criteria" : "No tutors match your search criteria"}
                            </p>
                        </div>
                        {filteredTutors.length === 0 && !isLoading && !error && (
                            <button
                                onClick={clearFilters}
                                className="btn-primary"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {/* Error state */}
                    {error && !isLoading && (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <X className="mx-auto h-12 w-12 text-red-500" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Unable to load tutors</h3>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                {error}
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 btn-primary"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Loading state */}
                    {isLoading ? (
                        <div className="flex flex-col space-y-4">
                            {[1, 2, 3].map((index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse w-full">
                                    <div className="flex items-start">
                                        <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                                        <div className="ml-4 flex-1">
                                            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/5 mb-2"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-1"></div>
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
                                        </div>
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                    </div>
                                    <div className="mt-4 h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : !error && filteredTutors.length > 0 ? (
                        <div className="flex flex-col space-y-4">
                            {filteredTutors.map((tutor) => (
                                <motion.div
                                    key={tutor.id}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow card-hover w-full"
                                    whileHover={{ y: -3 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Link to={`/tutor/${tutor.id}`} className="block p-6">
                                        <div className="flex flex-col md:flex-row md:items-center">
                                            <div className="flex items-start mb-4 md:mb-0">
                                                <div className="relative">
                                                    <div className="h-20 w-20 rounded-full overflow-hidden">
                                                        <img
                                                            src={tutor.image}
                                                            alt={tutor.name}
                                                            className="h-full w-full object-cover"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <h3 className="font-semibold text-xl font-poppins text-gray-900 dark:text-white mb-1">{tutor.name}</h3>
                                                    <p className="text-guru-blue dark:text-blue-400 font-medium mb-1">
                                                        {tutor.title}
                                                    </p>
                                                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                        <MapPin className="h-3.5 w-3.5 mr-1" />
                                                        <span>{tutor.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:ml-auto text-right">
                                                <div className="text-2xl font-bold text-guru-blue dark:text-blue-400 mb-2">
                                                    ₹{tutor.hourlyRate}/hr
                                                </div>
                                                <div className="flex items-center justify-end">
                                                    <div className="flex text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`h-4 w-4 ${i < Math.floor(tutor.rating) ? 'fill-current' : 'text-gray-300'}`} viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        ))}
                                                    </div>
                                                    <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">
                                                        ({tutor.reviewCount})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="my-4 border-t border-gray-100 dark:border-gray-700 pt-4">
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {tutor.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap justify-between items-center">
                                            <div className="flex flex-wrap gap-2 mb-2 md:mb-0">
                                                {tutor.skills.slice(0, 3).map((skill, index) => (
                                                    <span key={index} className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                                        {skill}
                                                    </span>
                                                ))}
                                                {tutor.skills.length > 3 && (
                                                    <span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                                        +{tutor.skills.length - 3} more
                                                    </span>
                                                )}
                                            </div>
                                            <button className="btn-outline-sm">View Profile</button>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    ) : !error && filteredTutors.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="mb-4">
                                <Search className="mx-auto h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 font-inter dark:text-white mb-2">No {categoryName.toLowerCase()} tutors found</h3>
                            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                We couldn't find any {categoryName.toLowerCase()} tutors matching your search criteria. Try adjusting your filters or search term.
                            </p>
                            <Link to="/courses" className="mt-6 inline-block btn-primary">
                                Explore All Categories
                            </Link>
                        </div>
                    ) : null}
                </motion.div>
            </div>
        </motion.div>
    );
};

export default CategoryCoursePage;