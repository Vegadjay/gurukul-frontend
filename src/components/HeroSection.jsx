import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ColourfulText } from "./ui/colourful-text";

const HeroSection = () => {
  return (
    <section className="pt-32 pb-16 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-bold text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
              Guruqool.com
            </span>
          </motion.h1>

          <motion.p
            className="text-2xl text-gray-600 dark:text-gray-300 mb-8 mx-auto max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Guruqool blends the best of physical and digital education to create an ecosystem where students thrive, teachers inspire, and learning never stops.
          </motion.p>

          <motion.div
            className="relative rounded-xl overflow-hidden shadow-xl mx-auto max-w-6xl mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <img
              src="/images/main-guruqool.png"
              alt="Guruqool Hero"
              className="w-full h-auto rounded-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Link
              to="/findguru"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <motion.span
                className="flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Find your Guru <ArrowRight className="ml-2 h-5 w-5" />
              </motion.span>
            </Link>
            <Link
              to="/signup"
              className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-all duration-300"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Become a Guru
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;