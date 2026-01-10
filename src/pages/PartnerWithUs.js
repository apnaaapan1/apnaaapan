import React from 'react';
import OurServices from '../components/OurServices';
import PartnerProcess from '../components/PartnerProcess';
 

const PartnerWithUs = () => {
  return (
    <div className="bg-[#EFE7D5]">
      {/* Hero Section */}
      <section className="relative max-w-[1280px] mx-auto px-4 md:px-8 pt-16 md:pt-28 lg:pt-32 pb-28 md:pb-32 lg:pb-40 min-h-[560px] md:min-h-[760px] lg:min-h-[840px]">
        {/* top-right sparkle icon */}
        <img
          src="/images/partner_us/Subtract.png"
          alt="decorative sparkle"
          className="absolute right-6 md:right-16 top-12 md:top-16 lg:top-20 w-10 md:w-20 lg:w-24 select-none pointer-events-none"
        />

        {/* headline */}
        <div className="max-w-2xl">
          <h1 className="font-serif text-[#0D1B2A] text-[36px] leading-[44px] md:text-[64px] md:leading-[72px] lg:text-[72px] lg:leading-[80px] font-bold">
            Partner With Us
          </h1>
          <h2 className="mt-3 text-[#EB8F1C] font-serif text-[32px] leading-[40px] md:text-[64px] md:leading-[72px] lg:text-[72px] lg:leading-[80px] font-bold">
            <span className="whitespace-nowrap">Let’s Build Something</span>
            <br />
            That Works
          </h2>
        </div>

        {/* CTA and intro text */}
        <div className="mt-8 md:mt-12 max-w-xl">
          <button 
            onClick={() => {
              const readyToPartnerSection = document.getElementById('ready-to-partner');
              if (readyToPartnerSection) {
                readyToPartnerSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="inline-flex items-center gap-2 rounded-full text-white text-base md:text-lg font-semibold px-8 py-3.5 bg-gradient-to-r from-[#F26B2A] to-[#FFC107] shadow hover:shadow-md transition-transform hover:scale-[1.02]"
          >
            Start Partnering
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          <p className="mt-6 text-[#202124] text-base md:text-xl leading-7 md:leading-8 max-w-[560px]">
            Work with us as a white-label partner. We handle the work behind the scenes, you lead the relationship, at B2B-friendly rates.
          </p>
        </div>

        {/* left logo badge */}
        <img
          src="/images/Group 100.png"
          alt="Apnaaapan circular badge"
          className="hidden md:block absolute left-6 bottom-16 w-36 lg:w-40 select-none z-10"
        />

        {/* right illustration of people on stairs */}
        <div className="mt-12 md:mt-0 md:absolute md:right-0 md:top-60 lg:top-72 xl:top-72 md:w-[620px] lg:w-[700px] xl:w-[760px] pointer-events-none z-0">
          <img
            src="/images/partner_us/Group 9.png"
            alt="Partners climbing stairs illustration"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* bottom color bars (non-gradient, spaced from content) */}
      <div className="w-full mt-8 md:mt-12">
        <div className="w-full h-2.5 md:h-3.5 flex">
          <div className="bg-[#4A70B0] w-1/3" />
          <div className="bg-[#E2552A] w-1/3" />
          <div className="bg-[#F3C133] w-1/3" />
        </div>
      </div>

      {/* Why Partner With Us - Section */}
      <section className="max-w-[1100px] mx-auto px-4 md:px-8 pt-12 md:pt-18 lg:pt-20 pb-4 md:pb-6 text-center">
        <div className="text-[#E2552A] text-sm md:text-base font-semibold tracking-wide mb-4">
          Why Partner With Us
        </div>
        <h3 className="font-serif text-[#0D1B2A] font-bold leading-tight text-[28px] md:text-[44px] lg:text-[56px]">
          Why Agencies Choose Apnaaapan
        </h3>
        <p className="mt-4 text-[#202124] text-base md:text-xl leading-7 md:leading-8 max-w-[720px] mx-auto">
          We’re not here to replace your brand.
          <br />
          We’re here to strengthen it.
        </p>
      </section>

      {/* Horizontal feature cards reusing OurServices animation */}
      <section className="bg-[#EFE7D5] pb-2">
        <OurServices 
          showHeader={false}
          items={[
            { id: '01', title: 'Scales\nWith You', description: 'Our services are built to grow as you do, without breaking systems or adding friction.' },
            { id: '02', title: 'Made for\nPartnerships', description: 'Clear B2B pricing that protects your margins and keeps growth sustainable.' },
            { id: '03', title: 'Quiet\nExecution', description: 'We work behind the scenes.\nYou stay client-facing.\nYour relationship always comes first.' },
            { id: '04', title: 'Dependable\nDelivery', description: 'Consistent quality. Clear timelines.\nWork you can trust without second-guessing.' },
          ]}
        />
      </section>

      {/* Our Process - How It Works (Partner-specific static cards) */}
      <PartnerProcess />

      {/* Services We White Label - Heading Section */}
      <section className="max-w-[1100px] mx-auto px-4 md:px-8 pt-6 md:pt-8 lg:pt-10 pb-4 text-center">
        <div className="text-[#E2552A] text-sm md:text-base font-semibold tracking-wide mb-2">
          Services We White Label
        </div>
        <h3 className="font-serif text-[#0D1B2A] font-bold leading-tight text-[30px] md:text-[44px] lg:text-[56px]">
          Services We Offer Under
          <br className="hidden md:block" />
          White Label
        </h3>
      </section>

      {/* Reuse animated services cards from homepage */}
      <section className="bg-[#EFE7D5] pt-2 pb-2">
        <OurServices 
          showHeader={false}
          items={[
            { id: '01', title: 'Branding & Identity', description: (<><span>We don’t begin with visuals.</span><br /><span>We begin with meaning.</span><br /><span>The kind that helps brands feel familiar, trustworthy, and easy to remember.</span></>) },
            { id: '02', title: 'Design & Creative', description: (<><span>Good design doesn’t shout.</span><br /><span>It guides.</span><br /><span>Every visual has a purpose, nothing extra, nothing random.</span></>) },
            { id: '03', title: 'Social Media & Marketing', description: (<><span>We help brands show up honestly.</span><br /><span>Real stories, real engagement, and outcomes that actually matter.</span></>) },
            { id: '04', title: 'Web Development', description: (<><span>Clear, fast, intuitive websites that move users naturally from interest to action.</span></>) },
            { id: '05', title: 'Marketing Strategy', description: (<><span>Thoughtful planning backed by execution, built to connect the dots between effort and growth.</span></>) }
          ]}
        />
      </section>

      {/* What sets us apart - reused from OurStory */}
      <section className="max-w-[1200px] mx-auto px-4 md:px-8 pt-2 md:pt-3 pb-10">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="flex flex-col lg:flex-row">
            {/* Left color bars */}
            <div className="lg:w-8 flex lg:flex-col">
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#FF6B35]"></div>
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#FFD700]"></div>
              <div className="flex-1 lg:flex-none lg:h-24 bg-[#4682B4]"></div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 md:p-8 lg:p-12">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-6">
                <h3 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[#0D1B2A] font-serif">
                  What Sets Us Apart
                </h3>
                <div className="flex space-x-1 sm:ml-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-base md:text-xl leading-7 md:leading-8 text-[#2C2C2C] max-w-5xl">
                We care about where you're headed. Every team here, design, content, marketing, works with one shared intent: helping you win in a way that feels right for your business. No templates. No one-size-fits-all thinking. We listen first. We understand next. Then we build what actually works. Because for us, partnership isn't about output. It's about impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA + Contact Form */}
      <section id="ready-to-partner" className="max-w-[1250px] mx-auto px-4 md:px-8 pt-6 md:pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center">
          {/* Left: Heading + Illustration */}
          <div className="lg:col-span-6">
            <div className="text-[#E2552A] font-semibold mb-3">Ready to Partner With Us?</div>
            <h3 className="font-serif text-[#0D1B2A] font-bold text-[28px] leading-[1.2] md:text-[52px] md:leading-[1.15]">
              Let’s build together. Share
              <br className="hidden md:block" />
              your details &  we’ll take it from there.
            </h3>
            <div className="mt-8 max-w-xl">
              <img src="/images/partner_us/Group 321.png" alt="People collaborating" className="w-full h-auto" />
            </div>
          </div>

          {/* Right: Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-[28px] shadow-xl border border-[#EEE7D8] p-4 md:p-6 lg:p-8">
              <div className="text-[#0D1B2A] text-sm md:text-lg font-medium mb-4">Let us know more about you and your goals</div>

              {/* Name row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-4">
                <input className="rounded-full border border-[#E5E7EB] px-4 md:px-5 py-3 text-sm md:text-base focus:outline-none" placeholder="First Name" />
                <input className="rounded-full border border-[#E5E7EB] px-4 md:px-5 py-3 text-sm md:text-base focus:outline-none" placeholder="Last Name" />
              </div>

              {/* Agency */}
              <div className="mb-4">
                <input className="w-full rounded-full border border-[#E5E7EB] px-4 md:px-5 py-3 text-sm md:text-base focus:outline-none" placeholder="Agency / Organization" />
              </div>

              {/* Email */}
              <div className="mb-4">
                <input className="w-full rounded-full border border-[#E5E7EB] px-4 md:px-5 py-3 text-sm md:text-base focus:outline-none" placeholder="Mail" />
              </div>

              {/* Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-[90px,1fr] gap-3 mb-4">
                <input className="rounded-full border border-[#E5E7EB] px-4 md:px-5 py-3 text-sm md:text-base focus:outline-none" defaultValue={"+91"} />
                <input className="rounded-full border border-[#E5E7EB] px-4 md:px-5 py-3 text-sm md:text-base focus:outline-none" placeholder="Phone Number" />
              </div>

              {/* Question */}
              <div className="mb-5">
                <textarea className="w-full rounded-2xl border border-[#E5E7EB] px-4 md:px-5 py-4 min-h-[140px] md:min-h-[160px] text-sm md:text-base focus:outline-none" placeholder="Enter your question here" />
              </div>

              {/* Submit */}
              <button className="w-full rounded-full text-white font-semibold py-3 bg-gradient-to-r from-[#F26B2A] to-[#FFC107]">Submit</button>

              {/* Fine print */}
              <p className="mt-4 text-[10px] md:text-[11px] text-[#6B7280] leading-relaxed text-center">
                By entering my phone number in the form, I agree to receive recurring automated
                marketing text messages. Msg & data rates may apply; msg frequency varies. Reply HELP
                for help and STOP to unsubscribe. Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnerWithUs;


