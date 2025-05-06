import React, { useState, useEffect } from "react";
import {
    User, Mail, Phone, MapPin, Calendar, Clock, Languages,
    BookOpen, Award, DollarSign, Globe, FileText,
    Briefcase, Linkedin, Twitter, Facebook, Instagram,
    LogOut, Settings, Users, Book, ChevronDown, ChevronUp, Edit,
    MessageCircle, Pencil
} from "lucide-react";
import { useParams, useNavigate, Link } from "react-router-dom";

const GuruDashboard = () => {
    const { guruId } = useParams();
    const navigate = useNavigate();

    const [guruData, setGuruData] = useState({
        username: "",
        category: "",
        isOnline: false,
        profileImage: "",
        email: "",
        phone: "",
        address: {
            city: "",
            state: "",
            country: ""
        },
        perHourRate: 0,
        socialLinks: [],
        aboutMe: "",
        teachingMode: "",
        experience: 0,
        skills: [],
        languages: [],
        education: [],
        totalEarnings: 0,
        currentMonthEarnings: 0,
        pendingPayments: 0,
        recentTransactions: [],
        paymentMethod: null
    });

    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("profile");
    const [expandedSections, setExpandedSections] = useState({
        personal: true,
        skills: true,
        education: true
    });

    useEffect(() => {
        const fetchGuruData = async () => {
            try {
                setLoading(true);
                setError(null);

                try {
                    const guruResponse = await fetch(`https://gurukul-backend-21h3.onrender.com/api/guru/${guruId}`);

                    if (!guruResponse.ok) {
                        throw new Error(`Server responded with status ${guruResponse.status}`);
                    }

                    const contentType = guruResponse.headers.get("content-type");
                    if (!contentType || !contentType.includes("application/json")) {
                        throw new Error("Server returned non-JSON response");
                    }

                    const { data } = await guruResponse.json();
                    console.log("Guru data fetched successfully:", data);

                    setGuruData(prev => ({
                        ...prev,
                        ...data,
                        address: data.address || { city: "", state: "", country: "" },
                        socialLinks: data.socialLinks || [],
                        skills: data.skills || [],
                        languages: data.languages || [],
                        education: data.education || [],
                        recentTransactions: data.recentTransactions || []
                    }));
                } catch (guruError) {
                    console.error("Error fetching guru data:", guruError);
                    setError(guruError.message || "Failed to load guru data");
                    setLoading(false);
                    return; // Exit the function if we can't get guru data
                }

                try {
                    const studentsResponse = await fetch(`https://gurukul-backend-21h3.onrender.com/api/student/enrolled/${guruId}`);

                    if (!studentsResponse.ok) {
                        console.warn(`Students API returned status: ${studentsResponse.status}`);
                        setEnrolledStudents([]);
                    } else {
                        const contentType = studentsResponse.headers.get("content-type");
                        if (!contentType || !contentType.includes("application/json")) {
                            console.warn("Students API returned non-JSON response");
                            setEnrolledStudents([]);
                        } else {
                            const studentsData = await studentsResponse.json();
                            setEnrolledStudents(studentsData.data || []);
                        }
                    }
                } catch (studentsError) {
                    console.warn("Failed to fetch students:", studentsError);
                    setEnrolledStudents([]);
                }

                setLoading(false);
            } catch (err) {
                console.error("Error in fetchGuruData:", err);
                setError(err.message || "Failed to load data. Please try again later.");
                setLoading(false);
            }
        };

        if (guruId) {
            fetchGuruData();
        } else {
            setError("No guru ID provided in the URL");
            setLoading(false);
        }
    }, [guruId]);

    const handleUpdateProfile = () => {

    }

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const getSocialIcon = (platform) => {
        switch (platform) {
            case "linkedin": return <Linkedin className="h-6 w-6" />;
            case "twitter": return <Twitter className="h-6 w-6" />;
            case "facebook": return <Facebook className="h-6 w-6" />;
            case "instagram": return <Instagram className="h-6 w-6" />;
            default: return <Globe className="h-6 w-6" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 font-poppins">
                <div className="animate-spin rounded-full h-40 w-40 border-t-4 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 font-poppins">
                <div className="bg-white dark:bg-gray-800 p-10 rounded-lg shadow-xl text-center max-w-lg w-full">
                    <div className="text-red-500 text-6xl mb-6">⚠️</div>
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">Error</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-lg font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Use mock data if enrolledStudents is empty
    const studentsToDisplay = enrolledStudents.length > 0 ? enrolledStudents : [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-poppins">
            <main className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-10 py-10 font-poppins">
                <div className="mb-8 border-b-2 border-gray-200 dark:border-gray-700 flex justify-between cursor-pointer"   >
                    <nav className="flex space-x-10">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`py-5 px-2 font-medium text-lg border-b-3 font-poppins ${activeTab === "profile"
                                ? "border-blue-600 text-blue-600 font-semibold"
                                : "border-transparent text-gray-500 hover:border-gray-300"
                                }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("students")}
                            className={`py-5 px-2 font-medium text-lg border-b-3 font-poppins ${activeTab === "students"
                                ? "border-blue-600 text-blue-600 font-semibold"
                                : "border-transparent text-gray-500 hover:border-gray-300"
                                }`}
                        >
                            Enrolled Students
                        </button>
                        <button
                            onClick={() => setActiveTab("courses")}
                            className={`py-5 px-2 font-medium text-lg border-b-3 font-poppins ${activeTab === "courses"
                                ? "border-blue-600 text-blue-600 font-semibold"
                                : "border-transparent text-gray-500 hover:border-gray-300"
                                }`}
                        >
                            My Contents
                        </button>
                        <button
                            onClick={() => setActiveTab("earnings")}
                            className={`py-5 px-2 font-medium text-lg border-b-3 font-poppins ${activeTab === "earnings"
                                ? "border-blue-600 text-blue-600 font-semibold"
                                : "border-transparent text-gray-500 hover:border-gray-300"
                                }`}
                        >
                            Earnings
                        </button>
                    </nav>
                    <Link to={`/updateguru/${guruId}`}>
                        <div
                            title="Update Profile"
                            className="h-12 w-12 bg-gray-400 flex justify-center items-center rounded-full">
                            <Pencil height={20} width={20} />
                        </div>
                    </Link>
                </div>

                {activeTab === "profile" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                                <div className="p-4 sm:p-6 md:p-8 lg:p-10 text-center min-h-[20rem] sm:min-h-[24rem] md:min-h-[28.2rem]">
                                    <div className="relative inline-block mt-5">
                                        <img
                                            src={`https://gurukul-backend-21h3.onrender.com/${guruData.profileImage}` || "https://img.freepik.com/free-photo/portrait-business-man-wearing-formal-suit_23-2148939117.jpg?semt=ais_hybrid&w=740"}
                                            alt="Profile"
                                            className="h-56 w-56 rounded-full object-cover border-4 border-white dark:border-gray-700 shadow-md"
                                        />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white font-poppins mb-2">
                                        {guruData.username}
                                    </h2>
                                    <p className="text-2xl text-gray-600 dark:text-gray-400 font-poppins mb-3">
                                        {guruData.category}
                                    </p>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700">
                                    <div className="p-6">
                                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 font-poppins text-lg">
                                            <Mail className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                                            <span>{guruData.email}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 font-poppins text-lg">
                                            <Phone className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                                            <span>{guruData.phone}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700 dark:text-gray-300 mb-4 font-poppins text-lg">
                                            <MapPin className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                                            <span>
                                                {guruData.address.city}, {guruData.address.state}, {guruData.address.country}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-gray-700 dark:text-gray-300 font-poppins text-lg">
                                            <DollarSign className="h-6 w-6 mr-3 text-gray-500 dark:text-gray-400" />
                                            <span>${guruData.perHourRate}/hour</span>
                                        </div>
                                    </div>
                                </div>

                                {guruData.socialLinks && guruData.socialLinks.length > 0 && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4 font-poppins text-xl">Social Links</h3>
                                        <div className="flex space-x-3">
                                            {guruData.socialLinks.map((social, index) => (
                                                <a
                                                    key={index}
                                                    href={social.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900 shadow-md transition-all duration-300"
                                                >
                                                    {getSocialIcon(social.platform)}
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl mb-8">
                                <div
                                    className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleSection("personal")}
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white font-poppins text-xl">About Me</h3>
                                    {expandedSections.personal ? (
                                        <ChevronUp className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-6 w-6 text-gray-500" />
                                    )}
                                </div>
                                {expandedSections.personal && (
                                    <div className="p-6">
                                        <p className="text-gray-700 dark:text-gray-300 font-poppins text-lg leading-relaxed">
                                            {guruData.aboutMe || "No information provided."}
                                        </p>
                                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-md">
                                                <h4 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3 font-poppins">Teaching Mode</h4>
                                                <div className="flex items-center">
                                                    <BookOpen className="h-6 w-6 mr-3 text-blue-600" />
                                                    <span className="text-gray-800 dark:text-white font-poppins text-lg">{guruData.teachingMode || "Not specified"}</span>
                                                </div>
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg shadow-md">
                                                <h4 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3 font-poppins">Experience</h4>
                                                <div className="flex items-center">
                                                    <Briefcase className="h-6 w-6 mr-3 text-blue-600" />
                                                    <span className="text-gray-800 dark:text-white font-poppins text-lg">{guruData.experience} years</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl mb-8">
                                <div
                                    className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleSection("skills")}
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white font-poppins text-xl">Skills & Languages</h3>
                                    {expandedSections.skills ? (
                                        <ChevronUp className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-6 w-6 text-gray-500" />
                                    )}
                                </div>
                                {expandedSections.skills && (
                                    <div className="p-6">
                                        <h4 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3 font-poppins">Skills</h4>
                                        <div className="flex flex-wrap gap-3 mb-6">
                                            {guruData.skills && guruData.skills.length > 0 ? (
                                                guruData.skills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-4 py-2 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-base font-medium font-poppins shadow-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400 font-poppins text-lg">No skills listed.</p>
                                            )}
                                        </div>

                                        <h4 className="text-base font-medium text-gray-500 dark:text-gray-400 mb-3 mt-6 font-poppins">Languages</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {guruData.languages && guruData.languages.length > 0 ? (
                                                guruData.languages.map((language, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-base font-medium font-poppins shadow-sm"
                                                    >
                                                        <Languages className="h-4 w-4 mr-2" />
                                                        {language}
                                                    </div>
                                                ))
                                            ) : (
                                                <p className="text-gray-500 dark:text-gray-400 font-poppins text-lg">No languages listed.</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl mb-8">
                                <div
                                    className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer"
                                    onClick={() => toggleSection("education")}
                                >
                                    <h3 className="font-semibold text-gray-900 dark:text-white font-poppins text-xl">Education</h3>
                                    {expandedSections.education ? (
                                        <ChevronUp className="h-6 w-6 text-gray-500" />
                                    ) : (
                                        <ChevronDown className="h-6 w-6 text-gray-500" />
                                    )}
                                </div>
                                {expandedSections.education && (
                                    <div className="p-6">
                                        {guruData.education && guruData.education.length > 0 ? (
                                            guruData.education.map((edu, index) => (
                                                <div
                                                    key={index}
                                                    className={`py-4 ${index !== guruData.education.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-800 dark:text-white font-poppins text-lg">{edu.degree}</h4>
                                                            <p className="text-gray-600 dark:text-gray-300 font-poppins text-base mt-1">{edu.institutionName}</p>
                                                        </div>
                                                        <div className="flex items-center text-base text-gray-500 dark:text-gray-400 font-poppins">
                                                            <Calendar className="h-5 w-5 mr-2" />
                                                            {edu.startDate} - {edu.endDate}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 dark:text-gray-400 font-poppins text-lg">No education details available.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "students" && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white font-poppins text-2xl">Enrolled Students</h3>
                        </div>
                        {studentsToDisplay && studentsToDisplay.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 font-poppins">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-8 py-4 text-left text-base font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-poppins">
                                                Student
                                            </th>
                                            <th scope="col" className="px-8 py-4 text-left text-base font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-poppins">
                                                Phone
                                            </th>
                                            <th scope="col" className="px-8 py-4 text-left text-base font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-poppins">
                                                Message
                                            </th>
                                            <th scope="col" className="px-8 py-4 text-left text-base font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider font-poppins">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {studentsToDisplay.map((student) => (
                                            <tr key={student._id} className="hover:bg-gray-700 dark:hover:bg-gray-750 transition-colors duration-150">
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-14 w-14">
                                                            <img className="h-14 w-14 rounded-full object-cover shadow-md" src={`https://gurukul-backend-21h3.onrender.com/${student.profileImage}` || "https://placehold.co/50"} alt="Student" />
                                                        </div>
                                                        <div className="ml-5">
                                                            <div className="text-base font-medium text-gray-900 dark:text-white font-poppins">{student.name}</div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400 font-poppins mt-1">{student.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap">
                                                    <div className="text-base text-gray-900 dark:text-white font-poppins">{student.phone}</div>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-base text-gray-500 dark:text-gray-400 font-poppins">
                                                    <button
                                                        className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors duration-150"
                                                        onClick={() => navigate(`/message/${student?._id}`)}
                                                    >
                                                        <MessageCircle size={24} className="text-blue-600 dark:text-blue-400" />
                                                    </button>
                                                </td>
                                                <td className="px-8 py-5 whitespace-nowrap text-start text-base font-medium">
                                                    {/* todo:- checkout */}
                                                    <Link to={`/student/studentdashboard/${student._id}`}>
                                                        <button className="text-blue-600 hover:text-blue-900 dark:hover:text-blue-400 font-poppins font-medium">
                                                            View Details
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <Users className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white font-poppins mb-2">No students yet</h3>
                                <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 font-poppins">
                                    You don't have any students enrolled in your courses yet.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "courses" && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white font-poppins text-2xl">My Contents</h3>
                        </div>
                        <div className="p-12 text-center">
                            <Book className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                            <h3 className="mt-2 text-xl font-medium text-gray-900 dark:text-white font-poppins mb-2">Add your first content here</h3>
                            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400 font-poppins mb-6">
                                Start sharing your knowledge by creating new educational content.
                            </p>
                            <Link to={"/guru/uploadcontent"}>
                                <button
                                    className="mt-4 px-6 py-3 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 font-poppins shadow-md transition-all duration-300"
                                >
                                    Upload Content
                                </button>
                            </Link>
                        </div>
                    </div>
                )}

                {activeTab === "earnings" && (
                    <div className="w-full gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl mb-8 min-h-96">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white font-poppins text-3xl">Earnings Overview</h3>
                            </div>
                            <div className="p-12 flex justify-around w-full items-center">
                                <div className="bg-gray-50 dark:bg-gray-700 flex justify-center flex-col p-10 mb-10 rounded-xl shadow-md transition-transform hover:scale-105 duration-300">
                                    <p className="text-2xl text-gray-500 dark:text-gray-400 font-poppins mb-3">Total Earnings</p>
                                    <h4 className="text-4xl min-w-96 font-bold text-gray-900 dark:text-white font-poppins">₹ {guruData.totalEarnings.toFixed(2)}</h4>
                                </div>
                                <div className="bg-gray-50 min-w-96 flex justify-center items-center dark:bg-gray-700 flex-col p-10 mb-10 rounded-xl shadow-md transition-transform hover:scale-105 duration-300">
                                    <p className="text-2xl text-gray-500 dark:text-gray-400 font-poppins mb-3">This Month</p>
                                    <h4 className="text-4xl font-bold text-gray-900 dark:text-white font-poppins">₹ {guruData.currentMonthEarnings.toFixed(2)}</h4>
                                </div>
                                <div className="bg-gray-50 min-w-96 flex justify-center items-center dark:bg-gray-700 flex-col p-10 mb-10 rounded-xl shadow-md transition-transform hover:scale-105 duration-300">
                                    <p className="text-2xl text-gray-500 dark:text-gray-400 font-poppins mb-3">Pending</p>
                                    <h4 className="text-4xl font-bold text-gray-900 dark:text-white font-poppins">₹ {guruData.pendingPayments.toFixed(2)}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default GuruDashboard;