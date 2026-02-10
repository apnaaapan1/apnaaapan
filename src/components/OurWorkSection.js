import React, { useEffect, useState } from 'react';

const companyLogos = [
  { src: "/images/clients_logos/1.png", alt: 'Logo 1' },
  { src: "/images/clients_logos/2.png", alt: 'Logo 2' },
  { src: "/images/clients_logos/3.png", alt: 'Logo 3' },
  { src: "/images/clients_logos/4.png", alt: 'Logo 4' },
  { src: "/images/clients_logos/5.png", alt: 'Logo 5' },
  { src: "/images/clients_logos/6.png", alt: 'Logo 6' },
  { src: "/images/clients_logos/7.png", alt: 'Logo 7' },
  { src: "/images/clients_logos/8.png", alt: 'Logo 8' },
  { src: "/images/clients_logos/9.png", alt: 'Logo 9' },
  { src: "/images/clients_logos/10.png", alt: 'Logo 10' },
  { src: "/images/clients_logos/11.png", alt: 'Logo 11' },
  { src: "/images/clients_logos/12.png", alt: 'Logo 12' },
  { src: "/images/clients_logos/13.png", alt: 'Logo 13' },
  { src: '/images/himee ride.png', alt: 'Himee Ride' },
  { src: '/images/safal.png', alt: 'Safal' },
  { src: '/images/kap.png', alt: 'KAP' },
  { src: "/images/clients_logos/Logo.png", alt: 'Logo' },
  { src: "/images/clients_logos/LogoB.png", alt: 'Logo B' },
];

const BG_COLORS = ['bg-blue-500', 'bg-orange-500', 'bg-yellow-400', 'bg-purple-500', 'bg-green-500', 'bg-pink-500'];

const OurWorkSection = () => {
  const [projectCards, setProjectCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Build API URL
  const getApiUrl = (endpoint) => {
    if (process.env.NODE_ENV === 'production') {
      return endpoint;
    }
    return `http://localhost:5000${endpoint}`;
  };

  useEffect(() => {
    let mounted = true;
    const fetchWork = async () => {
      try {
        setLoading(true);
        const res = await fetch(getApiUrl('/api/work'));
        if (!res.ok) {
          throw new Error('Failed to load work posts');
        }
        const data = await res.json();
        if (mounted) {
          const workPosts = Array.isArray(data.work) ? data.work : [];
          // Get top 6 posts and transform them to match our card structure
          const topSixPosts = workPosts.slice(0, 6).map((project, index) => ({
            title: project.title,
            tags: project.tags || [],
            hasButton: true,
            hasDescription: false,
            hoverImage: project.image,
            clientLogo: '/images/safal.png', // Default logo, you can customize this
            topBgColor: BG_COLORS[index % BG_COLORS.length] // Cycle through colors
          }));
          setProjectCards(topSixPosts);
        }
      } catch (e) {
        console.error('Error fetching work posts:', e);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchWork();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="bg-[#EFE7D5] py-12 sm:py-16 px-3 sm:px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Trusted Companies Section */}
        <div className="bg-white rounded-lg sm:rounded-xl px-4 sm:px-6 py-3 sm:py-4 flex flex-col md:flex-row items-center md:items-center justify-between mb-12 sm:mb-16 border border-[#e5e2d8]">
          <div className="w-full md:w-1/3 text-center md:text-left text-gray-700 text-base sm:text-lg font-nexa-regular mb-4 md:mb-0">
            Trusted by fast-growing<br />companies around the world
          </div>
          <div className="w-full md:w-2/3 overflow-hidden">
            <div className="flex items-center animate-scroll w-max flex-nowrap gap-12 sm:gap-16">
              {/* First set of logos */}
              {companyLogos.map((logo, idx) => (
                <div key={`first-${idx}`} className="w-[161px] h-[54px] flex items-center justify-center">
                  <img
                    src={logo.src.replace("client's logos", "clients_logos")}
                    alt={logo.alt}
                    className="w-full h-full object-contain"
                    style={{ filter: logo.alt === 'Himee Ride' ? 'none' : 'none' }}
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {companyLogos.map((logo, idx) => (
                <div key={`second-${idx}`} className="w-[161px] h-[54px] flex items-center justify-center">
                  <img
                    src={logo.src.replace("client's logos", "clients_logos")}
                    alt={logo.alt}
                    className="w-full h-full object-contain"
                    style={{ filter: logo.alt === 'Himee Ride' ? 'none' : 'none' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Section Title */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-gray-800">
            Our Clients and Work
          </h2>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">Loading our amazing work...</p>
          </div>
        )}

        {/* Project Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">{projectCards.map((card, index) => (
            <div key={index} className="group relative bg-[#faf8f3] rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 border border-gray-200 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl min-h-[350px] sm:min-h-[400px]">
              {/* Full Card Background Color - Appears on hover */}
              <div className={`absolute inset-0 ${card.topBgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out rounded-xl`}></div>

              {/* Hover Image - Slides up from bottom and covers 75% with rounded top */}
              <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-cover bg-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-t-xl overflow-hidden">
                <img
                  src={card.hoverImage}
                  alt={`${card.title} project`}
                  className="w-full h-full object-cover rounded-t-xl"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>

              {/* Client Logo - Appears on hover */}
              <div className="absolute top-4 sm:top-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 z-20">
                <div className="bg-white rounded-full p-2 sm:p-3 shadow-lg">
                  <img
                    src={card.clientLogo}
                    alt={`${card.title} logo`}
                    className="h-8 sm:h-10 w-auto object-contain"
                  />
                </div>
              </div>

              {/* Arrow Button - Appears on hover */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200 z-20">
                <button className="w-10 h-10 sm:w-12 sm:h-12 bg-[#faf8f3] rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700 transform rotate-45"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </button>
              </div>

              {/* Original Card Content - Hidden on hover */}
              <div className="relative z-10 group-hover:opacity-0 transition-opacity duration-300">
                {/* Card Title */}
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
                  {card.title}
                </h3>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                  {card.tags && card.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-orange-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Description or Button */}
                {card.hasDescription ? (
                  <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s,
                    when an unknown printer took a galley of t...
                  </p>
                ) : card.hasButton ? (
                  <button className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-full flex items-center justify-center hover:bg-orange-600 transition-colors duration-200">
                    <svg
                      className="w-4 h-4 sm:w-5 sm:h-5 text-white transform rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17l9.2-9.2M17 17V7H7"
                      />
                    </svg>
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default OurWorkSection; 