import React from 'react';
import { motion } from 'framer-motion';

/** Six overlapping collage frames (desktop). Tweaked for mobile via scale in parent. */
const COLLAGE_FRAMES = [
  { className: 'top-[0%] left-[0%] w-[56%] h-[34%] -rotate-[4deg] z-[2]' },
  { className: 'top-[2%] right-[0%] w-[56%] h-[34%] rotate-[3deg] z-[3]' },
  { className: 'top-[30%] left-[2%] w-[52%] h-[31%] rotate-[2deg] z-[4]' },
  { className: 'top-[32%] right-[0%] w-[54%] h-[31%] -rotate-[3deg] z-[3]' },
  { className: 'bottom-[6%] left-[6%] w-[50%] h-[28%] -rotate-[2deg] z-[2]' },
  { className: 'bottom-[4%] right-[4%] w-[50%] h-[30%] rotate-[4deg] z-[5]' },
];

const enter = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: 'easeOut' },
};

/**
 * Brand case study hero — Apnaaapan site palette; text + overlapping image collage with centered brand badge.
 */
function BrandCaseStudyHero({ brandName, logo = null, tagline, tags = [], heroImages = [] }) {
  const images = Array.from({ length: 6 }, (_, i) => heroImages[i] || { src: null, alt: `Image ${i + 1}` });

  return (
    <section className="relative w-full min-h-[68vh] flex flex-col justify-center bg-[#EDE8DC]">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-12 lg:py-20 flex flex-col flex-1 justify-center">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-10 xl:gap-14">
          {/* Left: label, title, tagline, tags */}
          <div className="w-full lg:w-[46%] xl:w-[42%] shrink-0 order-1">
            <motion.div
              {...enter}
              transition={{ ...enter.transition, delay: 0 }}
              className="w-10 h-px bg-gray-400/90 mb-4"
              aria-hidden
            />
            <motion.p
              {...enter}
              transition={{ ...enter.transition, delay: 0 }}
              className="text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-gray-600 mb-3"
            >
              Case study
            </motion.p>
            <motion.h1
              {...enter}
              transition={{ ...enter.transition, delay: 0.15 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-medium leading-tight text-gray-800 mb-4 md:mb-5"
            >
              {brandName}
            </motion.h1>
            <motion.p
              {...enter}
              transition={{ ...enter.transition, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 leading-relaxed font-sans mb-5 md:mb-6 max-w-xl"
            >
              {tagline}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.45 }}
              className="flex flex-wrap gap-2 sm:gap-2.5"
            >
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-white shadow-sm bg-gradient-to-r from-orange-500 to-yellow-400"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right: collage + centered badge */}
          <div className="w-full lg:flex-1 min-w-0 order-2 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[min(100%,520px)] lg:max-w-[560px] mx-auto aspect-[5/4] sm:aspect-[4/3] md:h-[min(420px,52vw)] md:aspect-auto lg:h-[440px]">
              {images.map((item, i) => {
                const frame = COLLAGE_FRAMES[i] || COLLAGE_FRAMES[0];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 + i * 0.1 }}
                    className={`absolute rounded-2xl overflow-hidden bg-[#e8e4dc] border-[3px] border-white shadow-lg transition-transform duration-300 hover:z-[40] hover:scale-[1.02] ${frame.className}`}
                    style={{
                      boxShadow: '0 12px 28px -8px rgba(13, 27, 42, 0.2)',
                    }}
                  >
                    {item.src ? (
                      <img
                        src={item.src}
                        alt={item.alt || `${brandName} visual ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center p-3 bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-xs sm:text-sm text-center text-gray-500 px-2 leading-snug">
                          {item.alt || `Placeholder ${i + 1}`}
                        </span>
                      </div>
                    )}
                  </motion.div>
                );
              })}

              <div className="absolute left-1/2 top-1/2 z-[25] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <motion.div
                  animate={{ y: [-4, 4, -4] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-flex max-w-[min(90vw,280px)] items-center justify-center rounded-full border-[3px] border-orange-500 bg-[#FFFFFF] px-6 py-3 text-center shadow-xl"
                >
                  {logo && String(logo).trim() ? (
                    <img
                      src={logo}
                      alt={`${brandName} logo`}
                      className="h-auto w-auto max-h-[36px] max-w-[140px] object-contain"
                      loading="eager"
                    />
                  ) : (
                    <span className="block max-w-[240px] truncate font-serif text-sm font-bold leading-tight text-gray-800 sm:text-base md:text-lg">
                      {brandName}
                    </span>
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrandCaseStudyHero;
