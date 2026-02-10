import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ClientFeedback from '../components/ClientFeedback';


const serviceContent = {
  'social-media': {
    title: 'Social Media Marketing',
    headline: 'From scrolling to sales, we turn attention into action',
    description:
      "Social media here goes deeper than posting nice things.\nWe mix stories, data, and platform-specific thinking to connect audiences and create results that last.",
  },
  'branding': {
    title: 'Branding & Identity',
    headline: 'Built to Feel Familiar. Designed to Last.',
    description:
      "We help brands find their footing.\nNot just how they look, but how they speak, behave, and stay remembered.\nThrough brand strategy, voice, and visual systems, we build identities that feel clear from the inside out, so every touchpoint feels intentional, not scattered.",
  },
  'design': {
    title: 'Design & Creative',
    headline: 'Design That Carries Meaning, Not Noise.',
    description:
      "Good design doesn't try too hard.\nIt knows what it's there to do.\nFrom campaigns to presentations, we create visual systems and creative work that tell clear stories, strengthen perception, and support real business outcomes, without unnecessary clutter.",
  },
  'web-development': {
    title: 'Web Development',
    headline: 'Built to Feel Easy. Designed to Move People.',
    description:
      "A website shouldn't make people think too hard.\nIt should guide them.\nWe design and develop websites that are fast, intuitive, and built around real user behavior, so visitors don't just arrive, they know where to go next.",
  },
  'marketing': {
    title: 'Marketing Strategy',
    headline: 'Built With Clarity. Guided With Intent.',
    description:
      "Growth doesn't come from doing more.\nIt comes from doing the right things, in the right order.\nWe build marketing strategies that bring alignment across channels, teams, and efforts, so growth feels focused, measurable, and steady instead of scattered.",
  },
};

const problemContent = {
  'social-media': [
    {
      title: "Posting regularly, but nothing's really landing",
      details: [
        "We look at what's working, what's not, and why.",
        'From timing to formats to hashtags, we fine-tune the details, so engagement starts feeling alive again.',
        'Most brands see a clear shift within a few months.'
      ]
    },
    {
      title: 'No clear voice or content direction',
      details: [
        'We help you sound like you.',
        'By shaping a brand voice and content flow that fits your audience, your messaging stops feeling scattered and starts feeling consistent and familiar.'
      ]
    },
    {
      title: 'Followers, but not enough customers',
      details: [
        "Attention alone isn't the goal.",
        'We design content that guides people from interest to trust to action, using thoughtful funnels and clear, natural call-to-actions.'
      ]
    },
    {
      title: 'Too many platforms. Too much to manage.',
      details: [
        'We take it off your plate.',
        'From content to posting to conversations, we handle the moving parts, so your brand shows up steadily, without you feeling stretched thin.'
      ]
    }
  ],
  'branding': [
    {
      title: "You're showing up, but nothing is really sticking",
      details: [
        "We help your brand move from noise to meaning, so people don't just see you, they remember you."
      ]
    },
    {
      title: 'Your brand sounds different everywhere',
      details: [
        'We shape a clear brand voice and direction that feels consistent, recognizable, and true to you.'
      ]
    },
    {
      title: "People notice you, but don't choose you",
      details: [
        'We align positioning and perception so attention turns into trust, and trust turns into action.'
      ]
    },
    {
      title: 'Too many touchpoints, no clear identity',
      details: [
        'We bring everything under one system, so your brand feels unified instead of fragmented.'
      ]
    }
  ],
  'design': [
    {
      title: "You're creating, but nothing is really landing",
      details: [
        "We help your creative move from being seen to being felt, so it actually stays with people."
      ]
    },
    {
      title: "Your visuals don't feel connected",
      details: [
        'We bring consistency across design, messaging, and platforms, so everything feels part of one story.'
      ]
    },
    {
      title: "Attention isn't turning into action",
      details: [
        'We design with intent, guiding people naturally from interest to response.'
      ]
    },
    {
      title: 'Too many formats, too much to handle',
      details: [
        'We simplify the system, so creative feels manageable, not overwhelming.'
      ]
    }
  ],
  'web-development': [
    {
      title: "People visit, but don't stay",
      details: [
        'We improve structure, speed, and flow so your website holds attention instead of losing it.'
      ]
    },
    {
      title: "Your website doesn't reflect your brand",
      details: [
        'We align design, language, and experience so your site feels like a true extension of who you are.'
      ]
    },
    {
      title: 'Traffic without conversions',
      details: [
        'We design journeys that gently move users from curiosity to action, without pressure.'
      ]
    },
    {
      title: 'Too many pages, too much confusion',
      details: [
        'We simplify navigation and content so everything feels clear and intentional.'
      ]
    }
  ],
  'marketing': [
    {
      title: "You're active, but results feel inconsistent",
      details: [
        'We bring structure and direction so efforts start adding up instead of spreading thin.'
      ]
    },
    {
      title: 'Your messaging feels unclear',
      details: [
        'We help define a clear narrative and priorities so every channel speaks the same language.'
      ]
    },
    {
      title: 'Attention without outcomes',
      details: [
        'We connect visibility to conversion, building paths that move people toward action.'
      ]
    },
    {
      title: 'Too many platforms, no clear focus',
      details: [
        'We simplify where to show up, how often, and why, so marketing feels manageable again.'
      ]
    }
  ]
};

