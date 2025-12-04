import React from 'react';

const BookingSection = () => {
  return (
    <section className="bg-[#EFE7D5] py-12 sm:py-16 px-3 sm:px-4 md:px-8">
      <div className="w-full h-[650px] sm:h-[700px] md:h-[750px]">
        <iframe
          src="https://cal.com/apnaaapan/30min?date=2025-12-05"
          title="Book a 30 min meeting with Apnaaapan"
          className="w-full h-full border-0"
          loading="lazy"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
        ></iframe>
      </div>
    </section>
  );
};

export default BookingSection; 