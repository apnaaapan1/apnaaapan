import React, { useState, useRef, useEffect } from 'react';
import OurServices from '../components/OurServices';
import OurWinningProcess from '../components/OurWinningProcess';
import BookingSection from '../components/BookingSection';

const AboutUs = () => {
  // State for tracking current image index in gallery section
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  
  // Total number of images
  const totalImages = 3;
  
  // Handle scroll event to update current index
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const cardWidth = 320 + 24; // 320px (w-80) + 24px (space-x-6)
        const newIndex = Math.round(scrollLeft / cardWidth);
        setCurrentImageIndex(Math.min(newIndex, totalImages - 1));
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [totalImages]);
  
  // Function to scroll to previous image
  const scrollToPrevious = () => {
    if (currentImageIndex > 0) {
      const newIndex = currentImageIndex - 1;
      setCurrentImageIndex(newIndex);
      if (scrollContainerRef.current) {
        const cardWidth = 320 + 24; // 320px (w-80) + 24px (space-x-6)
        scrollContainerRef.current.scrollTo({
          left: newIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };
  
  // Function to scroll to next image
  const scrollToNext = () => {
    if (currentImageIndex < totalImages - 1) {
      const newIndex = currentImageIndex + 1;
      setCurrentImageIndex(newIndex);
      if (scrollContainerRef.current) {
        const cardWidth = 320 + 24; // 320px (w-80) + 24px (space-x-6)
        scrollContainerRef.current.scrollTo({
          left: newIndex * cardWidth,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      {/* Centered Hero Section matching design */}
      <section className="px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-24 md:pb-28 mb-10 md:mb-16">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif tracking-tight">
              <span className="text-[#0D1B2A]">About </span>
              <span className="bg-gradient-to-r from-[#DF5316] to-[#F4BF11] bg-clip-text text-transparent">Us</span>
            </h1>
          <p className="mt-6 md:mt-8 text-base md:text-lg lg:text-xl text-[#0D1B2A]/80 font-nexa-regular">
              Creative at Heart. Strategic by Nature. Focused on You
          </p>
        </div>
      </section>

      

      {/* Who We Are Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-28 md:pt-32 pb-28">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0D1B2A] tracking-tight mb-6">Who We Are</h2>
            <div className="space-y-4 text-[#0D1B2A]/90 font-nexa-regular leading-relaxed text-[15px] md:text-base max-w-2xl">
              <p>
                Apnaapan is a full-service creative agency made up of designers, marketers,
                strategists, editors, developers, and storytellers. We’re here to help brands grow
                through thoughtful design, smart marketing, and real collaboration.
              </p>
              <p>
                We’re not just here to make things look good—we’re here to make them work. Everything we
                do is rooted in understanding what your brand needs, who your audience is, and how we can
                help you connect, engage, and thrive.
              </p>
            </div>

            {/* CTA Button - single gradient pill with arrow and text together */}
            <a href="#contact" className="group mt-8 inline-flex items-center gap-2 md:gap-3 rounded-full bg-gradient-to-r from-[#DF5316] to-[#F4BF11] px-5 md:px-7 py-3 text-white shadow-[0_6px_16px_rgba(223,83,22,0.25)] hover:brightness-105 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-sm md:text-base font-semibold">Work with US</span>
            </a>
          </div>

          {/* Image */}
          <div className="relative group">
            <div className="rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
              <img
                src="/images/work/Tsczi1maYoHHENT2Fu6ychsMM%201.png"
                alt="Work banner"
                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Mission & Vision Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-10 md:pt-14 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24">
          {/* Our mission */}
          <div>
            <h3 className="text-5xl md:text-6xl font-serif text-[#0D1B2A] tracking-tight">Our mission</h3>
            <p className="mt-4 md:mt-5 text-xl md:text-2xl text-[#0D1B2A] font-nexa-regular">
              To provide impactful growth solutions
            </p>
            <div className="mt-5 md:mt-6 text-[#0D1B2A]/85 font-nexa-regular leading-relaxed text-[15px] md:text-base max-w-xl">
              <p>
                This isn't just a statement; it's our commitment to making a real difference. We're
                here to offer solutions that don't just work, but truly propel our clients' growth.
                Think of it as our promise to deliver strategies that have a lasting impact, helping
                businesses not just grow, but thrive.
              </p>
            </div>
          </div>

          {/* Our vision */}
          <div>
            <h3 className="text-5xl md:text-6xl font-serif text-[#0D1B2A] tracking-tight">Our vision</h3>
            <p className="mt-4 md:mt-5 text-xl md:text-2xl text-[#0D1B2A] font-nexa-regular">
              A world where growth comes naturally.
            </p>
            <div className="mt-5 md:mt-6 text-[#0D1B2A]/85 font-nexa-regular leading-relaxed text-[15px] md:text-base max-w-xl">
              <p>
                Imagine a world where growing your business is as smooth as sailing on a calm sea.
                That's the future we're aspiring to create. We believe every business, big or small,
                should have the opportunity to grow without the usual roadblocks and headaches. We're
                not just dreaming of this world; we're actively working to make it a reality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Photos Section with scrolling animation */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Navigation Arrows */}
            <button 
              onClick={scrollToPrevious}
              disabled={currentImageIndex === 0}
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-colors ${
                currentImageIndex === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              onClick={scrollToNext}
              disabled={currentImageIndex === totalImages - 1}
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-colors ${
                currentImageIndex === totalImages - 1 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-gray-50 cursor-pointer'
              }`}
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Image Cards Container */}
            <div 
              ref={scrollContainerRef}
              className="flex space-x-6 overflow-x-auto pb-4 px-4 hide-scrollbar" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {['/images/image 12.png','/images/image 13.png','/images/image 14.png'].map((src, index) => (
                <div key={index} className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden shadow-lg relative bg-[#E8DFD0]">
                  <img src={src} alt={`About gallery ${index+1}`} className="w-full h-full object-cover" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="inline-block w-6 h-6 bg-white/90 text-[#5B5B5B] text-xs rounded-full grid place-items-center shadow">{index === 0 ? '●' : '○'}</span>
                  </div>
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <span className="inline-block w-6 h-6 bg-white/90 text-[#5B5B5B] text-xs rounded-full grid place-items-center shadow">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our History Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0D1B2A] tracking-tight">Our History</h2>
            <p className="mt-4 max-w-3xl mx-auto text-sm md:text-base text-[#0D1B2A]/80 font-nexa-regular">
              From a small idea to a full-scale creative agency, our journey has been shaped by passion,
              people, and purposeful growth. Every milestone reflects our commitment to doing meaningful
              work and helping brands thrive.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-[#DBD2BF]"></div>

            <div className="space-y-16">
              {[
                { year: '2024', text: "Aimed at constant transformation, we shifted our focus to a more efficient omnichannel approach. It allowed us to increase conversions x4 and boost our and our customers' growth. Also, we started developing the Belkins ecosystem by partnering with the best-in-class agencies to serve our customers better and cover more needs than before. Finally, we received the title of the Most Innovative B2B Lead Generation Agency 2024 from the Corporate Excellence Awards." },
                { year: '2024', text: "Aimed at constant transformation, we shifted our focus to a more efficient omnichannel approach. It allowed us to increase conversions x4 and boost our and our customers' growth. Also, we started developing the Belkins ecosystem by partnering with the best-in-class agencies to serve our customers better and cover more needs than before. Finally, we received the title of the Most Innovative B2B Lead Generation Agency 2024 from the Corporate Excellence Awards." },
                { year: '2023', text: "Aimed at constant transformation, we shifted our focus to a more efficient omnichannel approach. It allowed us to increase conversions x4 and boost our and our customers' growth. Also, we started developing the Belkins ecosystem by partnering with the best-in-class agencies to serve our customers better and cover more needs than before. Finally, we received the title of the Most Innovative B2B Lead Generation Agency 2024 from the Corporate Excellence Awards." },
                { year: '2022', text: "Aimed at constant transformation, we shifted our focus to a more efficient omnichannel approach. It allowed us to increase conversions x4 and boost our and our customers' growth. Also, we started developing the Belkins ecosystem by partnering with the best-in-class agencies to serve our customers better and cover more needs than before. Finally, we received the title of the Most Innovative B2B Lead Generation Agency 2024 from the Corporate Excellence Awards." },
                { year: '2021', text: "Aimed at constant transformation, we shifted our focus to a more efficient omnichannel approach. It allowed us to increase conversions x4 and boost our and our customers' growth. Also, we started developing the Belkins ecosystem by partnering with the best-in-class agencies to serve our customers better and cover more needs than before. Finally, we received the title of the Most Innovative B2B Lead Generation Agency 2024 from the Corporate Excellence Awards." }
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                  {/* Left: bullet + content */}
                  <div className="md:col-span-7 relative pl-12 md:pl-14">
                    {/* bullet */}
                    <span className="absolute left-2 md:left-4 top-1.5 inline-grid place-items-center w-6 h-6 rounded-full bg-white shadow">
                      <span className="w-2 h-2 rounded-full bg-[#0D1B2A]"></span>
                    </span>
                    <h4 className="text-[#0D1B2A] font-semibold mb-2" style={{fontFamily:'NexaBold'}}>{item.year}</h4>
                    <p className="text-[#0D1B2A]/80 text-sm md:text-[15px] leading-relaxed font-nexa-regular">
                      {item.text}
                    </p>
                  </div>

                  {/* Right: tilted cards */}
                  <div className="md:col-span-5 hidden md:block">
                    <div className="relative h-48">
                      <div className="absolute inset-x-6 top-0 h-28 bg-white rounded-xl shadow-xl rotate-[-4deg]"></div>
                      <div className="absolute inset-x-2 bottom-0 h-32 bg-white rounded-xl shadow-xl rotate-[4deg]"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* What We Do - Intro Section (moved below Our History) */}
      <section className="px-4 sm:px-6 lg:px-8 pt-6 md:pt-10 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif text-[#0D1B2A] tracking-tight">What We Do</h2>
          <p className="mt-4 text-sm md:text-base text-[#0D1B2A]/80 font-nexa-regular">
            We work across all areas of branding and digital
            <br className="hidden sm:block" />
            to deliver results-driven creative solutions. Our services include
          </p>
        </div>
      </section>

      {/* Services Cards Section reused from Home (cards + animation only) */}
      <OurServices showHeader={false} />

      {/* Our Winning Process - reused from Home with animation, slightly smaller spacer */}
      <OurWinningProcess compact={true} showSpacer={true} spacerScreens={0.75} />

      {/* What sets us apart section reused from OurStory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-14">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Color bars - better mobile layout */}
            <div className="h-3 sm:h-4 lg:h-auto lg:w-8 flex lg:flex-col">
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#FF6B35]"></div>
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#FFD700]"></div>
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#4682B4]"></div>
            </div>
            
            {/* Content area */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D1B2A] leading-tight" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
                  What sets us apart from others?
                </h3>
                <div className="flex space-x-1 sm:ml-6 self-start">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-base sm:text-lg md:text-xl leading-6 sm:leading-7 md:leading-8 text-[#2C2C2C] max-w-5xl" style={{ fontFamily: 'NexaRegular' }}>
                We genuinely care about your goals. Every team here, from design to marketing, works with one focus: making sure you win. We don't believe in one-size-fits-all solutions. Instead, we listen, we understand, and we build what actually works for you. It's not just about delivering work—it's about delivering impact.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Booking CTA section reused from Home */}
      <BookingSection />
    </main>
  );
};

export default AboutUs;


