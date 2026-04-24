import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { getBrandBySlug } from '../../brandsData';
import BrandCaseStudyHero from '../../components/BrandCaseStudyHero';
import {
  BrandCaseStudyBriefSection,
  BrandCaseStudyApproachSection,
} from '../../components/BrandCaseStudyBriefApproach';
import BrandCaseStudyResultsWorkSection from '../../components/BrandCaseStudyResultsWork';
import { useCaseStudyViewportY } from '../../hooks/useCaseStudyViewportY';

export default function BrandCaseStudyPage() {
  const { slug } = useParams();
  const brand = getBrandBySlug(slug);
  const viewportY = useCaseStudyViewportY();

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
