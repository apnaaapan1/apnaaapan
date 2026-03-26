import React, { useEffect, useState } from 'react';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

export default function Videos() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function fetchVideos() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(getApiUrl('/api/videos'));
        if (!res.ok) {
          throw new Error('Failed to fetch videos');
        }
        const data = await res.json();
        if (isMounted) {
          setVideos(Array.isArray(data.videos) ? data.videos : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load videos');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchVideos();
    return () => {
      isMounted = false;
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
              Portfolio
            </h1>
            <p className="text-[#5B5B5B] mt-2 max-w-2xl" style={{ fontSize: 'clamp(14px,2vw,16px)' }}>
              Watch our latest updates directly from Cloudinary.
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-6 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-64 md:h-72 rounded-2xl border border-black/20 bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        ) : videos.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {videos.map((v, idx) => (
              <article
                key={v.id || idx}
                className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-black/10 overflow-hidden"
              >
                <div className="p-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{v.title}</h2>
                  <div className="rounded-xl bg-black/5 border border-black/10 overflow-hidden">
                    <video
                      controls
                      src={v.videoUrl}
                      className="w-full h-auto max-h-72 bg-black/5"
                      preload="metadata"
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#5B5B5B] py-12" style={{ fontSize: '15px' }}>
            No portfolio items yet. Check back soon!
          </div>
        )}
      </div>
    </main>
  );
}