const approachContent = {
  'social-media': [
    {
      title: 'Audit & Strategy',
      details: [
        'We begin by looking closely.',
        'Your audience. Your space. What\'s worked before and what hasn\'t.',
        "That's how we spot the real opportunities."
      ]
    },
    {
      title: 'Content Planning',
      details: [
        'We plan with intention.',
        'A clear content rhythm, built around goals so your messaging stays consistent and actually lands.'
      ]
    },
    {
      title: 'Creative Production',
      details: [
        'This is where ideas take shape.',
        'Visuals, words, videos made to pause the scroll and stay with your audience.'
      ]
    },
    {
      title: 'Publishing & Engagement',
      details: [
        'Showing up matters.',
        "We post consistently and stay present in conversations so your brand doesn't fade between uploads."
      ]
    },
    {
      title: 'Reporting & Optimization',
      details: [
        'We keep watching and adjusting.',
        "Tracking what's working, refining what's not so results improve over time, naturally."
      ]
    }
  ],
  'branding': [
    {
      title: 'Audit & Direction',
      details: [
        'We begin by paying attention.',
        'Your story. Your space. What\'s working and what feels off.',
        "That's where clarity starts."
      ]
    },
    {
      title: 'Brand Foundations',
      details: [
        'We define the core, positioning, voice, and visual logic.',
        'So decisions feel easier and the brand starts sounding like itself.'
      ]
    },
    {
      title: 'Visual & Verbal Identity',
      details: [
        'This is where it comes alive.',
        'Logos, systems, language, and assets built to feel familiar and flexible.'
      ]
    },
    {
      title: 'Rollout & Alignment',
      details: [
        'We help your brand show up consistently across platforms and touchpoints, without forcing sameness.'
      ]
    },
    {
      title: 'Refinement',
      details: [
        "We don't lock things and walk away.",
        'We observe, refine, and strengthen the system as your brand grows.'
      ]
    }
  ],
  'design': [
    {
      title: 'Audit & Direction',
      details: [
        'We start by observing.',
        'Your brand, your audience, your visual landscape.',
        'That\'s how we understand what needs clarity, and what needs restraint.'
      ]
    },
    {
      title: 'Creative Planning',
      details: [
        'We plan with purpose.',
        'Clear formats, visual logic, and direction that support your goals instead of distracting from them.'
      ]
    },
    {
      title: 'Creative Production',
      details: [
        'This is where ideas take shape.',
        'Designs, visuals, and assets built to pause attention and hold meaning.'
      ]
    },
    {
      title: 'Publishing & Alignment',
      details: [
        'Consistency matters.',
        'We ensure creative shows up clearly across platforms, without losing its core.'
      ]
    },
    {
      title: 'Refinement',
      details: [
        'We keep improving.',
        'Studying what resonates, adjusting what doesn\'t, so creative grows stronger over time.'
      ]
    }
  ],
  'web-development': [
    {
      title: 'Audit & Direction',
      details: [
        'We start by understanding how people currently experience your website.',
        'What works. What slows them down. What\'s missing.'
      ]
    },
    {
      title: 'Structure & Planning',
      details: [
        'We plan the flow.',
        'Pages, hierarchy, and user journeys built around clarity and purpose.'
      ]
    },
    {
      title: 'Design & Development',
      details: [
        'This is where it comes together.',
        'Clean design, responsive layouts, and development that prioritizes performance and ease.'
      ]
    },
    {
      title: 'Testing & Launch',
      details: [
        'We test across devices and scenarios to make sure everything works smoothly before going live.'
      ]
    },
    {
      title: 'Refinement',
      details: [
        'After launch, we observe and refine.',
        'Small improvements that strengthen performance over time.'
      ]
    }
  ],
  'marketing': [
    {
      title: 'Audit & Direction',
      details: [
        'We start by understanding the full picture.',
        'Your audience, your channels, your past efforts, and what\'s holding things back.'
      ]
    },
    {
      title: 'Strategic Planning',
      details: [
        'We map out priorities, timelines, and channels with intention.',
        'No overloading. Just clear direction.'
      ]
    },
    {
      title: 'Execution Alignment',
      details: [
        'We align creative, content, and campaigns to the strategy, so everything moves together.'
      ]
    },
    {
      title: 'Launch & Coordination',
      details: [
        'We help ensure consistent execution across platforms, without gaps or confusion.'
      ]
    },
    {
      title: 'Measurement & Refinement',
      details: [
        "We track what matters.",
        "What's working gets strengthened. What's not gets rethought."
      ]
    }
  ]
};

