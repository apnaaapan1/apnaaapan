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
            Not Just What We Do. How We Do It.
          </p>
          <p className="mt-2 text-base md:text-lg lg:text-xl text-[#0D1B2A]/80 font-nexa-regular">
            Built With Care. Shaped by People.
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
                Apnaaapan is a collective of designers, marketers, strategists, editors, developers, and storytellers who care deeply about the work and the people behind it.
              </p>
              <p>
                We exist to help brands grow, not through noise or shortcuts, but through thoughtful design, clear thinking, and genuine collaboration.
              </p>
              <p>
                We don't chase how things look.
                <br />
                We focus on how they work.
              </p>
              <p>
                By understanding your brand, your audience, and what truly matters to you, we build work that connects, lasts, and moves your business forward in ways that feel right.
              </p>
            </div>

            {/* CTA Button - single gradient pill with arrow and text together */}
            <a href="#contact" className="group mt-8 inline-flex items-center gap-2 md:gap-3 rounded-full bg-gradient-to-r from-[#DF5316] to-[#F4BF11] px-5 md:px-7 py-3 text-white shadow-[0_6px_16px_rgba(223,83,22,0.25)] hover:brightness-105 transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-0.5">
                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-sm md:text-base font-semibold">Work with US</span>
            </a>
          </div>

          {/* Image */}
          <div className="relative group">
            <div className="rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.12)] h-[350px] sm:h-[400px] md:h-[450px]">
              <img
                src="/images/apnaaapan.webp"
                alt="Apnaaapan team"
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
            <h3 className="text-5xl md:text-6xl font-serif text-[#0D1B2A] tracking-tight">Our Mission</h3>
            <p className="mt-4 md:mt-5 text-xl md:text-2xl text-[#0D1B2A] font-nexa-regular">
              To build spaces that feel like your own.
            </p>
            <div className="mt-5 md:mt-6 text-[#0D1B2A]/85 font-nexa-regular leading-relaxed text-[15px] md:text-base max-w-xl space-y-3">
              <p>
                Apnaaapan comes from <em>apna aapan</em>, the idea of having a place where you don't have to perform, explain, or fit into someone else's version of success.
                <br />
                Our mission is to create that feeling in everything we build.
              </p>
              <p>
                Through brands, communities, and collaborations, we focus on trust first.
                <br />
                On work that feels honest.
                <br />
                On growth that doesn't disconnect you from who you are.
              </p>
              <p>
                Because when something feels like your own, you show up fully.
                <br />
                And that's when real progress begins.
              </p>
            </div>
          </div>

          {/* Our vision */}
          <div>
            <h3 className="text-5xl md:text-6xl font-serif text-[#0D1B2A] tracking-tight">Our Vision</h3>
            <p className="mt-4 md:mt-5 text-xl md:text-2xl text-[#0D1B2A] font-nexa-regular">
              To grow a culture where curiosity leads.
            </p>
            <div className="mt-5 md:mt-6 text-[#0D1B2A]/85 font-nexa-regular leading-relaxed text-[15px] md:text-base max-w-xl space-y-3">
              <p>
                Today, Apnaaapan is moving beyond services into something wider.
                <br />
                A community shaped by curiosity, not certainty.
                <br />
                A place where questions are welcomed, not rushed.
                <br />
                Where people build together, explore together, and learn without pretending to have it all figured out.
              </p>
              <p>
                We imagine a future where work feels human again.
                <br />
                Where growth feels shared, not lonely.
                <br />
                Where "your own" doesn't mean isolated, it means connected.
              </p>
              <p>
                That's the world we're building toward.
                <br />
                Slowly. Intentionally. Together.
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
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-colors ${currentImageIndex === 0
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
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center transition-colors ${currentImageIndex === totalImages - 1
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
              {['/images/Our_Story1.webp', '/images/Our_story2.webp', '/images/apnaaapan.webp'].map((src, index) => (
                <div key={index} className="flex-shrink-0 w-80 h-96 rounded-2xl overflow-hidden shadow-lg relative bg-[#E8DFD0]">
                  <img src={src} alt={`About gallery ${index + 1}`} className="w-full h-full object-cover" />
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
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-[#0D1B2A] font-nexa-regular">
              How Apnaaapan Came to Be
              <br />
              Apnaaapan didn't begin with a pitch deck or a long-term plan.
              <br />
              It began with restlessness.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-[2px] bg-[#DBD2BF]"></div>

            <div className="space-y-16">
              {[
                {
                  year: '2020 - Where It All Started',
                  text: "Lockdown. A small room in Pali, Rajasthan.\nA third-year electrical engineering student, curious and restless, wanted to move from non-tech into building something of his own. Around the same time, AI tools were beginning to bloom, opening new doors to learning and experimentation.\nThat's when Apnaaapan took shape. A word learned growing up. Apna aapan - your own space, your own market, your own way.\nWhat started as freelance work from a single room became a way to explore, learn, and create. One project at a time.",
                  image: '/images/2020.webp',
                  isCropped: true
                },
                {
                  year: '2021–2022 - From Solo to Shared',
                  text: "Work grew. So did belief.\nFriends joined in. What was once a solo effort slowly turned into a small agency-in-the-making.\nWebsites, social media, design, marketing, everything was learned by doing. Mistakes were frequent. So was growth.\nThere was no rush to \"scale.\" Just a steady rhythm of building, together.",
                  image: '/images/2021.webp',
                  hoverImage: '/images/2022.webp',
                  removeHoverShadow: true
                },
                {
                  year: '2023–2024 - Full-Time Journey',
                  text: "A full-time placement at an MNC came with stability, predictability, and comfort. And then came a decision.\nThe job was left behind. Delhi was left behind too.\nJaipur, the founder's college city, became home again. Apnaaapan turned full-time.\nClients increased. Interns joined. The work became more structured, but the intent stayed the same: build honestly, grow steadily.",
                  image: '/images/2023.webp',
                  hoverImage: '/images/2024.webp',
                  removeHoverShadow: true
                },
                {
                  year: '2025 - Growing Roots',
                  text: "Apnaaapan expanded, not upward, but outward.\nOffices took shape in Pali, Ahmedabad, and Jaipur. Clients came in from across industries and cities, all over India.\nThe team grew to 20+ full-time members and interns, working from different parts of the country, connected by shared intent rather than location.\nIn March 2025, something new began: with.apnaaapan. A community rooted in curiosity. A space for questions, conversations, and people who didn't want ready-made answers.",
                  image: '/images/2025(1).webp',
                  hoverImage: '/images/2025(2).webp'
                },
                {
                  year: '2026 - Chapter 2.0',
                  text: "Now comes the next chapter.\nBigger systems. Better clarity. Deeper focus. But the same core.\nApnaaapan 2.0 isn't about becoming corporate. It's about becoming more intentional.\nMore trust. More people-first work. More space for curiosity, community, and things that last.\nFrom a small room in Pali to a growing collective across cities, Apnaaapan continues to build what it always has: Something that feels like your own.",
                  image: '/images/Our_story2.webp',
                  hoverImage: '/images/2026.png',
                  isLogoHover: true
                }
              ].map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-center">
                  {/* Left: bullet + content */}
                  <div className="md:col-span-7 relative pl-12 md:pl-14">
                    {/* bullet */}
                    <span className="absolute left-2 md:left-4 top-1.5 inline-grid place-items-center w-6 h-6 rounded-full bg-white shadow">
                      <span className="w-2 h-2 rounded-full bg-[#0D1B2A]"></span>
                    </span>
                    <h4 className="text-[#0D1B2A] font-semibold mb-2" style={{ fontFamily: 'NexaBold' }}>{item.year}</h4>
                    <p className="text-[#0D1B2A]/80 text-sm md:text-[15px] leading-relaxed font-nexa-regular whitespace-pre-line">
                      {item.text}
                    </p>
                  </div>

                  {/* Right: tilted cards or image */}
                  <div className="md:col-span-5 mt-8 md:mt-0">
                    {item.image ? (
                      <div className={`relative ${item.year.startsWith('2020') ? 'rounded-3xl overflow-hidden' : 'rounded-2xl overflow-hidden'} ${item.isCropped ? '' : 'shadow-lg'} group flex items-center justify-center ${item.isCropped ? 'h-64 md:h-72 lg:h-80' : ''} ${item.removeHoverShadow ? 'hover:shadow-none group-hover:shadow-none' : ''}`}>
                        <img
                          src={item.image}
                          alt={item.year}
                          className={`${item.isCropped ? `h-full w-auto mx-auto object-contain ${item.year.startsWith('2020') ? 'rounded-3xl' : 'rounded-2xl'}` : 'w-full h-auto rounded-2xl'} transition-opacity duration-300 ${item.hoverImage ? 'group-hover:opacity-0' : ''}`}
                        />
                        {item.hoverImage && (
                          <img
                            src={item.hoverImage}
                            alt={`${item.year} hover`}
                            className={`absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-full shadow-none ${item.year.startsWith('2020') ? 'rounded-3xl' : 'rounded-2xl'} ${item.isLogoHover ? 'object-contain' : 'object-cover'}`}
                            style={{ maxHeight: '100%' }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className="relative h-48">
                        <div className="absolute inset-x-6 top-0 h-28 bg-white rounded-xl shadow-xl rotate-[-4deg]"></div>
                        <div className="absolute inset-x-2 bottom-0 h-32 bg-white rounded-xl shadow-xl rotate-[4deg]"></div>
                      </div>
                    )}
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
                We genuinely care about where you're going. Every team here, from design to marketing, works with one shared intent: helping you move forward. We don't use templates. We listen, understand, and build what truly fits. It's not just about delivering work, it's about creating impact.
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


