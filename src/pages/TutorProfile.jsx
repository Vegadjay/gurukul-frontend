import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  ChartColumnStacked,
  Video,
  Calendar,
  MessageSquare,
  ChevronRight,
  Award,
  Clock,
  Users,
  BookOpen,
  Check,
  Book
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import BookingModal from "../components/BookingModal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

const baseUrl = 'https://gurukul-backend-21h3.onrender.com';

const TutorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tutor, setTutor] = useState(null);
  const [stats, setStas] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('about');
  const [showBooking, setShowBooking] = useState(false);
  const [upperCaseUserName, setUpperCaseUserName] = useState("");
  const [numberOfReviews, setNumberOfReviews] = useState(0);
  const [userId, setUserId] = useState(JSON.parse(localStorage.getItem('user'))?._id);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");


  useEffect(() => {
    window.scrollTo(0, 0);

    const getUserIdFromStorage = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            const parsedUser = JSON.parse(userData);
            if (parsedUser && parsedUser.id) {
              setUserId(parsedUser.id);
              return;
            }
          } catch (parseError) {
            console.error("Error parsing user data:", parseError);
          }
        }

        const token = localStorage.getItem('token');
        if (token) {
          try {
            const parts = token.split('.');
            if (parts.length === 3) {
              const payload = JSON.parse(atob(parts[1]));
              if (payload && payload.id) {
                setUserId(payload.id);
                console.log("User ID set from token:", payload.id);
              }
            } else {
              console.warn("Token is not in valid JWT format");
            }
          } catch (tokenError) {
            console.error("Error parsing token:", tokenError);
          }
        }
      } catch (error) {
        console.error("Error extracting user ID:", error);
      }
    };

    getUserIdFromStorage();


    const fetchData = async () => {
      setIsLoading(true);
      try {
        const tutorResponse = await fetch(`${baseUrl}/api/guru/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!tutorResponse.ok) {
          const errorText = await tutorResponse.text();
          console.error(`Tutor API error (${tutorResponse.status}):`, errorText);
          throw new Error(`Tutor API request failed with status ${tutorResponse.status}`);
        }

        const tutorResult = await tutorResponse.json();

        if (!tutorResult.success) {
          throw new Error(tutorResult.message || 'Failed to fetch tutor');
        }

        setTutor(tutorResult.data);

        try {
          const reviewResponse = await fetch(`${baseUrl}/api/review/guru/${id}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });

          if (!reviewResponse.ok) {
            console.warn(`Review API request failed with status ${reviewResponse.status}`);
          } else {
            const reviewResult = await reviewResponse.json();
            if (reviewResult.success) {
              setNumberOfReviews(reviewResult.data.length);
              setReviews(reviewResult.data || []);
            } else {
              console.warn("Review API returned success: false");
            }
          }
        } catch (reviewError) {
          console.error("Error fetching reviews:", reviewError);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load tutor information. Please try again later.");
        toast.error("Failed to load tutor information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchTutorStats = async () => {
      try {
        const statsResponse = await fetch(`${baseUrl}/api/guru/stats/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!statsResponse.ok) {
          const errorText = await statsResponse.text();
          console.error(`Stats API error (${statsResponse.status}):`, errorText);
          throw new Error(`Stats API request failed with status ${statsResponse.status}`);
        }

        const statsResult = await statsResponse.json();

        if (!statsResult.success) {
          throw new Error(statsResult.message || 'Failed to fetch tutor stats');
        }

        setStas(statsResult.data);
      } catch (err) {
        console.error("Error fetching tutor stats:", err);
        toast.error("Failed to load tutor stats. Please try again later.");
      }
    }
    fetchTutorStats();
    fetchData();
    fetchTutorStats();
  }, [id]);

  useEffect(() => {
    if (tutor && tutor.username) {
      try {
        const mainUser = tutor.username.split(" ");
        mainUser[0] = mainUser[0].charAt(0).toUpperCase() + mainUser[0].slice(1);
        const finalName = mainUser.join(" ");
        setUpperCaseUserName(finalName);
      } catch (err) {
        console.error("Error formatting username:", err);
        setUpperCaseUserName(tutor.username);
      }
    }
  }, [id]);

  const startChat = () => {
    if (!userId) {
      toast.error("Please login to send messages");
      navigate('/login');
      return;
    }

    const chatPartnerId = id;
    navigate(`/message/${chatPartnerId}`);
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const openRazorpay = async () => {
    if (!userId) {
      toast.error("Please login to book a session");
      navigate('/login');
      return;
    }

    setShowBooking(true);
  };

  const handleBookLesson = async () => {
    if (!userId) {
      toast.error("Please login to book a session");
      navigate('/login');
      return;
    }
    try {
      console.log(userId, "userId");
      console.log(tutor._id, "tutorId");
      const response = await fetch(`https://gurukul-backend-21h3.onrender.com/api/student/booklesson?guruId=${tutor._id}&studentId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())

      if (response.error === 0) {
        toast.success("Session booked successfully!");
      }
      else {
        throw new Error("Failed to book session");
      }
    }
    catch (err) {
      console.error("Error booking lesson:", err);
      toast.error("Failed to book a session. Please try again later.");
    }
  }

  const openRatingModal = () => {
    if (!userId) {
      toast.error("Please login to rate this tutor");
      navigate('/login');
      return;
    }
    setShowRatingModal(true);
  };

  const handleRatingSubmit = async () => {
    if (userRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/api/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          guru: tutor._id,
          student: userId,
          rating: userRating,
          comment: ratingComment
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Rating submitted successfully!");
        setShowRatingModal(false);

        // Refresh reviews
        const reviewResponse = await fetch(`${baseUrl}/api/review/guru/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (reviewResponse.ok) {
          const reviewResult = await reviewResponse.json();
          if (reviewResult.success) {
            setNumberOfReviews(reviewResult.data.length);
            setReviews(reviewResult.data || []);
          }
        }
      } else {
        toast.error(result.message || "Failed to submit rating");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      toast.error("Failed to submit rating. Please try again later.");
    }
  };

  const scheduleLesson = () => {
    console.log(userId);
    if (!userId) {
      navigate('/login');
      return;
    }
    handleBookLesson();

    setShowBooking(true);
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container-custom animate-pulse">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-3/4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <div className="flex flex-col sm:flex-row">
                  <div className="mb-6 sm:mb-0 sm:mr-6">
                    <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                  </div>
                  <div className="flex-1">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/5 mb-4"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>

            {/* Right column - Actions */}
            <div className="w-full md:w-1/4">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full mb-3"></div>
                <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="pt-20 pb-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="container-custom">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tutor Not Found</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || "The tutor you are looking for does not exist or has been removed."}
            </p>
            <Link to="/findguru" className="btn-primary">
              Browse Other Tutors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="pt-20 pb-16 bg-gray-50 dark:bg-gray-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container-custom h-full">
        <motion.div className="mb-6 flex items-center text-sm text-gray-600 dark:text-gray-400" variants={itemVariants}>
          <Link to="/" className="hover:text-guru-blue dark:hover:text-blue-400">Home</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <Link to="/findguru" className="hover:text-guru-blue dark:hover:text-blue-400">Find Guru</Link>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="text-gray-900 dark:text-white">{tutor.username}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 h-full">
          <motion.div className="w-full lg:w-3/4" variants={itemVariants}>
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
              variants={itemVariants}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col sm:flex-row">
                <div className="mb-6 sm:mb-0 sm:mr-6">
                  <div className="relative h-32 w-32">
                    <motion.div
                      className="h-32 w-32 rounded-full overflow-hidden border border-gray-500 flex justify-center items-center"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      {tutor.profileImage ? (
                        <img
                          src={`${baseUrl}/${tutor.profileImage}`}
                          alt={tutor.username || "Tutor"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xl">
                            {tutor.username ? tutor.username.charAt(0).toUpperCase() : "?"}
                          </span>
                        </div>
                      )}
                    </motion.div>
                    {tutor.status === "online" && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-2 right-2 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                      ></motion.div>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-poppins bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                    {upperCaseUserName}
                  </h1>

                  <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                    {tutor.address && tutor.address.city && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {tutor.address.city}
                        </span>
                      </div>
                    )}
                    {tutor.skills && tutor.skills.length > 0 && (
                      <div className="flex items-center">
                        <Book className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {tutor.skills.join(", ")}
                        </span>
                      </div>
                    )}
                    {tutor.category && (
                      <div className="flex items-center">
                        <ChartColumnStacked className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {tutor.category}
                        </span>
                      </div>
                    )}

                    {tutor.experience && (
                      <div className="flex items-center">
                        <Award className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                        <span className="text-gray-600 dark:text-gray-300">
                          {tutor.experience} years
                        </span>
                      </div>
                    )}
                  </div>

                  {tutor.rating && (
                    <div className="mb-4 flex items-center">
                      <motion.div
                        className="flex text-yellow-400 mr-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.floor(tutor.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                            fill={i < Math.floor(tutor.rating) ? "currentColor" : "none"}
                          />
                        ))}
                      </motion.div>
                      <span className="text-lg font-medium text-gray-900 dark:text-white mr-2">
                        {tutor.rating.toFixed(1)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300">
                        ({tutor.rating || 0} reviews)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <span className="text-2xl font-bold bg-gradient-to-r from-guru-blue to-blue-600 bg-clip-text text-transparent mr-1">
                      ₹{tutor.perHourRate || 0}
                    </span>
                    <span className="text-gray-600 dark:text-gray-300">/hr</span>
                    {tutor.firstClassFree && (
                      <motion.span
                        className="ml-3 text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 py-1 px-2 rounded-full"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        First class free
                      </motion.span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation Tabs */}
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6 overflow-hidden"
              variants={itemVariants}
            >
              <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeSection === 'about'
                    ? 'text-guru-blue dark:text-blue-400 border-b-2 border-guru-blue dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-guru-blue dark:hover:text-blue-400'
                    }`}
                  onClick={() => setActiveSection('about')}
                >
                  About
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeSection === 'reviews'
                    ? 'text-guru-blue dark:text-blue-400 border-b-2 border-guru-blue dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-guru-blue dark:hover:text-blue-400'
                    }`}
                  onClick={() => setActiveSection('reviews')}
                >
                  Reviews ({numberOfReviews})
                </button>
                <button
                  className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${activeSection === 'availability'
                    ? 'text-guru-blue dark:text-blue-400 border-b-2 border-guru-blue dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:text-guru-blue dark:hover:text-blue-400'
                    }`}
                  onClick={() => setActiveSection('availability')}
                >
                  Availability
                </button>
              </div>

              <div className="p-4 sm:p-6 md:p-8 min-h-[16rem] sm:min-h-[21rem] md:min-h-[21rem]">
                {activeSection === 'about' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-inter">About {upperCaseUserName}</h3>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {tutor.aboutMe || "No bio provided yet."}
                      </p>
                    </div>

                    {tutor.skills && tutor.skills.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 font-inter">Skills</h3>
                        <div className="flex flex-wrap gap-2">
                          {tutor.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {tutor.education && tutor.education.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Education</h3>
                        <div className="space-y-4">
                          {tutor.education.map((edu, index) => (
                            <div key={index} className="flex">
                              <BookOpen className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-1" />
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">{edu.degree}</p>
                                <p className="text-gray-600 dark:text-gray-300">{edu.institution}</p>
                                {edu.year && <p className="text-sm text-gray-500 dark:text-gray-400">{edu.year}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {tutor.achievements && tutor.achievements.length > 0 && (
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Achievements</h3>
                        <div className="space-y-3">
                          {tutor.achievements.map((achievement, index) => (
                            <div key={index} className="flex">
                              <Award className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-1" />
                              <p className="text-gray-700 dark:text-gray-300">{achievement}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSection === 'reviews' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {reviews && reviews.length > 0 ? (
                      <div className="space-y-6">
                        {reviews.map((review, index) => (
                          <motion.div
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-200 dark:border-gray-700 pb-5 last:border-0"
                          >
                            <div className="flex items-start mb-2">
                              <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                                {review.student && review.student.profileImage ? (
                                  <img
                                    src={`${baseUrl}/${review.student.profileImage}`}
                                    alt={review.student.username}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center">
                                    <span className="text-gray-500 dark:text-gray-400">
                                      {review.student && review.student.username ? review.student.username.charAt(0).toUpperCase() : "?"}
                                    </span>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {review.student ? review.student.username : "Anonymous Student"}
                                  </h4>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(review.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                                <div className="flex text-yellow-400 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                                      fill={i < review.rating ? "currentColor" : "none"}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 pl-13">{review.comment}</p>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="mb-4 text-gray-500 dark:text-gray-400">
                          <MessageSquare className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-lg">No reviews yet</p>
                        </div>
                        <button
                          onClick={openRatingModal}
                          className="btn-primary-sm"
                        >
                          Be the first to review
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeSection === 'availability' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <h2 className="text-xl font-bold text-gray-900 font-poppins dark:text-white mb-4">Availability</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tutor.availableTimes && tutor.availableTimes.length > 0 ? (
                        tutor.availableTimes.map((day, idx) => (
                          <motion.div
                            key={idx}
                            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-guru-blue dark:hover:border-blue-400 transition-colors"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                          >
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2 font-inter">{day.day}</h3>
                            <p className="font-medium text-gray-900 dark:text-white mb-2 font-inter">{day.time}</p>
                          </motion.div>
                        ))
                      ) : (
                        <p className="col-span-2 text-gray-600 dark:text-gray-400 text-center py-8">
                          No availability information provided by this tutor.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Stats */}
            {stats && (
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-guru-blue dark:text-blue-400">{stats.totalLessons || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Lessons</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-guru-blue dark:text-blue-400">{stats.totalStudents || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Total Students</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-guru-blue dark:text-blue-400">{stats.totalHours || 0}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Hours Taught</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-guru-blue dark:text-blue-400">{stats.completionRate || 0}%</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Completion Rate</p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Right column - Actions */}
          <motion.div className="w-full lg:w-1/4" variants={itemVariants}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Book a Lesson</h3>
              <button
                onClick={openRazorpay}
                className="w-full btn-primary mb-3"
              >
                Book now
              </button>
              <button
                onClick={startChat}
                className="w-full btn-outline mb-3"
              >
                Message
              </button>
              <button
                onClick={openRatingModal}
                className="w-full btn-secondary"
              >
                Leave a review
              </button>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span>Verified profile</span>
                </div>
                {tutor.responseTime && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Clock className="h-5 w-5 text-guru-blue dark:text-blue-400 mr-2" />
                    <span>Responds in {tutor.responseTime}</span>
                  </div>
                )}
                {tutor.firstClassFree && (
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>First class free</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 font-inter">Rate {upperCaseUserName}</h3>

            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">Your rating</p>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-8 w-8 cursor-pointer ${i < userRating ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                    fill={i < userRating ? "currentColor" : "none"}
                    onClick={() => setUserRating(i + 1)}
                  />
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 mb-2" htmlFor="comment">
                Comment (optional)
              </label>
              <textarea
                id="comment"
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-guru-blue"
                rows="4"
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                placeholder="Share your experience with this tutor..."
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRatingModal(false)}
                className="btn-outline-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleRatingSubmit}
                className="btn-primary-sm"
              >
                Submit Rating
              </button>
            </div>
          </div>
        </div>
      )}

      {showBooking && (
        <BookingModal
          tutor={tutor}
          onClose={() => setShowBooking(false)}
          onBookLesson={handleBookLesson}
        />
      )}
    </motion.div>
  );
};

export default TutorProfile;