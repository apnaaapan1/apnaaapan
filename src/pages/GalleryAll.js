import React from 'react';

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

export default function GalleryAll() {
  const [images, setImages] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    let isMounted = true;

    async function fetchAll() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(getApiUrl('/api/gallery?all=true'));
        if (!res.ok) {
          throw new Error('Failed to fetch gallery');
        }
        const data = await res.json();
        if (isMounted) {
          setImages(Array.isArray(data.images) ? data.images : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load gallery');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAll();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#EFE7D5] px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
          <div>
            <h1 className="font-serif text-[#0D1B2A]" style={{fontWeight:700, fontSize:'clamp(34px,4.4vw,56px)'}}>
              All Gallery Images
            </h1>
            <p className="text-[#5B5B5B] mt-2 max-w-2xl" style={{fontSize:'clamp(14px,2vw,16px)'}}>
              Browse the full collection from our community events and adventures.
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
              <div key={i} className="h-48 sm:h-56 rounded-xl border border-black/20 bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : images.length ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {images.map((img, idx) => (
              <div key={img._id || idx} className="relative group rounded-xl border border-black/20 bg-white shadow-sm overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={`Gallery ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute top-2 left-2 px-2 py-1 text-xs font-semibold text-white rounded-full bg-black/60">
                  #{idx + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-[#5B5B5B] py-12" style={{fontSize:'15px'}}>
            No images yet. Check back soon!
          </div>
        )}
      </div>
    </main>
  );
}
