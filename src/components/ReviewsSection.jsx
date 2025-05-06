"use client";

import React, { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import AnimatedHeading from './ui/underline-svg';

export function InfiniteMovingCards({
  items,
  direction = "right",
  speed = "slow",
  pauseOnHover = true,
}) {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;
    // Add extra items for smooth infinite scroll
    setStart(true);
  }, []);

  const getSpeed = () => {
    switch (speed) {
      case "fast":
        return "20s";
      case "normal":
        return "30s";
      case "slow":
        return "40s";
      default:
        return "40s";
    }
  };

  return (
    <div
      ref={containerRef}
      className="overflow-hidden w-full relative"
      style={{ maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)" }}
    >
      <div
        ref={scrollerRef}
        className={`flex gap-4 py-4 ${start ? "" : "invisible"}`}
        style={{
          width: "max-content",
          animation: `scroll${direction === "right" ? "Right" : "Left"} ${getSpeed()} linear infinite`,
          // Changed: Animation starts running by default
          animationPlayState: "running",
        }}
        onMouseEnter={pauseOnHover ? (e) => {
          // Changed: Pause on hover instead of start on hover
          e.currentTarget.style.animationPlayState = "paused";
        } : undefined}
        onMouseLeave={pauseOnHover ? (e) => {
          e.currentTarget.style.animationPlayState = "running";
        } : undefined}
      >
        {items.map((item, idx) => (
          <div key={idx} className="w-96 flex-shrink-0">
            <ReviewCard {...item} />
          </div>
        ))}
        {/* Duplicate items for seamless loop */}
        {items.map((item, idx) => (
          <div key={`dup-${idx}`} className="w-96 flex-shrink-0">
            <ReviewCard {...item} />
          </div>
        ))}
      </div>
      <style jsx global>{`
        @keyframes scrollRight {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        @keyframes scrollLeft {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

const ReviewCard = ({ quote, name, title, avatar }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-60">
      <div className="flex-1 overflow-hidden">
        <div className="flex text-yellow-400 mb-2">
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
        </div>
        <blockquote className="text-gray-700 dark:text-gray-300 mb-2 italic text-sm line-clamp-5">
          "{quote}"
        </blockquote>
      </div>
      <div className="flex items-center mt-2">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
            {name}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
}

export function InfiniteMovingCardsDemo() {
  const testimonials = [
    {
      quote: "A terrific piece of praise! My daughter has improved so much in her piano lessons since finding her tutor through Guruqool. The platform made it easy to find the perfect match.",
      name: "Sarah Johnson",
      title: "Piano Student's Parent",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "A fantastic bit of feedback! I've been teaching languages for years, but Guruqool has connected me with students who truly value my expertise. The scheduling system is seamless.",
      name: "Michael Chen",
      title: "Language Tutor",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "After struggling with traditional tutoring options, Guruqool helped me find an art teacher who understands my style. My skills have improved dramatically.",
      name: "Emma Rodriguez",
      title: "Art Student",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "Guruqool transformed my tutoring business. I now have a full schedule of students who are genuinely interested in mathematics, and the payment system is reliable and transparent.",
      name: "David Park",
      title: "Mathematics Tutor",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "Finding a chemistry tutor who could explain complex concepts in a way I understand seemed impossible until I discovered Guruqool. Now I'm acing my AP Chemistry class!",
      name: "Jasmine Williams",
      title: "High School Student",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "As a retired professor, I wanted to continue sharing my knowledge. Guruqool provided the perfect platform to connect with eager physics students while maintaining a flexible schedule.",
      name: "Robert Thompson",
      title: "Physics Tutor",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "The personalized matching algorithm on Guruqool is incredible. My son's coding tutor understands exactly how he learns, and his confidence has skyrocketed in just two months.",
      name: "Lisa Garcia",
      title: "Parent of Coding Student",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "I've tried several tutoring platforms, but Guruqool stands out for its intuitive interface and quality of tutors. My English writing has improved tremendously thanks to my tutor.",
      name: "Akiko Tanaka",
      title: "ESL Student",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "The video call quality and collaborative whiteboard tools make teaching calculus remotely almost better than in-person. My students are achieving results I never thought possible online.",
      name: "James Wilson",
      title: "Calculus Tutor",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "Guruqool helped me find a vocal coach who specializes in my specific genre. The progress I've made in my singing career since starting these lessons has been remarkable.",
      name: "Olivia Martinez",
      title: "Vocal Student",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "As someone with ADHD, finding a tutor who understands my learning style was crucial. Guruqool's detailed profiles helped me connect with the perfect history tutor for my needs.",
      name: "Tyler Jackson",
      title: "University Student",
      avatar: "/api/placeholder/32/32"
    },
    {
      quote: "The scheduling flexibility on Guruqool allowed me to maintain my full-time job while tutoring Spanish on evenings and weekends. The extra income has been life-changing.",
      name: "Isabella Navarro",
      title: "Language Tutor",
      avatar: "/api/placeholder/32/32"
    }
  ];

  return (
    <div className="h-[37rem] rounded-md flex flex-col antialiased bg-white dark:bg-gray-900 dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4">
        <AnimatedHeading title={"Reviews"} />
        <p className="text-gray-600 dark:text-gray-300 text-center mb-10 max-w-2xl mx-auto">
          Don't just take our word for it. See what our community of learners and tutors have to say about their experiences with Guruqool.
        </p>
        <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
      </div>
    </div>
  );
}

export default InfiniteMovingCardsDemo;