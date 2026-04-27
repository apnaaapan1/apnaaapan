import React from 'react';
import { Link } from 'react-router-dom';

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg md:px-8 md:py-3 md:text-base';

export default function BrandCaseStudyBookCallButton({ className = '' }) {
  return (
    <Link
      to="/book-call"
      className={[baseClass, className].filter(Boolean).join(' ')}
    >
      <span>Book a call</span>
      <span aria-hidden>→</span>
    </Link>
  );
}
