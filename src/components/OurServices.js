import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    id: "01",
    title: "Branding & Identity.",
    description: "Whatever we take on, whether it's a product, website, or brand, it's never just for show. It's designed to work hard, deliver real value, and never coast on aesthetics."
  },
  {
    id: "02",
    title: "Design & Creative.",
    description: "Whatever we take on, whether it's a product, website, or brand, it's never just for show. It's designed to work hard, deliver real value, and never coast on aesthetics."
  },
  {
    id: "03",
    title: "Social Media & Marketing.",
    description: "Whatever we take on, whether it's a product, website, or brand, it's never just for show. It's designed to work hard, deliver real value, and never coast on aesthetics."
  },
  {
    id: "04",
    title: "Web Development.",
    description: "Whatever we take on, whether it's a product, website, or brand, it's never just for show. It's designed to work hard, deliver real value, and never coast on aesthetics."
  },
  {
    id: "05",
    title: "Marketing Strategy.",
    description: "Whatever we take on, whether it's a product, website, or brand, it's never just for show. It's designed to work hard, deliver real value, and never coast on aesthetics."
  }
];

const OurServices = ({ showHeader = true, items }) => {
  const wrapperRef = useRef(null);
  const cardsRef = useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToRender = items && items.length ? items : services;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const cards = cardsRef.current;
    
    if (!wrapper || !cards.length) return;

    // Handle resize events
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    
    window.addEventListener('resize', handleResize);

    // Calculate total width needed for horizontal scroll
    const getMaxWidth = () => {
      return cards.reduce((val, card) => val + card.offsetWidth, 0);
    };

    const maxWidth = getMaxWidth();
    const scrollSpeed = window.innerWidth < 768 ? 1.5 : 1.2; // Faster scroll for mobile to reduce empty space
    let tl = gsap.timeline();

    // Create horizontal scroll animation with maximum performance
    // Ensure we scroll enough to show the last card completely
    const isMobile = window.innerWidth < 768;
    const extraSpace = isMobile ? 0.05 : 0.15; // Minimized for mobile to eliminate empty space during animation
    const scrollDistance = maxWidth - window.innerWidth + (window.innerWidth * extraSpace);
    tl.to(cards, {
      x: -scrollDistance,
      duration: 1,
      ease: "none",
      force3D: true,
      transformOrigin: "center center",
      immediateRender: false, // Better performance
      willChange: "transform" // Optimize for GPU acceleration
    });

    // Create ScrollTrigger with highly optimized settings
    const scrollTrigger = ScrollTrigger.create({
      animation: tl,
      trigger: wrapper,
      pin: true,
      scrub: 0.05, // Reduced scrub for smoother animation
      snap: {
        snapTo: "labels",
        duration: { min: 0.2, max: 0.5 },
        delay: 0.1,
        directional: false
      },
      end: () => "+=" + (scrollDistance / scrollSpeed) * (window.innerWidth < 768 ? 1.0 : 2), // Further reduced for mobile to show next section sooner
      invalidateOnRefresh: true,
      anticipatePin: 1,
      refreshPriority: -1, // Better performance
      fastScrollEnd: true, // Optimize for fast scrolling
      onUpdate: (self) => {
        // Update current index based on progress
        const progress = self.progress;
        const newIndex = Math.round(progress * (cards.length - 1));
        setCurrentIndex(newIndex);
      }
    });

    function init() {
      gsap.set(cards, { 
        x: 0, 
        force3D: true,
        immediateRender: false
      });
      const maxWidth = getMaxWidth();
      const isMobile = window.innerWidth < 768;
      const extraSpace = isMobile ? 0.05 : 0.15; // Minimized for mobile to eliminate empty space during animation
      const scrollDistance = maxWidth - window.innerWidth + (window.innerWidth * extraSpace);
      let position = 0;
      const distance = scrollDistance;
      
      // Add labels for each card with better spacing
      tl.add("label0", 0);
      cards.forEach((card, i) => {
        let progress = position;
        position += card.offsetWidth / distance;
        tl.add("label" + (i + 1), position);
      });
    }

    init();
    ScrollTrigger.addEventListener("refreshInit", init);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      ScrollTrigger.removeEventListener("refreshInit", init);
      scrollTrigger.kill();
      tl.kill();
    };
  }, [itemsToRender]);


  return (
    <section className="bg-[#EFE7D5] pt-4 sm:pt-8 md:pt-14 lg:pt-20 pb-0 sm:pb-6 md:pb-8 lg:pb-0 px-3 sm:px-4 md:px-8 overflow-x-hidden -mb-[15vh] sm:mb-0">
      <div className="max-w-7xl mx-auto overflow-x-hidden">
        {/* Header Section */}
        {showHeader && (
          <div className="flex flex-col lg:flex-row items-center justify-between mb-3 sm:mb-6 md:mb-8 lg:mb-12 xl:mb-20">
            <div className="lg:w-1/2 mb-3 sm:mb-4 md:mb-6 lg:mb-0 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#1a2236] mb-2 sm:mb-3 md:mb-4 tracking-tight">
                Our Services
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#22223b] mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Whatever we take on, whether it's a product, website, or brand, it's never just for show. It's designed to work hard, deliver real value, and never coast on aesthetics. We believe in creating solutions that not only look great but perform exceptionally well, driving meaningful results for our clients and their businesses.
              </p>
              <button 
                onClick={() => window.location.href = '/services'}
                className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base md:text-lg hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center space-x-2 mx-auto lg:mx-0"
              >
                <span>View All</span>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <img 
                src="/images/Group 100.png" 
                alt="Company Logo" 
                className="w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 object-contain relative z-10"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Services Cards with GSAP ScrollTrigger horizontal scroll */}
      <div 
        ref={wrapperRef}
        className="wrapper flex flex-nowrap items-center"
        style={{ 
          height: window.innerWidth < 768 ? '35vh' : '90vh',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          perspective: '1000px',
          transform: 'translateZ(0)', // Force hardware acceleration
          WebkitTransform: 'translateZ(0)',
          WebkitBackfaceVisibility: 'hidden',
          contain: 'layout style paint' // Optimize rendering performance
        }}
      >
        {itemsToRender.map((service, index) => (
          <div 
            key={service.id} 
            ref={el => cardsRef.current[index] = el}
            className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] lg:w-[450px] mx-2 sm:mx-3 md:mx-4"
            style={{
              willChange: 'transform',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
              WebkitTransform: 'translateZ(0)',
              WebkitBackfaceVisibility: 'hidden',
              contain: 'layout style paint' // Optimize rendering performance
            }}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-300 group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] xl:h-[560px]">
              {/* Hover Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-3xl"></div>
              
              {/* Content Container */}
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex-1">
                  <span className="text-orange-500 font-bold text-base sm:text-lg mb-4 sm:mb-6 block tracking-wider group-hover:text-white transition-colors duration-300">
                    ({service.id})
                  </span>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-[#1a2236] mb-3 sm:mb-4 md:mb-6 group-hover:text-white transition-colors duration-300 leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-[#22223b] leading-relaxed text-xs sm:text-sm md:text-base group-hover:text-white transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default OurServices;