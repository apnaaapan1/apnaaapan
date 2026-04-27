import React from 'react';
import { motion } from 'framer-motion';
import BrandCaseStudyBookCallButton from './BrandCaseStudyBookCallButton';

const container = 'max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12';
const labelClass =
  'text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-[#F5A623]';
const sectionPad = 'py-12 lg:py-20';

const MAX_IMAGES = 4;

function viewBlock(y) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };
}

/**
 * Performance marketing stills — up to 4 images in a 2×2 grid (1 col on mobile).
 * `performanceMarketing`: [{ src, alt }, ...]
 */
export default function BrandCaseStudyPerformanceMarketing({ brandName, performanceMarketing, viewportY = 30 }) {
  const vb = viewBlock(viewportY);
  const items = Array.isArray(performanceMarketing)
    ? performanceMarketing
        .filter((it) => it && String(it.src || '').trim() !== '')
        .slice(0, MAX_IMAGES)
    : [];

  if (items.length === 0) {
    return null;
  }

  return (
    <section
      className={`relative w-full border-t border-[#D4CFC6] bg-[#FDFAF5] ${sectionPad}`}
      aria-labelledby="case-study-performance-heading"
    >
      <div className={container}>
        <motion.p id="case-study-performance-heading" className={labelClass} {...vb}>
          Performance marketing
        </motion.p>
        <motion.p
          className="mt-4 md:mt-5 max-w-3xl font-sans text-base md:text-lg text-[#2d2d2d]/85 leading-relaxed"
          initial={vb.initial}
          whileInView={vb.whileInView}
          viewport={vb.viewport}
          transition={{ ...vb.transition, delay: 0.05 }}
        >
          Paid media, funnels, and conversion creative we ran for {brandName}.
        </motion.p>

        <motion.div
          className="mt-6 flex justify-center md:justify-end"
          initial={vb.initial}
          whileInView={vb.whileInView}
          viewport={vb.viewport}
          transition={{ ...vb.transition, delay: 0.08 }}
        >
          <BrandCaseStudyBookCallButton />
        </motion.div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
          {items.map((item, i) => (
            <motion.div
              key={`${item.src || item.alt || i}-${i}`}
              initial={vb.initial}
              whileInView={vb.whileInView}
              viewport={vb.viewport}
              transition={{ ...vb.transition, delay: 0.07 * i }}
              className="relative aspect-[4/3] overflow-hidden bg-[#E8E4DC]"
            >
              {item.src ? (
                <img
                  src={item.src}
                  alt={item.alt || `Performance marketing ${i + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm text-gray-500">
                  {item.alt || `Placeholder ${i + 1}`}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
