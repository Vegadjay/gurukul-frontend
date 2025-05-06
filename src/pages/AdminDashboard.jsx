"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Calendar,
    ChevronLeft,
    ChevronRight,
    User,
    Users,
    Receipt,
    Loader,
    AlertCircle,
    CreditCardIcon as PaymentIcon,
    DollarSign,
    CheckCircle,
    Save,
    Edit,
    XSquare,
} from "lucide-react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function AdminDashboard() {
    const [darkMode, setDarkMode] = useState(false)
    const navigate = useNavigate()
    const [students, setStudents] = useState([])
    const [transactions, setTransactions] = useState([])
    const [teachers, setTeachers] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [activeTab, setActiveTab] = useState("students")
    const [loading, setLoading] = useState(true)
    const [pendingPayments, setPendingPayments] = useState([])
    const [processingPayment, setProcessingPayment] = useState(false)
    const [sessions, setSessions] = useState([])
    const [completingSession, setCompletingSession] = useState(false)
    const [teacherStats, setTeacherStats] = useState([])
    const [editingPrice, setEditingPrice] = useState(null)
    const [newPrice, setNewPrice] = useState("")
    const [updatingPrice, setUpdatingPrice] = useState(false)



    const [currentStudentPage, setCurrentStudentPage] = useState(1)
    const [currentTeacherPage, setCurrentTeacherPage] = useState(1)
    const [currentTransactionPage, setCurrentTransactionPage] = useState(1)
    const [currentPendingPage, setCurrentPendingPage] = useState(1)
    const [currentSessionPage, setCurrentSessionPage] = useState(1)
    const [currentStatsPage, setCurrentStatsPage] = useState(1)
    const itemsPerPage = 5

    useEffect(() => {
        setCurrentStudentPage(1)
        setCurrentTeacherPage(1)
        setCurrentTransactionPage(1)
        setCurrentPendingPage(1)
        setCurrentSessionPage(1)
        setCurrentStatsPage(1)
    }, [searchTerm])



    const handleTabChange = (tab) => {
        setActiveTab(tab)
        setSearchTerm("")
        setEditingPrice(null)
        setNewPrice("")
    }

    const fetchAllStudents = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/student", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json())

            if (response.error === 0) {
                setStudents(response.data)
            } else {
                toast.error("Error fetching students data")
            }
        } catch (error) {
            toast.error("Error fetching students data")
        }
    }

    const fetchAllTeachers = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/guru", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json())

            if (response.error === 0) {
                setTeachers(response.data)
            } else {
                toast.error("Error fetching teachers data")
            }
        } catch (error) {
            toast.error("Error fetching teachers data")
        }
    }

    const fetchTransactions = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/transaction", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json())

            if (response.error === 0) {
                const allTransactions = response.data
                const pending = allTransactions.filter((t) => !t.paidToTeacher)

                setPendingPayments(pending)
                setTransactions(allTransactions)
            } else {
                toast.error("Error fetching transactions data")
            }
        } catch (error) {
            toast.error("Error fetching transactions data")
        }
    }

    const fetchSessions = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/session", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json())
            console.log(response);
            if (response.error === 0) {
                setSessions(response.data)
            } else {
                throw new Error("Error fetching sessions data");
            }
        } catch (error) {
            toast.error("Error fetching sessions data");
            setSessions([]);
        }
    }

    const calculateTeacherStats = () => {
        const stats = []

        const teacherGroups = {}

        sessions.forEach((session) => {
            const teacherId = session.guruId?._id
            if (!teacherId) return

            if (!teacherGroups[teacherId]) {
                teacherGroups[teacherId] = {
                    teacher: session.guruId,
                    totalSessions: 0,
                    completedSessions: 0,
                    pendingSessions: 0,
                    totalAmount: 0,
                    pricePerSession: session.pricePerSession || session.amount || 0,
                }
            }

            teacherGroups[teacherId].totalSessions++

            if (session.status) {
                teacherGroups[teacherId].completedSessions++
                teacherGroups[teacherId].totalAmount += Number(session.amount || 0)
            } else {
                teacherGroups[teacherId].pendingSessions++
            }
        })

        Object.values(teacherGroups).forEach((stats) => {
            if (!stats.teacher) return

            const teacherData = teachers.find((t) => t._id === stats.teacher._id)
            if (teacherData) {
                stats.teacher = teacherData
            }

            stats.avgPerSession = stats.completedSessions > 0 ? (stats.totalAmount / stats.completedSessions).toFixed(2) : 0

            stats.totalSessions = stats.completedSessions + stats.pendingSessions
        })

        setTeacherStats(Object.values(teacherGroups))
    }

    const processPaymentToTeacher = async (transactionId, techer, amount) => {
        console.log(transactionId, " this is me", techer, amount, " this is me")
        try {
            setProcessingPayment(true)
            const response = await fetch(`http://localhost:5000/api/guru/transfer-payment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    receiverId: techer,
                    amount: amount,
                    transactionId: transactionId
                })
            }).then((res) => res.json());

            if (response.error === 0) {
                toast.success("Payment successfully transferred to teacher")
                await fetchTransactions()
                await fetchSessions()
            } else {
                toast.error(response.message || "Error processing payment")
            }
        } catch (error) {
            toast.error("Error processing payment")
        } finally {
            setProcessingPayment(false)
        }
    }

    const completeSession = async (sessionId) => {
        console.log(sessionId);
        try {
            setCompletingSession(true)
            const response = await fetch(`http://localhost:5000/api/session/${sessionId}/complete`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json())

            if (response.error === 0) {
                toast.success("Session marked as completed")
                const session = sessions.find((s) => s._id === sessionId)
                if (session) {
                    await processPaymentToTeacher(session._id)
                }
                await fetchSessions()
                await fetchTransactions()
                calculateTeacherStats()
            } else {
                toast.success("Session marked as completed")

                setSessions((prevSessions) =>
                    prevSessions.map((s) => (s._id === sessionId ? { ...s, status: "completed" } : s)),
                )

                setTransactions((prevTransactions) =>
                    prevTransactions.map((t) => (t._id === sessionId ? { ...t, paidToTeacher: true } : t)),
                )

                setPendingPayments((prevPending) => prevPending.filter((p) => p._id !== sessionId))

                calculateTeacherStats()
            }
        } catch (error) {
            toast.error("Error completing session")
        } finally {
            setCompletingSession(false)
        }
    }

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        document.body.appendChild(script);
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
            setDarkMode(true)
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }

        const fetchData = async () => {
            setLoading(true)
            await Promise.all([fetchAllTeachers(), fetchAllStudents(), fetchTransactions()])
            setLoading(false)

            await fetchSessions()

            // Calculate teacher stats after sessions are loaded
            calculateTeacherStats()
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (sessions.length > 0 && teachers.length > 0) {
            calculateTeacherStats()
        }
    }, [sessions.length, teachers.length])

    const filteredStudents = students.filter(
        (student) =>
            student.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredTeachers = teachers.filter(
        (teacher) =>
            teacher.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            teacher.email?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredTransactions = transactions.filter(
        (transaction) =>
            transaction.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.guruId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            transaction.studentId?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredPendingPayments = pendingPayments.filter(
        (payment) =>
            payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.guruId?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.studentId?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredSessions = sessions.filter(
        (session) =>
            session.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.guru?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            session.student?.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const filteredTeacherStats = teacherStats.filter(
        (stat) =>
            stat.teacher?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stat.teacher?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            stat.teacher?.category?.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const paginatedStudents = filteredStudents.slice(
        (currentStudentPage - 1) * itemsPerPage,
        currentStudentPage * itemsPerPage,
    )

    const paginatedTeachers = filteredTeachers.slice(
        (currentTeacherPage - 1) * itemsPerPage,
        currentTeacherPage * itemsPerPage,
    )

    const paginatedTransactions = filteredTransactions.slice(
        (currentTransactionPage - 1) * itemsPerPage,
        currentTransactionPage * itemsPerPage,
    )

    const paginatedPendingPayments = filteredPendingPayments.slice(
        (currentPendingPage - 1) * itemsPerPage,
        currentPendingPage * itemsPerPage,
    )

    const paginatedSessions = filteredSessions.slice(
        (currentSessionPage - 1) * itemsPerPage,
        currentSessionPage * itemsPerPage,
    )

    const paginatedTeacherStats = filteredTeacherStats.slice(
        (currentStatsPage - 1) * itemsPerPage,
        currentStatsPage * itemsPerPage,
    )

    const studentsPageCount = Math.ceil(filteredStudents.length / itemsPerPage)
    const teachersPageCount = Math.ceil(filteredTeachers.length / itemsPerPage)
    const transactionsPageCount = Math.ceil(filteredTransactions.length / itemsPerPage)
    const pendingPaymentsPageCount = Math.ceil(filteredPendingPayments.length / itemsPerPage)
    const sessionsPageCount = Math.ceil(filteredSessions.length / itemsPerPage)
    const teacherStatsPageCount = Math.ceil(filteredTeacherStats.length / itemsPerPage)

    const Pagination = ({ currentPage, setCurrentPage, pageCount }) => {
        return (
            <div className="flex items-center justify-center mt-6 space-x-2">
                <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                >
                    <ChevronLeft size={18} />
                </button>
                <span className="px-4 py-2 text-sm font-medium">
                    {currentPage} of {pageCount || 1}
                </span>
                <button
                    onClick={() => setCurrentPage(Math.min(pageCount, currentPage + 1))}
                    disabled={currentPage === pageCount || pageCount === 0}
                    className="p-2 rounded-md bg-gray-200 dark:bg-gray-700 disabled:opacity-50"
                >
                    <ChevronRight size={18} />
                </button>
            </div>
        )
    }

    const EmptyState = ({ type }) => (
        <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle size={48} className="text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-500 dark:text-gray-400">No {type} found</h3>
            <p className="text-gray-400 dark:text-gray-500 mt-2">
                {searchTerm ? `No results match "${searchTerm}"` : `There are no ${type} available in the system.`}
            </p>
        </div>
    )

    const LoadingState = () => (
        <div className="flex items-center justify-center py-12">
            <Loader size={40} className="animate-spin text-blue-500" />
        </div>
    )

    const deleteStudent = async (studentId) => {
        toast.success("User deleted successfully");
        console.log(studentId)
    }

    const openRazorpay = async (paymentId) => {
        setProcessingPayment(true);
        try {
            // Get the payment details from the pending payments
            const payment = pendingPayments.find(p => p._id === paymentId);
            if (!payment) {
                toast.error("Payment details not found");
                setProcessingPayment(false);
                return;
            }

            const amount = payment.amount;
            const teacherName = payment.guruId?.username || "Teacher";
            const teacherEmail = payment.guruId?.email || "teacher@example.com";
            const teacherPhone = payment.guruId?.phone || "";

            // Create order in backend
            const response = await fetch("http://localhost:5000/api/payment/create-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    amount,
                    transactionId: payment.transactionId,
                    teacherId: payment.guruId?._id,
                    paymentId: paymentId
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to create order");
            }

            const order = await response.json();

            const options = {
                key: "rzp_test_EfZ5xkx1ssjM7g",
                amount: amount * 100,
                currency: "INR",
                name: "Guruqool.com",
                description: `Payment to teacher: ${teacherName}`,
                order_id: order.id,
                handler: async function (response) {
                    try {

                        console.log(response, " [[");
                        if (response.razorpay_payment_id != "") {
                            toast.success("Payment successful");
                            await processPaymentToTeacher(paymentId, payment.guruId?._id, amount);
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error("Error processing payment");
                    } finally {
                        setProcessingPayment(false);
                    }
                },
                prefill: {
                    name: teacherName,
                    email: teacherEmail,
                    contact: teacherPhone,
                },
                notes: {
                    transactionId: payment.transactionId,
                    teacherId: payment.guruId?._id,
                    paymentId: paymentId
                },
                theme: {
                    color: "#6366f1",
                },
                modal: {
                    ondismiss: function () {
                        setProcessingPayment(false);
                        toast.info("Payment cancelled");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Failed to create Razorpay order:", err);
            toast.error("Failed to initiate payment");
            setProcessingPayment(false);
        }
    };

    return (
        <div
            className={`min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-8 flex flex-col ${darkMode ? "dark" : ""}`}
        >
            <div className="w-full mx-auto">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins">Admin Dashboard</h1>
                    </div>

                    <div className="p-4 sm:p-6">
                        <div className="flex flex-wrap mb-6 gap-2">
                            <button
                                onClick={() => handleTabChange("students")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${activeTab === "students"
                                    ? "bg-blue-600 text-white shadow-md dark:bg-blue-700 dark:text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                <User size={18} /> Students
                            </button>
                            <button
                                onClick={() => handleTabChange("teachers")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${activeTab === "teachers"
                                    ? "bg-blue-600 text-white shadow-md dark:bg-blue-700 dark:text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                <Users size={18} /> Teachers
                            </button>
                            <button
                                onClick={() => handleTabChange("sessions")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${activeTab === "sessions"
                                    ? "bg-blue-600 text-white shadow-md dark:bg-blue-700 dark:text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                <Calendar size={18} /> Sessions
                            </button>
                            <button
                                onClick={() => handleTabChange("transactions")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${activeTab === "transactions"
                                    ? "bg-blue-600 text-white shadow-md dark:bg-blue-700 dark:text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                <Receipt size={18} /> Transactions
                            </button>
                            <button
                                onClick={() => handleTabChange("pending_payments")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-base font-medium transition-all ${activeTab === "pending_payments"
                                    ? "bg-blue-600 text-white shadow-md dark:bg-blue-700 dark:text-white"
                                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                    }`}
                            >
                                <PaymentIcon size={18} /> Pending Payments
                            </button>
                        </div>

                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab.replace("_", " ")}...`}
                                    className="w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 px-5 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent shadow-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute right-4 top-3.5 h-6 w-6 text-gray-400" />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                            {loading ? (
                                <LoadingState />
                            ) : (
                                <>
                                    {activeTab === "students" && (
                                        <div>
                                            {paginatedStudents.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    Username
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    Email
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    Phone
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    Location
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    Action
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {paginatedStudents.map((student) => (
                                                                <tr key={student._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                                                                                {student.profileImage ? (
                                                                                    <img
                                                                                        src={`http://localhost:5000/${student.profileImage}`}
                                                                                        alt={student.username}
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="h-full w-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-500">
                                                                                        <User size={20} />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                {student.username}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {student.email}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {student.phone}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {student.address?.city}, {student.address?.country}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        <div className="flex space-x-2">
                                                                            <button
                                                                                onClick={() => {
                                                                                    navigate(`/student/studentdashboard/${student._id}`, { replace: true })
                                                                                }}
                                                                                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                                            >
                                                                                View
                                                                            </button>
                                                                            <button
                                                                                onClick={() => {
                                                                                    deleteStudent(student._id)
                                                                                }}
                                                                                className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                                                                            >
                                                                                Delete
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
                                                        currentPage={currentStudentPage}
                                                        setCurrentPage={setCurrentStudentPage}
                                                        pageCount={studentsPageCount}
                                                    />
                                                </div>
                                            ) : (
                                                <EmptyState type="students" />
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "teachers" && (
                                        <div>
                                            {paginatedTeachers.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Username{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Email{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Category{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Experience{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Action{" "}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {paginatedTeachers.map((teacher) => (
                                                                <tr key={teacher._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <div className="flex items-center">
                                                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden mr-3">
                                                                                {teacher.profileImage ? (
                                                                                    <img
                                                                                        src={`http://localhost:5000/${teacher.profileImage}`}
                                                                                        alt={teacher.username}
                                                                                        className="h-full w-full object-cover"
                                                                                    />
                                                                                ) : (
                                                                                    <div className="h-full w-full flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-500">
                                                                                        <Users size={20} />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                                {" "}
                                                                                {teacher.username}{" "}
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {teacher.email}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {teacher.category || "Not Specified"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {teacher.experience} years
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        <div className="flex space-x-2">
                                                                            <button
                                                                                onClick={() => {
                                                                                    navigate(`/guru/gurudashboard/${teacher._id}`, { replace: true })
                                                                                }}
                                                                                className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                                                            >
                                                                                View
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
                                                        currentPage={currentTeacherPage}
                                                        setCurrentPage={setCurrentTeacherPage}
                                                        pageCount={teachersPageCount}
                                                    />
                                                </div>
                                            ) : (
                                                <EmptyState type="teachers" />
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "transactions" && (
                                        <div>
                                            {paginatedTransactions.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Transaction ID
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Student{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Teacher{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Amount{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Date{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Status{" "}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {paginatedTransactions.map((transaction) => (
                                                                <tr key={transaction._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                                        {transaction.transactionId}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {transaction.studentId?.username || "Unknown"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {transaction.guruId?.username || "Unknown"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        ₹{transaction.amount}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {new Date(transaction.date).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span
                                                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.paidToTeacher ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"}`}
                                                                        >
                                                                            {transaction.paidToTeacher ? "Paid to Teacher" : "Pending Payment"}
                                                                        </span>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
                                                        currentPage={currentTransactionPage}
                                                        setCurrentPage={setCurrentTransactionPage}
                                                        pageCount={transactionsPageCount}
                                                    />
                                                </div>
                                            ) : (
                                                <EmptyState type="transactions" />
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "pending_payments" && (
                                        <div>
                                            {paginatedPendingPayments.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Transaction ID
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Teacher{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Student{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Amount{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Date{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Action{" "}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {paginatedPendingPayments.map((payment) => (
                                                                <tr key={payment._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                                        {payment.transactionId}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {payment.guruId?.username || "Unknown"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {payment.studentId?.username || "Unknown"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        ₹{payment.amount}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {new Date(payment.date).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        <button
                                                                            onClick={() => openRazorpay(payment._id)}
                                                                            disabled={processingPayment}
                                                                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 rounded-lg disabled:opacity-50"
                                                                        >
                                                                            {processingPayment ? (
                                                                                <>
                                                                                    <Loader size={14} className="animate-spin mr-1" />
                                                                                    Processing...
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <DollarSign size={14} className="mr-1" />
                                                                                    Pay Teacher
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
                                                        currentPage={currentPendingPage}
                                                        setCurrentPage={setCurrentPendingPage}
                                                        pageCount={pendingPaymentsPageCount}
                                                    />
                                                </div>
                                            ) : (
                                                <EmptyState type="pending payments" />
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "sessions" && (
                                        <div>
                                            {paginatedSessions.length > 0 ? (
                                                <div className="overflow-x-auto">
                                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                                        <thead className="bg-gray-50 dark:bg-gray-900">
                                                            <tr>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Student{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Teacher{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Date{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Time{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Duration{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Price{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Status{" "}
                                                                </th>
                                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                                    {" "}
                                                                    Action{" "}
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                                            {paginatedSessions.map((session) => (
                                                                <tr key={session._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {session.student?.username || "Unknown"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {session.guru?.username || "Unknown"}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {new Date(session.date).toLocaleDateString()}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {session.time}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        {session.duration}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                                        ${session.price}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                                        <span
                                                                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
            ${session.status === "scheduled" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300" : ""}
            ${session.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""}
            ${session.status === "cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300" : ""}
        `}
                                                                        >
                                                                            {session.status}
                                                                        </span>
                                                                    </td>

                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                        {session.status == "scheduled" && (
                                                                            <button
                                                                                onClick={() => completeSession(session._id)}
                                                                                disabled={completingSession}
                                                                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 rounded-lg disabled:opacity-50"
                                                                            >
                                                                                {session.status != "scheduled" ? (
                                                                                    <>
                                                                                        <Loader size={14} className="animate-spin mr-1" />
                                                                                        Processing...
                                                                                    </>
                                                                                ) : (
                                                                                    <>
                                                                                        <CheckCircle size={14} className="mr-1" />
                                                                                        Mark Complete
                                                                                    </>
                                                                                )}
                                                                            </button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
                                                        currentPage={currentSessionPage}
                                                        setCurrentPage={setCurrentSessionPage}
                                                        pageCount={sessionsPageCount}
                                                    />
                                                </div>
                                            ) : (
                                                <EmptyState type="sessions" />
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
