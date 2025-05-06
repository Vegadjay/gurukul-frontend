
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ArrowRight, CheckCircle, School, Award, Briefcase, Bookmark, Star } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "../components/ui/input-otp";

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

const Signup = () => {
  const [userType, setUserType] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Student specific fields
    standard: "",
    school: "",
    cgpa: "",
    // Guru specific fields
    specialization: "",
    experience: "",
    workplace: ""
  });
  
  const [step, setStep] = useState(1);
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSendOTP = () => {
    if (!formData.email || !formData.email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Simulate sending OTP
    toast.success("OTP sent successfully", {
      description: "Check your email for the verification code"
    });
    
    setOtpSent(true);
  };
  
  const handleVerifyOTP = () => {
    if (otpValue.length !== 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    
    // Simulate OTP verification
    toast.success("Email verified successfully");
    setOtpVerified(true);
    setStep(2);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (step === 2) {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords don't match", {
          description: "Please ensure both passwords are identical"
        });
        return;
      }
      
      setStep(3);
      return;
    }
    
    if (step === 3) {
      // In a real app, this would send data to the server
      toast.success("Account created successfully", {
        description: `Welcome to Guruqool! You've signed up as a ${userType}.`
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        standard: "",
        school: "",
        cgpa: "",
        specialization: "",
        experience: "",
        workplace: ""
      });
      setStep(1);
      setOtpSent(false);
      setOtpVerified(false);
      setOtpValue("");
    }
  };

  const benefitsForStudent = [
    "Learn from verified, expert tutors",
    "Flexible scheduling that fits your lifestyle",
    "One-on-one personalized attention",
    "First lesson free with many tutors"
  ];

  const benefitsForGuru = [
    "Share your expertise and knowledge",
    "Set your own rates and availability",
    "Connect with motivated students",
    "Build your teaching portfolio"
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
            {/* Left Column - Form */}
            <div className="p-8">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Join Guruqool
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Create an account to start your learning journey
                </p>
              </div>

              {/* User Type Selector */}
              <div className="mb-6">
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                      userType === "student"
                        ? "bg-white dark:bg-gray-800 shadow-sm text-guru-dark dark:text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    onClick={() => setUserType("student")}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                      userType === "guru"
                        ? "bg-white dark:bg-gray-800 shadow-sm text-guru-dark dark:text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                    onClick={() => setUserType("guru")}
                  >
                    Guru
                  </button>
                </div>
              </div>

              {/* Form Steps */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <>
                    {/* Step 1: Basic Info & OTP */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
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
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={otpSent}
                        />
                        {!otpSent && (
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                              type="button"
                              onClick={handleSendOTP}
                              className="text-sm font-medium text-guru-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              Send OTP
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {otpSent && !otpVerified && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
                      >
                        <label
                          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-3"
                        >
                          Enter Verification Code
                        </label>
                        
                        <div className="flex justify-center mb-4">
                          <InputOTP 
                            maxLength={6}
                            value={otpValue}
                            onChange={setOtpValue}
                          >
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                          >
                            Resend OTP
                          </button>
                          <button
                            type="button"
                            onClick={handleVerifyOTP}
                            className="text-sm font-medium bg-guru-blue text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Verify Email
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </>
                )}
                
                {step === 2 && (
                  <>
                    {/* Step 2: Password */}
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete="new-password"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="••••••••"
                          minLength={8}
                          value={formData.password}
                          onChange={handleInputChange}
                        />
                      </div>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {step === 3 && userType === "student" && (
                  <>
                    {/* Step 3: Student Additional Info */}
                    <div>
                      <label
                        htmlFor="standard"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Standard / Grade / Year
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <School className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="standard"
                          name="standard"
                          type="text"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="10th Grade / 3rd Year College"
                          value={formData.standard}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="school"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        School / University
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Bookmark className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="school"
                          name="school"
                          type="text"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="Oxford University"
                          value={formData.school}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="cgpa"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Current CGPA / Marks (%)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Star className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="cgpa"
                          name="cgpa"
                          type="text"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="3.5 GPA / 85%"
                          value={formData.cgpa}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}
                
                {step === 3 && userType === "guru" && (
                  <>
                    {/* Step 3: Guru Additional Info */}
                    <div>
                      <label
                        htmlFor="specialization"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Specialization / Degree
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Award className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="specialization"
                          name="specialization"
                          type="text"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="PhD in Mathematics / Master's in Music"
                          value={formData.specialization}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Experience (Years)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="experience"
                          name="experience"
                          type="text"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="5 years"
                          value={formData.experience}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="workplace"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                      >
                        Previous/Current Workplace
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Bookmark className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="workplace"
                          name="workplace"
                          type="text"
                          required
                          className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                          placeholder="University of Cambridge / Private Tutor"
                          value={formData.workplace}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="flex items-center">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-guru-blue focus:ring-guru-blue border-gray-300 rounded"
                  />
                  <label
                    htmlFor="agree-terms"
                    className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                  >
                    I agree to the{" "}
                    <a href="#" className="text-guru-blue hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-guru-blue hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full flex justify-center items-center py-3"
                  disabled={step === 1 && !otpVerified}
                >
                  {step === 1 ? (
                    <>
                      {otpVerified ? "Continue" : "Verify Email First"}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  ) : step === 2 ? (
                    <>
                      Continue <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  ) : (
                    <>
                      Create Account <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Already have an account?{" "}
                    <Link
                      to="/login"
                      className="font-medium text-guru-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Sign in
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Right Column - Benefits */}
            <div className="bg-gradient-to-br from-guru-blue to-blue-700 dark:from-blue-800 dark:to-blue-900 p-8 text-white flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-6">
                {userType === "student" ? "Learn with the best" : "Share your knowledge"}
              </h2>

              <ul className="space-y-4">
                {(userType === "student" ? benefitsForStudent : benefitsForGuru).map((benefit, index) => (
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
                    {userType === "student"
                      ? "Join thousands of students who have found their perfect tutor on Guruqool."
                      : "Join our community of expert tutors and start teaching your way."}
                  </p>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-8 w-8 rounded-full overflow-hidden border-2 border-guru-blue dark:border-blue-900">
                        <img 
                          src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} 
                          alt={`User ${i}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="h-8 w-8 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-white text-xs border-2 border-guru-blue dark:border-blue-900">
                      +250
                    </div>
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

export default Signup;
