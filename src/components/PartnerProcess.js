import React, { useEffect, useRef, useState } from 'react';

const PartnerProcess = () => {
  // Copy the animation behavior from OurWinningProcess, but keep Partner content
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const steps = [
    { step: 'Step 1', title: 'Connect', description: 'We start with alignment. Your goals, your clients, and how you like to work.', image: '/images/partner_us/connect.png' },
    { step: 'Step 2', title: 'Collaborate', description: 'We integrate with your team and processes, staying flexible and responsive as things move.', image: '/images/partner_us/collaborate.png' },
    { step: 'Step 3', title: 'Deliver', description: 'Our team executes quietly and consistently, maintaining quality at every stage.', image: '/images/partner_us/deliver.png' },
    { step: 'Step 4', title: 'Grow Together', description: 'As your needs evolve, we adapt with you, refining systems and scaling support.', image: '/images/partner_us/grow together.png' },
  ];

  useEffect(() => {
    const onResize = () => setIsSmallScreen(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = rect.height;
      const sectionTop = rect.top;
      const sectionBottom = rect.bottom;
      const startOffsetPx = windowHeight / 2;
      if (sectionTop <= windowHeight && sectionBottom >= 0) {
        const shiftedNumerator = (windowHeight - sectionTop) - startOffsetPx;
        const totalRange = Math.max(1, (windowHeight + sectionHeight - startOffsetPx));
        const progress = Math.max(0, Math.min(1, shiftedNumerator / totalRange));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSmallScreen]);

  const getCardTransform = (index) => {
    const stepSpan = 0.25;
    const stepProgress = Math.max(0, Math.min(1, (scrollProgress - index * stepSpan) / stepSpan));
    if (index === 0) return 'translateY(0)';
    const startY = isSmallScreen ? 120 : 100;
    // Nudge later cards lower so more of the previous card remains visible
    const endYBase = isSmallScreen ? 28 : 12;
    const perIndexIncrement = isSmallScreen ? 12 : 8; // increased spacing for later cards
    const endY = endYBase + index * perIndexIncrement;
    const currentY = startY - (startY - endY) * stepProgress;
    return `translateY(${currentY}%)`;
  };

  const getCardOpacity = (index) => {
    const stepSpan = 0.25;
    const stepProgress = Math.max(0, Math.min(1, (scrollProgress - index * stepSpan) / stepSpan));
    const baseOpacity = 0;
    return stepProgress > 0 ? Math.min(1, baseOpacity + stepProgress * (1 - baseOpacity)) : baseOpacity;
  };

  const getCardZIndex = (index) => index + 1;

  return (
    <>
      <section ref={sectionRef} className="bg-[#EFE7D5] py-16 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-10 md:mb-12">
            <div className="text-[#E2552A] text-sm md:text-base font-semibold tracking-wide mb-2">Our Process</div>
            <h2 className="font-serif text-[#0D1B2A] font-bold text-[32px] md:text-[44px] lg:text-[52px] leading-tight">How It Works</h2>
          </div>

          <div className={`relative ${isSmallScreen ? 'h-[180vh]' : 'h-[80vh]'}`}>
            <div className={`sticky ${isSmallScreen ? 'top-20' : 'top-32'} space-y-6 flex flex-col items-center`}>
              {steps.map((item, idx) => (
                <div
                  key={idx}
                  className={`max-w-6xl w-full bg-white rounded-2xl shadow-lg overflow-hidden border border-[#E6E1D6] transition-all duration-300 ease-out`}
                  style={{
                    opacity: getCardOpacity(idx),
                    zIndex: getCardZIndex(idx),
                    position: 'absolute',
                    top: `${idx * (isSmallScreen ? 28 : 20)}%`,
                    left: '50%',
                    transform: `translateX(-50%) ${getCardTransform(idx)}`,
                  }}
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 p-6 md:p-8 bg-white">
                      <div className="flex flex-col h-full justify-start pt-1 sm:pt-2">
                        <span className="inline-block bg-[#F2F2F2] text-[#6B7280] px-3 py-1 rounded-full text-xs md:text-sm font-medium w-fit mb-3">
                          {item.step}
                        </span>
                        <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#0D1B2A] mb-3">{item.title}</h3>
                        <p className="text-[#1f2937] text-sm md:text-base leading-7 md:leading-8">{item.description}</p>
                      </div>
                    </div>
                    <div className="lg:w-1/2 p-6 md:p-8 flex items-center justify-center bg-white">
                      <img src={item.image} alt={`${item.title} step`} className="w-full h-auto max-h-56 md:max-h-72 object-contain" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="bg-[#EFE7D5] h-[100vh] md:h-[68vh]"></div>
    </>
  );
};

export default PartnerProcess;
