import React from 'react';

const BookCall = () => {
  return (
    <div className="min-h-screen bg-[#EFE7D5]">
      {/* Header Section */}
      <section className="relative px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 md:mb-6 leading-tight">
            <span className="text-[#1a365d]">Book a Call with</span>{' '}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              Apnaaapan
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            <p>Schedule a 30-minute meeting with our team to discuss your project and explore how we can help bring your vision to life.</p>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="px-3 sm:px-4 md:px-8 pb-12 sm:pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="w-full h-[650px] sm:h-[700px] md:h-[800px] bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src="https://cal.com/apnaaapan/30min?date=2025-12-05"
              title="Book a 30 min meeting with Apnaaapan"
              className="w-full h-full border-0"
              loading="lazy"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              style={{ overflow: 'hidden' }}
              scrolling="no"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookCall;
