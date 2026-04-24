import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useMetricCountUp } from '../hooks/useMetricCountUp';
import BrandCaseStudyVideosSection from './BrandCaseStudyVideos';
import BrandCaseStudyMarqueeGallery from './BrandCaseStudyMarqueeGallery';
import BrandCaseStudyPerformanceMarketing from './BrandCaseStudyPerformanceMarketing';

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

function MetricCard({ metric, index, enabled, viewportY }) {
  const vb = viewBlock(viewportY);
  const display = useMetricCountUp(metric.value, enabled);

  return (
    <motion.article
      initial={vb.initial}
      whileInView={vb.whileInView}
      viewport={vb.viewport}
      transition={{ ...vb.transition, delay: index * 0.1 }}
      className="relative rounded-2xl border-t-4 border-t-[#F5A623] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
    >
      <div className="text-[48px] sm:text-[52px] md:text-[56px] font-bold leading-none tracking-tight text-[#F5A623] tabular-nums">
        {display}
      </div>
      <h3 className="mt-3 font-sans text-base font-normal leading-snug text-[#2d2d2d]">{metric.label}</h3>
      {metric.description ? (
        <p className="mt-2 font-sans text-sm leading-relaxed text-gray-500">{metric.description}</p>
      ) : null}
    </motion.article>
  );
}

/**
 * Case study — Results + Videos + Gallery marquee + Performance marketing + CTA.
 */
export default function BrandCaseStudyResultsWorkSection({
  brandName,
  results,
  videos,
  marqueeGallery,
  performanceMarketing,
  viewportY = 30,
}) {
  const vb = viewBlock(viewportY);
  const resultsRef = useRef(null);
  const resultsInView = useInView(resultsRef, { once: true, margin: '-80px' });

  return (
    <div className="w-full">
      {/* Results */}
      <section
        ref={resultsRef}
        className={`relative w-full bg-[#F5F0E8] ${sectionPad}`}
        aria-labelledby="case-study-results-heading"
      >
        <div className={container}>
          <motion.p id="case-study-results-heading" className={labelClass} {...vb}>
            The Results
          </motion.p>
          <motion.p
            className="mt-4 md:mt-5 max-w-2xl font-sans text-base md:text-lg text-[#2d2d2d]/75 leading-relaxed"
            initial={vb.initial}
            whileInView={vb.whileInView}
            viewport={vb.viewport}
            transition={{ ...vb.transition, delay: 0.05 }}
          >
            Here&apos;s what we achieved together.
          </motion.p>

          <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-4">
            {results.map((r, i) => (
              <MetricCard
                key={`${r.label}-${r.value}`}
                metric={r}
                index={i}
                enabled={resultsInView}
                viewportY={viewportY}
              />
            ))}
          </div>
        </div>
      </section>

      <BrandCaseStudyVideosSection brandName={brandName} videos={videos} viewportY={viewportY} />

      <BrandCaseStudyMarqueeGallery
        brandName={brandName}
        marqueeGallery={marqueeGallery}
        viewportY={viewportY}
      />

      <BrandCaseStudyPerformanceMarketing
        brandName={brandName}
        performanceMarketing={performanceMarketing}
        viewportY={viewportY}
      />

      <section
        className="relative w-full border-t border-[#D4CFC6] bg-[#FAF9F6] py-12 md:py-16 lg:py-20"
        aria-labelledby="case-study-cta-heading"
      >
        <div className={container}>
          <motion.div
            className="flex flex-col items-stretch gap-8 md:flex-row md:items-center md:justify-between md:gap-12"
            initial={vb.initial}
            whileInView={vb.whileInView}
            viewport={vb.viewport}
            transition={{ ...vb.transition, delay: 0.08 }}
          >
            <div className="max-w-xl text-center md:text-left">
              <p className="font-sans text-sm leading-snug text-[#2d2d2d]/60 md:text-[15px]">
                Ready to grow your brand?
              </p>
              <h2
                id="case-study-cta-heading"
                className="mt-2 font-serif text-2xl font-medium leading-tight text-[#2d2d2d] sm:text-3xl md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]"
              >
                Let&apos;s build something great together.
              </h2>
            </div>
            <Link
              to="/book-call"
              className="inline-flex w-full shrink-0 items-center justify-center gap-2 self-center rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-8 py-3.5 text-center text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg md:w-auto md:self-auto md:px-10 md:py-4 md:text-base"
            >
              <span>Work With Us</span>
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
