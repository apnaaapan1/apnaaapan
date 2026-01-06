import React, { useEffect, useMemo, useState } from 'react';

const Work = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Build API URL similarly to AdminPanel without altering UI
  const getApiUrl = (endpoint) => {
    if (process.env.NODE_ENV === 'production') {
      return endpoint;
    }
    return `http://localhost:5000${endpoint}`;
  };

  useEffect(() => {
    let mounted = true;
    const fetchWork = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(getApiUrl('/api/work'));
        if (!res.ok) {
          throw new Error('Failed to load work posts');
        }
        const data = await res.json();
        if (mounted) {
          setProjects(Array.isArray(data.work) ? data.work : []);
        }
      } catch (e) {
        if (mounted) {
          setError(e.message || 'Unable to fetch work posts');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchWork();
    return () => { mounted = false; };
  }, []);

  // Helper to normalize category values for uniqueness/filtering
  const normalizeCategory = (c) => (c || '').trim().toLowerCase().replace(/\s+/g, ' ');

  // Build categories dynamically from projects, de-duplicated by normalized value, keep 'All'
  const categories = useMemo(() => {
    const map = new Map(); // normalized -> display label (first seen)
    projects.forEach((p) => {
      (p.categories || []).forEach((label) => {
        const norm = normalizeCategory(label);
        if (norm && !map.has(norm)) {
          map.set(norm, label);
        }
      });
    });
    return ['All', ...Array.from(map.values())];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return projects;
    const target = normalizeCategory(activeFilter);
    return projects.filter((project) =>
      (project.categories || []).some((c) => normalizeCategory(c) === target)
    );
  }, [projects, activeFilter]);

  const handleFilterClick = (category) => {
    setActiveFilter(category);
  };

  return (
    <>
      {/* Our Recent Work Section */}
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
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Title */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4 md:mb-8 leading-tight">
            <span className="text-[#1a365d]">Our recent</span>{' '}
            <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
              work
            </span>
          </h1>
          
          {/* Subtitle */}
          <div className="text-sm sm:text-base md:text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto space-y-2 md:space-y-4">
          
            <p>A glimpse into the brands we've partnered with.</p>
            <p>Different industries. Different goals.</p>
            <p>One shared focus, doing work that feels intentional and delivers real movement.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Filter Section */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Filter Navigation */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleFilterClick(category)}
                className={`px-6 py-3 rounded-full font-medium text-sm transition-all duration-200 ${
                  activeFilter === category
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-400 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Error/Loading states (UI spacing preserved) */}
          {error && (
            <div className="text-center mb-6">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto px-2 md:px-0">
            {loading && (
              <div className="col-span-1 md:col-span-2 text-center text-gray-600">Loading...</div>
            )}
            {!loading && filteredProjects.map((project) => (
              <div key={project.id} className="animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-video bg-gray-200 relative overflow-hidden">
                    <img 
                      src={project.image} 
                      alt={project.alt || project.title} 
                      className="w-full h-full object-cover transform transition-transform duration-500 ease-out group-hover:scale-110"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-1 md:mb-2">{project.title}</h3>
                  <p className="text-gray-600 text-sm md:text-base mb-3 md:mb-4">{project.description}</p>
                                       <div className="flex flex-wrap gap-2">
                       {(project.tags || []).map((tag, index) => (
                         <span 
                           key={index}
                           className="px-3 py-1 bg-orange-500 text-white text-xs rounded-full"
                         >
                           {tag}
                         </span>
                       ))}
                     </div>
                </div>
              </div>
            ))}
          </div>

          {/* No projects message */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No projects found for the selected category.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Work;