const outcomesContent = {
  'social-media': {
    items: [
      'Higher engagement that feels natural, not forced',
      'A clear, recognizable brand voice people remember',
      'Consistent follower growth that builds over time',
      'More inbound leads and real conversions'
    ],
    cta: "Let's Grow Your Socials"
  },
  'branding': {
    items: [
      'A brand presence that feels clear, not confusing',
      'A recognizable voice people remember',
      'Consistency across platforms and touchpoints',
      'Stronger trust, recall, and long-term growth'
    ],
    cta: "Let's Build Your Brand"
  },
  'design': {
    items: [
      'Design that feels intentional, not decorative',
      'A visual language people recognize and trust',
      'Consistency across campaigns and platforms',
      'Creative that supports engagement, leads, and growth'
    ],
    cta: "Let's Build Your Creative"
  },
  'web-development': {
    items: [
      'A website that feels fast and easy to use',
      'Clear navigation that guides visitors naturally',
      'Stronger trust and credibility',
      'More enquiries, leads, and real actions'
    ],
    cta: "Let's Build Your Website"
  },
  'marketing': {
    items: [
      'Clear direction across marketing efforts',
      'More focused execution with less waste',
      'Better alignment between effort and results',
      'Steady inbound growth and conversions'
    ],
    cta: "Let's Build Your Strategy"
  }
};

const teamContent = {
  'social-media': 'Meet the team behind making your appointments happen.',
  'branding': 'Meet the team behind making your appointments happen.',
  'design': 'The people behind thoughtful design and clear execution.',
  'web-development': 'The people behind thoughtful design and reliable development.',
  'marketing': 'The people behind thoughtful planning and steady execution.'
};

