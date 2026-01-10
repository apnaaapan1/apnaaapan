import React, { useEffect, useRef, useState } from 'react';

const OurWinningProcess = ({ compact = false, showSpacer = true, spacerScreens = 1 }) => {
  const sectionRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const processSteps = [
    {
      step: "Step 1",
      title: "Listen First",
      description: "We begin by paying attention. To your brand, your people, and the space you're in. When the foundation is clear, growth doesn't feel forced. It unfolds naturally.",
      bgColor: "bg-orange-500",
      tagColor: "bg-orange-500",
      image: "/images/step1.png",
      cardSize: "max-w-4xl"
    },
    {
      step: "Step 2",
      title: "Shape the Direction",
      description: "With the right insights in place, we build a plan that fits you. Your goals. Your audience. Your pace. Nothing copied. Nothing rushed. Just clarity that makes sense.",
      bgColor: "bg-yellow-400",
      tagColor: "bg-yellow-500",
      image: "/images/step2.png",
      cardSize: "max-w-5xl"
    },
    {
      step: "Step 3",
      title: "Build & Launch",
      description: "This is where momentum begins. Across content, social, and campaigns, we show up consistently, so your brand doesn't just exist, it's noticed.",
      bgColor: "bg-blue-400",
      tagColor: "bg-blue-500",
      image: "/images/step3.png",
      cardSize: "max-w-6xl"
    },
    {
      step: "Step 4",
      title: "Refine & Grow",
      description: "We don't set things live and walk away. We observe, adjust, and improve, so each step forward brings stronger results and steady progress.",
      bgColor: "bg-orange-500",
      tagColor: "bg-orange-400",
      image: "/images/step4.png",
      cardSize: "max-w-7xl"
    }
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

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isSmallScreen]);

  const getCardTransform = (index) => {
    const stepSpan = isSmallScreen ? 0.25 : 0.25;
    const stepProgress = Math.max(0, Math.min(1, (scrollProgress - index * stepSpan) / stepSpan));
    if (index === 0) return 'translateY(0)';
    const startY = isSmallScreen ? 120 : 100; // Increased startY for mobile to prevent overlap
    const endY = isSmallScreen ? 25 : 10; // Slightly increased endY for mobile
    const currentY = startY - (startY - endY) * stepProgress;
    return `translateY(${currentY}%)`;
  };

  const getCardOpacity = (index) => {
    const stepSpan = isSmallScreen ? 0.25 : 0.25;
    const stepProgress = Math.max(0, Math.min(1, (scrollProgress - index * stepSpan) / stepSpan));
    const baseOpacity = 0; // Set to 0 for both mobile and desktop to prevent initial visibility
    return stepProgress > 0 ? Math.min(1, baseOpacity + stepProgress * (1 - baseOpacity)) : baseOpacity;
  };

  const getCardZIndex = (index) => index + 1;

  return (
    <>
      <section ref={sectionRef} className={`bg-[#EFE7D5] ${compact ? 'py-6 px-6' : 'py-6 sm:py-8 px-3 sm:px-4 md:px-8'} relative`}>
        <div className="max-w-7xl mx-auto relative">
          <div className={`text-center ${compact ? 'mb-4' : 'mb-4 sm:mb-6 md:mb-8'} ${isSmallScreen ? '' : 'sticky'} ${compact ? 'top-4' : 'top-6 sm:top-8'} z-50 bg-[#EFE7D5] ${compact ? 'py-2' : 'py-3 sm:py-4'}`}>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800">Our Way of Working</h2>
          </div>
          <div className={`relative ${compact ? 'h-[80vh]' : (isSmallScreen ? 'h-[180vh]' : 'h-[80vh]')}`}>
            <div className={`sticky ${compact ? 'top-24' : (isSmallScreen ? 'top-20' : 'top-32')} space-y-4 sm:space-y-6 flex flex-col items-center`}>
              {processSteps.map((step, index) => (
                <div
                  key={index}
                  className={`${step.cardSize} w-full bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-out`}
                  style={{
                    opacity: getCardOpacity(index),
                    zIndex: getCardZIndex(index),
                    position: 'absolute',
                    top: `${index * (isSmallScreen ? 28 : 20)}%`,
                    left: '50%',
                    transform: `translateX(-50%) ${getCardTransform(index)}`,
                  }}
                >
                  <div className="flex flex-col lg:flex-row">
                    <div className="lg:w-1/2 p-4 sm:p-5 md:p-8 bg-white">
                      <div className="flex flex-col h-full justify-center">
                        <span className={`inline-block ${step.tagColor} text-white px-2 sm:px-3 md:px-4 py-1 rounded-full text-xs sm:text-sm md:text-base font-medium w-fit mb-2 sm:mb-3 md:mb-4`}>{step.step}</span>
                        <h3 className="text-base sm:text-lg md:text-2xl lg:text-3xl font-serif font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 leading-tight">{step.title}</h3>
                        <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                    <div className={`lg:w-1/2 p-4 sm:p-5 md:p-8 ${step.bgColor} flex items-center justify-center min-h-[180px] sm:min-h-[220px] md:min-h-[300px]`}>
                      <img src={step.image} alt={`${step.title} illustration`} className="w-full h-auto object-contain" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {showSpacer && (
        <div className="bg-[#EFE7D5]" style={{ height: isSmallScreen ? `${Math.max(1, spacerScreens) * 60}vh` : `${Math.max(1, spacerScreens) * 68}vh` }}></div>
      )}
    </>
  );
};

export default OurWinningProcess;