import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const photos = [
  '/images/Our_Story1.jpeg',
  '/images/Our_story2.jpeg',
  '/images/Our_story3.jpeg'
];

const OurStory = () => {
  const wrapperRef = useRef(null);
  const cardsRef = useRef([]);

  // GSAP Horizontal Scroll Animation for Milestones
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
    const scrollSpeed = 1.2;
    let tl = gsap.timeline();

    // Create horizontal scroll animation with maximum performance
    // Ensure we scroll enough to show the last card completely
    const isMobile = window.innerWidth < 768;
    const extraSpace = isMobile ? 0.6 : 0.15; // Increased for complete 5th card visibility
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
      end: () => "+=" + (scrollDistance / scrollSpeed) * 2, // Extended duration to show all cards
      invalidateOnRefresh: true,
      anticipatePin: 1,
      refreshPriority: -1, // Better performance
      fastScrollEnd: true, // Optimize for fast scrolling
      onUpdate: () => {
        // Update current index based on progress
        // Can be used here if needed for indicators or other UI elements
        // For now, we're keeping the calculation but not storing it
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
      const extraSpace = isMobile ? 0.6 : 0.15; // Increased for complete 5th card visibility
      const scrollDistance = maxWidth - window.innerWidth + (window.innerWidth * extraSpace);
      let position = 0;
      const distance = scrollDistance;
      
      // Add labels for each card with better spacing
      tl.add("label0", 0);
      cards.forEach((card, i) => {
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
  }, []);


  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 pt-20 md:pt-28 pb-8 md:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start">
          <div className="md:col-span-7">
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-[#0D1B2A] tracking-tight font-serif">
              Our Story
            </h1>
            <p className="mt-8 text-sm md:text-base leading-6 text-[#2C2C2C] max-w-xl">
              Apnaaapan didn't start in a boardroom. It started in lockdown. In 2020, during the third year of engineering, time felt slow. Classes were online. Days felt repetitive. And from a small town in Pali, Rajasthan, curiosity had nowhere to go. So it went inward. Into creativity. Into learning things that weren't part of the syllabus. What began as small freelance work, websites, apps, social media slowly became something more. Not a plan. Just momentum. After graduation came a full-time job at an MNC. Stable. Secure. Predictable. And then, a choice. In January 2023, that job was left behind. Jaipur became home. Along with three friends, Apnaaapan turned from a solo effort into a shared dream.
            </p>
          </div>

          <div className="md:col-span-5 flex justify-center md:justify-end">
            <img
              src="/images/Group 100.png"
              alt="Apnaaapan monogram"
              className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-contain select-none"
            />
          </div>
        </div>

        <div className="mt-32 md:mt-40 lg:mt-48 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((src, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden bg-[#E8DFD0] h-64 sm:h-72 md:h-80 flex items-center justify-center"
            >
              <img
                src={src}
                alt={`Our story ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Our People Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column - Title and Description */}
          <div className="lg:col-span-5 lg:pr-8 flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0D1B2A] mb-6 md:mb-8 leading-tight" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
              Our People
            </h2>
            <div className="space-y-4">
              <p className="text-lg md:text-xl leading-7 text-[#2C2C2C]" style={{ fontFamily: 'NexaRegular' }}>
                We're not built like a typical agency.
                <br />
                And we never wanted to be.
                <br />
                We're a collective of creatives, strategists, editors, designers, and marketers who care deeply about the work we do and the people we do it with.
                <br />
                Our culture grows from the work itself.
                <br />
                It evolves as we do.
                <br />
                And it's shaped by listening, collaboration, and mutual respect.
                <br />
                Here, everyone is heard.
                <br />
                And everyone belongs.
              </p>
            </div>
          </div>

          {/* Right Column - Team Image */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-80 sm:w-96 md:w-[28rem] lg:w-[32rem] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/apnaaapan_team.jpeg"
                  alt="Apnaaapan Team"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row - Founder and Additional Description */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mt-12 md:mt-16 lg:mt-16">
          {/* Left Column - Founder Profile */}
          <div className="lg:col-span-5 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="w-72 h-88 sm:w-80 sm:h-96 md:w-96 md:h-[28rem] lg:w-[28rem] lg:h-[32rem] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src="/images/gaurav.png"
                  alt="Gourav Sharma"
                  className="w-full h-full object-cover"
                />
                {/* Badges positioned at bottom-left of image */}
                <div className="absolute -bottom-3 left-4 sm:left-6 flex flex-row gap-2 sm:gap-3">
                  <span className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#DF5316] to-[#F4BF11] text-white text-xs sm:text-sm font-medium rounded-full shadow-md" style={{ fontFamily: 'NexaBold' }}>
                    <span className="mr-2 text-white">⭐</span>
                    Founder
                  </span>
                  <span className="inline-flex items-center px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#DF5316] to-[#F4BF11] text-white text-xs sm:text-sm font-medium rounded-full shadow-md" style={{ fontFamily: 'NexaBold' }}>
                    <span className="mr-2 text-white">⭐</span>
                    Gourav Sharma
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Description */}
          <div className="lg:col-span-7 lg:pl-8 flex flex-col justify-center">
            <p className="text-lg md:text-xl leading-7 text-[#2C2C2C]" style={{ fontFamily: 'NexaRegular' }}>
              Four people. One intent. Build something honest. Over the next two years, the work grew. Local brands. National clients. International projects. But the feeling stayed the same, personal, close, human. By the end of 2024, Apnaaapan had roots in three cities: Ahmedabad. Jaipur. Pali. In 2025, the journey circled back home. Eight months in Pali, building quietly with the team with 20+ people. Then Jaipur again, this time from the Startup India office. And now, in 2026, Apnaaapan is entering its second chapter. With new energy. New backing. But the same core. Because Apnaaapan was never about becoming corporate. It was always about people. The name itself means our own. Our own market. Our own space. Our own way of doing things. That feeling: of trust, belonging, and care, has stayed constant from day one. In the team. In the culture. And in the experience we create for every brand we work with. Six years later, that's still what we're building. in a way that feels honest and human. Over the years, our services expanded. From small creative projects to full-scale digital marketing and branding. But the intention stayed the same: build things that actually work.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Grid Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 pt-12 md:pt-16 pb-16 md:pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            { name: "Yashaswi Mertiya", role: "Social Media Manager" },
            { name: "Team Member", role: "Marketing Lead" },
            { name: "Team Member", role: "Creative Director" },
            { name: "Team Member", role: "Design Lead" },
            { name: "Team Member", role: "Content Strategist" },
            { name: "Team Member", role: "Project Manager" }
          ].map((member, index) => {
            // Determine overlay color based on column (index % 3)
            const getOverlayColor = (index) => {
              if (index % 3 === 0) return 'from-orange-600/80 via-orange-500/40 to-transparent'; // First column - Orange
              if (index % 3 === 1) return 'from-yellow-500/80 via-yellow-400/40 to-transparent'; // Second column - Yellow
              return 'from-blue-600/80 via-blue-500/40 to-transparent'; // Third column - Blue
            };

            return (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden h-72 md:h-80 lg:h-96 transition-all duration-300 hover:scale-105 cursor-pointer group"
                style={{
                  background: 'linear-gradient(135deg, #FF6B35 0%, #F7931E 25%, #FFD700 50%, #87CEEB 75%, #4682B4 100%)',
                  padding: '6px'
                }}
              >
                <div 
                  className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-white transition-all duration-300 pointer-events-none"
                  style={{ zIndex: 10 }}
                ></div>
                <div className="w-full h-full rounded-xl overflow-hidden relative">
                  <img
                    src="/images/file 1.png"
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                  />
                  
                  {/* Hover Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${getOverlayColor(index)} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                      <p className="text-sm opacity-90">{member.role}</p>
                    </div>
                    
                    {/* Arrow button */}
                    <div className="absolute bottom-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center group-hover:bg-white transition-all duration-300">
                      <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17l9.2-9.2M17 17V7H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Values Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-16 md:py-20">
        {/* Our Values Cards */}
        <div className="mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0D1B2A] mb-16 text-center" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Collaborate Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[500px] group cursor-pointer transition-all duration-500 relative">
              {/* White top section with icon */}
              <div className="p-8 flex flex-col items-center justify-center h-1/2 group-hover:h-3/4 transition-all duration-500 bg-white relative z-10">
                <img 
                  src="/images/image 16.png" 
                  alt="Collaborate icon" 
                  className="w-40 h-40 object-contain"
                />
                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-b-3xl"></div>
              </div>
              {/* Orange bottom section */}
              <div className="bg-[#FF6B35] text-white px-8 py-8 text-center font-bold text-5xl h-1/2 group-hover:h-1/4 flex items-center justify-center rounded-t-3xl transition-all duration-500 relative z-5" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
                Trust
              </div>
            </div>

            {/* Innovate Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[500px] group cursor-pointer transition-all duration-500 relative">
              {/* White top section with icon */}
              <div className="p-8 flex flex-col items-center justify-center h-1/2 group-hover:h-3/4 transition-all duration-500 bg-white relative z-10">
                <img 
                  src="/images/image 17.png" 
                  alt="Innovate icon" 
                  className="w-40 h-40 object-contain"
                />
                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-b-3xl"></div>
              </div>
              {/* Yellow bottom section */}
              <div className="bg-[#FFD700] text-white px-8 py-8 text-center font-bold text-5xl h-1/2 group-hover:h-1/4 flex items-center justify-center rounded-t-3xl transition-all duration-500 relative z-5" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
                Belonging
              </div>
            </div>

            {/* Elevate Card */}
            <div className="bg-white rounded-3xl overflow-hidden shadow-xl h-[500px] group cursor-pointer transition-all duration-500 relative">
              {/* White top section with icon */}
              <div className="p-8 flex flex-col items-center justify-center h-1/2 group-hover:h-3/4 transition-all duration-500 bg-white relative z-10">
                <img 
                  src="/images/image 18.png" 
                  alt="Elevate icon" 
                  className="w-40 h-40 object-contain"
                />
                {/* Curved bottom edge */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-white rounded-b-3xl"></div>
              </div>
              {/* Blue bottom section */}
              <div className="bg-[#4682B4] text-white px-8 py-8 text-center font-bold text-5xl h-1/2 group-hover:h-1/4 flex items-center justify-center rounded-t-3xl transition-all duration-500 relative z-5" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
                Curiosity
              </div>
            </div>
          </div>
        </div>

        {/* What sets us apart Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Color bars */}
            <div className="lg:w-8 flex lg:flex-col h-3 sm:h-4 lg:h-auto">
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#FF6B35]"></div>
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#FFD700]"></div>
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#4682B4]"></div>
            </div>
            
            {/* Right side - Content */}
            <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[#0D1B2A] mb-3 sm:mb-0 leading-tight" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
                  What sets us apart from others?
                </h3>
                <div className="flex space-x-1 sm:ml-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-6 sm:leading-7 md:leading-8 text-[#2C2C2C] max-w-5xl" style={{ fontFamily: 'NexaRegular' }}>
                We care. Truly. Every team here, design, content, marketing, works with one shared intent: helping you win in a way that feels right for your brand. No templates. No shortcuts. No one-size-fits-all solutions. We listen first. We understand next. Then we build what actually works. Because impact matters more than output. Through it all, Apnaaapan stays what it set out to be: our own.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="bg-[#EFE7D5] pt-8 sm:pt-14 md:pt-20 pb-0 px-2 sm:px-4 md:px-8 overflow-x-hidden">
        <div className="max-w-7xl mx-auto overflow-x-hidden">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#0D1B2A] mb-4 tracking-tight">
              Milestones
            </h2>
            <p className="text-base md:text-lg text-[#2C2C2C] leading-relaxed max-w-2xl mx-auto">
            How It Unfolded, Year by Year
            </p>
          </div>
        </div>
        
        {/* Milestones Cards with GSAP ScrollTrigger horizontal scroll */}
        <div 
          ref={wrapperRef}
          className="wrapper flex flex-nowrap items-center"
          style={{ 
            height: window.innerWidth < 768 ? '80vh' : '90vh',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px',
            transform: 'translateZ(0)', // Force hardware acceleration
            WebkitTransform: 'translateZ(0)',
            WebkitBackfaceVisibility: 'hidden',
            contain: 'layout style paint' // Optimize rendering performance
          }}
        >
          {[
            {
              id: "2020",
              title: "Where Curiosity Had Time",
              description: "Lockdown slowed everything down.\nA small town. Long days. A mind that wouldn't sit still.\nApnaaapan began as freelance work, learning by doing, one small project at a time."
            },
            {
              id: "2021",
              title: "Finding Our Flow",
              description: "Work started coming in.\nSo did confidence.\nWebsites, apps, social media, curiosity slowly turning into real skill."
            },
            {
              id: "2022",
              title: "When Comfort Wasn't Enough",
              description: "By the final year, it was clear this wasn't just a side thing anymore.\nThe thought of building something of our own stopped feeling distant.\nIt felt possible."
            },
            {
              id: "2023",
              title: "The Jump",
              description: "A stable job was left behind.\nJaipur became home.\nWith a small team and a lot of belief, Apnaaapan officially became a company."
            },
            {
              id: "2024",
              title: "Growing, But Staying Close",
              description: "Clients grew, local to national to international.\nThree cities. Many projects.\nBut the work stayed personal.\nAnd the culture stayed human."
            },
            {
              id: "2025",
              title: "Back to the Heart of It",
              description: "Eight quiet months in Pali.\nA team of 20+ people, building without noise.\nThen Jaipur again, this time from the Startup India office, stronger, clearer, steadier."
            },
            {
              id: "2026",
              title: "What Comes Next",
              description: "New backing. New systems.\nThe same intent.\nApnaaapan begins its next chapter, rooted in trust, people, and work that's built to last."
            }
          ].map((milestone, index) => (
            <div 
              key={milestone.id} 
              ref={el => cardsRef.current[index] = el}
              className="flex-shrink-0 w-[240px] sm:w-[320px] md:w-[380px] lg:w-[450px] mx-1 sm:mx-4"
              style={{
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
                WebkitTransform: 'translateZ(0)',
                WebkitBackfaceVisibility: 'hidden',
                contain: 'layout style paint' // Optimize rendering performance
              }}
            >
              <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg border border-gray-300 group relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl h-[420px] sm:h-[480px] md:h-[560px]">
                {/* Hover Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-600 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-3xl"></div>
                
                {/* Content Container */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex-1">
                    <span className="text-orange-500 font-bold text-lg mb-6 block tracking-wider group-hover:text-white transition-colors duration-300">
                      ({milestone.id})
                    </span>
                    <h3 className="text-xl md:text-3xl font-serif font-bold text-[#1a2236] mb-4 md:mb-6 group-hover:text-white transition-colors duration-300 leading-tight">
                      {milestone.title}
                    </h3>
                    <p className="text-[#22223b] leading-relaxed text-sm md:text-base group-hover:text-white transition-colors duration-300" style={{ whiteSpace: 'pre-line' }}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
    </main>
  );
};

export default OurStory;





