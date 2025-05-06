import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Menu, X, User, LogOut, MessageCircle, Settings } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isTutorLogin, setIsTutorLogin] = useState(false);
  const [userData, setUserData] = useState(null);
  const [imgUrl, setImageUrl] = useState("");
  const [adminData, setAdminData] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    try {
      const user = localStorage.getItem('user');
      if (user) {
        const parsedUser = JSON.parse(user);
        if (parsedUser && typeof parsedUser === 'object') {
          const imagePath = parsedUser.profileImage || "";
          setImageUrl(imagePath);
        }
      }
    } catch (error) {
      console.error("Error handling user profile image:", error);
      setImageUrl("");
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const checkUserLoggedIn = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const role = localStorage.getItem('role');
    const adminToken = localStorage.getItem("adminToken");
    const admin = localStorage.getItem("admin");

    if (token && user) {
      setIsLoggedIn(true);
      try {
        const parsedUser = JSON.parse(user);
        setUserData(parsedUser);
        setUserRole(role);

        if (role === "admin") {
          setIsAdminLoggedIn(true);
          setAdminData(parsedUser);
        }

        if (role === "tutor") {
          setIsTutorLogin(true);
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUserData(null);
      setUserRole(null);
    }

    if (adminToken && admin && !isAdminLoggedIn) {
      setIsAdminLoggedIn(true);
      try {
        setAdminData(JSON.parse(admin));
      } catch (error) {
        console.error("Error parsing admin data:", error);
      }
    }
  };

  const handleLogout = () => {
    if (isAdminLoggedIn) {
      localStorage.removeItem("adminToken");
      localStorage.removeItem("admin");
      setIsAdminLoggedIn(false);
      setAdminData(null);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    setIsLoggedIn(false);
    setUserData(null);
    setUserRole(null);
    setIsTutorLogin(false);

    navigate("/");
  };

  const navigateToDashboard = () => {
    if (isAdminLoggedIn || userRole === "admin") {
      navigate("/admin/dashboard");
    } else if (userData && userData._id) {
      if (userRole === "guru") {
        navigate(`/guru/gurudashboard/${userData._id}`);
      } else if (userRole === "student") {
        navigate(`/student/studentdashboard/${userData._id}`);
      } else if (userRole === "tutor") {
        navigate(`/tutor/tutordashboard/${userData._id}`);
      }
    } else {
      if (userRole === "guru") {
        navigate("/guru/gurudashboard");
      } else if (userRole === "student") {
        navigate("/student/studentdashboard");
      } else if (userRole === "tutor") {
        navigate("/tutor/tutordashboard");
      }
    }

    setProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const handleOpenChat = () => {
    setChatOpen(true);

    if (userRole === "guru") {
      if (userData && userData._id) {
        navigate(`/message/${userData._id}`);
      } else {
        navigate('/guru/messages');
      }
    } else {
      if (userData && userData._id) {
        navigate(`/messages/${userData._id}`);
      } else {
        navigate('/messages');
      }
    }

    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinkClass = "font-medium transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400";
  const activeNavLinkClass = "text-blue-600 dark:text-blue-400 font-semibold";

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (custom) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.4 }
    })
  };

  const getFirstName = () => {
    if (isAdminLoggedIn || userRole === "admin") {
      if (adminData && adminData.name) {
        return adminData.name.split(' ')[0];
      } else if (userData && userData.username) {
        return userData.username;
      }
      return "Admin";
    }

    if (userData) {
      if (userData.name) {
        return userData.name.split(' ')[0];
      } else if (userData.username) {
        return userData.username;
      }
    }

    if (userRole === "guru") return "Guru";
    if (userRole === "tutor") return "Tutor";
    return "Student";
  };

  // Get the profile image URL with fallback to default image
  const getProfileImageUrl = () => {
    // If there's a valid image URL, use it
    if (imgUrl && imgUrl.trim() !== "") {
      return `http://localhost:5000/${imgUrl}`;
    }
    // Otherwise return a default profile image
    return "/images/default-profile.png"; // Make sure this default image exists in your public folder
  };

  // Update the condition for showing "Find Guru"
  const shouldShowFindGuru = isLoggedIn && !isAdminLoggedIn && userRole !== "guru" && userRole !== "tutor" && userRole !== "admin";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 ${isScrolled || mobileMenuOpen
        ? "bg-white dark:bg-gray-900 shadow-md py-2"
        : "bg-white/80 dark:bg-gray-900 backdrop-blur-sm py-5"
        }`}
    >
      <div className="container-custom flex justify-between items-center">
        <motion.div
          className="flex items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to={(isAdminLoggedIn || userRole === "admin") ? "/admin/dashboard" : "/"}
            className="text-xl font-bold text-gray-900 dark:text-white flex items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <img src="/images/logo1.png" alt="" className="h-16 w-16" />
            </motion.div>
          </Link>
        </motion.div>

        <nav className="hidden md:flex items-center space-x-6">
          {/* Show "Find Guru" only for students (not for gurus, tutors, or admins) */}
          {shouldShowFindGuru && (
            <motion.div
              custom={1}
              variants={navItemVariants}
              initial="hidden"
              animate="visible"
            >
              <Link
                to="/findguru"
                className={`${navLinkClass} ${location.pathname === '/findguru' ? activeNavLinkClass : ''}`}
              >
                Find Guru
              </Link>
            </motion.div>
          )}

          <motion.div
            custom={2}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <Link
              to="/help"
              className={`${navLinkClass} ${location.pathname === '/help' ? activeNavLinkClass : ''}`}
            >
              Help
            </Link>
          </motion.div>

          {isLoggedIn || isAdminLoggedIn ? (
            <div className="flex items-center space-x-6">
              <motion.div
                custom={3}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                className="relative"
              >
                <motion.button
                  onClick={toggleProfileDropdown}
                  className={`flex items-center space-x-2 py-2 px-3 rounded-lg dark:bg-gray-800 bg-slate-200 transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center text-white overflow-hidden">
                    <img
                      src={getProfileImageUrl()}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <span className="font-medium text-gray-900 dark:text-white">
                    {getFirstName()}
                  </span>
                </motion.button>
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-1 z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <button
                        onClick={navigateToDashboard}
                        className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Dashboard
                      </button>

                      {(isAdminLoggedIn || userRole === "admin") && (
                        <Link
                          to="/admin/settings"
                          className="flex items-center w-full px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </Link>
                      )}

                      {userRole === "guru" && !isAdminLoggedIn && userRole !== "admin" && (
                        <button
                          onClick={handleOpenChat}
                          className="flex items-center w-full px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Messages
                        </button>
                      )}

                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ) : (
            <>
              <motion.div
                custom={3}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link
                  to={userRole === "admin" ? "/admin/admindashboard" : "/login"}
                  className={`${navLinkClass} ${location.pathname === '/login' ? activeNavLinkClass : ''}`}
                >
                  Log in
                </Link>
              </motion.div>

              <motion.div
                custom={4}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
              >
                <Link to="/choice">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-medium transition-colors"
                  >
                    Sign Up
                  </motion.div>
                </Link>
              </motion.div>
            </>
          )}

          <motion.div
            custom={6}
            variants={navItemVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5 text-yellow-400" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </motion.button>
          </motion.div>
        </nav>

        {/* Mobile buttons */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Message button for guru on mobile */}
          {isLoggedIn && userRole === "guru" && !isAdminLoggedIn && userRole !== "admin" && (
            <motion.button
              onClick={handleOpenChat}
              className="p-2 rounded-full bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300"
              aria-label="Messages"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="h-5 w-5" />
            </motion.button>
          )}

          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
            aria-label="Toggle theme"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-gray-700" />
            )}
          </motion.button>
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-900 shadow-md overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-custom py-4 flex flex-col space-y-2">
              {/* Admin menu items */}
              {(isAdminLoggedIn || userRole === "admin") && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0 }}
                  >
                    <Link
                      to="/admin/manage-users"
                      className={`block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ${location.pathname === '/admin/manage-users' ? 'text-red-600 dark:text-red-400 font-medium' : ''
                        }`}
                    >
                      Manage Users
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 }}
                  >
                    <Link
                      to="/admin/settings"
                      className={`block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ${location.pathname === '/admin/settings' ? 'text-red-600 dark:text-red-400 font-medium' : ''
                        }`}
                    >
                      Settings
                    </Link>
                  </motion.div>
                </>
              )}

              {/* Regular user menu items - only show Find Guru for students (not tutors/gurus/admins) */}
              {shouldShowFindGuru && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0 }}
                >
                  <Link
                    to="/findguru"
                    className={`block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ${location.pathname === '/findguru' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                      }`}
                  >
                    Find Guru
                  </Link>
                </motion.div>
              )}

              {/* Message section in mobile menu for guru users */}
              {isLoggedIn && userRole === "guru" && !isAdminLoggedIn && userRole !== "admin" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.05 }}
                >
                  <button
                    onClick={handleOpenChat}
                    className={`flex items-center w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ${location.pathname.includes('/guru/messages') ? 'text-green-600 dark:text-green-400 font-medium' : ''
                      }`}
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Messages
                  </button>
                </motion.div>
              )}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Link
                  to="/help"
                  className={`block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ${location.pathname === '/help' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                    }`}
                >
                  Help
                </Link>
              </motion.div>

              {isLoggedIn || isAdminLoggedIn ? (
                <>
                  {!isAdminLoggedIn && userRole !== "admin" && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {userRole === "guru" ? (
                        <Link
                          to={userData && userData._id ? `/guru/profile/${userData._id}` : "/guru/profile"}
                          className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          My Profile
                        </Link>
                      ) : userRole === "tutor" ? (
                        <Link
                          to={userData && userData._id ? `/tutor/profile/${userData._id}` : "/tutor/profile"}
                          className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          My Profile
                        </Link>
                      ) : (
                        <Link
                          to={userData && userData._id ? `/student/profile/${userData._id}` : "/student/profile"}
                          className="block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                        >
                          My Profile
                        </Link>
                      )}
                    </motion.div>
                  )}

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <button
                      onClick={navigateToDashboard}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      Dashboard
                    </button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Link
                      to="/login"
                      className={`block px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg ${location.pathname === '/login' ? 'text-blue-600 dark:text-blue-400 font-medium' : ''
                        }`}
                    >
                      Log in
                    </Link>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Link
                      to="/choice"
                      className="block mt-2"
                    >
                      <div className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-5 rounded-lg font-medium text-center transition-colors">
                        Sign Up
                      </div>
                    </Link>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;