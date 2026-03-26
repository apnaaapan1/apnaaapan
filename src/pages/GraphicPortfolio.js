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
    <main className="min-h-screen bg-[#EFE7D5] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-10">
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
                <div className="p-3">
                  <div className="rounded-lg overflow-hidden bg-white border border-black/10">
                    <img
                      src={g.imageUrl}
                      alt={g.title || `Graphic ${idx + 1}`}
                      className="w-full h-44 sm:h-52 object-contain bg-white"
                      loading="lazy"
                    />
                  </div>
                  {g.title && (
                    <h2 className="mt-3 text-sm font-semibold text-[#0D1B2A] line-clamp-2">
                      {g.title}
                    </h2>
                  )}
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

