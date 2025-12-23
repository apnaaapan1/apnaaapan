import React, { useEffect, useRef, useState } from 'react';

// Use localhost:5000 in development (Express server), relative path in production (Vercel)
const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  // In development, use Express server on port 5000
  return `http://localhost:5000${endpoint}`;
};

// Mobile-only scroll reveal wrapper for text blocks
const RevealOnScroll = ({ children }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    // Only animate on mobile viewports
    const isMobile = window.matchMedia && window.matchMedia('(max-width: 640px)').matches;
    if (!isMobile) {
      setIsVisible(true);
      return;
    }

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {children}
    </div>
  );
};

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchBlogs() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(getApiUrl('/api/blogs'));
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await res.json();
        if (isMounted) {
          setBlogs(Array.isArray(data.blogs) ? data.blogs : []);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Unable to load blogs right now.');
          setLoading(false);
        }
      }
    }
    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  const featured = blogs[0] || null;
  const sideBlogs = blogs.slice(1, 3);

  // Pagination for the grid after top 3 posts
  const BLOGS_PER_PAGE = 6;
  const remainingBlogs = blogs.slice(3);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(remainingBlogs.length / BLOGS_PER_PAGE));

  // Reset page if data changes and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePageChange = (page) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
  };

  const goToPreviousPage = () => {
    handlePageChange(currentPage - 1);
  };

  const goToNextPage = () => {
    handlePageChange(currentPage + 1);
  };

  const startIdx = (currentPage - 1) * BLOGS_PER_PAGE;
  const endIdx = startIdx + BLOGS_PER_PAGE;
  const paginatedBlogs = remainingBlogs.slice(startIdx, endIdx);

  return (
    <main className="bg-[#EFE7D5] min-h-screen relative">
      {/* Subtle Grid Pattern Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal line near top */}
        <div className="absolute top-32 left-0 right-0 h-px bg-gray-200/40"></div>
        {/* Vertical lines on left and right */}
        <div className="absolute top-0 bottom-0 left-8 w-px bg-gray-200/40"></div>
        <div className="absolute top-0 bottom-0 right-8 w-px bg-gray-200/40"></div>
        {/* Diamond nodes at intersections */}
        <div className="absolute top-32 left-8 w-2 h-2 bg-gray-300/50 transform rotate-45"></div>
        <div className="absolute top-32 right-8 w-2 h-2 bg-gray-300/50 transform rotate-45"></div>
        {/* Additional subtle grid elements */}
        <div className="absolute top-64 left-16 w-1 h-1 bg-gray-200/30 rounded-full"></div>
        <div className="absolute top-64 right-16 w-1 h-1 bg-gray-200/30 rounded-full"></div>
      </div>

      {/* Main Content Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-20 md:py-32 relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <RevealOnScroll>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-[#0D1B2A] transition-all duration-300 hover:text-[#1a365d]" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>Inside the</span>
              <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent ml-4 hover:from-orange-600 hover:to-yellow-500 transition-all duration-300" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>Studio</span>
            </h1>
          </RevealOnScroll>
          
          {/* Subheading */}
          <RevealOnScroll>
            <p className="text-lg md:text-xl lg:text-2xl text-[#2C2C2C] max-w-3xl mx-auto leading-relaxed" style={{ fontFamily: 'NexaRegular' }}>
              Stories, Insights & Ideas from the World of Apnaaapan
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Top Blog Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-16 md:py-20 relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0D1B2A] tracking-tight">
              Top Blog
            </h2>
          </RevealOnScroll>
        </div>

        {/* Main Blog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-12">
          {/* Featured Blog Post - Left Section */}
          <div className="lg:col-span-3">
            {featured ? (
              <a href={`/blog/${featured.slug}`} className="block">
                <div className="mb-6">
                  {/* Image Box */}
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6 group cursor-pointer transition-all duration-300 hover:shadow-2xl">
                    <div className="relative overflow-hidden">
                      <img
                        src={featured.heroImage || '/images/work/Tsczi1maYoHHENT2Fu6ychsMM 1.png'}
                        alt={featured.title}
                        className="w-full h-56 sm:h-72 md:h-[28rem] object-cover transition-all duration-500 group-hover:scale-110"
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {/* Text Content */}
                  <RevealOnScroll>
                    <div className="text-left">
                      <div className="text-gray-500 text-sm font-medium mb-3">
                        {featured.readTime || '10 Min'}
                      </div>
                      <h3 className="text-2xl font-bold text-[#0D1B2A] mb-3">
                        {featured.title}
                      </h3>
                      <p className="text-gray-600 text-base leading-relaxed">
                        {Array.isArray(featured.content) && featured.content.length > 0
                          ? `${featured.content[0].slice(0, 180)}${featured.content[0].length > 180 ? '...' : ''}`
                          : 'Discover stories, insights, and ideas from the world of Apnaaapan.'}
                      </p>
                    </div>
                  </RevealOnScroll>
                </div>
              </a>
            ) : (
              <div className="mb-6">
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6 h-56 sm:h-72 md:h-[28rem] animate-pulse" />
              </div>
            )}
          </div>

          {/* Right Side - Two Smaller Blog Posts */}
          <div className="lg:col-span-2 space-y-4">
            {sideBlogs.map((blog) => (
              <a
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="flex flex-col sm:flex-row h-auto sm:h-48 md:h-56 mb-4 group cursor-pointer"
              >
                {/* Image Box Only */}
                <div className="rounded-2xl overflow-hidden shadow-lg sm:mr-4 mb-3 sm:mb-0 flex-shrink-0 transition-all duration-300 hover:shadow-xl">
                  <div className="relative overflow-hidden">
                    <img
                      src={blog.heroImage || '/images/istockphoto-104251890-612x612 1.png'}
                      alt={blog.title}
                      className="w-full sm:w-40 h-40 sm:h-40 object-cover transition-all duration-500 group-hover:scale-110"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                {/* Text Content Outside Box */}
                <RevealOnScroll>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-gray-500 text-sm font-medium mb-2">
                      {blog.readTime || '10 Min'}
                    </div>
                    <h3 className="text-lg font-bold text-[#0D1B2A] mb-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {Array.isArray(blog.content) && blog.content.length > 0
                        ? `${blog.content[0].slice(0, 140)}${blog.content[0].length > 140 ? '...' : ''}`
                        : 'Discover how brands grow through thoughtful content and strategy.'}
                    </p>
                  </div>
                </RevealOnScroll>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Section */}
      <section className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10 py-16 md:py-20 relative z-10">
        {/* Section Header */}
        <div className="mb-12">
          <RevealOnScroll>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#0D1B2A] tracking-tight">
              Latest Blog
            </h2>
          </RevealOnScroll>
        </div>

        {/* Blog Posts Grid - paginated */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-8 mb-16">
          {loading ? (
            <>
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div key={idx} className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
                    <div className="w-full h-48 sm:h-60 md:h-72 lg:h-80 bg-gray-100 rounded-t-2xl border border-gray-100 animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-300 text-sm font-medium mb-2">10 Min</div>
                    <div className="h-5 bg-gray-200 rounded mb-2 w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))}
            </>
          ) : paginatedBlogs.length === 0 ? (
            <div className="col-span-full text-center text-gray-600">No more blogs to display.</div>
          ) : (
            paginatedBlogs.map((blog) => (
              <a key={blog.id} href={`/blog/${blog.slug}`} className="block">
                <div>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-lg mb-4">
                    <div className="w-full h-48 sm:h-60 md:h-72 lg:h-80 bg-white rounded-t-2xl border border-gray-100">
                      {blog.heroImage && (
                        <img
                          src={blog.heroImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                  <RevealOnScroll>
                    <div className="text-left">
                      <div className="text-gray-500 text-sm font-medium mb-2">
                        {blog.readTime || '10 Min'}
                      </div>
                      <h3 className="text-lg font-bold text-[#0D1B2A] mb-2">
                        {blog.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {Array.isArray(blog.content) && blog.content.length > 0
                          ? `${blog.content[0].slice(0, 120)}${blog.content[0].length > 120 ? '...' : ''}`
                          : 'Discover how social media can shape your brand\'s voice, build real connections, and drive meaningful growth.'}
                      </p>
                    </div>
                  </RevealOnScroll>
                </div>
              </a>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-center space-x-4">
          {/* Previous Arrow */}
          <button 
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentPage === 1 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-[#0D1B2A] hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-[#0D1B2A] text-white'
                    : 'text-[#0D1B2A] hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Arrow */}
          <button 
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentPage === totalPages 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-[#0D1B2A] hover:bg-gray-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Blog;
