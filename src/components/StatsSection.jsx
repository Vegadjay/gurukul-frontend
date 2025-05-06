
import React from "react";
import { motion } from "framer-motion";
import StatsCounter from "./StatsCounter";
import AnimatedHeading from '../components/ui/underline-svg'

const StatsSection = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-6xl font-sf font-bold mb-4 text-center text-gray-900 dark:text-white">
            <AnimatedHeading title={"Our Growing Community"} />
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of students and educators on their learning journey
          </p>
        </motion.div>

        <StatsCounter />
      </div>
    </section>
  );
};

export default StatsSection;
