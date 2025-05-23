import React from "react";

const HelpCenterPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-20 font-inter">
            <div className="max-w-5xl mx-auto px-8 py-16 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-2xl shadow-lg my-12">
                <div className="border-b-2 border-gray-200 dark:border-gray-800 pb-8 mb-10">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white font-inter">Help Center</h1>
                    <p className="text-gray-600 dark:text-gray-400 italic text-lg">
                        Find answers to common questions and learn how to use Guruqool effectively.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm mb-10">
                    <p className="mb-6 text-lg">
                        Welcome to Guruqool's Help Center! Here you'll find answers to frequently asked questions, troubleshooting tips, and guidance for getting the most out of our educational platform. If you can't find what you're looking for, our support team is always ready to assist you.
                    </p>
                </div>

                <div className="space-y-12">
                    <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                            <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">1</span>
                            Getting Started
                        </h2>
                        <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                New to Guruqool? Here's how to get started with our platform and make the most of your learning experience.
                            </p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                                <li><a href="https://guruqool.vercel.app/studentregister" className="text-blue-600 dark:text-blue-400 hover:underline">Creating your account</a></li>
                                <li><a href="https://guruqool.vercel.app/findguru" className="text-blue-600 dark:text-blue-400 hover:underline">Finding courses and content</a></li>
                                <li><a href="https://guruqool.vercel.app/   " className="text-blue-600 dark:text-blue-400 hover:underline">Navigating the dashboard</a></li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                            <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">2</span>
                            Account & Billing
                        </h2>
                        <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Manage your account settings, subscription plans, and payment information.
                            </p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Changing your password</a></li>
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Managing subscription plans</a></li>
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Updating payment methods</a></li>
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Viewing billing history</a></li>
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Cancelling subscription</a></li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                            <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">3</span>
                            Courses & Learning
                        </h2>
                        <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Everything you need to know about accessing courses, tracking progress, and maximizing your learning experience.
                            </p>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                                    <thead className="bg-gray-100 dark:bg-gray-800">
                                        <tr>
                                            <th className="px-4 py-3 text-left">Feature</th>
                                            <th className="px-4 py-3 text-left">Description</th>
                                            <th className="px-4 py-3 text-left">How to Access</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                        <tr>
                                            <td className="px-4 py-3">Course Library</td>
                                            <td className="px-4 py-3">Browse all available courses</td>
                                            <td className="px-4 py-3">Main menu {'->'} Explore</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Progress Tracking</td>
                                            <td className="px-4 py-3">Monitor your learning progress</td>
                                            <td className="px-4 py-3">Dashboard {'->'} My Progress</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Certificates</td>
                                            <td className="px-4 py-3">Download course completion certificates</td>
                                            <td className="px-4 py-3">Profile {'->'} My Achievements</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3">Note-Taking</td>
                                            <td className="px-4 py-3">Create and manage course notes</td>
                                            <td className="px-4 py-3">Within each lesson {'->'} Notes</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                            <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">4</span>
                            Technical Support
                        </h2>
                        <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Encountering technical issues? Here are solutions to common problems.
                            </p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Video playback issues</a></li>
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Login problems</a></li>
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Browser compatibility</a></li>
                                <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Mobile app troubleshooting</a></li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                            <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">5</span>
                            Community Guidelines
                        </h2>
                        <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Our community thrives on respect and collaboration. Please review our guidelines for interacting with other learners and instructors.
                            </p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                                <li><span className="font-medium">Be respectful:</span> Treat others with kindness and respect in all interactions.</li>
                                <li><span className="font-medium">Provide constructive feedback:</span> Offer helpful and specific comments when reviewing courses.</li>
                                <li><span className="font-medium">Protect privacy:</span> Do not share personal information about yourself or others.</li>
                                <li><span className="font-medium">Report concerns:</span> Flag inappropriate content or behavior to our moderation team.</li>
                            </ul>
                        </div>
                    </section>

                    <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                            <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">6</span>
                            Contact Support
                        </h2>
                        <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                Still need help? Our support team is here for you. Here's how to reach us:
                            </p>
                            <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                                <li><span className="font-medium">Email:</span> <a href="mailto:guruqoolhelp@gmail.com" className="text-blue-600 dark:text-blue-400 hover:underline">guruqoolhelp@gmail.com</a></li>
                                <li><span className="font-medium">Live Chat:</span> Available in the bottom right corner of any page</li>
                                <li><span className="font-medium">Phone:</span> +91 9265160652 (Monday to Friday, 9am-5pm IST)</li>
                                <li><span className="font-medium">Support Ticket:</span> <a href="/support-ticket" className="text-blue-600 dark:text-blue-400 hover:underline">Submit a support ticket</a></li>
                            </ul>
                        </div>
                    </section>
                </div>

                <div className="mt-16 pt-8 border-t-2 border-gray-200 dark:border-gray-800 text-center">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: April 25, 2025
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        © 2025 Guruqool. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HelpCenterPage;