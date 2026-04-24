import React from 'react';
import { motion } from 'framer-motion';

const container = 'max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12';
const labelClass =
  'text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-[#F5A623]';
const sectionPad = 'py-12 lg:py-20';

/** Matches portfolio page (`Videos.js`): vertical reel frame + inner black stage. */
const portfolioFrameOuter = 'bg-white/70 backdrop-blur rounded-2xl shadow-sm overflow-hidden';
const portfolioFramePad = 'p-2.5';
const portfolioAspectInner = 'aspect-[9/16] rounded-xl overflow-hidden bg-black';

function viewBlock(y) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };
}

const MAX_VIDEOS = 9;

/**
 * Case study — up to 9 videos, 3 per row on md+ (same card + 9:16 frame as `/portfolio`).
 * Each item: { embedUrl } or { src }, optional { title }.
 */
export default function BrandCaseStudyVideosSection({ brandName, videos = [], viewportY = 30 }) {
  const vb = viewBlock(viewportY);
  const list = Array.isArray(videos) ? videos.filter(Boolean).slice(0, MAX_VIDEOS) : [];

  if (list.length === 0) {
    return null;
  }

  return (
    <section
      className={`relative w-full border-t border-[#D4CFC6] bg-[#F5F0E8] ${sectionPad}`}
      aria-labelledby="case-study-videos-heading"
    >
      <div className={container}>
        <motion.p id="case-study-videos-heading" className={labelClass} {...vb}>
          Videos
        </motion.p>
        <motion.p
          className="mt-4 md:mt-5 max-w-3xl font-sans text-base md:text-lg text-[#2d2d2d]/85 leading-relaxed"
          initial={vb.initial}
          whileInView={vb.whileInView}
          viewport={vb.viewport}
          transition={{ ...vb.transition, delay: 0.05 }}
        >
          Featured motion and reels we produced for {brandName}.
        </motion.p>

        <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
          {list.map((item, i) => {
            const title = item.title || `Video ${i + 1}`;
            return (
              <motion.article
                key={`${item.embedUrl || item.src || i}-${i}`}
                initial={vb.initial}
                whileInView={vb.whileInView}
                viewport={vb.viewport}
                transition={{ ...vb.transition, delay: 0.06 * i }}
                className={portfolioFrameOuter}
              >
                <div className={portfolioFramePad}>
                  <div
                    className={`${portfolioAspectInner} flex items-center justify-center`}
                  >
                    {item.embedUrl ? (
                      <div className="aspect-video w-full max-h-full shrink-0">
                        <iframe
                          title={title}
                          src={item.embedUrl}
                          className="h-full w-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          loading="lazy"
                        />
                      </div>
                    ) : item.src ? (
                      <video
                        title={title}
                        controls
                        src={item.src}
                        className="h-full w-full object-contain bg-black"
                        preload="metadata"
                        playsInline
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-gray-400">
                        Add <code className="mx-1 rounded bg-white/10 px-1 text-xs">embedUrl</code> or{' '}
                        <code className="mx-1 rounded bg-white/10 px-1 text-xs">src</code> in brands data
                      </div>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
