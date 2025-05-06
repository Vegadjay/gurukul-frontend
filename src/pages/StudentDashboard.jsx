import React, { useState, useEffect } from "react";
import {
    User, Mail, Phone, MapPin, Calendar, Clock, Languages,
    BookOpen, Award, DollarSign, Globe, FileText,
    Briefcase, Linkedin, Twitter, Facebook, Instagram,
    LogOut, Settings, Users, Book, ChevronDown, ChevronUp, Pencil
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";

const StudentDashboard = () => {
    const { studentId } = useParams();
    const navigate = useNavigate();

    const [studentData, setStudentData] = useState({
        username: "",
        email: "",
        phone: "",
        address: {
            city: "",
            state: "",
            country: "",
            zipCode: ""
        },
        profileImage: "",
        aboutMe: "",
        languages: [],
        enrolledGurus: []
    });

    const [gurusData, setGurusData] = useState([]);
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [learningProgress, setLearningProgress] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        languages: true,
        interests: true
    });

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setLoading(true);
                setError(null);

                const studentResponse = await fetch(`https://gurukul-backend-21h3.onrender.com/api/student/${studentId}`);
                if (!studentResponse.ok) {
                    throw new Error(`Failed to fetch student data: ${studentResponse.status}`);
                }

                const { data } = await studentResponse.json();
                console.log("Student data:", data);
                setStudentData(prev => ({
                    ...prev,
                    ...data,
                    address: data.address || { city: "", state: "", country: "", zipCode: "" },
                    languages: data.languages || []
                }));

                if (data.enrolledGurus && data.enrolledGurus.length > 0) {
                    try {
                        const gurusPromises = data.enrolledGurus.map(guruId =>
                            fetch(`https://gurukul-backend-21h3.onrender.com/api/guru/${guruId}`)
                                .then(res => {
                                    if (!res.ok) throw new Error(`Failed to fetch guru: ${res.status}`);
                                    return res.json();
                                })
                                .then(guruData => guruData.data)
                                .catch(err => {
                                    console.warn(`Failed to fetch guru with ID ${guruId}:`, err);
                                    return null;
                                })
                        );

                        const gurusResults = await Promise.all(gurusPromises);
                        const validGurus = gurusResults.filter(guru => guru !== null);
                        setGurusData(validGurus);
                        console.log("Fetched gurus data:", validGurus);
                    } catch (gurusError) {
                        console.warn("Error fetching gurus:", gurusError);
                    }
                }

                try {
                    const coursesResponse = await fetch(`/api/student/${studentId}/courses`);
                    if (coursesResponse.ok) {
                        const coursesData = await coursesResponse.json();
                        setEnrolledCourses(coursesData || []);
                    } else {
                        setEnrolledCourses([]);
                    }
                } catch (coursesError) {
                    console.warn("Failed to fetch courses:", coursesError);
                    setEnrolledCourses([]);
                }

                try {
                    const progressResponse = await fetch(`/api/student/${studentId}/progress`);
                    if (progressResponse.ok) {
                        const progressData = await progressResponse.json();
                        setLearningProgress(progressData || []);
                    } else {
                        setLearningProgress([]);
                    }
                } catch (progressError) {
                    console.warn("Failed to fetch learning progress:", progressError);
                    setLearningProgress([]);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error fetching student data:", err);
                setError(err.message || "Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        if (studentId) {
            fetchStudentData();
        } else {
            setError("No student ID provided in the URL");
            setLoading(false);
        }
    }, [studentId]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        navigate("/login");
    };

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleGuruClick = (guruId) => {
        // Redirect to the tutor page with the guru ID
        window.location.href = `https://guruqool.vercel.app/tutor/${guruId}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 font-poppins">
                <div className="animate-spin rounded-full h-48 w-48 border-t-8 border-b-8 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 font-poppins">
                <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-lg text-center">
                    <div className="text-red-500 text-7xl mb-8">⚠️</div>
                    <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Error</h2>
                    <p className="text-2xl text-gray-600 dark:text-gray-300">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-10 px-8 py-4 bg-blue-600 text-white text-xl rounded-md hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 dark:bg-gray-900 font-poppins">
            {/* Main content */}
            <main className="w-full mx-auto px-8 md:px-12 lg:px-16 py-12 font-poppins">
                {/* Tabs */}
                <div className="mb-10 border-b-4 border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <nav className="flex space-x-12">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`py-6 px-4 font-medium text-2xl border-b-4 font-poppins ${activeTab === "profile"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:border-gray-300"
                                }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("gurus")}
                            className={`py-6 px-4 font-medium text-2xl border-b-4 font-poppins ${activeTab === "gurus"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:border-gray-300"
                                }`}
                        >
                            My Gurus
                        </button>
                    </nav>
                    <div>
                        <Link to={`/updatestudent/${studentId}`}>
                            <div
                                title="Update Profile"
                                className="h-12 w-12 bg-zinc-800 hover:scale-105 flex justify-center items-center rounded-full">
                                <Pencil height={20} width={20} />
                            </div>
                        </Link>
                    </div>
                </div>

                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                                <div className="p-7 text-center">
                                    <div className="relative mb-5 inline-block">
                                        <img
                                            src={`https://gurukul-backend-21h3.onrender.com/${studentData.profileImage}` || "https://placehold.co/400"}
                                            alt="Profile"
                                            className="h-36 w-36 rounded-full object-cover border-4 border-white dark:border-gray-700"
                                        />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins mb-3">
                                        {studentData.username}
                                    </h2>
                                    <p className="text-2xl text-gray-600 dark:text-gray-400 font-poppins">
                                        Student
                                    </p>
                                </div>

                                <div className="border-t-2 border-gray-200 dark:border-gray-700">
                                    <div className="p-8">
                                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-6 text-xl font-poppins">
                                            <Mail className="h-7 w-7 mr-4 text-gray-500 dark:text-gray-400" />
                                            <span>{studentData.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-6 text-xl font-poppins">
                                            <Phone className="h-7 w-7 mr-4 text-gray-500 dark:text-gray-400" />
                                            <span>{studentData.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-6 text-xl font-poppins">
                                            <MapPin className="h-7 w-7 mr-4 text-gray-500 dark:text-gray-400" />
                                            <span>
                                                {studentData.address.city}, {studentData.address.state}, {studentData.address.country}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl mb-10">
                                <div
                                    className="p-8 border-b-2 border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleSection("personal")}
                                >
                                    <h3 className="text-2xl font-medium text-gray-900 dark:text-white font-poppins">About Me</h3>
                                    {expandedSections.personal ? (
                                        <ChevronUp className="h-8 w-8 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-8 w-8 text-gray-500" />
                                    )}
                                </div>
                                {expandedSections.personal && (
                                    <div className="p-8">
                                        <p className="text-xl text-gray-700 dark:text-gray-300 font-poppins">
                                            {studentData.aboutMe || "No information provided."}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl mb-10">
                                <div
                                    className="p-8 border-b-2 border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleSection("languages")}
                                >
                                    <h3 className="text-2xl font-medium text-gray-900 dark:text-white font-poppins">Languages</h3>
                                    {expandedSections.languages ? (
                                        <ChevronUp className="h-8 w-8 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-8 w-8 text-gray-500" />
                                    )}
                                </div>
                                {expandedSections.languages && (
                                    <div className="p-8">
                                        <div className="flex flex-wrap gap-4">
                                            {studentData.languages && studentData.languages.length > 0 ? (
                                                studentData.languages.map((language, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xl font-poppins"
                                                    >
                                                        <Languages className="h-5 w-5 mr-3" />
                                                        {language}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-xl text-gray-500 dark:text-gray-400 font-poppins">No languages listed.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Progress Tab */}
                {activeTab === "progress" && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-8 border-b-2 border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-medium text-gray-900 dark:text-white font-poppins">Learning Progress</h3>
                        </div>
                        {learningProgress && learningProgress.length > 0 ? (
                            <div className="p-8">
                                <div className="mb-12">
                                    <h4 className="text-2xl font-medium text-gray-900 dark:text-white mb-8 font-poppins">Weekly Activity</h4>
                                    <div className="grid grid-cols-7 gap-4 mb-4">
                                        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                                            <div key={index} className="text-center text-lg font-medium text-gray-600 dark:text-gray-400 font-poppins">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-4">
                                        {[2, 0, 3, 1, 4, 2, 0].map((activity, index) => (
                                            <div key={index}
                                                className={`h-20 rounded-md ${activity === 0 ? 'bg-gray-100 dark:bg-gray-700' :
                                                    activity === 1 ? 'bg-blue-100 dark:bg-blue-900' :
                                                        activity === 2 ? 'bg-blue-200 dark:bg-blue-800' :
                                                            activity === 3 ? 'bg-blue-300 dark:bg-blue-700' :
                                                                'bg-blue-400 dark:bg-blue-600'
                                                    }`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-12">
                                    <h4 className="text-2xl font-medium text-gray-900 dark:text-white mb-8 font-poppins">Course Completion</h4>
                                    <div className="space-y-8">
                                        {learningProgress.slice(0, 3).map((course, index) => (
                                            <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h5 className="text-xl font-medium text-gray-900 dark:text-white font-poppins">{course.title}</h5>
                                                    <span className="text-lg text-gray-500 dark:text-gray-400 font-poppins">{course.progress}%</span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-5">
                                                    <div
                                                        className="bg-blue-600 h-5 rounded-full"
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                                <div className="mt-4 flex justify-between items-center text-base text-gray-500 dark:text-gray-400 font-poppins">
                                                    <span>Started: {course.startDate}</span>
                                                    <span>Last active: {course.lastActive}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-2xl font-medium text-gray-900 dark:text-white mb-8 font-poppins">Recent Achievements</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
                                            <div className="inline-flex items-center justify-center p-5 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300 mb-6">
                                                <Award className="h-10 w-10" />
                                            </div>
                                            <h5 className="text-xl font-medium text-gray-900 dark:text-white font-poppins">First Course Completed</h5>
                                            <p className="text-lg text-gray-500 dark:text-gray-400 mt-3 font-poppins">Earned 2 weeks ago</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
                                            <div className="inline-flex items-center justify-center p-5 bg-green-100 dark:bg-green-900 rounded-full text-green-600 dark:text-green-300 mb-6">
                                                <Award className="h-10 w-10" />
                                            </div>
                                            <h5 className="text-xl font-medium text-gray-900 dark:text-white font-poppins">Perfect Score</h5>
                                            <p className="text-lg text-gray-500 dark:text-gray-400 mt-3 font-poppins">Earned 3 days ago</p>
                                        </div>
                                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-8 text-center">
                                            <div className="inline-flex items-center justify-center p-5 bg-purple-100 dark:bg-purple-900 rounded-full text-purple-600 dark:text-purple-300 mb-6">
                                                <Award className="h-10 w-10" />
                                            </div>
                                            <h5 className="text-xl font-medium text-gray-900 dark:text-white font-poppins">7-Day Streak</h5>
                                            <p className="text-lg text-gray-500 dark:text-gray-400 mt-3 font-poppins">Earned today</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-16 text-center">
                                <Chart className="mx-auto h-20 w-20 text-gray-400" />
                                <h3 className="mt-6 text-2xl font-medium text-gray-900 dark:text-white font-poppins">No progress yet</h3>
                                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 font-poppins">
                                    Start a course to track your learning progress.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Gurus Tab */}
                {activeTab === "gurus" && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
                        <div className="p-8 border-b-2 border-gray-200 dark:border-gray-700">
                            <h3 className="text-2xl font-medium text-gray-900 dark:text-white font-poppins">My Gurus</h3>
                        </div>
                        {gurusData && gurusData.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-8">
                                {gurusData.map((guru) => (
                                    <div
                                        key={guru._id}
                                        className="bg-gray-50 dark:bg-gray-700 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:shadow-2xl transition-shadow duration-300"
                                        onClick={() => handleGuruClick(guru._id)}
                                    >
                                        <div className="p-8 flex flex-col items-center">
                                            <img
                                                src={guru.profileImage ? `https://gurukul-backend-21h3.onrender.com/${guru.profileImage}` : "https://placehold.co/120?text=Guru"}
                                                alt={guru.name}
                                                className="h-28 w-28 rounded-full object-cover mb-6"
                                            />
                                            <div className="text-center">
                                                <h4 className="text-2xl font-medium text-gray-900 dark:text-white font-poppins mb-2">
                                                    {guru.name || guru.username}
                                                </h4>
                                                <p className="text-lg text-gray-500 dark:text-gray-400 font-poppins mb-3">
                                                    {guru.expertise || "Expert Teacher"}
                                                </p>
                                                <div className="flex items-center justify-center">
                                                    <span className="text-yellow-500 text-xl">
                                                        {"★".repeat(Math.floor(guru.rating || 5))}
                                                        {"☆".repeat(5 - Math.floor(guru.rating || 5))}
                                                    </span>
                                                    <span className="text-base text-gray-500 dark:text-gray-400 ml-2 font-poppins">
                                                        ({guru.rating?.toFixed(1) || "5.0"})
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 border-t-2 border-gray-200 dark:border-gray-600 flex justify-between">
                                            <button
                                                className="px-5 py-3 bg-transparent border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900 font-poppins text-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`https://guruqool.vercel.app/message/${guru._id}`);
                                                }}
                                            >
                                                Message
                                            </button>
                                            <button
                                                className="px-5 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-poppins text-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleGuruClick(guru._id);
                                                }}
                                            >
                                                View Profile
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-16 text-center">
                                <Users className="mx-auto h-20 w-20 text-gray-400" />
                                <h3 className="mt-6 text-2xl font-medium text-gray-900 dark:text-white font-poppins">No gurus yet</h3>
                                <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 font-poppins">
                                    You haven't enrolled with any gurus yet.
                                </p>
                                <div className="mt-10">
                                    <button
                                        className="inline-flex items-center px-8 py-4 border border-transparent shadow-lg text-xl font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none font-poppins"
                                    >
                                        <Users className="h-7 w-7 mr-3" /> Find Gurus
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
                }
            </main >
        </div >
    );
};

export default StudentDashboard;