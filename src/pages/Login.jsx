import React, { useState } from "react";
import { Mail, Lock, ArrowRight, User, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [userType, setUserType] = useState("guru");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {

      console.log("Sending login request with:", {
        role: userType,
        email,
        password
      });

      const response = await fetch("https://gurukul-backend-21h3.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: userType,
          email,
          password
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);
      if (response.ok && data.success) {
        if (rememberMe) {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("role", userType);
        } else {
          localStorage.setItem("token", data.data.token);
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("role", userType);
        }

        toast.success(data.message, {
          description: `Welcome back to Guruqool as a ${userType}!`
        });

        const userId = data.data.user._id || data.data.user.id;

        if (userType === "student") {
          navigateTo(`/student/studentdashboard/${userId}`);
        } else {
          navigateTo(`/guru/gurudashboard/${userId}`);
        }
      } else {
        toast.error("Login failed", {
          description: data.message || "Invalid credentials"
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed", {
        description: error.message || "Could not connect to the server. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 font-inter">
              Welcome back
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Sign in to continue your {userType === "student" ? "learning" : "teaching"} journey
            </p>
          </div>

          <div className="mb-6">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${userType === "student"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-guru-dark dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
                  }`}
                onClick={() => handleUserTypeChange("student")}
              >
                <div className="flex items-center justify-center">
                  <User className="h-4 w-4 mr-2" />
                  Student
                </div>
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-md transition-colors ${userType === "guru"
                  ? "bg-white dark:bg-gray-800 shadow-sm text-guru-dark dark:text-white"
                  : "text-gray-600 dark:text-gray-300"
                  }`}
                onClick={() => handleUserTypeChange("guru")}
              >
                <div className="flex items-center justify-center">
                  <User className="h-4 w-4 mr-2" />
                  Guru
                </div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Email address
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                  placeholder={userType === "student" ? "student@example.com" : "guru@example.com"}
                />
              </div>
            </div>

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
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 block w-full border border-gray-300 dark:border-gray-600 rounded-lg py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-guru-blue focus:border-transparent"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-guru-blue focus:ring-guru-blue border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-guru-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in as {userType}...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in as {userType} <ArrowRight className="ml-2 h-5 w-5" />
                </span>
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <a
                href="/choice"
                className="font-medium text-guru-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign up now
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;