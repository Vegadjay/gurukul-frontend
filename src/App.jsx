
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";

import FindGuru from "./pages/FindGuru";
import TutorProfile from "./pages/TutorProfile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import TermsAndConditions from './pages/TermsCondition'
import BrowsingPreferencesPolicy from './pages/BrowsingPreferencesPolicy'
import HelpCenterPage from './pages/Help'
import ChoicePage from './pages/ChoicePage'
import RegisterStudent from './pages/RegisterAsStudent'
import RegisterGuru from './pages/RegisterAsGuru'
import CourseCategory from './pages/Courses'
import Chatpage from './pages/Chatpage'
import GuruDashboard from './pages/Gurudashboard'
import UploadContent from './pages/UploadContent'
import UpdateGuru from './pages/UpdateGuru';
import UpdateStudent from './pages/UpdateStudent';
import StudnetDashboardAdmin from './pages/StudentDashboardAdmin';
import GuruDashboardAdmin from './pages/GuruDashboardAdmin';


import HeroSection from "./components/HeroSection";
import ExploreSection from "./components/ExploreSection";
import ReviewsSection from "./components/ReviewsSection";
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";

const queryClient = new QueryClient();


const HomePage = () => (
  <>
    <HeroSection />
    <ExploreSection />
    <ReviewsSection />
  </>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow pt-16">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/findguru" element={<FindGuru />} />
                  <Route path="/admin" element={<AdminLogin />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/tutor/:id" element={<TutorProfile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/choice" element={<ChoicePage />} />
                  <Route path="/studentregister" element={<RegisterStudent />} />
                  <Route path="/gururegister" element={<RegisterGuru />} />
                  <Route path="/message/:userId" element={<Chatpage />} />
                  <Route path="/updateguru/:guruId" element={<UpdateGuru />} />
                  <Route path="/updatestudent/:studentId" element={<UpdateStudent />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/terms" element={<TermsAndConditions />} />
                  <Route path="/guru/uploadcontent" element={<UploadContent />} />
                  <Route path="/privacy" element={<BrowsingPreferencesPolicy />} />
                  <Route path="/courses/:category" element={<CourseCategory />} />
                  <Route path="/guru/gurudashboard/:guruId" element={<GuruDashboard />} />
                  <Route path="/student/studentdashboard/:studentId" element={<StudentDashboard />} />
                  <Route path="/student/studentdashboardadmin/:studentId" element={<StudnetDashboardAdmin />} />
                  <Route path="/student/gurudashboardadmin/:studentId" element={<GuruDashboardAdmin />} />
                  <Route path="/help" element={<HelpCenterPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;