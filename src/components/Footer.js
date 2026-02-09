import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#0B0B0B] text-white py-12 sm:py-16 px-4 sm:px-6 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-12 gap-8 xl:gap-12">

          {/* Column 1 - Logo, contact and social media */}
          <div className="lg:col-span-1 xl:col-span-3">
            {/* Company Logo */}
            <div className="mb-4 sm:mb-6">
              <img
                src="/images/Logo Icon A 4.png"
                alt="Apnaaapan Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 object-contain shadow-lg"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-white text-sm sm:text-base">+91-9587773274</span>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-white text-sm sm:text-base whitespace-nowrap">Grow@apnaaapan.com</span>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <a href="https://wa.me/919587773274" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
              <a href="https://www.facebook.com/apnaaapan1/" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://instagram.com/apnaaapan" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-gradient-to-tr hover:from-pink-500 hover:to-violet-500">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" />
                </svg>
              </a>
              <a href="https://twitter.com/apnaaapan" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center transition-colors duration-200 hover:bg-gray-600">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l16 16" />
                  <path d="M20 4L4 20" />
                </svg>
              </a>
              <a href="https://youtube.com/@apnaaapan" className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2 - Explore Services */}
          <div className="lg:col-span-1 xl:col-span-3">
            <h3 className="text-gray-400 font-semibold text-base sm:text-lg mb-4 sm:mb-6">Explore Services</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/services/branding" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">Branding & Identity</a></li>
              <li><a href="/services/design" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">Design & Creative</a></li>
              <li><a href="/services/social-media" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">Social Media</a></li>
              <li><a href="/services/web-development" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">Web Development</a></li>
              <li><a href="/services/marketing" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">Marketing Strategy</a></li>
            </ul>
          </div>

          {/* Column 3 - Quick Link */}
          <div className="lg:col-span-1 xl:col-span-2">
            <h3 className="text-gray-400 font-semibold text-base sm:text-lg mb-4 sm:mb-6">Quick Link</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/partner-with-us" className="text-white hover:text-orange-400 transition-colors duration-200 relative group text-sm sm:text-base">
                  Partner with Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="/work-with-us" className="text-white hover:text-orange-400 transition-colors duration-200 relative group text-sm sm:text-base">
                  Work with Us
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
              <li>
                <a href="/blog" className="text-white hover:text-orange-400 transition-colors duration-200 relative group text-sm sm:text-base">
                  Blog
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 - Info */}
          <div className="lg:col-span-1 xl:col-span-2">
            <h3 className="text-gray-400 font-semibold text-base sm:text-lg mb-4 sm:mb-6">Info</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/about-us" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">About us</a></li>
              <li><a href="/work" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">Our Work</a></li>
              <li><a href="/contact" className="text-white hover:text-orange-400 transition-colors duration-200 text-sm sm:text-base">Contacts</a></li>
            </ul>
          </div>

          {/* Column 5 - Book a call section */}
          <div className="xl:col-span-2 flex flex-col items-center sm:items-start md:items-center xl:items-end">
            {/* Book a Call Button */}
            <div className="mb-6 sm:mb-8 w-full sm:w-auto">
              <a
                href="/book-call"
                className="inline-block bg-gradient-to-r from-orange-500 to-yellow-400 text-white px-6 py-3 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base hover:shadow-xl transition-all duration-300 hover:scale-105 shadow-lg w-full text-center"
              >
                Book a Call
              </a>
            </div>

            {/* Address */}
            <div className="mb-4 sm:mb-6 text-center sm:text-left md:text-center xl:text-right">
              <p className="text-white text-xs sm:text-sm leading-relaxed">
                136, Shree Shyam Tower,<br />
                Kesar Nagar, Sangner,<br />
                Jaipur - 302020, Rajasthan, India
              </p>
            </div>

            {/* Working Hours */}
            <div className="text-center sm:text-left md:text-center xl:text-right">
              <p className="text-white text-xs sm:text-sm font-medium">
                From 10 a.m. to 6:30 p.m.
              </p>
              <p className="text-gray-400 text-xs mt-1 italic">
                Mon-Sat
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section - Copyright & Privacy */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-0">
            © 2026 WorkPark Private Limited — All Rights Reserved
          </div>
          <div className="text-gray-400 text-xs sm:text-sm flex gap-4">
            <a href="/terms-and-conditions" className="hover:text-white transition-colors duration-200">Terms & Conditions</a>
            <a href="/privacy-policy" className="hover:text-white transition-colors duration-200">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 