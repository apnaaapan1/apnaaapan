import React from 'react';
import { motion } from 'framer-motion';

const container = 'max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12';

/** Case study sections: 48px mobile, 80px desktop */
const sectionPad = 'py-12 lg:py-20';

function viewBlock(y) {
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.6, ease: 'easeOut' },
  };
}

function normalizeBrief(brief) {
  if (typeof brief === 'string') {
    return { intro: brief, bullets: [] };
  }
  if (brief && typeof brief === 'object' && 'intro' in brief) {
    return {
      intro: brief.intro,
      bullets: Array.isArray(brief.bullets) ? brief.bullets : [],
    };
  }
  return { intro: '', bullets: [] };
}

/**
 * “The Brief” — label top-left; intro + bullets below, max-width for reading.
 */
export function BrandCaseStudyBriefSection({ brief, brandName, viewportY = 30 }) {
  const { intro, bullets } = normalizeBrief(brief);
  const vb = viewBlock(viewportY);

  return (
    <motion.section
      className={`relative w-full bg-[#F5F0E8] ${sectionPad}`}
      aria-label={brandName ? `The Brief — ${brandName}` : 'The Brief'}
      {...vb}
    >
      <div className={container}>
        <div className="flex flex-col items-start">
          <div className="w-10 h-px bg-gray-400/90 mb-4" aria-hidden />
          <p className="text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-[#F5A623]">The Brief</p>
        </div>

        <div className="mt-8 md:mt-10 max-w-[680px]">
          {intro ? (
            <p className="font-sans text-[18px] md:text-[20px] leading-[1.7] text-[#2d2d2d]">{intro}</p>
          ) : null}

          {bullets.length > 0 ? (
            <ul className="mt-6 md:mt-8 space-y-4 md:space-y-5 list-none p-0 m-0">
              {bullets.map((point, i) => (
                <li key={i} className="flex gap-3.5 text-left items-start">
                  <span
                    className="font-sans text-[#F5A623] font-normal leading-[1.7] mt-[2px] shrink-0 select-none"
                    aria-hidden
                  >
                    →
                  </span>
                  <span className="font-sans text-[18px] md:text-[20px] font-normal leading-[1.65] text-[#2d2d2d]">
                    {point}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}

function normalizeApproach(approach) {
  if (approach == null) return { intro: '', points: [] };
  if (typeof approach === 'string') {
    return { intro: approach, points: [] };
  }
  if (Array.isArray(approach)) {
    return { intro: '', points: approach };
  }
  if (typeof approach === 'object' && Array.isArray(approach.points)) {
    return {
      intro: typeof approach.intro === 'string' ? approach.intro : '',
      points: approach.points,
    };
  }
  return { intro: '', points: [] };
}

/**
 * “Our Approach” — warm beige strip, label + intro + numbered rows.
 */
export function BrandCaseStudyApproachSection({ approach, brandName, viewportY = 30 }) {
  const { intro, points } = normalizeApproach(approach);
  const vb = viewBlock(viewportY);

  return (
    <section
      className={`relative w-full bg-[#FDFAF5] ${sectionPad}`}
      aria-label={brandName ? `Our Approach — ${brandName}` : 'Our Approach'}
    >
      <div className={container}>
        <motion.p className="text-xs sm:text-sm font-medium uppercase tracking-[0.28em] text-[#F5A623]" {...vb}>
          Our Approach
        </motion.p>

        {intro ? (
          <motion.p
            className="mt-6 md:mt-8 max-w-3xl font-sans text-[18px] md:text-[20px] leading-[1.7] text-[#2d2d2d]"
            initial={vb.initial}
            whileInView={vb.whileInView}
            viewport={vb.viewport}
            transition={{ ...vb.transition, delay: 0.1 }}
          >
            {intro}
          </motion.p>
        ) : null}

        {points.length > 0 ? (
          <ul className="mt-10 md:mt-12 lg:mt-14 list-none m-0 p-0 max-w-3xl space-y-10 md:space-y-12 lg:space-y-14">
            {points.map((item, i) => (
              <motion.li
                key={`${item.title}-${i}`}
                initial={vb.initial}
                whileInView={vb.whileInView}
                viewport={vb.viewport}
                transition={{ ...vb.transition, delay: 0.15 * i }}
              >
                <div className="flex flex-row gap-4 sm:gap-5 items-start transition-transform duration-[250ms] ease-out hover:-translate-x-[6px]">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F5A623] text-[11px] sm:text-xs font-semibold text-white tabular-nums leading-none"
                    aria-hidden
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <h3 className="font-sans text-lg md:text-xl font-bold text-[#2d2d2d] leading-snug">{item.title}</h3>
                    <p className="mt-2 font-sans text-[18px] md:text-[20px] font-normal leading-[1.65] text-[#2d2d2d]">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
