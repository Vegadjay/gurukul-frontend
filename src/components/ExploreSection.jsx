import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CourseGrid from "./TreandingCourse";

const ExploreSection = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">


        <CourseGrid />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeIn}
          className="mt-16 text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Link
              to="/findguru"
              className="px-10 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Courses
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreSection;