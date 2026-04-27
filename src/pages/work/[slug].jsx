import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import BrandCaseStudyHero from '../../components/BrandCaseStudyHero';
import {
  BrandCaseStudyBriefSection,
  BrandCaseStudyApproachSection,
} from '../../components/BrandCaseStudyBriefApproach';
import BrandCaseStudyResultsWorkSection from '../../components/BrandCaseStudyResultsWork';
import { useCaseStudyViewportY } from '../../hooks/useCaseStudyViewportY';

const getApiBase = () => (process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000');

function mapCaseStudyFromApi(cs) {
  if (!cs) return null;
  return {
    name: cs.name,
    slug: cs.slug,
    logo: cs.logo == null || cs.logo === '' ? null : cs.logo,
    tags: cs.tags || [],
    tagline: cs.tagline || '',
    heroImages: (cs.heroImages || []).map((h) => ({
      src: h.src || null,
      alt: h.alt || '',
    })),
    brief: cs.brief || { intro: '', bullets: [] },
    approach: cs.approach || { intro: '', points: [] },
    results: cs.results || [],
    videos: cs.videos || [],
    marqueeGallery: cs.marqueeGallery || { row1: [], row2: [] },
    performanceMarketing: cs.performanceMarketing || [],
  };
}

export default function BrandCaseStudyPage() {
  const { slug } = useParams();
  const [brand, setBrand] = useState(undefined);
  const viewportY = useCaseStudyViewportY();

  useEffect(() => {
    let cancelled = false;

    if (!slug) {
      setBrand(null);
      return;
    }

    const load = async () => {
      setBrand(undefined);
      try {
        const base = getApiBase();
        const res = await fetch(`${base}/api/case-studies/by-slug/${encodeURIComponent(slug)}`);
        if (res.ok) {
          const data = await res.json();
          const mapped = mapCaseStudyFromApi(data.caseStudy);
          if (!cancelled && mapped) {
            setBrand(mapped);
            return;
          }
        }
      } catch {
        /* API unavailable or network error */
      }
      if (!cancelled) {
        setBrand(null);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (brand === undefined) {
    return (
      <main className="min-h-screen bg-[#EDE8DC] flex items-center justify-center px-4">
        <p className="text-gray-600 text-sm">Loading…</p>
      </main>
    );
  }

  if (!brand) {
    return <Navigate to="/work" replace />;
  }

  return (
    <main className="min-h-screen bg-[#EDE8DC]">
      <BrandCaseStudyHero
        brandName={brand.name}
        logo={brand.logo}
        tagline={brand.tagline}
        tags={brand.tags}
        heroImages={brand.heroImages}
      />

      <BrandCaseStudyBriefSection brief={brand.brief} brandName={brand.name} viewportY={viewportY} />
      <BrandCaseStudyApproachSection approach={brand.approach} brandName={brand.name} viewportY={viewportY} />

      <BrandCaseStudyResultsWorkSection
        brandName={brand.name}
        results={brand.results}
        videos={brand.videos}
        marqueeGallery={brand.marqueeGallery}
        performanceMarketing={brand.performanceMarketing}
        viewportY={viewportY}
      />
    </main>
  );
}
