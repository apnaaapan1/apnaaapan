import React, { useState, useRef, useEffect } from 'react';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const POSITIONS_API = getApiUrl('/api/positions');

const WorkWithUs = () => {
  // State for tracking current image index in Life at Apnaaapan section
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // State for scroll animations
  const [visibleElements, setVisibleElements] = useState(new Set());

  // State for open positions
  const [positions, setPositions] = useState([]);
  const [positionsLoading, setPositionsLoading] = useState(false);
  const [positionsError, setPositionsError] = useState('');

  // Total number of images
  const totalImages = 4;

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleElements(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchPositions = async () => {
      try {
        setPositionsLoading(true);
        setPositionsError('');
        const res = await fetch(POSITIONS_API);
        if (!res.ok) {
          throw new Error('Failed to load positions');
        }
        const data = await res.json();
        if (!isMounted) return;
        const safePositions = Array.isArray(data.positions) ? data.positions : [];
        setPositions(safePositions);

        // Ensure freshly rendered cards are visible even if they mount after observer setup
        const newIds = safePositions.map((position, index) => `job-card-${position.id || index}`);
        setVisibleElements((prev) => new Set([...prev, ...newIds, 'job-card-empty']));
      } catch (error) {
        console.error('Error fetching positions:', error);
        if (isMounted) {
          setPositionsError('Unable to load open positions right now.');
        }
      } finally {
        if (isMounted) {
          setPositionsLoading(false);
        }
      }
    };

    fetchPositions();

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Helper function to get animation classes
  const getAnimationClasses = (elementId) => {
    const isVisible = visibleElements.has(elementId);
    return `transition-all duration-1000 ease-out ${isVisible
        ? 'opacity-100 translate-y-0'
        : 'opacity-0 translate-y-8'
      }`;
  };

  return (
    <div className="bg-[#EFE7D5] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center min-h-[90vh] flex flex-col justify-center items-center py-6">
          <h1
            id="header-title"
            data-animate
            className={`text-6xl md:text-7xl lg:text-8xl font-bold text-[#0D1B2A] mb-6 leading-tight ${getAnimationClasses('header-title')}`}
            style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}
          >
            Grow With <span className="text-[#FFC107]">Us</span>
          </h1>
          <p
            id="header-description"
            data-animate
            className={`text-xl md:text-2xl text-[#5B5B5B] max-w-4xl mx-auto leading-relaxed mb-6 ${getAnimationClasses('header-description')}`}
            style={{ fontFamily: 'NexaRegular' }}
          >
            Apnaaapan is a place for people who care about the work and the why behind it.
            <br />
            If you're curious, thoughtful, and willing to learn by doing, you'll feel at home here.
            <br />
            If that sounds like you, we'd love to work together.
          </p>
          <button
            id="header-button"
            data-animate
            onClick={() => {
              const openPositionsSection = document.getElementById('open-positions');
              if (openPositionsSection) {
                openPositionsSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className={`bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-10 py-5 rounded-full font-semibold text-xl flex items-center space-x-3 mx-auto hover:shadow-lg transition-all duration-200 hover:scale-105 ${getAnimationClasses('header-button')}`}
            style={{ fontFamily: 'NexaBold Regular' }}
          >
            <span>view open positions</span>
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Quote/Testimonial Section */}
        <div className="text-center mb-20 sm:mb-24 md:mb-28">
          <blockquote className="max-w-5xl mx-auto">
            <p
              id="quote-text"
              data-animate
              className={`text-2xl md:text-3xl lg:text-4xl font-bold text-[#0D1B2A] leading-relaxed mb-6 ${getAnimationClasses('quote-text')}`}
            >
              "This didn't start as a company. It started as a need to build something that felt honest.
              <br />
              Apnaaapan grew from curiosity, mistakes, and learning in public. From late nights, small wins, and the belief that good work doesn't need to be loud to matter.
              <br />
              <span className="text-[#F26B2A]">Everything we build carries that same intent, to create with care, to grow with clarity, and to never lose the human side of the work."</span>
            </p>
            <footer
              id="quote-author"
              data-animate
              className={`mt-8 ${getAnimationClasses('quote-author')}`}
            >
              <cite className="not-italic">
                <div className="text-xl font-bold text-[#0D1B2A]">- Gourav Sharma</div>
                <div className="text-lg text-[#5B5B5B]">Founder, Apnaaapan</div>
              </cite>
            </footer>
          </blockquote>
        </div>

        {/* Our Culture Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20 sm:mb-24 md:mb-28">
          {/* Left Section - Text Content */}
          <div className="space-y-8">
            <h2
              id="culture-title"
              data-animate
              className={`text-4xl md:text-5xl font-bold text-black leading-tight ${getAnimationClasses('culture-title')}`}
            >
              Our Culture
            </h2>
            <p
              id="culture-description"
              data-animate
              className={`text-lg md:text-xl text-[#5B5B5B] leading-relaxed ${getAnimationClasses('culture-description')}`}
            >
              Our culture isn't built on buzzwords. It's built on how we show up for each other.
              <br />
              We value curiosity over certainty.
              <br />
              Work here moves with intention. We think before we act.
              <br />
              We ask questions before offering answers.
              <br />
              There's room to learn. Room to unlearn.
              <br />
              And room to grow without pretending you have it all figured out.
              <br />
              We care about the work, yes. But we care just as much about the people doing it.
              <br />
              Because when people feel trusted and heard, good work follows naturally.
            </p>
          </div>

          {/* Right Section - Team Image */}
          <div
            id="culture-image"
            data-animate
            className={`relative ${getAnimationClasses('culture-image')}`}
          >
            <div className="h-[400px] w-full rounded-2xl overflow-hidden">
              {/* Team Culture Image */}
              <img
                src="/images/apnaaapan_team.webp"
                alt="Our Team Culture - Apnaaapan team members"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>

        {/* Numbers That Shows Growth Section */}
        <div className="text-center mb-20 sm:mb-24 md:mb-28 w-full">
          <h2
            id="growth-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-black mb-16 leading-tight font-serif ${getAnimationClasses('growth-title')}`}
          >
            Numbers That Shows Growth
          </h2>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 lg:gap-24 w-full">
            {/* Stat 1 */}
            <div
              id="stat-1"
              data-animate
              className={`text-center ${getAnimationClasses('stat-1')}`}
            >
              <div className="text-5xl md:text-6xl font-bold text-[#4A70B0] mb-3">3+</div>
              <p className="text-sm text-[#5B5B5B] leading-relaxed px-4">
                Years of excellence in digital marketing and brand building, delivering consistent results for our clients
              </p>
            </div>

            {/* Stat 2 */}
            <div
              id="stat-2"
              data-animate
              className={`text-center ${getAnimationClasses('stat-2')}`}
            >
              <div className="text-5xl md:text-6xl font-bold text-[#4A70B0] mb-3">65+</div>
              <p className="text-sm text-[#5B5B5B] leading-relaxed px-4">
                Successful campaigns completed across various industries, from startups to established enterprises
              </p>
            </div>

            {/* Stat 3 */}
            <div
              id="stat-3"
              data-animate
              className={`text-center ${getAnimationClasses('stat-3')}`}
            >
              <div className="text-5xl md:text-6xl font-bold text-[#4A70B0] mb-3">100+</div>
              <p className="text-sm text-[#5B5B5B] leading-relaxed px-4">
                Happy clients who trust us with their brand growth and digital presence strategies
              </p>
            </div>

            {/* Stat 4 */}
            <div
              id="stat-4"
              data-animate
              className={`text-center ${getAnimationClasses('stat-4')}`}
            >
              <div className="text-5xl md:text-6xl font-bold text-[#4A70B0] mb-3">75%+</div>
              <p className="text-sm text-[#5B5B5B] leading-relaxed px-4">
                Average increase in client engagement and conversion rates through our strategic campaigns
              </p>
            </div>
          </div>
        </div>

        {/* Life at Apnaaapan Section */}
        <div className="mb-20 sm:mb-24 md:mb-28 w-full">
          <h2
            id="life-title"
            data-animate
            className={`text-4xl md:text-5xl font-bold text-black mb-16 leading-tight font-serif text-center ${getAnimationClasses('life-title')}`}
          >
            Life at Apnaaapan
          </h2>

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
              className="flex space-x-6 overflow-x-auto pb-4 px-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Card 1 - Team on Sofa */}
              <div className="flex-shrink-0 max-w-[600px] h-[350px] overflow-hidden bg-[#EFE7D5] flex items-center justify-center">
                <img
                  src="/images/life_apnaaapan1.webp"
                  alt="Team members sitting on sofa - collaborative work environment"
                  className="h-full w-auto object-contain rounded-2xl"
                />
              </div>

              {/* Card 2 - Gaurav */}
              <div className="flex-shrink-0 max-w-[600px] h-[350px] overflow-hidden bg-[#EFE7D5] flex items-center justify-center">
                <img
                  src="/images/life_apnaaapan2.webp"
                  alt="Gaurav - Team member with red hoodie and wireless earbuds"
                  className="h-full w-auto object-contain rounded-2xl"
                />
              </div>

              {/* Card 3 - Team Discussion */}
              <div className="flex-shrink-0 max-w-[600px] h-[350px] overflow-hidden bg-[#EFE7D5] flex items-center justify-center">
                <img
                  src="/images/life_apnaaapan3.webp"
                  alt="Team members in discussion - collaborative brainstorming session"
                  className="h-full w-auto object-contain rounded-2xl"
                />
              </div>

              {/* Card 4 - Kartik Patel */}
              <div className="flex-shrink-0 max-w-[600px] h-[350px] overflow-hidden bg-[#EFE7D5] flex items-center justify-center">
                <img
                  src="/images/life_apnaaapan4.webp"
                  alt="Kartik Patel - Team member with confident smile"
                  className="h-full w-auto object-contain rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Open Positions Section */}
        <div id="open-positions" className="mb-8 w-full">
          <div className="mb-8">
            <h2
              id="positions-title"
              data-animate
              className={`text-3xl sm:text-4xl md:text-5xl font-bold text-[#0D1B2A] mb-6 sm:mb-8 leading-tight ${getAnimationClasses('positions-title')}`}
            >
              Open Positions
            </h2>
            <p
              id="positions-description"
              data-animate
              className={`text-base sm:text-lg md:text-xl text-[#5B5B5B] max-w-4xl leading-relaxed ${getAnimationClasses('positions-description')}`}
            >
              We're looking for people who care about the work and the people behind it.
              <br />
              If you enjoy learning, collaborating, and building with intention, you'll feel at home here.
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8 w-full">
            {positionsLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`job-card-skeleton-${index}`}
                  className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg animate-pulse"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                    <div className="h-7 sm:h-8 w-48 bg-gray-200 rounded" />
                    <div className="h-10 w-32 bg-gray-200 rounded-full" />
                  </div>
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
              ))
            ) : positions && positions.length > 0 ? (
              positions.map((position, index) => {
                const cardId = `job-card-${position.id || index}`;
                const applyHref = position.applyUrl || 'mailto:hr@apnaaapan.com';

                return (
                  <div
                    key={cardId}
                    id={cardId}
                    data-animate
                    className={`bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg relative ${getAnimationClasses(cardId)}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0D1B2A] leading-tight">
                        {position.title}
                      </h3>
                      <a
                        href={applyHref}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 sm:px-6 py-3 sm:py-3 rounded-full font-semibold flex items-center justify-center space-x-2 hover:shadow-lg transition-all duration-200 hover:scale-105 w-full sm:w-auto"
                      >
                        <span>Apply Now</span>
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                    <p className="text-base sm:text-lg text-[#5B5B5B] leading-relaxed">
                      {position.description || 'More details coming soon.'}
                    </p>
                  </div>
                );
              })
            ) : (
              <div
                id="job-card-empty"
                data-animate
                className={`bg-white rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg relative ${getAnimationClasses('job-card-empty')}`}
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 space-y-4 sm:space-y-0">
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0D1B2A] leading-tight">
                    No open roles right now
                  </h3>
                  <div className="bg-gray-200 text-gray-600 px-4 sm:px-6 py-3 sm:py-3 rounded-full font-semibold flex items-center justify-center space-x-2 w-full sm:w-auto">
                    <span>Check back soon</span>
                  </div>
                </div>
                <p className="text-base sm:text-lg text-[#5B5B5B] leading-relaxed">
                  {positionsError || 'We are not actively hiring at the moment. Feel free to reach out and we will contact you when a suitable role opens.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkWithUs;
