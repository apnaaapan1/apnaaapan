import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  // Get current path using React Router
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showHeader, setShowHeader] = useState(true);
  const [isWorkDropdownOpen, setIsWorkDropdownOpen] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);
  const workDropdownCloseTimeoutRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const currentY = window.scrollY || 0;
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const lastY = lastScrollYRef.current;
          const isScrollingDown = currentY > lastY;
          const distance = Math.abs(currentY - lastY);

          if (currentY < 10) {
            setShowHeader(true);
          } else if (distance > 4) {
            setShowHeader(!isScrollingDown);
          }

          lastScrollYRef.current = currentY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    return () => {
      if (workDropdownCloseTimeoutRef.current) {
        clearTimeout(workDropdownCloseTimeoutRef.current);
      }
    };
  }, []);

  // Function to handle logo click - redirect to home page
  const handleLogoClick = () => {
    navigate('/');
  };

  // Function to handle Book A Call click - navigate to book call page
  const handleBookCallClick = () => {
    navigate('/book-call');
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`bg-[#EFE7D5] border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50 transition-transform duration-200 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
        {/* Logo - Clickable */}
        <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
          <img 
            src="/images/apnaaapan logo.png" 
            alt="Apnaaapan Logo" 
            className="h-10 w-auto mr-2 select-none hover:opacity-80 transition-opacity duration-200"
            style={{marginTop: '-2px'}}
          />
        </div>
        
        {/* Navigation Links - Center (with dropdown groupings) */}
        <div className="hidden md:flex items-center space-x-8 relative">
          {/* Our Story (simple link, submenu removed) */}
          <div className="relative">
            <Link
              to="/our-story"
              className={`font-dm-sans-medium text-sm transition-colors duration-200 relative group ${
                currentPath === '/our-story' ? 'text-[#0D1B2A]' : 'text-[#5B5B5B]'
              }`}
            >
              <span className="inline-flex items-center gap-1">
                <span>Our Story</span>
              </span>
              <div
                className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-opacity duration-200 ${
                  currentPath === '/our-story'
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              />
            </Link>
          </div>

          {/* Work (hover dropdown) */}
          <div
            className="relative"
            onMouseEnter={() => {
              if (workDropdownCloseTimeoutRef.current) {
                clearTimeout(workDropdownCloseTimeoutRef.current);
                workDropdownCloseTimeoutRef.current = null;
              }
              setIsWorkDropdownOpen(true);
            }}
            onMouseLeave={() => {
              // Delay prevents the menu from disappearing while moving/clicking
              workDropdownCloseTimeoutRef.current = setTimeout(() => {
                setIsWorkDropdownOpen(false);
              }, 120);
            }}
          >
            <Link
              to="/work"
              className={`font-dm-sans-medium text-sm transition-colors duration-200 relative group ${
                currentPath === '/work' ? 'text-[#0D1B2A]' : 'text-[#5B5B5B]'
              }`}
            >
              Work
              <div
                className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-opacity duration-200 ${
                  currentPath === '/work'
                    ? 'opacity-100'
                    : 'opacity-0 group-hover:opacity-100'
                }`}
              />
            </Link>

            {/* Dropdown shown on hover */}
            <div
              className={`absolute left-0 top-[calc(100%+10px)] border border-gray-200 rounded-lg shadow-xl z-50 min-w-[180px] overflow-hidden ${
                isWorkDropdownOpen ? 'block' : 'hidden'
              }`}
              style={{ backgroundColor: '#EFE7D5', pointerEvents: isWorkDropdownOpen ? 'auto' : 'none' }}
            >
              <Link
                to="/portfolio"
                onClick={() => setIsWorkDropdownOpen(false)}
                className="block px-4 py-3 text-sm text-[#0D1B2A] hover:bg-white/70 hover:text-[#F26B2A] transition-colors duration-150"
              >
                Portfolio
              </Link>
              <div className="h-px bg-gray-200/60" />
              <Link
                to="/graphic-portfolio"
                onClick={() => setIsWorkDropdownOpen(false)}
                className="block px-4 py-3 text-sm text-[#0D1B2A] hover:bg-white/70 hover:text-[#F26B2A] transition-colors duration-150"
              >
                Graphic Portfolio
              </Link>
            </div>
          </div>

          <Link 
            to="/contact" 
            className={`font-dm-sans-medium text-sm transition-colors duration-200 relative group ${
              currentPath === '/contact' ? 'text-[#0D1B2A]' : 'text-[#5B5B5B]'
            }`}
          >
            Contact Us
            <div
              className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-opacity duration-200 ${
                currentPath === '/contact'
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
            />
          </Link>
          <Link 
            to="/with-apnaaapan" 
            className={`font-dm-sans-medium text-sm transition-colors duration-200 relative group ${
              currentPath === '/with-apnaaapan' ? 'text-[#0D1B2A]' : 'text-[#5B5B5B]'
            }`}
          >
            With.Apnaaapan
            <div
              className={`absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-opacity duration-200 ${
                currentPath === '/with-apnaaapan'
                  ? 'opacity-100'
                  : 'opacity-0 group-hover:opacity-100'
              }`}
            />
          </Link>
        </div>
        
        {/* CTA Button + Mobile Menu Button - Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleBookCallClick}
            className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-3.5 py-2 md:px-6 md:py-2.5 rounded-full font-nexa-bold text-xs md:text-sm flex items-center gap-2 hover:shadow-lg transition-all duration-200 hover:scale-105 whitespace-nowrap"
          >
            <span className="text-white text-xs">⭐</span>
            <span>Book A Call</span>
          </button>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-400"
            onClick={() => {
              setIsMobileMenuOpen((prev) => !prev);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className={`w-6 h-6 transition-transform ${isMobileMenuOpen ? 'rotate-90' : 'rotate-0'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      
      {/* Horizontal separator line */}
      <div className="w-full h-px bg-[#D9D9D9]"></div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-[57px] left-0 right-0 bg-[#EFE7D5] border-b border-gray-200 shadow-sm transition-max-height duration-300 overflow-hidden ${isMobileMenuOpen ? 'max-h-[80vh]' : 'max-h-0'}`}
      >
        <div className="px-4 py-3 space-y-1">
          {/* Our Story (simple link) */}
          <Link to="/our-story" className="block py-3 text-[#3B3B3B] font-dm-sans-medium" onClick={() => setIsMobileMenuOpen(false)}>Our Story</Link>

          {/* Work (simple link on mobile, submenu removed) */}
          <Link to="/work" className="block py-3 text-[#3B3B3B] font-dm-sans-medium" onClick={() => setIsMobileMenuOpen(false)}>Work</Link>

          <Link to="/contact" className="block py-3 text-[#3B3B3B] font-dm-sans-medium" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</Link>
          <Link to="/with-apnaaapan" className="block py-3 text-[#3B3B3B] font-dm-sans-medium" onClick={() => setIsMobileMenuOpen(false)}>With.Apnaaapan</Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 