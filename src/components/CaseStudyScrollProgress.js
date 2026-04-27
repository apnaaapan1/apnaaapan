import React from 'react';
import { useScrollProgress } from '../hooks/useScrollProgress';

/**
 * Fixed 3px reading progress bar at viewport top (above navbar). z-index above header.
 */
export default function CaseStudyScrollProgress() {
  const progress = useScrollProgress();
  const widthPct = `${progress * 100}%`;

  return (
    <div
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] w-full bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(progress * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    >
      <div
        className="h-full bg-[#F5A623] transition-[width] duration-150 ease-out"
        style={{ width: widthPct }}
      />
    </div>
  );
}