const differentiatorContent = {
  'social-media': "We actually care about where you're headed. Every person on our team, design, content, marketing, works with one shared intent: helping you move forward. No templates. No one-size-fits-all fixes. We listen first. We understand next. And then we build what truly fits you. Because for us, it's not just about getting the work done. It's about making sure it matters.",
  'branding': "We don't start with templates.\nWe start with listening.\nEvery team here, strategy, design, content, works with one shared intent: building brands that feel right, not just look good.\nWe take the time to understand where you're headed.\nThen we build systems that support that direction.\nBecause for us, branding isn't decoration.\nIt's alignment.",
  'design': "We don't design to impress.\nWe design to align.\nEvery team here, design, content, marketing, works with one shared intent: creating work that makes sense for where you're headed.\nNo templates.\nNo shortcuts.\nWe listen first.\nWe understand next.\nThen we build creative that actually fits.\nBecause design isn't about filling space.\nIt's about giving meaning to it.",
  'web-development': "We don't build websites to impress.\nWe build them to work.\nEvery team here, design, content, development, collaborates with one shared intent: creating digital experiences that support your goals.\nNo bloated features.\nNo unnecessary complexity.\nWe listen first.\nWe understand next.\nThen we build something that actually fits.\nBecause a website isn't just a screen.\nIt's often the first conversation your brand has.",
  'marketing': "We don't believe strategy should live in documents alone.\nIt should guide real decisions.\nEvery team here, strategy, design, content, marketing, works with one shared intent: helping you move forward with clarity.\nNo borrowed frameworks.\nNo unnecessary complexity.\nWe listen first.\nWe understand next.\nThen we build a strategy that actually fits.\nBecause good strategy doesn't feel heavy.\nIt feels grounding."
};

const clientFeedbackIntro = {
  'social-media': 'What They Say After Using Our Product',
  'branding': 'What They Say After Using Our Product',
  'design': "What people notice after working with us isn't just better visuals. It's clarity. Consistency. And creative that finally feels connected.",
  'web-development': "What clients notice isn't just better design. It's smoother journeys, clearer messaging, and websites that finally feel usable.",
  'marketing': "What clients experience isn't just better planning. It's clearer direction, smoother execution, and growth that feels intentional."
};

const faqContent = {
  'social-media': [
    {
      q: 'Will this work for my brand?',
      a: "If you're willing to show up consistently and grow with intention, yes. We don't force results. We build toward them."
    },
    {
      q: 'How long before we see a difference?',
      a: 'Some things shift early. Others take time. We focus on steady progress, not overnight spikes.'
    },
    {
      q: 'Do you need constant input from us?',
      a: "No. We'll need clarity at the start, and alignment along the way. After that, we handle the rest."
    },
    {
      q: 'Is this just about posting on social media?',
      a: "Not really. It's about how your brand sounds, feels, and shows up, posts are only one part of it."
    },
    {
      q: 'Do you follow a fixed process?',
      a: 'We follow your brand. The framework adapts. The thinking stays intentional.'
    },
    {
      q: 'How do you define success?',
      a: 'When your presence feels clear, consistent, and starts bringing the right people to you.'
    }
  ],
  'branding': [
    {
      q: 'Will this work for my brand?',
      a: "If you're ready to build with intention and consistency, yes. We don't rush identities. We shape them carefully."
    },
    {
      q: 'How long before we see a difference?',
      a: 'Some clarity comes early. Recognition grows over time. We focus on foundations that last.'
    },
    {
      q: 'Do you need constant input from us?',
      a: 'We need alignment at the start and checkpoints along the way. After that, we handle the process.'
    },
    {
      q: 'Is this only about logos and visuals?',
      a: 'No. Branding is about how your brand feels, sounds, and shows up everywhere.'
    },
    {
      q: 'Do you follow a fixed process?',
      a: 'The thinking stays structured. The execution adapts to your brand.'
    },
    {
      q: 'How do you define success?',
      a: 'When your brand feels clear, consistent, and starts attracting the right people naturally.'
    }
  ],
  'design': [
    {
      q: 'Is this just about making things look good?',
      a: 'No. Design here is about clarity. Every visual is created to support understanding, not decoration.'
    },
    {
      q: 'What kind of design do you actually handle?',
      a: 'Campaign creatives, brand visuals, presentations, social content, and design systems that stay consistent across platforms.'
    },
    {
      q: 'Will the creative match our brand exactly?',
      a: "Yes. Everything is built from your brand's voice, values, and context. Nothing generic. Nothing forced."
    },
    {
      q: 'How involved do we need to be?',
      a: 'We align closely at the start. After that, we handle execution and keep you in the loop at key checkpoints.'
    },
    {
      q: 'Can this work if we already have a designer?',
      a: 'Absolutely. We often complement in-house teams by bringing structure, direction, and fresh perspective.'
    },
    {
      q: 'How do you measure success here?',
      a: 'When your creative feels clear, consistent, and starts supporting engagement, recall, and action naturally.'
    }
  ],
  'web-development': [
    {
      q: 'Is this just about building a website?',
      a: "No. It's about creating an experience that feels clear, reliable, and easy to move through."
    },
    {
      q: 'Can you work with an existing website?',
      a: 'Yes. We often redesign, restructure, or improve what\'s already there.'
    },
    {
      q: 'How involved do we need to be?',
      a: 'We align closely at the start and at key stages. Execution stays with us.'
    },
    {
      q: 'Will the website be easy to manage later?',
      a: "Yes. We build with simplicity in mind, so updates don't feel overwhelming."
    },
    {
      q: 'Do you follow a fixed process?',
      a: 'The framework stays steady. The execution adapts to your needs.'
    },
    {
      q: 'How do you define success?',
      a: 'When your website feels effortless to use and starts supporting real business outcomes.'
    }
  ],
  'marketing': [
    {
      q: 'Is marketing strategy only for large brands?',
      a: 'No. Strategy matters even more when resources are limited.'
    },
    {
      q: 'How long before we see results?',
      a: 'Some clarity comes early. Consistent outcomes build with execution over time.'
    },
    {
      q: 'Will you also help with execution?',
      a: 'Yes. Strategy and execution work best when they stay connected.'
    },
    {
      q: 'Do we need to be involved constantly?',
      a: 'We align closely at the start and review at key stages. Day-to-day execution is handled by us.'
    },
    {
      q: 'Do you follow a fixed framework?',
      a: 'The structure stays clear. The strategy adapts to your brand and goals.'
    },
    {
      q: 'How do you define success?',
      a: 'When your marketing feels focused, aligned, and starts delivering predictable progress.'
    }
  ]
};

