import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import from react-router-dom

// Extracted AnimatedHeading component for reusability
const AnimatedHeading = ({ title }) => {
    return (
        <div className="relative inline-block">
            <span className="relative z-10 font-poppins">{title}</span>
            <div className="absolute bottom-0 left-0 w-full h-3 bg-blue-200 dark:bg-blue-900 opacity-50 -z-10"></div>
        </div>
    );
};

// Extracted CategoryCard component for better organization
const CategoryCard = ({ category, isBottomCard = false, isHovered, onHover, onLeave }) => {
    const cardHeight = isBottomCard ? "h-96" : "h-80"; // Increased height for both card types

    return (
        <Link to={category.url} className="text-decoration-none">
            <div
                className={`rounded-xl overflow-hidden bg-transparent transition-all duration-300 cursor-pointer ${isHovered ? "transform -translate-y-2 shadow-lg" : ""
                    }`}
                onMouseEnter={onHover}
                onMouseLeave={onLeave}
            >
                <div className="block h-full">
                    <div className="flex flex-col h-full">
                        <div className={`relative overflow-hidden rounded-xl ${cardHeight}`}>
                            <img
                                src={`${category.imageUrl}`}
                                alt={category.title}
                                className={`w-full h-full object-cover object-center transition-transform duration-300 ${isHovered ? "scale-110" : "scale-100"
                                    }`}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        </div>

                        <div className="px-4 py-6 flex flex-col flex-grow">
                            <h4 className="text-2xl font-bold text-gray-900 dark:text-white font-poppins mb-3">
                                {category.title}
                            </h4>
                            <div className={`w-16 h-1 ${category.color.split(' ')[0]} mb-4`}></div>
                            <p className="text-base text-gray-600 dark:text-gray-300 font-inter">
                                {category.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

// Main CourseGrid component
const CourseGrid = () => {
    const [hoveredCard, setHoveredCard] = useState(null);

    // Data for course categories with the exact URLs you provided
    const topCategories = [
        {
            id: 1,
            title: "Instruments | Performing",
            description: "Master musical instruments and performing arts with expert guidance from seasoned professionals.",
            color: "border-purple-300 dark:border-purple-700",
            imageUrl: "/catagory/Instruments.png",
            url: "http://localhost:8081/courses/Professional%20skills"
        },
        {
            id: 2,
            title: "Art and Creativity",
            description: "Explore diverse art forms and unleash your creative potential through hands-on projects and techniques.",
            color: "border-blue-300 dark:border-blue-700",
            imageUrl: "/catagory/Art-and-Creativity.png",
            url: "http://localhost:8081/courses/arts%20and%20crafts"
        },
        {
            id: 3,
            title: "Academics",
            description: "Enhance your academic knowledge with comprehensive courses across various disciplines and subjects.",
            color: "border-green-300 dark:border-green-700",
            imageUrl: "/catagory/Academics.png",
            url: "http://localhost:8081/courses/Academic"
        }
    ];

    const bottomCategories = [
        {
            id: 4,
            title: "Languages",
            description: "Learn new languages with immersive methods, cultural context, and conversational practice with expert instructors.",
            color: "border-yellow-300 dark:border-yellow-700",
            imageUrl: "/catagory/Languages.png",
            url: "http://localhost:8081/courses/Langauges"
        },
        {
            id: 5,
            title: "Handicrafts",
            description: "Discover traditional and modern handicraft techniques to create beautiful, handmade items with sustainable materials.",
            color: "border-indigo-300 dark:border-indigo-700",
            imageUrl: "/catagory/Handicraft.png",
            url: "http://localhost:8081/courses/handi%20craft"
        }
    ];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Top Section */}
            <div className="mb-20 text-center">
                <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white font-poppins">
                    <AnimatedHeading title="Diverse Domains" />
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Explore a wide range of subjects taught by experts who are passionate about sharing their knowledge and skills.
                </p>
            </div>

            {/* Top Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                {topCategories.map(category => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        isHovered={hoveredCard === category.id}
                        onHover={() => setHoveredCard(category.id)}
                        onLeave={() => setHoveredCard(null)}
                    />
                ))}
            </div>

            {/* Middle Explore Section */}
            <div className="mb-24 mt-20">
                <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold mb-6 text-gray-900 dark:text-white font-poppins">
                        <AnimatedHeading title="Explore" />
                    </h2>
                </div>

                <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 pr-0 md:pr-16 mb-12 md:mb-0">
                        <h3 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white font-poppins text-left">
                            Redefine Boundaries
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl lg:text-2xl mb-8 leading-relaxed font-inter text-left">
                            Break through conventional learning limitations and discover new possibilities with our innovative approach to education and skill development.
                        </p>

                        <div className="flex space-x-4 mb-12">
                            <Link
                                to="/gururegister"
                                className="inline-block px-8 py-4 bg-white text-black border-2 border-black font-medium rounded-lg hover:bg-gray-100 transition-colors font-inter text-lg"
                            >
                                Register as a Guru
                            </Link>
                        </div>

                        <div className="mt-12">
                            <h4 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white font-poppins text-left">
                                Convenience of selecting mutual time
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed font-inter text-left">
                                Our flexible scheduling system allows students and instructors to find the perfect time that works for both, eliminating the hassle of time zone differences and busy calendars.
                            </p>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <Link to="/explore">
                            <div className="overflow-hidden rounded-xl shadow-xl cursor-pointer">
                                <img
                                    src="/catagory/Explore.png"
                                    alt="Person breaking boundaries"
                                    className="w-full h-auto transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {bottomCategories.map(category => (
                    <CategoryCard
                        key={category.id}
                        category={category}
                        isBottomCard={true}
                        isHovered={hoveredCard === category.id}
                        onHover={() => setHoveredCard(category.id)}
                        onLeave={() => setHoveredCard(null)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CourseGrid;