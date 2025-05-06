import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function AnimatedHeading({ title }) {
    const textRef = useRef(null);
    const [textWidth, setTextWidth] = useState(0);

    useEffect(() => {
        if (textRef.current) {
            // Get text width after render
            const width = textRef.current.getBoundingClientRect().width;
            setTextWidth(width);
        }
    }, [title]);

    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const drawPath = {
        hidden: { pathLength: 0 },
        visible: {
            pathLength: 1,
            transition: {
                duration: 1.2,
                ease: "easeInOut",
                delay: 0.3
            }
        }
    };

    // Calculate the width of the underline (smaller than text width)
    const lineWidth = textWidth > 0 ? Math.min(440, textWidth * 0.6) : 220;
    // Increase the height to allow for more pronounced curve
    const svgHeight = 20;

    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="mb-16 text-center"
        >
            <div className="relative inline-block text-center">
                <motion.h2
                    ref={textRef}
                    variants={fadeIn}
                    className="text-6xl font-poppins font-bold mb-4 text-black dark:text-white"
                >
                    {title}
                </motion.h2>

                <div className="flex justify-center">
                    {textWidth > 0 && (
                        <motion.svg
                            width={lineWidth}
                            height={svgHeight}
                            viewBox={`0 0 ${lineWidth} ${svgHeight}`}
                            preserveAspectRatio="xMidYMid meet"
                            className="mt-1"
                        >
                            {/* More pronounced upward curve using quadratic Bézier curve */}
                            <motion.path
                                d={`M0,10 Q${lineWidth / 2},0 ${lineWidth},10`}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                variants={drawPath}
                            />
                        </motion.svg>
                    )}
                </div>
            </div>
        </motion.div>
    );
}