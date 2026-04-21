import React, { useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const scrollStaticServicesRow = (container, direction) => {
  if (!container) return;
  const first = container.firstElementChild;
  if (!first) return;
  const style = window.getComputedStyle(first);
  const marginX =
    (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);
  const step = first.getBoundingClientRect().width + marginX;
  const maxScroll = Math.max(0, container.scrollWidth - container.clientWidth);
  const next = Math.min(
    maxScroll,
    Math.max(0, container.scrollLeft + direction * step)
  );
  container.scrollTo({ left: next, behavior: 'smooth' });
};

const services = [
  {
    id: "01",
    title: "Branding & Identity",
    description: (
      <>
        <span>We don't start with logos.</span>
        <br />
        <span>We start with meaning.</span>
        <br />
        <span>The kind that makes your brand feel familiar, trustworthy, and easy to remember.</span>
        <br />
        <span>So when people see you, they get you.</span>
      </>
    )
  },
  {
    id: "02",
    title: "Design & Creative",
    description: (
      <>
        <span>Good design isn't loud.</span>
        <br />
        <span>It's clear.</span>
        <br />
        <span>Every visual we create has a job, to catch attention, hold it, and move people to act.</span>
        <br />
        <span>Nothing extra. Nothing random.</span>
      </>
    )
  },
  {
    id: "03",
    title: "Social Media & Marketing",
    description: (
      <>
        <span>We help brands show up without pretending.</span>
        <br />
        <span>Telling real stories. Building real engagement.</span>
        <br />
        <span>And turning attention into outcomes that actually matter to your business.</span>
      </>
    )
  },
  {
    id: "04",
    title: "Web Development",
    description: (
      <>
        <span>Websites shouldn't confuse people.</span>
        <br />
        <span>We build fast, intuitive experiences that guide visitors naturally</span>
        <br />
        <span>from curiosity to action, without making them think too hard.</span>
      </>
    )
  },
  {
    id: "05",
    title: "Marketing Strategy",
    description: "Your growth, planned and delivered. We develop and execute custom marketing strategies that reach your audience, maximize ROI, and accelerate your journey from launch to success."
  }
];

const CARD_COLUMN_CLASS =
  'mx-2 flex w-[280px] flex-shrink-0 sm:mx-3 sm:w-[320px] md:mx-4 md:w-[380px] lg:w-[450px]';

const GPU_CARD_WRAPPER_STYLE = {
  willChange: 'transform',
  backfaceVisibility: 'hidden',
  transform: 'translateZ(0)',
  WebkitTransform: 'translateZ(0)',
  WebkitBackfaceVisibility: 'hidden',
  contain: 'layout style paint',
};

const OurServices = ({ showHeader = true, items, enableScrollAnimation = true }) => {
  const wrapperRef = useRef(null);
  const cardsRef = useRef([]);
  const itemsToRender = items && items.length ? items : services;

  const handleStaticArrowClick = useCallback(
    (direction) => {
      if (enableScrollAnimation) return;
      scrollStaticServicesRow(wrapperRef.current, direction);
    },
    [enableScrollAnimation]
  );

  useEffect(() => {
    if (!enableScrollAnimation) return undefined;

    const wrapper = wrapperRef.current;
    const cards = cardsRef.current;

    // Clean up null references to avoid errors
    const validCards = cards.filter(card => card !== null);

    if (!wrapper || !validCards.length) return;

    // Robust width calculation using reduce (matches OurStory.js approach)
    // This is more reliable for flex containers than scrollWidth
    const getMaxWidth = () => {
      return validCards.reduce((val, card) => val + card.offsetWidth, 0);
    };

    // Helper to calculate precise scroll distance
    const getScrollDistance = () => {
      const maxWidth = getMaxWidth();
      // Ensure we treat mobile/desktop distinctly
      const isMobile = window.innerWidth < 768;
      // Buffer adjustment to ensure the last card is fully visible
      // Mobile needs a bit more buffer usually due to screen constraints
      const extraSpace = isMobile ? 0.3 : 0.15;
      return maxWidth - wrapper.offsetWidth + (window.innerWidth * extraSpace);
    };

    let tl = gsap.timeline();

    // Use function-based value for x to support invalidation on refresh properly
    // This allows GSAP to re-calculate the destination when the screen parses
    tl.to(validCards, {
      x: () => -getScrollDistance(),
      duration: 1,
      ease: "none",
      force3D: true, // Force GPU acceleration
      immediateRender: false,
    });

    // Create ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      animation: tl,
      trigger: wrapper,
      pin: true,
      scrub: 0.5, // Slightly smoother scrub
      snap: {
        snapTo: "labels",
        duration: { min: 0.2, max: 0.5 },
        delay: 0.1,
        directional: false // Snap in both directions
      },
      // Recalculate end position dynamically
      end: () => "+=" + (getScrollDistance() / 1.2) * 2,
      invalidateOnRefresh: true, // Important: recalculates tween values on resize
      anticipatePin: 1,
      fastScrollEnd: true,
    });

    // Initialize labels for snapping
    function init() {
      // Clear any existing labels to prevent duplicates on refresh
      // tl.clearLabels(); // Method not available

      const distance = getScrollDistance();
      let position = 0;

      // Add start label
      tl.add("label0", 0);

      // Calculate relative positions for other cards
      validCards.forEach((card, i) => {
        // Calculate how much of the total distance this card occupies
        const cardDistance = card.offsetWidth;
        // Add to current position
        // We use a safe division to map physical pixels to timeline progress (0-1)
        if (distance > 0) {
          position += cardDistance / distance;
        }

        // Clamp position to 1 to avoid GSAP errors
        if (position > 1) position = 1;

        tl.add("label" + (i + 1), position);
      });
    }

    // Run init immediately
    init();

    // Refresh listener
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);

    // CRITICAL FIX: Refresh ScrollTrigger after a delay to account for layout shifts
    // from upstream components (like OurWorkSection images loading)
    const timer1 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const timer2 = setTimeout(() => ScrollTrigger.refresh(), 2000);

    // Also listen for general window load to be safe
    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', handleLoad);

    // Re-run init when ScrollTrigger refreshes (e.g. on resize)
    ScrollTrigger.addEventListener("refreshInit", init);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleLoad);
      ScrollTrigger.removeEventListener("refreshInit", init);
      clearTimeout(timer1);
      clearTimeout(timer2);
      scrollTrigger.kill();
      tl.kill();
    };
  }, [itemsToRender, enableScrollAnimation]);

  const isCompactCards = !enableScrollAnimation;

  /* Home: reference proportions (~1.5× height vs width), not too small */
  const cardColumnClassForMode = isCompactCards
    ? 'mx-2.5 flex w-[262px] flex-shrink-0 sm:mx-3 sm:w-[286px] md:mx-3.5 md:w-[304px] lg:w-[320px]'
    : CARD_COLUMN_CLASS;

  const cardShellClass =
    'bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-300 group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl h-[320px] sm:h-[380px] md:h-[420px] lg:h-[480px] xl:h-[560px]';

  const hoverOverlayRounded = 'rounded-3xl';

  const serviceCardColumns = itemsToRender.map((service, index) => (
    <div
      key={service.id}
      ref={(el) => {
        cardsRef.current[index] = el;
      }}
      className={cardColumnClassForMode}
      style={enableScrollAnimation ? GPU_CARD_WRAPPER_STYLE : undefined}
    >
      {isCompactCards ? (
        <div className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-[#1a2236] bg-white shadow-sm transition-all duration-500 hover:shadow-md aspect-[2/3]">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-orange-600 to-yellow-500 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100" />
          <div className="relative z-10 flex h-full min-h-0 flex-col p-5 sm:p-6 md:p-7">
            <div className="flex items-start justify-between gap-3">
              <span className="text-sm font-semibold tracking-wide text-orange-500 transition-colors duration-300 group-hover:text-white">
                ({service.id})
              </span>
              <svg
                className="h-4 w-4 shrink-0 text-[#1a2236] transition-colors duration-300 group-hover:text-white sm:h-[18px] sm:w-[18px]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.75}
                  d="M4.5 19.5L19.5 4.5M19.5 4.5H10.5M19.5 4.5V13.5"
                />
              </svg>
            </div>
            <h3 className="mt-4 font-serif text-[1.35rem] font-bold leading-[1.15] text-[#1a2236] transition-colors duration-300 group-hover:text-white sm:mt-5 sm:text-[1.5rem] md:text-[1.78rem]">
              {service.title}
            </h3>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-[#22223b] transition-colors duration-300 group-hover:text-white sm:mt-5 sm:text-[1.02rem] md:text-[1.0625rem]">
              {service.description}
            </p>
          </div>
        </div>
      ) : (
        <div className={cardShellClass}>
          <div
            className={`absolute inset-0 bg-gradient-to-b from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out ${hoverOverlayRounded}`}
          />
          <div className="relative z-10 flex h-full flex-col">
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
      )}
    </div>
  ));

  return (
    <section
      className={`bg-[#EFE7D5] pt-4 sm:pt-8 md:pt-14 lg:pt-20 pb-12 sm:pb-16 md:pb-20 lg:pb-24 px-3 sm:px-4 md:px-8 ${
        enableScrollAnimation ? 'overflow-x-hidden' : 'overflow-x-visible'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto ${
          enableScrollAnimation ? 'overflow-x-hidden' : ''
        }`}
      >
        {/* Header Section */}
        {showHeader && (
          <div className="flex flex-col lg:flex-row items-center justify-between mb-3 sm:mb-6 md:mb-8 lg:mb-12 xl:mb-20">
            <div className="lg:w-1/2 mb-3 sm:mb-4 md:mb-6 lg:mb-0 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#1a2236] mb-2 sm:mb-3 md:mb-4 tracking-tight">
                Our Services
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-[#22223b] mb-3 sm:mb-4 md:mb-6 lg:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Everything we build at Apnaaapan has a reason behind it. Products. Websites. Brands. Not to just look good but to work. To connect. To convert. To grow with you. We focus on clarity, consistency, and outcomes so what you put out into the world actually moves your business forward.
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

      {/* Services Cards — horizontal ScrollTrigger on most pages; plain row + arrows on home */}
      {enableScrollAnimation ? (
        <div
          ref={wrapperRef}
          className="wrapper flex w-full max-w-full flex-nowrap items-center"
          style={{
            height: window.innerWidth < 768 ? '80vh' : '90vh',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            contain: 'layout style paint',
          }}
        >
          {serviceCardColumns}
        </div>
      ) : (
        <div className="relative w-full max-w-full px-10 sm:px-12 md:px-14">
          <button
            type="button"
            onClick={() => handleStaticArrowClick(-1)}
            className="pointer-events-auto absolute left-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#1a2236]/15 bg-white/95 text-[#1a2236] shadow-md transition hover:bg-white hover:shadow-lg sm:h-11 sm:w-11"
            aria-label="Previous service"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => handleStaticArrowClick(1)}
            className="pointer-events-auto absolute right-0 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#1a2236]/15 bg-white/95 text-[#1a2236] shadow-md transition hover:bg-white hover:shadow-lg sm:h-11 sm:w-11"
            aria-label="Next service"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div
            ref={wrapperRef}
            className="hide-scrollbar flex w-full max-w-full flex-nowrap items-center overflow-x-auto overflow-y-visible py-6 sm:py-10 scroll-smooth"
          >
            {serviceCardColumns}
          </div>
        </div>
      )}

    </section>
  );
};

export default OurServices;