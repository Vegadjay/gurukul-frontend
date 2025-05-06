
import React from "react";
import { Star, MapPin, Music, Users, Clock, Video, MessageSquare, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

const TutorCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 animate-pulse">
      <div className="flex flex-col sm:flex-row">
        <div className="mb-4 sm:mb-0 sm:mr-4">
          <div className="h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="flex-1">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-4"></div>
          <div className="flex gap-2">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-28"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TutorCard = ({ tutor }) => {
  const navigate = useNavigate();

  const goToTutorProfile = () => {
    navigate(`/tutor/${tutor.id}`);
  };

  return (
    <motion.div
      className={`bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6 ${tutor.highlighted ? 'border-2 border-guru-blue dark:border-blue-500' : ''}`}
      variants={itemVariants}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onClick={goToTutorProfile}
      style={{ cursor: 'pointer' }}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="mb-4 sm:mb-0 sm:mr-4">
          <div className="relative h-24 w-24">
            <div className="h-24 w-24 rounded-full overflow-hidden">
              <img
                src={tutor.image}
                alt={tutor.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {tutor.name}
            </h3>
            <div className="mt-2 sm:mt-0">
              <span className="text-2xl font-bold text-guru-blue dark:text-blue-400">
                £{tutor.hourlyRate}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-300">/hr</span>
              {tutor.firstClassFree && (
                <p className="text-sm text-guru-blue dark:text-blue-400">
                  First class free
                </p>
              )}
            </div>
          </div>

          <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {tutor.location}
              </span>
            </div>
            <div className="flex items-center">
              <Music className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {tutor.subject}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {tutor.lessonType}
              </span>
            </div>
          </div>

          {tutor.rating && (
            <div className="mb-3 flex items-center">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.floor(tutor.rating) ? 'fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                    fill={i < Math.floor(tutor.rating) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {tutor.rating.toFixed(1)} ({tutor.reviewCount} reviews)
              </span>
            </div>
          )}

          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {tutor.description}
          </p>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/tutor/${tutor.id}`);
              }}
            >
              View Profile
            </button>
            <button
              className="btn-outline"
              onClick={(e) => {
                e.stopPropagation();
                // Contact functionality
              }}
            >
              Contact
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TutorList = ({ isLoading }) => {
  // Sample tutor data with expanded fields
  const tutors = [
    {
      id: 1,
      name: "Bethany Wilson",
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      location: "Bournemouth",
      subject: "Piano & Music Theory",
      hourlyRate: 30,
      highlighted: true,
      status: "online",
      firstClassFree: true,
      lessonType: "In Person & Online",
      rating: 4.9,
      reviewCount: 127,
      description: "Music graduate teaching music theory, piano and all music related subjects. I am a recent music graduate spending the last 3 years studying my Masters in Advanced Performance in Bournemouth University. I have been teaching piano for over 10 years with students of all ages."
    },
    {
      id: 2,
      name: "Simon James Collier",
      image: "https://randomuser.me/api/portraits/men/42.jpg",
      location: "Portsmouth",
      subject: "Violin & Viola",
      hourlyRate: 26,
      rating: 4.5,
      reviewCount: 89,
      highlighted: true,
      status: "offline",
      firstClassFree: true,
      lessonType: "In Person",
      description: "Private Tuition in Violin/Viola & Elementary Piano. I am a Private Teacher (I possess Bachelor of Ed) in Violin (Grade 8) and Piano teaching to a Private Teaching Level. I give 30 min lessons for beginners and 45 min to 1 hour lessons for intermediate to advanced students."
    },
    {
      id: 3,
      name: "Malcolm Johnson",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      location: "Surrey",
      subject: "Violin & Viola",
      hourlyRate: 30,
      highlighted: true,
      status: "online",
      firstClassFree: true,
      rating: 4.8,
      reviewCount: 56,
      lessonType: "Online",
      description: "Willing to travel, friendly prices, Surrey and surroundings - piano, violin and viola. As a performing musician, performing on the violin and teaching for over 30 years, especially love to help people who want to learn, I am passionate about music education and sharing the joy of music with others."
    },
    {
      id: 4,
      name: "Kevin Phillips",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      location: "London",
      subject: "Guitar",
      hourlyRate: 25,
      status: "offline",
      firstClassFree: false,
      rating: 4.6,
      reviewCount: 42,
      lessonType: "In Person & Online",
      description: "Guitar teacher available to teach all levels, ages, genres and styles. I am a guitar tutor with over 8 years of experience playing bands and teaching guitar and music both in school settings and privately. I tailor my lessons to each student's individual needs and goals."
    },
    {
      id: 5,
      name: "Emma Lewis",
      image: "https://randomuser.me/api/portraits/women/45.jpg",
      location: "Manchester",
      subject: "Mathematics",
      hourlyRate: 28,
      status: "online",
      firstClassFree: true,
      rating: 4.7,
      reviewCount: 103,
      lessonType: "Online",
      description: "Mathematics tutor with 12 years experience teaching GCSE and A-Level. I specialize in helping students who struggle with mathematics to build confidence and achieve their desired grades. My approach focuses on clear explanations and plenty of practice problems."
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <TutorCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
    >
      {tutors.map((tutor) => (
        <TutorCard key={tutor.id} tutor={tutor} />
      ))}

      <motion.div
        className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-dashed border-gray-300 dark:border-gray-600 text-center"
        variants={itemVariants}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          Still looking for a tutor?
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Post an advert and tutors will be able to contact you
        </p>
        <Link to="/post-ad" className="btn-primary">
          Post your ad
        </Link>
      </motion.div>
    </motion.div>
  );
};

export { TutorCardSkeleton };
export default TutorList;
