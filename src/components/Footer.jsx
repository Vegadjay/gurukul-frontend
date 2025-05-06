
import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Linkedin, Youtube, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 pt-12 pb-6 border-t border-gray-200 dark:border-gray-800">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="text-xl font-bold text-guru-dark dark:text-white">
              <img src="/images/logo1.png" alt="" height={100} width={100} className="hover:scale-110 transition duration-200" />
            </Link>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <Youtube size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-gray-900 font-poppins dark:text-gray-100">Terms and Conditions</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  Cookie Policy
                </Link>
              </li>

            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-gray-900 font-poppins dark:text-gray-100">Find out more</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  Help
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  How it works
                </Link>
              </li>
              <li>
                <Link to="/tutor-area" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  Tutor Area
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  News and Blog
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-gray-900 font-poppins dark:text-gray-100">Join us</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/become-tutor" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  Become a tutor
                </Link>
              </li>
              <li>
                <Link to="/find-tutor" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  Students looking for tutor
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-gray-600 hover:text-guru-blue dark:text-gray-400 dark:hover:text-blue-400">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Guruqool. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
