import React from 'react';
import { motion } from 'framer-motion';

const container = 'max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12';
const labelClass =
  'text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-[#F5A623]';
const sectionPad = 'py-12 lg:py-20';

function viewBlock(y) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };
}

/**
 * Two-row image marquee using the same CSS animations as `ClientFeedback`
 * (`animate-scroll-left` / `animate-scroll-right` in `index.css`).
 * Each row duplicates its items for seamless `translateX(-50%)` looping.
 *
 * `marqueeGallery`: { row1: [{ src, alt }], row2: [{ src, alt }] }
 */
function hasImageSrc(item) {
  return item && String(item.src || '').trim() !== '';
}

export default function BrandCaseStudyMarqueeGallery({ brandName, marqueeGallery, viewportY = 30 }) {
  const vb = viewBlock(viewportY);
  const row1Raw = Array.isArray(marqueeGallery?.row1) ? marqueeGallery.row1.filter(Boolean) : [];
  const row2Raw = Array.isArray(marqueeGallery?.row2) ? marqueeGallery.row2.filter(Boolean) : [];
  const row1 = row1Raw.filter(hasImageSrc);
  const row2 = row2Raw.filter(hasImageSrc);

  if (row1.length === 0 && row2.length === 0) {
    return null;
  }

  const renderStrip = (items, animClass, rowKey) => {
    const loop = [...items, ...items];
    return (
      <div className={`flex ${animClass}`}>
        {loop.map((item, index) => (
          <div
            key={`${rowKey}-${index}-${item.src || item.alt || index}`}
            className="mx-1 flex-shrink-0 w-80 sm:w-96 sm:mx-2"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#E8E4DC] sm:aspect-[5/4]">
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt || `Gallery image ${index + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-4 text-center text-xs text-gray-500 sm:text-sm">
                  {item.alt || 'Image placeholder'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section
      className={`relative w-full border-t border-[#D4CFC6] bg-[#F5F0E8] ${sectionPad}`}
      aria-labelledby="case-study-marquee-gallery-heading"
    >
      <div className={container}>
        <motion.p id="case-study-marquee-gallery-heading" className={labelClass} {...vb}>
          Gallery
        </motion.p>
        <motion.p
          className="mt-4 md:mt-5 max-w-3xl font-sans text-base md:text-lg text-[#2d2d2d]/85 leading-relaxed"
          initial={vb.initial}
          whileInView={vb.whileInView}
          viewport={vb.viewport}
          transition={{ ...vb.transition, delay: 0.05 }}
        >
          Campaign and creative stills from our work with {brandName}.
        </motion.p>
      </div>

      <div className="relative mt-8 w-full overflow-hidden md:mt-10">
        {row1.length > 0 ? (
          <div className="mb-6 sm:mb-8">{renderStrip(row1, 'animate-scroll-left', 'r1')}</div>
        ) : null}
        {row2.length > 0 ? renderStrip(row2, 'animate-scroll-right', 'r2') : null}
      </div>
    </section>
  );
}
