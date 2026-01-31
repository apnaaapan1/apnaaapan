import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Use localhost:5000 in development (Express server), relative path in production (Vercel)
const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  // In development, use Express server on port 5000
  return `http://localhost:5000${endpoint}`;
};

const BlogDetail = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function fetchPost() {
      try {
        setLoading(true);
        setError('');
        const res = await fetch(getApiUrl(`/api/blogs?slug=${encodeURIComponent(slug)}`));
        if (!res.ok) {
          if (res.status === 404) {
            if (isMounted) {
              setPost(null);
              setLoading(false);
            }
            return;
          }
          throw new Error('Failed to load blog');
        }
        const data = await res.json();
        if (isMounted) {
          setPost(data.blog || null);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Unable to load this blog right now.');
          setLoading(false);
        }
      }
    }
    fetchPost();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <main className="bg-[#EFE7D5] min-h-screen">
        <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-10 py-24 md:py-32">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4">Loading...</h1>
          <p className="text-gray-700">Please wait while we load this blog post.</p>
        </section>
      </main>
    );
  }

  if (error || !post) {
    return (
      <main className="bg-[#EFE7D5] min-h-screen">
        <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-10 py-24 md:py-32">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4">
            {error ? 'Something went wrong' : 'Blog not found'}
          </h1>
          <p className="text-gray-700 mb-8">
            {error || 'The blog you are looking for does not exist or has been moved.'}
          </p>
          <a href="/blog" className="text-[#0D1B2A] underline">Back to Blog</a>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[#EFE7D5] min-h-screen">
      <article className="max-w-4xl mx-auto px-6 md:px-8 lg:px-10 py-24 md:py-32">
        <div className="mb-6">
          <div className="text-gray-500 text-sm font-medium mb-2">{post.readTime}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0D1B2A] mb-4">{post.title}</h1>
        </div>
        {post.heroImage ? (
          <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
            <img src={post.heroImage} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
          </div>
        ) : null}
        <div className="prose prose-lg max-w-none text-[#2C2C2C]">
          <p className="whitespace-pre-wrap leading-relaxed">
            {Array.isArray(post.content) ? post.content.join(' ') : post.content}
          </p>
        </div>
        <div className="mt-10">
          <a href="/blog" className="inline-block text-[#0D1B2A] hover:underline">← Back to Blog</a>
        </div>
      </article>
    </main>
  );
};

export default BlogDetail;





