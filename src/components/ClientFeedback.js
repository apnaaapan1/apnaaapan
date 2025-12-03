import React from 'react';

const ClientFeedback = () => {
  const testimonials = [
    {
      name: "Narendra Patel",
      role: "Wood Designer",
      feedback: "Our brand took off after teaming with Apnaaapan. From strategy to execution, they handled everything and helped us see consistent sales growth and real engagement. Highly recommended!",
      avatar: "👨‍💼"
    },
    {
      name: "Vinod Kumawat",
      role: "Amrita Naturals",
      feedback: "Apnaaapan created marketing campaigns that spoke to our audience. We started seeing meaningful leads, not just vanity metrics, and felt genuinely supported throughout.",
      avatar: "👨‍💼"
    },
    {
      name: "Ritika Maheshwari",
      role: "Kavvya",
      feedback: "With Apnaaapan's creative team, our products finally got noticed. Their approach is personal, data-driven, and built around our vision. We started seeing actual returns!",
      avatar: "👩‍💼"
    },
    {
      name: "Kavita Sharma",
      role: "Pakkey Rang",
      feedback: "The team at Apnaaapan understands branding and digital growth. Every campaign felt customized, which made our message stand out and our audience truly connect with us.",
      avatar: "👩‍💼"
    },
    {
      name: "Yash Vijayvergiya",
      role: "GoLead",
      feedback: "We saw a huge shift in our online presence and traffic. Apnaaapan aligned marketing with our goals, constantly refining strategies to keep us moving forward.",
      avatar: "👨‍💼"
    },
    {
      name: "Nivedita",
      role: "Divya Jadi Boutique",
      feedback: "Apnaaapan's smart paid ads and fresh content quickly expanded our reach. Their process, communication, and insights helped us convert new audiences into lasting customers!",
      avatar: "👩‍💼"
    },
    {
      name: "Abhishek Maheshwari",
      role: "CRSK",
      feedback: "Three months with Apnaaapan doubled our engagement rates. Strategic guidance and creative flair made digital marketing enjoyable—and results visible.",
      avatar: "👨‍💼"
    },
    {
      name: "Sahil Khan",
      role: "Cloudy Sharks",
      feedback: "The team's influencer campaigns and storytelling gave our brand fresh energy online. We could see real conversations and leads, not just surface-level numbers.",
      avatar: "👨‍💼"
    },
    {
      name: "Navdeep Mehta",
      role: "Smiloshine",
      feedback: "Our business found a voice, not just visibility. Apnaaapan gave us custom strategies and genuinely cared about our brand's unique goals and story.",
      avatar: "👨‍💼"
    },
    {
      name: "Kavya Naturals",
      role: "Kavya Naturals",
      feedback: "We worked closely with Apnaaapan on social media and growth. Sales increased, feedback improved, and their team was always transparent and proactive.",
      avatar: "👩‍💼"
    }
  ];

  return (
    <section className="bg-[#EFE7D5] py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <p className="text-blue-600 text-xs sm:text-sm font-medium mb-2">Client Feedback</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800">
            What They Say After Using Our Product
          </h2>
        </div>
      </div>

      {/* Moving Cards Container - Full Screen Width */}
      <div className="relative overflow-hidden w-full">
        {/* First Row - Moving Right to Left */}
        <div className="flex mb-6 sm:mb-8 animate-scroll-left">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div key={`row1-${index}`} className="flex-shrink-0 w-80 sm:w-96 mx-3 sm:mx-6">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg min-h-[10rem] sm:min-h-[12rem] h-auto overflow-hidden">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg sm:text-2xl mr-2 sm:mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-orange-500 text-sm sm:text-base">
                    <span>★★★★★</span>
                  </div>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                  {testimonial.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Second Row - Moving Left to Right */}
        <div className="flex animate-scroll-right">
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div key={`row2-${index}`} className="flex-shrink-0 w-80 sm:w-96 mx-3 sm:mx-6">
              <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg min-h-[10rem] sm:min-h-[12rem] h-auto overflow-hidden">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full flex items-center justify-center text-lg sm:text-2xl mr-2 sm:mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm sm:text-base">{testimonial.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex text-orange-500 text-sm sm:text-base">
                    <span>★★★★★</span>
                  </div>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm leading-relaxed break-words">
                  {testimonial.feedback}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientFeedback; 