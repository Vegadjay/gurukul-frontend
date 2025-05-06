"use client";
import React from "react";
import { StickyScroll } from "../components/ui/sticky-scroll-reveal";

const content = [
    {
        title: "Master Your Musical Journey",
        description:
            "Begin your musical adventure with personalized learning paths designed for all skill levels. Our expert instructors guide you through comprehensive lessons that adapt to your unique learning style.",
        content: (
            <div className="flex h-full w-full items-center justify-center text-white">
                <img
                    src="/api/placeholder/400/320"
                    className="h-full w-full object-cover rounded-md"
                    alt="Music learning journey"
                />
            </div>
        ),
    },
    {
        title: "Learn At Your Own Pace",
        description:
            "Our flexible curriculum allows you to progress at a comfortable speed. Whether you have 15 minutes a day or several hours to dedicate, we provide structured lessons that fit your schedule and learning goals.",
        content: (
            <div className="flex h-full w-full items-center justify-center text-white">
                <img
                    src="/api/placeholder/400/320"
                    className="h-full w-full object-cover rounded-md"
                    alt="Self-paced learning"
                />
            </div>
        ),
    },
    {
        title: "Connect With Expert Instructors",
        description:
            "Get personalized feedback from professional musicians and educators who are passionate about helping you succeed. Our instructors provide guidance, answer questions, and help you overcome challenges in your musical development.",
        content: (
            <div className="flex h-full w-full items-center justify-center text-white">
                <img
                    src="/api/placeholder/400/320"
                    className="h-full w-full object-cover rounded-md"
                    alt="Expert instructors"
                />
            </div>
        ),
    },
    {
        title: "Join Our Creative Community",
        description:
            "Become part of a supportive network of fellow learners and creators. Share your progress, collaborate on projects, and get inspired by others on similar journeys. Music is better when we learn together.",
        content: (
            <div className="flex h-full w-full items-center justify-center text-white">
                <img
                    src="/api/placeholder/400/320"
                    className="h-full w-full object-cover rounded-md"
                    alt="Creative community"
                />
            </div>
        ),
    },
];

function StickyScrollRevealDemo() {
    return (
        <div className="w-full py-12 max-w-6xl mx-auto mb-20">
            <h3 className="text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white">
                Why Choose Our Learning Platform
            </h3>
            <StickyScroll
                content={content}
                contentClassName="w-96 h-72 rounded-xl shadow-lg"
            />
        </div>
    );
}

export default StickyScrollRevealDemo;