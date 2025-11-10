import React from 'react';
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

function App() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';

  const renderPage = () => {
    if (path.startsWith('/blog/')) {
      return <BlogDetail />;
    }
    if (path === '/about-us') {
      return <AboutUs />;
    }
    if (path === '/our-story') {
      return <OurStory />;
    }
    
    if (path === '/work') {
      return <Work />;
    }
    
    if (path === '/blog') {
      return <Blog />;
    }
    
    if (path === '/contact') {
      return <Contact />;
    }
    
    if (path === '/work-with-us') {
      return <WorkWithUs />;
    }
    
    if (path === '/services') {
      return <Services />;
    }

    if (path === '/partner-with-us') {
      return <PartnerWithUs />;
    }

    if (path === '/with-apnaaapan') {
      return <WithApnaaapan />;
    }

    return (
      <>
        {/* Hero Section Component */}
        <HeroSection />

        {/* Our Work Section Component */}
        <OurWorkSection />

        {/* Our Winning Process Section Component */}
        <OurWinningProcess />

        {/* Client Feedback Section Component */}
        <ClientFeedback />

        {/* Our Services Section Component */}
        <OurServices />

        {/* Booking Section Component */}
        <BookingSection />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#EFE7D5]">
      <Header />
      <div className="pt-14 sm:pt-16 md:pt-20">
        {renderPage()}
        <Footer />
      </div>
    </div>
  );
}

export default App; 