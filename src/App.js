import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import OurWorkSection from './components/OurWorkSection';
import OurWinningProcess from './components/OurWinningProcess';
import ClientFeedback from './components/ClientFeedback';
import OurServices from './components/OurServices';
import BookingSection from './components/BookingSection';
import Footer from './components/Footer';
import OurStory from './pages/OurStory';
import AboutUs from './pages/AboutUs';
import Work from './pages/Work';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Contact from './pages/Contact';
import WorkWithUs from './pages/WorkWithUs';
import Services from './pages/Services';
import PartnerWithUs from './pages/PartnerWithUs';
import WithApnaaapan from './pages/WithApnaaapan';
import AdminDashboard from './pages/AdminDashboard';
import AdminBlogs from './pages/AdminBlogs';
import AdminReviews from './pages/AdminReviews';
import AdminPositions from './pages/AdminPositions';
import AdminWork from './pages/AdminWork';
import usePageTracking from './hooks/usePageTracking';

function App() {
  // Track page views on route changes
  usePageTracking();

  return (
    <div className="min-h-screen bg-[#EFE7D5]">
      <Header />
      <div className="pt-14 sm:pt-16 md:pt-20">
        <Routes>
          {/* Home Page */}
          <Route 
            path="/" 
            element={
              <>
                <HeroSection />
                <OurWorkSection />
                <OurWinningProcess />
                <ClientFeedback />
                <OurServices />
                <BookingSection />
              </>
            } 
          />
          
          {/* Other Pages */}
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/our-story" element={<OurStory />} />
          <Route path="/work" element={<Work />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/work-with-us" element={<WorkWithUs />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<Services />} />
          <Route path="/partner-with-us" element={<PartnerWithUs />} />
          <Route path="/with-apnaaapan" element={<WithApnaaapan />} />
          {/* Admin Panel: Dashboard + sections */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/blogs" element={<AdminBlogs />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
          <Route path="/admin/positions" element={<AdminPositions />} />
          <Route path="/admin/work" element={<AdminWork />} />
        </Routes>
        <Footer />
      </div>
    </div>
  );
}

export default App; 