import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ChoicePage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 px-4">
            <motion.h1
                className="text-3xl md:text-5xl font-bold mb-10 text-gray-900 dark:text-white font-inter"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                Register
            </motion.h1>

            <div className="flex flex-col md:flex-row gap-6">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    <Link to="/gururegister">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors">
                            Register as Guru
                        </button>
                    </Link>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <Link to="/studentregister">
                        <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-lg text-lg font-medium transition-colors">
                            Register as Student
                        </button>
                    </Link>
                </motion.div>
            </div>
        </div>
    );
};

export default ChoicePage;
