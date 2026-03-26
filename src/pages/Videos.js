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
    <main className="min-h-screen bg-[#EFE7D5] px-4 sm:px-6 lg:px-6 py-12">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 max-w-7xl mx-auto">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-black/20 bg-gray-200 animate-pulse overflow-hidden"
              />
            ))}
          </div>
        ) : videos.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 lg:gap-4 max-w-7xl mx-auto">
            {videos.map((v, idx) => (
              <article
                key={v.id || idx}
                className="bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-black/10 overflow-hidden"
              >
                <div className="p-3">
                  {/* Instagram-like vertical frame (no cropping) */}
                  <div className="aspect-[9/16] rounded-xl overflow-hidden bg-black border border-black/10">
                    <video
                      controls
                      src={v.videoUrl}
                      className="w-full h-full object-contain bg-black"
                      preload="metadata"
                      playsInline
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