const Services = () => {
  const navigate = useNavigate();
  const [expandedCards, setExpandedCards] = useState({});

  // Resolve dynamic service slug (default to social-media when not provided)
  const path = typeof window !== 'undefined' ? window.location.pathname : '/services/social-media';
  const slug = path.startsWith('/services/') ? path.replace('/services/', '') : 'social-media';
  const svc = serviceContent[slug] || serviceContent['social-media'];
  const heroImages = {
    'social-media': '/images/social_media_service.png',
    'branding': '/images/branding_identity.png',
    'design': '/images/design_creative.png',
    'web-development': '/images/web_development_service.png',
    'marketing': '/images/marketing_strategy.png',
  };
  const heroImage = heroImages[slug];
  const problems = problemContent[slug] || problemContent['social-media'];
  const approach = approachContent[slug] || approachContent['social-media'];
  const outcomes = outcomesContent[slug] || outcomesContent['social-media'];
  const teamText = teamContent[slug] || teamContent['social-media'];
  const differentiator = differentiatorContent[slug] || differentiatorContent['social-media'];
  const feedbackIntro = clientFeedbackIntro[slug] || clientFeedbackIntro['social-media'];
  const faqItems = faqContent[slug] || faqContent['social-media'];
  const [openFaq, setOpenFaq] = useState(faqItems.map((_, index) => index === 0));
  const toggleFaq = (index) => {
    setOpenFaq(prev => prev.map((isOpen, i) => (i === index ? !isOpen : isOpen)));
  };

  const toggleCard = (cardId) => {
    setExpandedCards(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };
  // Mobile-friendly scroll reveal
  const RevealOnScroll = ({ children }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setVisible(true);
        return;
      }
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      }, { threshold: 0.15 });
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    return (
      <div ref={ref} className={`transform transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        {children}
      </div>
    );
  };

  return (
    <>
      <div className="min-h-screen bg-[#EFE7D5] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Social Media Marketing Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-20">
            {/* Left Section - Text Content */}
            <div className="space-y-8">
              <div>
                <RevealOnScroll>
                  <h3 className="text-lg font-semibold text-[#F26B2A] mb-4 font-nexa-regular">
                    {svc.title}
                  </h3>
                </RevealOnScroll>
                <RevealOnScroll>
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0D1B2A] mb-6 leading-tight font-serif">
                    {svc.headline}
                  </h1>
                </RevealOnScroll>
                <RevealOnScroll>
                  <p className="text-lg text-[#5B5B5B] leading-relaxed font-nexa-regular">
                    {svc.description}
                  </p>
                </RevealOnScroll>
              </div>

              {/* CTA Button */}
              <div className="pt-4">
                <RevealOnScroll>
                  <button
                    onClick={() => navigate('/book-call')}
                    className="bg-gradient-to-r from-[#F26B2A] to-[#FFC107] text-white px-8 py-4 rounded-full font-nexa-bold text-lg flex items-center space-x-3 hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span>Book a Free Strategy Call</span>
                  </button>
                </RevealOnScroll>
              </div>
            </div>

            {/* Right Section - Visual */}
            <div className="relative order-first lg:order-last">
              <RevealOnScroll>
                {heroImage ? (
                  <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
                    <img src={heroImage} alt={svc.title} className="w-full h-full object-cover rounded-3xl" />
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-2xl relative overflow-hidden transform hover:scale-105 transition-all duration-300">
                    {/* Engagement Metrics Section */}
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-600 font-nexa-regular">Engagement Last 7 days</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-3xl font-bold text-gray-800">5.49K</span>
                          <div className="flex items-center text-green-500">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Mini Bar Chart */}
                      <div className="flex items-end space-x-1 h-8">
                        {[3, 5, 4, 7, 6, 8, 9].map((height, index) => (
                          <div
                            key={index}
                            className="bg-green-400 rounded-t-sm flex-1"
                            style={{ height: `${height * 0.8}rem` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    {/* Revenue Graph Section */}
                    <div className="mb-8">
                      <h4 className="text-sm font-medium text-gray-600 mb-4 font-nexa-regular">Revenue</h4>
                      <div className="relative h-32">
                        {/* SVG Line Graph */}
                        <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
                              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path
                            d="M0,80 Q50,60 100,40 T200,20 T300,30"
                            stroke="#8B5CF6"
                            strokeWidth="3"
                            fill="none"
                            className="drop-shadow-sm"
                          />
                          <path
                            d="M0,80 Q50,60 100,40 T200,20 T300,30 L300,100 L0,100 Z"
                            fill="url(#revenueGradient)"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* 3D Avatar Elements */}
                    <div className="absolute top-2 right-2 lg:top-4 lg:right-4 animate-pulse">
                      <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-sm lg:text-lg">✨</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Avatar */}
                    <div className="absolute bottom-2 left-2 lg:bottom-4 lg:left-4">
                      <div className="w-10 h-10 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                        <div className="w-6 h-6 lg:w-10 lg:h-10 bg-white rounded-full flex items-center justify-center">
                          <span className="text-sm lg:text-lg">👨</span>
                        </div>
                      </div>
                    </div>

                    {/* Megaphone Icon */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 12a7.971 7.971 0 00-1.343-4.243 1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                )}
              </RevealOnScroll>

              {!heroImage && (
                <div className="absolute -z-10 top-8 left-8 w-full h-full bg-gradient-to-br from-orange-100 to-yellow-100 rounded-3xl"></div>
              )}
            </div>
          </div>


          {/* Trusted Companies Section */}
          <div className="bg-white rounded-xl px-6 py-4 flex flex-col md:flex-row items-center md:items-center justify-between mb-16 border border-[#e5e2d8]">
            <div className="w-full md:w-1/3 text-left text-gray-700 text-lg font-nexa-regular mb-4 md:mb-0">
              Trusted by fast-growing<br />companies around the world
            </div>
            <div className="w-full md:w-2/3 overflow-hidden">
              <div className="flex items-center animate-scroll w-max flex-nowrap gap-12 sm:gap-16">
                {/* First set of logos */}
                {[
                  { src: "/images/clients_logos/1.png", alt: 'Logo 1' },
                  { src: "/images/clients_logos/2.png", alt: 'Logo 2' },
                  { src: "/images/clients_logos/13.png", alt: 'Logo 13' },
                  { src: '/images/himee ride.png', alt: 'Himee Ride' },
                  { src: '/images/kavvya.png', alt: 'Kavvya' },
                  { src: '/images/safal.png', alt: 'Safal' },
                  { src: '/images/kap.png', alt: 'KAP' },
                  { src: '/images/utkrasht.png', alt: 'Utkrasht' },
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
                  { src: "/images/clients_logos/Logo.png", alt: 'Logo' },
                  { src: "/images/clients_logos/LogoB.png", alt: 'Logo B' },
                ].map((logo, idx) => (
                  <div key={`first-${idx}`} className="w-[161px] h-[54px] flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="w-full h-full object-contain"
                      style={{ filter: logo.alt === 'Himee Ride' ? 'none' : 'none' }}
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {[
                  { src: "/images/clients_logos/1.png", alt: 'Logo 1' },
                  { src: "/images/clients_logos/2.png", alt: 'Logo 2' },
                  { src: "/images/clients_logos/13.png", alt: 'Logo 13' },
                  { src: '/images/himee ride.png', alt: 'Himee Ride' },
                  { src: '/images/kavvya.png', alt: 'Kavvya' },
                  { src: '/images/safal.png', alt: 'Safal' },
                  { src: '/images/kap.png', alt: 'KAP' },
                  { src: '/images/utkrasht.png', alt: 'Utkrasht' },
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
                  { src: "/images/clients_logos/Logo.png", alt: 'Logo' },
                  { src: "/images/clients_logos/LogoB.png", alt: 'Logo B' },
                ].map((logo, idx) => (
                  <div key={`second-${idx}`} className="w-[161px] h-[54px] flex items-center justify-center">
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="w-full h-full object-contain"
                      style={{ filter: logo.alt === 'Himee Ride' ? 'none' : 'none' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* We Help Solve Section */}
          <div className="text-center mb-16">
            <RevealOnScroll>
              <h2 className="text-4xl md:text-5xl font-serif text-[#0D1B2A] mb-12">
                We Help Solve
              </h2>
            </RevealOnScroll>

            <div className="max-w-4xl mx-auto space-y-6">
              {problems.map((item, idx) => {
                const key = `problem${idx + 1}`;
                return (
                  <div key={key} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div
                      className="p-6 flex items-center justify-between cursor-pointer"
                      onClick={() => toggleCard(key)}
                    >
                      <div className="flex items-center space-x-6">
                        <div className="w-12 h-12 bg-[#F26B2A] rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xl">{idx + 1}</span>
                        </div>
                        <p className="text-lg text-[#0D1B2A] font-nexa-regular">
                          {item.title}
                        </p>
                      </div>
                      <div className="text-[#F26B2A]">
                        <svg
                          className={`w-6 h-6 transition-transform duration-300 ${expandedCards[key] ? 'rotate-180' : ''}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {expandedCards[key] && (
                      <div className="px-6 pb-6 pt-0 border-t border-gray-100">
                        <div className="ml-18 pt-4 text-left space-y-2">
                          {item.details.map((line, lineIdx) => (
                            <p key={lineIdx} className="text-gray-600 font-nexa-regular leading-relaxed">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Our Approach Section */}
          <div className="text-center mb-16">
            <RevealOnScroll>
              <h2 className="text-4xl md:text-5xl font-serif text-[#0D1B2A] mb-16">
                Our Approach
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
              {approach.map((step, idx) => (
                <RevealOnScroll key={idx}>
                  <div className="group relative bg-white rounded-2xl p-8 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl h-full min-h-[280px]">
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                      <div className="w-16 h-16 bg-[#F26B2A] rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <span className="text-white font-bold text-2xl">{idx + 1}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-center text-center pt-4">
                      <h3 className="text-xl font-bold text-black mb-3 font-nexa-regular">
                        {step.title}
                      </h3>
                      {step.details.map((line, lineIdx) => (
                        <p key={lineIdx} className={`text-gray-600 text-sm leading-relaxed font-nexa-regular${lineIdx === 0 ? '' : ' mt-2'}`}>
                          {line}
                        </p>
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-0 rounded-2xl ring-0 ring-transparent group-hover:ring-2 group-hover:ring-orange-300/60 transition-all duration-300"></div>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          {/* Expected Outcomes Section */}
          <div className="text-center mb-16">
            <RevealOnScroll>
              <h2 className="text-4xl md:text-5xl font-serif text-[#0D1B2A] mb-16">
                Expected Outcomes
              </h2>
            </RevealOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto mb-12">
              {outcomes.items.map((text, idx) => {
                const icons = [
                  (
                    <svg className="w-8 h-8 text-[#F26B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  ),
                  (
                    <svg className="w-8 h-8 text-[#F26B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                    </svg>
                  ),
                  (
                    <svg className="w-8 h-8 text-[#F26B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                  ),
                  (
                    <svg className="w-8 h-8 text-[#F26B2A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                ];
                const icon = icons[idx % icons.length];
                return (
                  <div key={idx} className="flex items-center space-x-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                      {icon}
                    </div>
                    <div className="text-left">
                      <p className="text-lg text-[#0D1B2A] font-nexa-regular leading-tight">
                        {text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Call-to-Action Button */}
            <div className="flex justify-center">
              <button className="bg-gradient-to-r from-[#F26B2A] to-[#FFC107] text-white px-8 py-4 rounded-full font-nexa-bold text-lg flex items-center space-x-3 hover:shadow-lg transition-all duration-200 hover:scale-105">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <span>{outcomes.cta}</span>
              </button>
            </div>
          </div>

          {/* What sets us apart Section */}
          <div className="mb-8">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="flex flex-col lg:flex-row">
                {/* Left side - Color bars */}
                <div className="lg:w-8 flex lg:flex-col">
                  <div className="flex-1 lg:flex-none lg:h-24 bg-[#FF6B35]"></div>
                  <div className="flex-1 lg:flex-none lg:h-24 bg-[#FFD700]"></div>
                  <div className="flex-1 lg:flex-none lg:h-24 bg-[#4682B4]"></div>
                </div>

                {/* Right side - Content */}
                <div className="flex-1 p-8 lg:p-12">
                  <div className="flex items-start justify-between mb-6">
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#0D1B2A]" style={{ fontFamily: 'MADE Avenue PERSONAL USE' }}>
                      What sets us apart from others?
                    </h3>
                    <div className="flex space-x-1 ml-6">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-6 h-6 text-[#FF6B35]" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-lg md:text-xl leading-8 text-[#2C2C2C] max-w-5xl" style={{ fontFamily: 'NexaRegular' }}>
                    {differentiator.replace(/\n/g, ' ')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Client Feedback moved below container for full-width */}


        </div>
      </div>
      {/* Full-width Client Feedback section (outside padded container) */}
      <ClientFeedback introText={feedbackIntro} />
      {/* FAQ Section (moved after Client Feedback) */}
      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-5xl md:text-6xl font-serif text-[#0D1B2A] mb-10 md:mb-14">
            FAQ
          </h2>

          <div className="border-t border-[#D9D2C4]"></div>
          {faqItems.map((item, idx) => (
            <div key={idx}>
              <button
                type="button"
                className="w-full flex items-center justify-between py-5 md:py-6 text-left"
                onClick={() => toggleFaq(idx)}
                aria-expanded={openFaq[idx]}
              >
                <span className="text-[#0D1B2A] text-sm md:text-base font-medium">
                  {item.q}
                </span>
                <span className="text-[#0D1B2A] text-lg md:text-2xl leading-none select-none">
                  {openFaq[idx] ? '×' : '+'}
                </span>
              </button>
              {openFaq[idx] && (
                <div className="pb-6 text-[#2C2C2C] text-xs md:text-sm leading-6 md:leading-7">
                  {item.a}
                </div>
              )}
              <div className="border-t border-[#D9D2C4]"></div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Services;
