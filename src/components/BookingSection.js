import React from 'react';

const BookingSection = () => {
  return (
    <section id="booking-calendar" className="bg-[#EFE7D5] py-12 sm:py-16 px-3 sm:px-4 md:px-8">
      <div className="w-full h-[1000px] sm:h-[700px] md:h-[800px] rounded-2xl overflow-hidden shadow-lg bg-[#292929]">
        <iframe
          src="https://cal.com/apnaaapan/30min?date=2025-12-05&theme=dark"
          title="Book a 30 min meeting with Apnaaapan"
          className="w-full h-full border-0"
          loading="lazy"
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          style={{ overflow: 'hidden' }}
        ></iframe>
      </div>
    </section>
  );
};

export default BookingSection; 