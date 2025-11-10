import React from 'react';

const blogPosts = {
  'the-power-of-social-media-for-your-brand': {
    title: 'The Power of Social Media for Your Brand',
    readTime: '10 Min',
    heroImage: '/images/work/Tsczi1maYoHHENT2Fu6ychsMM 1.png',
    content: [
      'Social media has transformed the way brands connect with audiences. From real-time engagement to storytelling, it enables brands to build trust, authority, and loyalty at scale.',
      'A strong content strategy focuses on clarity, consistency, and community. Use a blend of educational posts, behind-the-scenes content, and interactive elements like polls and Q&As.',
      'Measure what matters: track awareness (reach and impressions), engagement (comments, shares, saves), and conversion (traffic and leads). Iterate based on performance.',
    ],
  },
  'from-likes-to-loyalty': {
    title: 'From Likes to Loyalty',
    readTime: '10 Min',
    heroImage: '/images/istockphoto-104251890-612x612 1.png',
    content: [
      'It’s not about vanity metrics. Sustainable growth comes from nurturing real relationships and delivering value at every touchpoint.',
      'Turn engagement into advocacy by recognizing your audience, responding quickly, and creating moments worth sharing.',
      'Build a retention loop: useful content → participation → recognition → belonging. Loyalty follows naturally.',
    ],
  },
};

const BlogDetail = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/';
  const slug = path.startsWith('/blog/') ? path.replace('/blog/', '') : '';
  const post = blogPosts[slug];

  if (!post) {
    return (
      <main className="bg-[#EFE7D5] min-h-screen">
        <section className="max-w-4xl mx-auto px-6 md:px-8 lg:px-10 py-24 md:py-32">
          <h1 className="text-3xl md:text-4xl font-bold text-[#0D1B2A] mb-4">Blog not found</h1>
          <p className="text-gray-700 mb-8">The blog you are looking for does not exist or has been moved.</p>
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
          {post.content.map((paragraph, idx) => (
            <p key={idx} className="mb-6">{paragraph}</p>
          ))}
        </div>
        <div className="mt-10">
          <a href="/blog" className="inline-block text-[#0D1B2A] hover:underline">← Back to Blog</a>
        </div>
      </article>
    </main>
  );
};

export default BlogDetail;


