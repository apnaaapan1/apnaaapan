import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    question: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success', 'error', or null
  const [errorMessage, setErrorMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  // Auto-dismiss success message after 5 seconds with countdown
  useEffect(() => {
    if (submitStatus === 'success') {
      setCountdown(5);

      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setSubmitStatus(null);
            setErrorMessage('');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Cleanup interval on component unmount or when status changes
      return () => clearInterval(countdownInterval);
    }
  }, [submitStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear status when user starts typing again
    if (submitStatus) {
      setSubmitStatus(null);
      setErrorMessage('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrorMessage('');

    try {
      // Use relative URL for production, or localhost for development
      const apiUrl = process.env.REACT_APP_API_URL || '/api/contact';
      const fullUrl = apiUrl.startsWith('http') ? apiUrl :
        (process.env.NODE_ENV === 'production' ? apiUrl : 'http://localhost:5000/api/contact');

      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        // Try to get error message from response
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          errorData = { message: `Server error: ${response.status} ${response.statusText}` };
        }
        setSubmitStatus('error');
        setErrorMessage(errorData.message || errorData.details || 'An error occurred while submitting the form');
        console.error('Server error:', errorData);
        return;
      }

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          question: ''
        });
      } else {
        setSubmitStatus('error');
        setErrorMessage(result.message || 'An error occurred while submitting the form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');

      // Provide more specific error messages
      if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        setErrorMessage('Cannot connect to server. Please make sure the server is running on port 5000.');
      } else if (error.message.includes('CORS')) {
        setErrorMessage('CORS error. Please check server configuration.');
      } else {
        setErrorMessage(`Network error: ${error.message}. Please check your connection and try again.`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#EFE7D5] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start mb-20">
          {/* Left Section - Connect With Us */}
          <div className="space-y-12 animate-fadeIn" style={{ animationDelay: '50ms' }}>
            <div className="animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-6" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
                Connect With <span className="text-[#FFC107]">Us</span>
              </h2>
              <p className="text-lg text-[#5B5B5B] leading-relaxed animate-fadeIn" style={{ fontFamily: 'nexaRegular', animationDelay: '140ms' }}>
                Have a question about our services, or something else in mind? We're always open to conversations and happy to figure things out together.
              </p>
            </div>

            <div className="space-y-12">
              {/* Contact Us Section */}
              <div className="animate-fadeIn" style={{ animationDelay: '180ms' }}>
                <h3 className="text-xl font-semibold text-[#0D1B2A] mb-6" style={{ fontFamily: 'nexaRegular' }}>
                  Contact Us
                </h3>
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-[#F26B2A]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    <span className="text-[#5B5B5B]" style={{ fontFamily: 'nexaRegular' }}>Email - Hr@apnaaapan.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-[#F26B2A]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="text-[#5B5B5B]" style={{ fontFamily: 'nexaRegular' }}>Phone - +91 9548954859</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 animate-fadeIn" style={{ animationDelay: '180ms' }}>
            <h2 className="text-2xl font-bold text-[#0D1B2A] mb-6" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
              Let us know more about you and your goals
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-[#5B5B5B] mb-2" style={{ fontFamily: 'nexaRegular' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F26B2A] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your first name"
                    required
                    style={{ fontFamily: 'nexaRegular' }}
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-[#5B5B5B] mb-2" style={{ fontFamily: 'nexaRegular' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F26B2A] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your last name"
                    required
                    style={{ fontFamily: 'nexaRegular' }}
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#5B5B5B] mb-2" style={{ fontFamily: 'nexaRegular' }}>
                  Mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-[#F26B2A]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F26B2A] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                    required
                    style={{ fontFamily: 'nexaRegular' }}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-[#5B5B5B] mb-2" style={{ fontFamily: 'nexaRegular' }}>
                  Phone Number
                </label>
                <div className="flex">
                  <div className="flex-shrink-0 px-4 py-3 bg-gray-100 border border-r-0 border-gray-300 rounded-l-xl flex items-center">
                    <span className="text-[#5B5B5B] font-medium" style={{ fontFamily: 'nexaRegular' }}>+91</span>
                  </div>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-xl focus:ring-2 focus:ring-[#F26B2A] focus:border-transparent transition-all duration-200"
                    placeholder="Enter your phone number"
                    required
                    style={{ fontFamily: 'nexaRegular' }}
                  />
                </div>
              </div>

              {/* Question */}
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-[#5B5B5B] mb-2" style={{ fontFamily: 'nexaRegular' }}>
                  Enter your question here
                </label>
                <textarea
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#F26B2A] focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Tell us about your project or question..."
                  required
                  style={{ fontFamily: 'nexaRegular' }}
                />
              </div>

              {/* Success/Error Messages */}
              {submitStatus === 'success' && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span style={{ fontFamily: 'nexaRegular' }}>
                        Thank you! Your message has been sent successfully. We'll get back to you soon.
                      </span>
                    </div>
                    <div className="flex items-center text-sm space-x-2">
                      <span style={{ fontFamily: 'nexaRegular' }} className="mr-1">
                        Auto-dismiss in:
                      </span>
                      <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
                        {countdown}s
                      </span>
                      <button
                        onClick={() => {
                          setSubmitStatus(null);
                          setErrorMessage('');
                          setCountdown(0);
                        }}
                        className="text-green-600 hover:text-green-800 transition-colors"
                        title="Dismiss message"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span style={{ fontFamily: 'nexaRegular' }}>
                      {errorMessage}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSubmitting
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white hover:shadow-lg hover:scale-[1.02] focus:ring-orange-500'
                  }`}
                style={{ fontFamily: 'nexaRegular' }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </div>
                ) : (
                  'Submit'
                )}
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-[#5B5B5B] text-center leading-relaxed" style={{ fontFamily: 'nexaRegular' }}>
                By entering my phone number in the form, I agree to receive recurring automated marketing text messages.

                <a href="/terms" className="text-[#F26B2A] hover:underline ml-1">Terms of Use</a> and{' '}
                <a href="/privacy" className="text-[#F26B2A] hover:underline">Privacy Policy</a>.
              </p>
            </form>
          </div>
        </div>

        {/* Google Maps Section */}
        <div className="mt-20 mb-20 animate-fadeIn" style={{ animationDelay: '280ms' }}>
          <div className="bg-white rounded-3xl p-2 shadow-lg border border-gray-100">
            <div className="relative h-[600px] w-full rounded-2xl overflow-hidden">
              {/* Google Maps iframe - Replace with your actual Google Maps embed code */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d222.53600439212462!2d75.7502111!3d26.8216239!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396dcbeea82eeba9%3A0xff55686426875b37!2sAxis%20Bank%20Branch!5e0!3m2!1sen!2sin!4v1770488560581!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Apnaaapan Office Location"
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Icon - Fixed in bottom-right corner */}
      <a
        href="https://wa.me/919587773274"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
};

export default Contact;
