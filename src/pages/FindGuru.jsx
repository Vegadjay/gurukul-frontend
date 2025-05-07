import React, { useState, useEffect } from "react";
import { Search, MapPin, Filter, X, Video, Calendar, MessageSquare, DollarSign, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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

const FindGuru = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    location: "",
    lessonType: "",
    minRating: "",
    priceRange: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [error, setError] = useState(null);

  // Fetch tutors from the API
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
          lessonType: "Both"
        }));

        setTutors(transformedData);
        setFilteredTutors(transformedData);
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

  useEffect(() => {
    let results = [...tutors];

    // Apply search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      results = results.filter(tutor =>
        tutor.name.toLowerCase().includes(searchLower) ||
        tutor.subject.toLowerCase().includes(searchLower) ||
        tutor.title.toLowerCase().includes(searchLower) ||
        (tutor.description && tutor.description.toLowerCase().includes(searchLower))
      );
    }

    // Apply subject filter
    if (filters.subject) {
      results = results.filter(tutor =>
        tutor.subject.toLowerCase().includes(filters.subject.toLowerCase())
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

    // Apply minimum rating filter
    if (filters.minRating) {
      const ratingValue = parseFloat(filters.minRating);
      results = results.filter(tutor => parseFloat(tutor.rating) >= ratingValue);
    }

    // Apply price range filter
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split('-').map(num => parseInt(num));
      if (max) {
        results = results.filter(tutor => tutor.hourlyRate >= min && tutor.hourlyRate <= max);
      } else {
        // Handle the "100+" case
        results = results.filter(tutor => tutor.hourlyRate >= min);
      }
    }

    setFilteredTutors(results);
  }, [searchTerm, filters, tutors]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      subject: "",
      location: "",
      lessonType: "",
      minRating: "",
      priceRange: ""
    });
    setSearchTerm("");
  };

  const subjects = Array.from(new Set(tutors.map(tutor => tutor.subject).filter(Boolean)));

  const locations = Array.from(new Set(tutors.map(tutor => tutor.location).filter(Boolean)));

  const priceRanges = [
    { value: "0-25", label: "₹0 - ₹25" },
    { value: "25-50", label: "₹25 - ₹50" },
    { value: "50-75", label: "₹50 - ₹75" },
    { value: "75-100", label: "₹75 - ₹100" },
    { value: "100+", label: "₹100+" }
  ];

  // Rating options for filter
  const ratingOptions = [
    { value: "4.5", label: "4.5 & above" },
    { value: "4.0", label: "4.0 & above" },
    { value: "3.5", label: "3.5 & above" },
    { value: "3.0", label: "3.0 & above" }
  ];

  return (
    <motion.div
      className="pt-20 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container-custom">
        <motion.div className="mb-8" variants={itemVariants}>
          <h1 className="text-3xl font-poppins md:text-4xl font-bold text-guru-dark dark:text-white mb-4">
            Find Your Perfect Guru
          </h1>
          <p className="text-gray-600 font-inter dark:text-gray-300 text-lg max-w-3xl">
            Connect with expert tutors who can help you master new skills and achieve your learning goals
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
                placeholder="Search for subjects, skills, or tutors..."
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
              Filters {Object.values(filters).filter(Boolean).length > 0 && `(${Object.values(filters).filter(Boolean).length})`}
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
                {/* Subject Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={filters.subject}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map((subject, index) => (
                      <option key={index} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>

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

                {/* Rating Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    Rating
                  </label>
                  <select
                    name="minRating"
                    value={filters.minRating}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                  >
                    <option value="">Any Rating</option>
                    {ratingOptions.map((option, index) => (
                      <option key={index} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="flex-1 min-w-[200px]">
                  <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                    Price Range (per hour)
                  </label>
                  <select
                    name="priceRange"
                    value={filters.priceRange}
                    onChange={handleFilterChange}
                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-2 px-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                  >
                    <option value="">Any Price</option>
                    {priceRanges.map((range, index) => (
                      <option key={index} value={range.value}>{range.label}</option>
                    ))}
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
                {isLoading ? "Searching for tutors..." : `${filteredTutors.length} Gurus Available`}
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

          {/* Active Filters Display */}
          {Object.values(filters).filter(Boolean).length > 0 && !isLoading && (
            <div className="mb-4 flex flex-wrap gap-2">
              {filters.subject && (
                <div className="flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                  <span>Subject: {filters.subject}</span>
                  <button
                    className="ml-2"
                    onClick={() => setFilters(prev => ({ ...prev, subject: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.location && (
                <div className="flex items-center bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-3 py-1 rounded-full text-sm">
                  <span>Location: {filters.location}</span>
                  <button
                    className="ml-2"
                    onClick={() => setFilters(prev => ({ ...prev, location: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.lessonType && (
                <div className="flex items-center bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-3 py-1 rounded-full text-sm">
                  <span>Lesson: {filters.lessonType}</span>
                  <button
                    className="ml-2"
                    onClick={() => setFilters(prev => ({ ...prev, lessonType: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.minRating && (
                <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-3 py-1 rounded-full text-sm">
                  <Star className="h-3 w-3 mr-1" />
                  <span>{filters.minRating}+ stars</span>
                  <button
                    className="ml-2"
                    onClick={() => setFilters(prev => ({ ...prev, minRating: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.priceRange && (
                <div className="flex items-center bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-sm">
                  <DollarSign className="h-3 w-3 mr-1" />
                  <span>
                    {filters.priceRange === "100+" ? "₹100+" :
                      `₹${filters.priceRange.split('-').join(' - ₹')}`}
                  </span>
                  <button
                    className="ml-2"
                    onClick={() => setFilters(prev => ({ ...prev, priceRange: "" }))}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
            <div className="text-center py-12">
              <div className="mb-4">
                <X className="mx-auto h-12 w-12 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 font-inter">Unable to load tutors</h3>
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
              {[1, 2, 3, 4, 5].map((index) => (
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
                      <div className="flex space-x-2 mb-2 md:mb-0">
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {tutor.subject}
                        </span>
                        <span className="px-3 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300">
                          {tutor.lessonType}
                        </span>
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tutors found</h3>
              <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                We couldn't find any tutors matching your search criteria. Try adjusting your filters or search term.
              </p>
            </div>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FindGuru;