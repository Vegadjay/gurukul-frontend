import React from "react";

const BrowsingPreferencesPolicy = () => {
    return (
        <div className="max-w-5xl mx-auto px-8 py-16 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 rounded-xl shadow-lg my-12">
            <div className="border-b-2 border-gray-200 dark:border-gray-800 pb-8 mb-10">
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white font-poppins">Site Preferences Policy</h1>
                <p className="text-gray-600 dark:text-gray-400 italic text-lg">
                    Information about how we use browser storage on our platform.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm mb-10">
                <p className="mb-6 text-lg">
                    Welcome to Guruqool's Site Preferences Policy! This policy explains how we use browser storage technologies on our educational platform. By accessing and using Guruqool, you consent to our use of these technologies in accordance with this policy.
                </p>
            </div>

            <div className="space-y-12">
                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">1</span>
                        What Are Browser Storage Files
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Browser storage files are small text files that are placed on your device when you visit our website. They allow us to recognize your device and remember certain information about your visit, such as your preferences and actions.
                        </p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Some storage files are deleted when you close your browser (temporary storage), while others remain on your device until they expire or you delete them (persistent storage). These files can be set by the website you are visiting or by another organization whose services are used by the website.
                        </p>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">2</span>
                        Types of Storage Technologies We Use
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            We use the following types of browser storage on our platform:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li><span className="font-medium">Essential storage:</span> These are necessary for the operation of our platform. They enable basic functions such as page navigation, secure areas access, and account authentication.</li>
                            <li><span className="font-medium">Preference storage:</span> These allow us to remember choices you make and provide enhanced, personalized features.</li>
                            <li><span className="font-medium">Usage data storage:</span> These help us understand how visitors interact with our platform by collecting and reporting information anonymously.</li>
                            <li><span className="font-medium">Customization storage:</span> These are used to provide personalized content and improve user experience.</li>
                        </ul>
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                Our platform uses both temporary and persistent storage technologies to provide you with the best possible experience.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">3</span>
                        Specific Storage Files Used
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Below is a list of the main storage files we use and what we use them for:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
                                <thead className="bg-gray-100 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left">File Name</th>
                                        <th className="px-4 py-3 text-left">Type</th>
                                        <th className="px-4 py-3 text-left">Purpose</th>
                                        <th className="px-4 py-3 text-left">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    <tr>
                                        <td className="px-4 py-3">guruqool_session</td>
                                        <td className="px-4 py-3">Essential</td>
                                        <td className="px-4 py-3">Authentication and session management</td>
                                        <td className="px-4 py-3">Session</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">guruqool_preferences</td>
                                        <td className="px-4 py-3">Preference</td>
                                        <td className="px-4 py-3">Remembers your preferences (dark/light mode, etc.)</td>
                                        <td className="px-4 py-3">1 year</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">site_analytics</td>
                                        <td className="px-4 py-3">Usage</td>
                                        <td className="px-4 py-3">Usage statistics - Distinguishes users</td>
                                        <td className="px-4 py-3">2 years</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3">user_exp</td>
                                        <td className="px-4 py-3">Customization</td>
                                        <td className="px-4 py-3">Personalization - Enhances user experience</td>
                                        <td className="px-4 py-3">3 months</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">
                            This is not an exhaustive list and may be updated as our platform evolves. For more detailed information, please contact us.
                        </p>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">4</span>
                        Third-Party Technologies
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Our platform includes functionality provided by third parties. These third parties may store data on your device when you visit our platform to provide their services.
                        </p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Third-party services we use include:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Site usage analysis tools</li>
                            <li>Security verification systems</li>
                            <li>Content personalization tools</li>
                            <li>Video content providers</li>
                            <li>Payment processors</li>
                        </ul>
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                We recommend reviewing the privacy policies of these third parties to understand how they use your data.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">5</span>
                        Managing Your Preferences
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Most web browsers allow you to control storage through their settings preferences. You can typically find these settings in the "options" or "preferences" menu of your browser.
                        </p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            Here are links to instructions for managing browser settings in common browsers:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Google Chrome</a></li>
                            <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Mozilla Firefox</a></li>
                            <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Safari</a></li>
                            <li><a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">Microsoft Edge</a></li>
                        </ul>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Please note:</span> If you disable certain browser features, you may not be able to use all features of our platform, particularly features that require you to be logged in.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">6</span>
                        Your Consent
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            When you first visit our platform, you will be presented with a notice asking for your consent to use non-essential technologies. You can choose to accept all, reject non-essential ones, or customize your preferences.
                        </p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            You can change your preferences at any time by clicking on the "Site Preferences" link in the footer of our website.
                        </p>
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                By continuing to use our platform without changing your settings, you are agreeing to our use of browser storage technologies as described in this policy.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">7</span>
                        Data Protection and Privacy
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            The information we collect is handled in accordance with our Privacy Policy. We implement appropriate technical and organizational measures to protect your data against unauthorized or unlawful processing and against accidental loss, destruction, or damage.
                        </p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            For more detailed information about how we protect and process your personal data, please refer to our <a href="/privacy-policy" className="text-blue-600 dark:text-blue-400 hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">8</span>
                        Policy Updates
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            We may update this policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will be posted on this page with an updated revision date. We encourage you to periodically review this page to stay informed.
                        </p>
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            If we make significant changes to this policy, we will notify you through a prominent notice on our platform or by sending an email to the address associated with your account.
                        </p>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">9</span>
                        Legal Basis
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            We process your personal data based on the following legal grounds:
                        </p>
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700 dark:text-gray-300">
                            <li>Your consent, which you can withdraw at any time</li>
                            <li>Our legitimate interests in operating, improving, and securing our platform</li>
                            <li>The necessity to perform a contract with you</li>
                            <li>Compliance with legal obligations to which we are subject</li>
                        </ul>
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                Where required by applicable law, we will only process your data with your prior explicit consent.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold mb-6 flex items-center text-indigo-600 dark:text-indigo-400">
                        <span className="bg-indigo-100 dark:bg-indigo-900 rounded-full w-10 h-10 flex items-center justify-center mr-3 text-lg font-bold shadow-md">10</span>
                        Contact Us
                    </h2>
                    <div className="pl-12 border-l-3 border-indigo-100 dark:border-indigo-800 py-2">
                        <p className="mb-4 text-gray-700 dark:text-gray-300">
                            If you have any questions or concerns about this policy, please contact us at <a href="mailto:support@guruqool.com" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">support@guruqool.com</a> or through our <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">Contact Page</a>.
                        </p>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                            <p className="text-gray-700 dark:text-gray-300">
                                Our data protection team is dedicated to addressing your concerns and ensuring compliance with applicable data protection laws. We aim to respond to all inquiries within 72 hours.
                            </p>
                        </div>
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
    );
};

export default BrowsingPreferencesPolicy;