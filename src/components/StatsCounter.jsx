import React, { useState, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Icon = ({ className, ...rest }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className={className}
      {...rest}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
    </svg>
  );
};

const StatsCounter = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const animationControls = useAnimation();

  useEffect(() => {
    if (inView) {
      animationControls.start("visible");
    }
  }, [animationControls, inView]);

  const statVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const countVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.2 + 0.3,
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    })
  };

  const stats = [
    {
      value: 100,
      suffix: "+",
      label: "Active Gurus",
      color: "from-blue-500 to-cyan-400",
      iconColor: "blue-100 dark:blue-900",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      value: 3000,
      suffix: "+",
      label: "Active Students",
      color: "from-green-500 to-emerald-400",
      iconColor: "green-100 dark:green-900",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      value: 100,
      suffix: "+",
      label: "Institutes",
      color: "from-purple-500 to-indigo-400",
      iconColor: "purple-100 dark:purple-900",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    }
  ];

  const Counter = ({ value, suffix = "", delay = 0 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (inView) {
        let start = 0;
        const duration = 2000; // ms
        const increment = Math.ceil(value / (duration / 16)); // 16ms per frame is roughly 60fps

        // Wait for the delay before starting counting
        const timer = setTimeout(() => {
          const interval = setInterval(() => {
            start += increment;
            if (start >= value) {
              setCount(value);
              clearInterval(interval);
            } else {
              setCount(start);
            }
          }, 16);

          return () => clearInterval(interval);
        }, delay * 1000);

        return () => clearTimeout(timer);
      }
    }, [value, delay, inView]);

    return (
      <span className="flex items-center justify-center">
        <span>{count}</span>
        <span>{suffix}</span>
      </span>
    );
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={animationControls}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto"
    >
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={statVariants}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center relative overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600"
        >
          {/* Icon border decorations */}
          <Icon className="absolute top-0 left-0 w-6 h-6 text-gray-400 dark:text-gray-500 -translate-x-1/2 -translate-y-1/2" />
          <Icon className="absolute top-0 right-0 w-6 h-6 text-gray-400 dark:text-gray-500 translate-x-1/2 -translate-y-1/2" />
          <Icon className="absolute bottom-0 left-0 w-6 h-6 text-gray-400 dark:text-gray-500 -translate-x-1/2 translate-y-1/2" />
          <Icon className="absolute bottom-0 right-0 w-6 h-6 text-gray-400 dark:text-gray-500 translate-x-1/2 translate-y-1/2" />

          <div className={`absolute inset-0 bg-gradient-to-br bg-black border-white opacity-10 dark:opacity-20`}></div>

          <div className="relative z-10">
            <div className={`mx-auto w-16 h-16 mb-4 rounded-full flex items-center justify-center text-guru-blue dark:text-blue-400 bg-gray-100 dark:bg-gray-700`}>
              {stat.icon}
            </div>

            <motion.div
              custom={i}
              variants={countVariants}
              className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-2"
            >
              <Counter value={stat.value} suffix={stat.suffix} delay={i * 0.2 + 0.3} />
            </motion.div>

            <p className="text-gray-600 dark:text-gray-300 text-lg">{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default StatsCounter;