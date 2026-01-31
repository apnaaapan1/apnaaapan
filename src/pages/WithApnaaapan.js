import React from 'react';
import { Link } from 'react-router-dom';

// Use localhost:5000 in development (Express server), relative path in production (Vercel)
const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const WithApnaaapan = () => {
  const [galleryImages, setGalleryImages] = React.useState([]);
  const [blogs, setBlogs] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [suggestEventLink, setSuggestEventLink] = React.useState('#suggest');
  const [loadingBlogs, setLoadingBlogs] = React.useState(true);
  const [loadingGallery, setLoadingGallery] = React.useState(true);
  const [loadingEvents, setLoadingEvents] = React.useState(true);
  const [expandedEvents, setExpandedEvents] = React.useState({});

  // Fetch top 3 blogs
  React.useEffect(() => {
    let isMounted = true;
    async function fetchBlogs() {
      try {
        setLoadingBlogs(true);
        const res = await fetch(getApiUrl('/api/blogs'));
        if (!res.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await res.json();
        if (isMounted) {
          // Get only top 3 blogs
          setBlogs(Array.isArray(data.blogs) ? data.blogs.slice(0, 3) : []);
          setLoadingBlogs(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoadingBlogs(false);
        }
      }
    }
    fetchBlogs();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch gallery images
  React.useEffect(() => {
    let isMounted = true;
    async function fetchGallery() {
      try {
        setLoadingGallery(true);
        const res = await fetch(getApiUrl('/api/gallery'));
        if (!res.ok) {
          throw new Error('Failed to fetch gallery');
        }
        const data = await res.json();
        if (isMounted) {
          setGalleryImages(Array.isArray(data.images) ? data.images : []);
          setLoadingGallery(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoadingGallery(false);
        }
      }
    }
    fetchGallery();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch events
  React.useEffect(() => {
    let isMounted = true;
    async function fetchEvents() {
      try {
        setLoadingEvents(true);
        const res = await fetch(getApiUrl('/api/events'));
        if (!res.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await res.json();
        if (isMounted) {
          setEvents(Array.isArray(data.events) ? data.events : []);
          setLoadingEvents(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setLoadingEvents(false);
        }
      }
    }
    fetchEvents();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch suggest event link
  React.useEffect(() => {
    let isMounted = true;
    async function fetchSuggestLink() {
      try {
        const res = await fetch(getApiUrl('/api/settings?key=suggest_event_link'));
        if (!res.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await res.json();
        if (isMounted && data.setting?.value) {
          setSuggestEventLink(data.setting.value);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchSuggestLink();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <div className="min-h-screen bg-[#EFE7D5] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Hero Card */}
        <div className="relative rounded-[32px] bg-[#F6F0E0] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-white/40">
          {/* Global inner softness/vignette */}
          <div className="pointer-events-none absolute inset-0"
            style={{
              background: 'radial-gradient(120% 80% at 50% 45%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.75) 28%, rgba(255,255,255,0.35) 48%, rgba(255,255,255,0) 62%)',
              mixBlendMode: 'normal'
            }} />

          {/* Top-left bluish corner with soft inner white */}
          <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full"
            style={{ background: 'radial-gradient( circle at 30% 30%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 60%)', filter: 'blur(2px)' }} />
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full opacity-90"
            style={{ background: 'radial-gradient(circle at 35% 35%, #88A4E6 0%, rgba(136,164,230,0.6) 35%, rgba(136,164,230,0.0) 62%)', filter: 'blur(1.5px)' }} />

          {/* Bottom-left big yellow quarter-circle with white core */}
          <div className="pointer-events-none absolute -left-40 bottom-[-180px] h-[520px] w-[520px] rounded-full"
            style={{ background: 'radial-gradient(circle at 55% 55%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.0) 40%)', filter: 'blur(4px)' }} />
          <div className="pointer-events-none absolute -left-36 bottom-[-200px] h-[560px] w-[560px] rounded-full"
            style={{ background: 'radial-gradient(circle at 55% 55%, #FFC100 10%, rgba(255,193,0,0.85) 35%, rgba(255,193,0,0.35) 55%, rgba(255,193,0,0) 70%)', filter: 'blur(8px)' }} />

          {/* Right big orange ellipse with soft white center and feathered edge */}
          <div className="pointer-events-none absolute -right-28 -top-6 h-[640px] w-[460px] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 45% 45%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.0) 45%)', filter: 'blur(6px)' }} />
          <div className="pointer-events-none absolute -right-24 -top-8 h-[640px] w-[460px] rounded-full"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(240,95,40,0.95) 25%, rgba(240,95,40,0.65) 45%, rgba(240,95,40,0.25) 60%, rgba(240,95,40,0) 72%)', filter: 'blur(6px)' }} />

          {/* Content */}
          <div className="relative z-10 px-6 sm:px-12 lg:px-24 py-20 md:py-28 text-center">
            <h1 className="font-serif text-[#0D1B2A] leading-tight mx-auto max-w-3xl"
              style={{ fontWeight: 700, fontSize: 'clamp(36px,5vw,72px)' }}>
              Where Curiosity
            </h1>
            <h2 className="font-serif leading-tight mx-auto max-w-3xl mt-3"
              style={{
                fontWeight: 700, fontSize: 'clamp(36px,5vw,72px)',
                background: 'linear-gradient(90deg, #E65522 0%, #F9C219 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent'
              }}>
              Finds Its Tribe
            </h2>

            <p className="mt-8 text-[#5B5B5B] max-w-xl mx-auto leading-relaxed"
              style={{ fontSize: 'clamp(14px,2.2vw,18px)' }}>
              Apnaaapan is a space where curiosity thrives and connections grow
            </p>

            <div className="mt-10">
              <a href="#join" className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-white font-semibold shadow-lg hover:shadow-xl active:scale-[0.99] transition"
                style={{ background: 'linear-gradient(90deg, #E86C21 0%, #F8C31A 100%)' }}>
                <span className="text-white">⭐</span>
                <span>Be a Part</span>
              </a>
            </div>
          </div>

          {/* Card padding bottom to show gradient fade */}
          <div className="h-10" />
        </div>
      </div>

      {/* Concentric Circles Section */}
      <section className="mt-20">
        <div className="relative mx-auto" style={{ width: 'min(740px, 88vw)', height: 'min(740px, 88vw)' }}>
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.35) 22%, rgba(29,12,69,0.65) 52%, rgba(29,12,69,1) 60%, rgba(29,12,69,0.85) 66%, rgba(255,255,255,0.75) 90%, rgba(255,255,255,0) 100%)',
              filter: 'blur(0.5px)'
            }} />

          {/* Deep blue ring */}
          <div className="absolute inset-[11%] rounded-full"
            style={{
              background: 'radial-gradient(circle, #2D2A7A 56%, #1E1A52 60%, rgba(14,8,40,0.95) 78%, rgba(14,8,40,0.6) 100%)'
            }} />

          {/* Middle cyan ring */}
          <div className="absolute inset-[21%] rounded-full overflow-hidden">
            <div className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at 50% 50%, rgba(0,188,212,0.28) 28%, rgba(0,188,212,0.14) 52%, rgba(0,188,212,0.08) 68%, rgba(0,188,212,0.0) 82%)'
              }} />
            <div className="absolute inset-[2%] rounded-full"
              style={{
                border: '1px solid rgba(255,255,255,0.35)'
              }} />
          </div>

          {/* Bright aqua ring */}
          <div className="absolute inset-[30.5%] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0,196,255,0.75) 33%, rgba(0,196,255,0.35) 53%, rgba(0,196,255,0.14) 70%, rgba(0,196,255,0) 86%)'
            }} />

          {/* Inner green disc */}
          <div className="absolute inset-[41.5%] rounded-full flex items-center justify-center"
            style={{
              background: 'radial-gradient(circle at 50% 35%, #39C7A5 0%, #2FB9A2 45%, #169D8E 78%)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.45), 0 20px 50px rgba(0,0,0,0.22)'
            }}>
            <div className="text-white text-[clamp(32px,5.5vw,64px)] font-serif font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.3)' }}>What</div>
          </div>

          {/* How label - sits on cyan ring */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[26%] text-white text-[clamp(28px,4.2vw,48px)] font-serif font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)' }}>How</div>

          {/* WHY label - sits on outer ring */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[6%] text-white text-[clamp(30px,4.5vw,52px)] font-serif font-bold" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)' }}>WHY</div>

          {/* Speech bubble - top right (WHY) */}
          <div className="absolute bottom-[-10%] right-[4%] bg-white rounded-2xl shadow-xl w-[50vw] md:w-[min(340px,74vw)] p-2 md:p-4 border-2 border-[#1E1A52]">
            <div className="absolute -top-4 left-12 w-0 h-0 border-l-[14px] border-l-transparent border-b-[18px] border-b-white border-r-[14px] border-r-transparent" />
            <div className="absolute -top-[21px] left-[45px] w-0 h-0 border-l-[16px] border-l-transparent border-b-[20px] border-b-[#1E1A52] border-r-[16px] border-r-transparent" />
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <span className="inline-block px-1.5 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-[#1E1A52] to-[#2D2A7A] text-white text-[9px] md:text-xs font-bold rounded-full">WHY</span>
            </div>
            <p className="text-[#5B5B5B] leading-snug md:leading-relaxed text-[10px] md:text-[15px]">Because in all the noise of creating and scaling, we lost the space to stay curious and truly alive.</p>
          </div>

          {/* Speech bubble - left middle (WHAT) */}
          <div className="absolute left-[-5%] top-[35%] -translate-y-1/2 bg-white rounded-2xl shadow-xl w-[50vw] md:w-[min(360px,76vw)] p-2 md:p-4 border-2 border-[#39C7A5]">
            <div className="absolute top-1/2 -right-4 -translate-y-1/2 w-0 h-0 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent border-l-[18px] border-l-white" />
            <div className="absolute top-1/2 -right-[21px] -translate-y-1/2 w-0 h-0 border-t-[14px] border-t-transparent border-b-[14px] border-b-transparent border-l-[20px] border-l-[#39C7A5]" />
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <span className="inline-block px-1.5 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-[#39C7A5] to-[#2FB9A2] text-white text-[9px] md:text-xs font-bold rounded-full">WHAT</span>
            </div>
            <p className="text-[#5B5B5B] leading-snug md:leading-relaxed text-[10px] md:text-[15px]">A living community built on questions, contradictions, and moments of clarity that don't fade.</p>
          </div>

          {/* Speech bubble - bottom right (HOW) */}
          <div className="absolute top-[2%] right-[6%] bg-white rounded-2xl shadow-xl w-[50vw] md:w-[min(340px,74vw)] p-2 md:p-4 border-2 border-[#00C4FF]">
            <div className="absolute -bottom-4 right-12 w-0 h-0 border-l-[14px] border-l-transparent border-t-[18px] border-t-white border-r-[14px] border-r-transparent" />
            <div className="absolute -bottom-[21px] right-[45px] w-0 h-0 border-l-[16px] border-l-transparent border-t-[20px] border-t-[#00C4FF] border-r-[16px] border-r-transparent" />
            <div className="flex items-center gap-2 mb-1 md:mb-2">
              <span className="inline-block px-1.5 py-0.5 md:px-3 md:py-1 bg-gradient-to-r from-[#00C4FF] to-[#00BCDC] text-white text-[9px] md:text-xs font-bold rounded-full">HOW</span>
            </div>
            <p className="text-[#5B5B5B] leading-snug md:leading-relaxed text-[10px] md:text-[15px]">Through playful experiments, messy collaboration, and spaces that help you ask better questions, not rush to answers.</p>
          </div>
        </div>
      </section>



      {/* Curiosity Manifesto Section */}
      <section className="mt-24 mb-24">
        <style>{`
          .flip-card {
            perspective: 1000px;
          }
          .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 0.6s;
            transform-style: preserve-3d;
          }
          .flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
          }
          .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
          }
          .flip-card-back {
            transform: rotateY(180deg);
          }
        `}</style>
        <div className="max-w-6xl mx-auto text-center px-2">
          <h3 className="font-serif text-[#0D1B2A] mb-10" style={{ fontWeight: 700, fontSize: 'clamp(28px,3.5vw,44px)' }}>
            The Curiosity Manifesto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 place-items-center">
            {/* Card: What */}
            <div className="flip-card" style={{ width: 'min(340px,86vw)', height: '420px' }}>
              <div className="flip-card-inner rounded-3xl" style={{ background: '#E24E15' }}>
                {/* Front */}
                <div className="flip-card-front flex items-center justify-center relative shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-3xl" style={{ background: '#E24E15' }}>
                  <div className="absolute left-6 top-5 text-white/90 select-none" style={{ fontSize: '54px', lineHeight: 1 }}>""</div>
                  <div className="absolute right-6 bottom-5 text-white/90 rotate-180 select-none" style={{ fontSize: '54px', lineHeight: 1 }}>""</div>
                  <div className="text-white font-serif text-center" style={{ lineHeight: '1.8' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: 'clamp(22px,3.2vw,36px)' }}>WHAT</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>Not a brand.</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>Not a club.</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>A live wire of curiosity.</div>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back flex items-center justify-center p-6 rounded-3xl" style={{ background: '#E24E15' }}>
                  <div className="text-white font-serif text-center" style={{ fontSize: 'clamp(14px,2vw,16px)', lineHeight: '1.6' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>WHAT</div>
                    <div>with.apnaaapan is a community built on questions, contradictions, and uncomfortable clarity.</div>
                    <div style={{ marginTop: '0.8rem' }}>We don't chase the algorithm.</div>
                    <div>We chase the moment something clicks and refuses to go back to how it was.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Why */}
            <div className="flip-card" style={{ width: 'min(340px,86vw)', height: '420px' }}>
              <div className="flip-card-inner rounded-3xl" style={{ background: '#5C80C3' }}>
                {/* Front */}
                <div className="flip-card-front flex items-center justify-center relative shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-3xl" style={{ background: '#5C80C3' }}>
                  <div className="absolute left-6 top-5 text-white/90 select-none" style={{ fontSize: '54px', lineHeight: 1 }}>""</div>
                  <div className="absolute right-6 bottom-5 text-white/90 rotate-180 select-none" style={{ fontSize: '54px', lineHeight: 1 }}>""</div>
                  <div className="text-white font-serif text-center" style={{ lineHeight: '1.8' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: 'clamp(22px,3.2vw,36px)' }}>WHY</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>Because everything felt loud.</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>And yet, nothing felt alive.</div>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back flex items-center justify-center p-6 rounded-3xl" style={{ background: '#5C80C3' }}>
                  <div className="text-white font-serif text-center" style={{ fontSize: 'clamp(14px,2vw,16px)', lineHeight: '1.6' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>WHY</div>
                    <div>The timelines were full, but empty.</div>
                    <div style={{ marginTop: '0.8rem' }}>Everyone was creating, posting, scaling but no one was cracking open anymore.</div>
                    <div style={{ marginTop: '0.8rem' }}>We missed curiosity. The kind that asks why even when it feels awkward.</div>
                    <div style={{ marginTop: '0.8rem' }}>So this became a place for that version of you, the one who doesn't pretend to know.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card: How */}
            <div className="flip-card" style={{ width: 'min(340px,86vw)', height: '420px' }}>
              <div className="flip-card-inner rounded-3xl" style={{ background: '#F2BC09' }}>
                {/* Front */}
                <div className="flip-card-front flex items-center justify-center relative shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-3xl" style={{ background: '#F2BC09' }}>
                  <div className="absolute left-6 top-5 text-white/90 select-none" style={{ fontSize: '54px', lineHeight: 1 }}>""</div>
                  <div className="absolute right-6 bottom-5 text-white/90 rotate-180 select-none" style={{ fontSize: '54px', lineHeight: 1 }}>""</div>
                  <div className="text-white font-serif text-center" style={{ lineHeight: '1.8' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '1.5rem', fontSize: 'clamp(22px,3.2vw,36px)' }}>HOW</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>By playing first.</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>Pausing next.</div>
                    <div style={{ fontSize: 'clamp(16px,2.5vw,20px)' }}>And pulling things apart.</div>
                  </div>
                </div>
                {/* Back */}
                <div className="flip-card-back flex items-center justify-center p-6 rounded-3xl" style={{ background: '#F2BC09' }}>
                  <div className="text-white font-serif text-center" style={{ fontSize: 'clamp(14px,2vw,16px)', lineHeight: '1.6' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '1rem' }}>HOW</div>
                    <div>This isn't plug-and-play self-improvement.</div>
                    <div style={{ marginTop: '0.8rem' }}>It's messy workshops, ruined plans, sticky notes everywhere, and "idk but let's try."</div>
                    <div style={{ marginTop: '0.8rem' }}>Labs, not lecture halls. Collabs that feel like experiments.</div>
                    <div style={{ marginTop: '0.8rem' }}>We don't hand you answers, we make you ask better questions.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mb-28">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h3 className="font-serif text-[#0D1B2A]" style={{ fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)' }}>
              Gallery
            </h3>
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full px-4 sm:px-5 py-2 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.99] transition"
              style={{ background: 'linear-gradient(90deg,#E86C21 0%, #F6BE18 100%)' }}
            >
              <span>See All</span>
              <span aria-hidden>➜</span>
            </Link>
          </div>

          {/* Grid with quotes */}
          <div className="relative">
            {/* Decorative quotes positioned to match mock */}
            <div className="absolute -top-6 -left-6 text-[#D24E1D] select-none" style={{ fontSize: '52px' }}>“</div>
            <div className="absolute -bottom-8 -right-2 text-[#D24E1D] select-none rotate-180" style={{ fontSize: '52px' }}>“</div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {loadingGallery ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-black/30 bg-gray-200 animate-pulse h-[220px] sm:h-[240px]"></div>
                ))
              ) : (
                Array.from({ length: 8 }).map((_, i) => {
                  const img = galleryImages[i];
                  return (
                    <div key={i} className="rounded-xl border border-black/30 bg-white/70 shadow-sm overflow-hidden h-[220px] sm:h-[240px]">
                      {img ? (
                        <img src={img.imageUrl} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* What's Next Section */}
      <section className="mt-2 mb-24">
        <div className="max-w-6xl mx-auto px-2">
          <h3 className="font-serif text-[#0D1B2A] mb-8" style={{ fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)' }}>
            What Happened
          </h3>

          {loadingEvents ? (
            <div className="text-center py-12 text-gray-600">Loading events...</div>
          ) : events.length > 0 ? (
            <div className="relative">
              {/* Continuous timeline line for all events */}
              {events.length > 1 && (
                <div className="hidden md:block absolute left-[14px] top-0 bottom-0 w-0.5 border-l-2 border-dashed border-black/25 pointer-events-none" />
              )}

              <div className="space-y-12">
                {events.map((event, idx) => (
                  <div key={event._id} className="relative grid grid-cols-1 md:grid-cols-[140px_1fr] gap-8">
                    {/* Date - aligned to top */}
                    <div className="hidden md:block relative pl-8">
                      <span className="absolute left-0 top-0 w-2.5 h-2.5 rounded-full bg-black/70 z-10" />
                      <div className="text-[#2E2E2E] text-sm">{event.date}</div>
                    </div>

                    {/* Event Card */}
                    <div>
                      <div className="relative rounded-2xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-black/10 overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-4 px-6 py-5">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="text-2xl leading-none flex-shrink-0 mt-0.5">{event.emoji}</div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-serif text-[#0D1B2A]" style={{ fontWeight: 700, fontSize: 'clamp(18px,2.4vw,24px)' }}>
                                {event.title}
                              </h4>
                              <div className="text-[#5B5B5B] mt-1" style={{ fontSize: '13px' }}>By {event.author}</div>
                            </div>
                          </div>

                          <button
                            onClick={() => toggleEventExpansion(event._id)}
                            className="ml-auto sm:ml-0 inline-flex items-center gap-2 rounded-full px-5 py-2 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.99] transition whitespace-nowrap text-sm flex-shrink-0"
                            style={{ background: 'linear-gradient(90deg,#E86C21 0%, #F6BE18 100%)' }}
                          >
                            <span className="text-white">➤</span>
                            <span>{expandedEvents[event._id] ? 'READ LESS' : 'READ MORE'}</span>
                          </button>
                        </div>

                        {/* Content with proper height management */}
                        <div
                          className="px-6 pb-8 text-[#2C2C2C] leading-relaxed transition-all duration-300 overflow-hidden"
                          style={{
                            fontSize: 'clamp(15px,1.8vw,17px)',
                            maxHeight: expandedEvents[event._id] ? '1500px' : '3.6em',
                            lineHeight: '1.7'
                          }}
                        >
                          {event.content.map((paragraph, pIdx) => (
                            <p key={pIdx} className="break-words" style={{ marginBottom: pIdx < event.content.length - 1 ? '0.8rem' : '0' }}>
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Row */}
              <div className="flex justify-center pt-8 mt-12">
                <a
                  href={suggestEventLink}
                  target={suggestEventLink.startsWith('http') ? '_blank' : '_self'}
                  rel={suggestEventLink.startsWith('http') ? 'noopener noreferrer' : ''}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.99] transition"
                  style={{ background: 'linear-gradient(90deg,#E86C21 0%, #F6BE18 100%)' }}
                >
                  <span>Suggest an Event</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              No events yet. Check back soon!
            </div>
          )}
        </div>
      </section>

      {/* Curiosity Challenge - final section */}
      <section className="mt-10 mb-28">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          <h3 className="text-center font-serif text-[#0D1B2A] mb-10" style={{ fontWeight: 700, fontSize: 'clamp(32px,4vw,56px)' }}>
            Curiosity Challenge
          </h3>

          <div className="grid grid-cols-1 md:[grid-template-columns:minmax(0,1fr)_minmax(0,1.6fr)] gap-8 items-start">
            {/* Left Card */}
            <div className="rounded-[20px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/10 p-8 md:p-9 md:min-h-[260px]">
              <div className="font-serif text-[#0D1B2A] leading-tight mb-4" style={{ fontWeight: 700, fontSize: 'clamp(24px,3vw,34px)' }}>
                What are you curious about today?
              </div>
              <p className="text-[#4F4F4F] leading-relaxed mb-8" style={{ fontSize: 'clamp(14px,2vw,16px)' }}>
                Not what you know.<br />
                Not what you're good at.<br />
                What's pulling at you quietly?
              </p>
              <button className="inline-flex items-center justify-center w-[200px] h-[46px] rounded-full text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.99] transition"
                style={{ background: 'linear-gradient(90deg,#E86C21 0%, #F6BE18 100%)' }}>
                I’m In!
              </button>
            </div>

            {/* Right Card */}
            <div className="rounded-[20px] bg-white shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/10 p-8 md:p-10 md:min-h-[360px]">
              <div className="font-serif text-[#0D1B2A] leading-tight mb-4" style={{ fontWeight: 700, fontSize: 'clamp(24px,3vw,34px)' }}>
                Be a Part
              </div>
              <ul className="text-[#4F4F4F] space-y-2 mb-5" style={{ fontSize: '14px' }}>
                <li className="flex items-start gap-2"><span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#111]" /> Connect with curious minds</li>
                <li className="flex items-start gap-2"><span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#111]" /> Join conversations that don't rush to conclusions</li>
                <li className="flex items-start gap-2"><span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-[#111]" /> Build, contribute, and lead projects together</li>
              </ul>

              {/* Roles */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-5 text-sm text-[#222]">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#E86C21]" /> Member
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#C0C0C0]" /> Collaborator
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <span className="w-2 h-2 rounded-full bg-[#C0C0C0]" /> Volunteer
                </label>
              </div>

              {/* Email + CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 w-full rounded-full border border-black/10 bg-white px-3 py-2.5">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#9E9E9E]">
                      <path d="M4 6h16v12H4z" stroke="#9E9E9E" strokeWidth="1.5" />
                      <path d="M4 7l8 6 8-6" stroke="#9E9E9E" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input type="email" placeholder="Email address" className="w-full outline-none text-sm placeholder-[#9E9E9E]" />
                  </div>
                </div>
                <button className="sm:w-[170px] inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-white font-semibold shadow-md hover:shadow-lg active:scale-[0.99] transition"
                  style={{ background: 'linear-gradient(90deg,#E86C21 0%, #F6BE18 100%)' }}>
                  Join now
                  <span>➝</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog / Stories Section */}
      <section className="mt-8 mb-28">
        <div className="max-w-7xl mx-auto px-2 sm:px-4">
          {/* Header row */}
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <h3 className="font-serif text-[#0D1B2A]" style={{ fontWeight: 700, fontSize: 'clamp(28px,3.8vw,48px)' }}>
                Blog / Stories
              </h3>
              <p className="text-[#353535] opacity-70 mt-2" style={{ fontSize: 'clamp(13px,2vw,16px)' }}>
                Latest stories and insights from our community
              </p>
            </div>
            <a
              href="/blog"
              className="text-[#D24E1D] underline underline-offset-4 hover:opacity-80"
              style={{ fontSize: 'clamp(14px,2vw,18px)' }}
            >
              See All
            </a>
          </div>

          {/* Cards */}
          {loadingBlogs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="animate-pulse">
                  <div className="rounded-xl bg-gray-200 h-[360px]"></div>
                  <div className="mt-4 h-4 bg-gray-200 rounded w-16"></div>
                  <div className="mt-2 h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="mt-2 h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article key={blog._id} className="group cursor-pointer" onClick={() => window.location.href = `/blog/${blog.slug}`}>
                  <div className="rounded-xl bg-white/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.05)] overflow-hidden">
                    <div className="h-[360px] bg-gradient-to-br from-orange-100 to-yellow-100 rounded-xl overflow-hidden">
                      {(blog.heroImage || blog.image) && (
                        <img
                          src={blog.heroImage || blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-4 text-[#6F6F6F] text-sm">{blog.readTime || '5 Min'}</div>
                  <h4 className="mt-2 font-serif text-[#0D1B2A] leading-snug group-hover:text-[#D24E1D] transition-colors"
                    style={{ fontWeight: 600, fontSize: 'clamp(18px,2.4vw,22px)' }}>
                    {blog.title}
                  </h4>
                  <p className="mt-2 text-[#6F6F6F] text-sm leading-relaxed max-w-md line-clamp-3">
                    {blog.excerpt || (Array.isArray(blog.content) && blog.content.length > 0 ? blog.content[0].substring(0, 150) + '...' : '')}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-[#6F6F6F]">
              <p>No blogs available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default WithApnaaapan;


