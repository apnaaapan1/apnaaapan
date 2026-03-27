import React, { useEffect, useState } from 'react';

const getApiUrl = (endpoint) => {
  // Always hit the Express API on localhost (even if NODE_ENV is 'production')
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const isLocalhost = host === 'localhost' || host === '127.0.0.1' || host === '::1';
  if (isLocalhost) return `http://localhost:5000${endpoint}`;
  return endpoint;
};

export default function GraphicPortfolio() {
  const [graphics, setGraphics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function fetchGraphics() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(getApiUrl('/api/graphics'));
        if (!res.ok) throw new Error('Failed to fetch graphics');
        const data = await res.json();
        if (mounted) {
          setGraphics(Array.isArray(data.graphics) ? data.graphics : []);
        }
      } catch (err) {
        if (mounted) setError(err.message || 'Unable to load graphics');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchGraphics();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#EFE7D5]">
      {/* Our Recent Graphics Section */}
      <section className="relative px-4 md:px-8 py-16 md:py-32">
        {/* Background decorative lines */}
        <div className="absolute left-0 top-0 w-full h-full pointer-events-none">
          <div className="absolute left-8 top-0 w-px h-full bg-gray-300">
            <div className="absolute left-0 top-0 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300"></div>
          </div>
          <div className="absolute right-8 top-0 w-px h-full bg-gray-300">
            <div className="absolute right-0 top-0 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-300"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4 md:mb-8 leading-tight">
            <span className="text-[#1a365d]">Our recent</span>{' '}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              graphics
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="text-sm sm:text-base md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto space-y-2 md:space-y-4">
            <p>Creative designs crafted with precision and purpose.</p>
            <p>Visual storytelling. Brand identity. Design excellence.</p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-10 hidden">
          <div>
            <h1
              className="font-serif text-[#0D1B2A]"
              style={{ fontWeight: 700, fontSize: 'clamp(34px,4.4vw,56px)' }}
            >
              Graphic Portfolio
            </h1>
            <p className="text-[#5B5B5B] mt-2 max-w-2xl" style={{ fontSize: 'clamp(14px,2vw,16px)' }}>
              A curated selection of design and creative graphics.
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-44 sm:h-52 rounded-xl border border-black/20 bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : graphics.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {graphics.map((g, idx) => (
              <article
                key={g.id || idx}
                className="rounded-xl border border-black/10 bg-white/70 shadow-sm overflow-hidden"
              >
                <div className="p-2 sm:p-3">
                  <div className="rounded-lg overflow-hidden bg-white border border-black/10">
                    <img
                      src={g.imageUrl}
                      alt={g.title || `Graphic ${idx + 1}`}
                      className="w-full h-auto object-contain bg-white"
                      loading="lazy"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#5B5B5B] py-12" style={{ fontSize: '15px' }}>
            No graphics yet. Check back soon!
          </div>
        )}
      </div>
    </main>
  );
}

