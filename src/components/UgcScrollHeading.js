import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const getApiUrl = (endpoint) => {
  if (process.env.NODE_ENV === 'production') {
    return endpoint;
  }
  return `http://localhost:5000${endpoint}`;
};

const LINE_CLASS =
  'relative z-10 pointer-events-none select-none whitespace-nowrap text-[clamp(4.25rem,19vw,13.5rem)] font-black uppercase leading-[0.95] tracking-tight';

/**
 * Portfolio grid order (Videos page): 1st, 3rd, 9th, 8th, 14th, 15th, 13th — 0-based API indices.
 */
const SHOWCASE_PORTFOLIO_INDICES = [0, 2, 8, 7, 13, 14, 12];

const FINAL_ROTATIONS = [-5, 4, -3.5, 5, -4, 3, -4.5];

const TEXT_DURATION = 1;
const CARD_TWEEN = 1;
const CARD_STAGGER = 0.48;

const getShowcaseKey = (v, i) => (v.id != null ? String(v.id) : `showcase-${i}`);

const UgcScrollHeading = () => {
  const rootRef = useRef(null);
  const cardsLayerRef = useRef(null);
  const line1Ref = useRef(null);
  const line2Ref = useRef(null);
  const line3Ref = useRef(null);
  const cardRefs = useRef([]);
  const videoRefs = useRef({});

  const [showcaseVideos, setShowcaseVideos] = useState([]);
  const [lightboxKey, setLightboxKey] = useState(null);
  const lightboxVideoRef = useRef(null);

  const lightboxVideo = useMemo(() => {
    if (!lightboxKey) return null;
    const idx = showcaseVideos.findIndex((v, i) => getShowcaseKey(v, i) === lightboxKey);
    if (idx === -1) return null;
    return showcaseVideos[idx];
  }, [lightboxKey, showcaseVideos]);

  const closeLightbox = useCallback(() => {
    setLightboxKey(null);
    requestAnimationFrame(() => {
      showcaseVideos.forEach((v, i) => {
        const k = getShowcaseKey(v, i);
        const el = videoRefs.current[k];
        if (!el) return;
        const p = el.play();
        if (p && typeof p.catch === 'function') p.catch(() => {});
      });
    });
  }, [showcaseVideos]);

  useEffect(() => {
    if (!lightboxKey) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [lightboxKey, closeLightbox]);

  useEffect(() => {
    if (!lightboxKey || !lightboxVideoRef.current) return undefined;
    const el = lightboxVideoRef.current;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
    return undefined;
  }, [lightboxKey, lightboxVideo?.videoUrl]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch(getApiUrl('/api/videos'));
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        const list = Array.isArray(data.videos) ? data.videos : [];
        const picked = SHOWCASE_PORTFOLIO_INDICES.map((i) => list[i]).filter(
          (v) => v && v.videoUrl
        );
        if (mounted) setShowcaseVideos(picked);
      } catch (e) {
        console.error('UgcScrollHeading: portfolio videos', e);
        if (mounted) setShowcaseVideos([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const keepVideoPlaying = (key) => {
    const el = videoRefs.current[key];
    if (!el) return;
    const p = el.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  };

  useLayoutEffect(() => {
    const n = showcaseVideos.length;
    const root = rootRef.current;
    const cardsLayer = cardsLayerRef.current;
    const l1 = line1Ref.current;
    const l2 = line2Ref.current;
    const l3 = line3Ref.current;
    const cards = cardRefs.current.filter(Boolean);
    if (!root || !cardsLayer || !l1 || !l2 || !l3 || !n || cards.length !== n) {
      return undefined;
    }

    const getShift = () => Math.min(window.innerWidth * 0.2, 460);

    const getLayout = () => {
      const w = cardsLayer.clientWidth;
      const h = cardsLayer.clientHeight;
      const isNarrow = w < 768;
      const cols = isNarrow ? 2 : n;
      const rows = isNarrow ? Math.ceil(n / 2) : 1;
      const padX = Math.max(12, w * 0.045);
      const padY = Math.max(96, h * 0.13);
      const innerW = Math.max(0, w - 2 * padX);
      const innerH = Math.max(0, h - 2 * padY);
      const cellW = innerW / cols;
      const cellH = innerH / rows;
      const originX = w / 2;
      const estCardH =
        (cards[0] && cards[0].offsetHeight) ||
        Math.round((Math.min(w * 0.46, 380) * 16) / 9);
      const originY = h + estCardH + 64;

      const positions = [];
      for (let i = 0; i < n; i += 1) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        positions.push({
          fx: padX + cellW * (col + 0.5),
          fy: padY + cellH * (row + 0.5),
        });
      }
      return { w, h, originX, originY, positions };
    };

    const ctx = gsap.context(() => {
      gsap.set([l1, l2, l3], { x: 0, force3D: true });

      const layout0 = getLayout();
      cards.forEach((card, i) => {
        const cw = card.offsetWidth || 1;
        const ch = card.offsetHeight || 1;
        gsap.set(card, {
          x: layout0.originX - cw / 2,
          y: layout0.originY - ch,
          rotation: 0,
          scale: 0.88,
          transformOrigin: '50% 50%',
          zIndex: 20 + i,
          force3D: true,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${Math.round(window.innerHeight * 4.35)}`,
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(l1, { x: () => getShift(), ease: 'none', duration: TEXT_DURATION }, 0)
        .to(l2, { x: () => -getShift(), ease: 'none', duration: TEXT_DURATION }, 0)
        .to(l3, { x: () => getShift(), ease: 'none', duration: TEXT_DURATION }, 0);

      cards.forEach((card, i) => {
        const rot = FINAL_ROTATIONS[i] ?? 0;
        const startAt = TEXT_DURATION + i * CARD_STAGGER;

        tl.to(
          card,
          {
            x: () => {
              const { positions } = getLayout();
              const cw = card.offsetWidth || 1;
              return positions[i].fx - cw / 2;
            },
            y: () => {
              const { positions } = getLayout();
              const ch = card.offsetHeight || 1;
              return positions[i].fy - ch / 2;
            },
            rotation: rot,
            scale: 1,
            ease: 'power2.out',
            duration: CARD_TWEEN,
          },
          startAt
        );
      });
    }, root);

    const onResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      ctx.revert();
    };
  }, [showcaseVideos]);

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen overflow-hidden bg-[#EFE7D5]"
      aria-label="Discover our best work delivered"
    >
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pt-16 pb-28 sm:pt-20 sm:pb-32 md:pb-36">
        <div className="relative z-10 flex flex-col items-center gap-3 sm:gap-5 md:gap-7 lg:gap-8">
          <h2 ref={line1Ref} className={`${LINE_CLASS} text-[#1a2236]`}>
            DISCOVER OUR
          </h2>
          <h2 ref={line2Ref} className={`${LINE_CLASS} text-[#F26B2A]`}>
            BEST WORK
          </h2>
          <h2 ref={line3Ref} className={`${LINE_CLASS} text-[#1a2236]`}>
            DELIVERED
          </h2>
        </div>

        <div
          ref={cardsLayerRef}
          className="absolute inset-0 z-20"
        >
          {showcaseVideos.map((v, i) => {
            const key = getShowcaseKey(v, i);
            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                aria-label="Open video in larger player"
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute left-0 top-0 w-[min(46vw,380px)] max-w-[380px] cursor-pointer overflow-hidden rounded-2xl border-[3px] border-white bg-black opacity-100 shadow-[0_14px_44px_rgba(26,34,54,0.18)] will-change-transform sm:max-w-[350px] md:w-[min(16.5vw,380px)]"
                style={{ aspectRatio: '9 / 16' }}
                onClick={(e) => {
                  e.stopPropagation();
                  const bg = videoRefs.current[key];
                  if (bg) bg.pause();
                  setLightboxKey(key);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const bg = videoRefs.current[key];
                    if (bg) bg.pause();
                    setLightboxKey(key);
                  }
                }}
              >
                <video
                  src={v.videoUrl}
                  className="pointer-events-none h-full w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  ref={(el) => {
                    if (el) videoRefs.current[key] = el;
                    else delete videoRefs.current[key];
                  }}
                  onPause={() => {
                    if (lightboxKey !== key) keepVideoPlaying(key);
                  }}
                />
              </div>
            );
          })}
        </div>

        <div className="pointer-events-auto absolute bottom-3 left-1/2 z-30 -translate-x-1/2 sm:bottom-4 md:bottom-5">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 px-7 py-3 text-sm font-semibold text-white shadow-md transition hover:scale-105 hover:shadow-lg sm:px-10 sm:py-3.5 sm:text-base md:px-11 md:py-4"
          >
            See more
            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {lightboxVideo &&
        lightboxVideo.videoUrl &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 px-4 py-16 sm:py-20"
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            onClick={closeLightbox}
          >
            <button
              type="button"
              className="absolute right-4 top-4 z-[301] flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 sm:right-6 sm:top-6"
              aria-label="Close video"
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div
              className="relative w-full max-w-[min(420px,90vw)] overflow-hidden rounded-2xl bg-black shadow-2xl"
              style={{ aspectRatio: '9 / 16', maxHeight: 'min(92vh, 860px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={lightboxVideoRef}
                key={lightboxKey}
                src={lightboxVideo.videoUrl}
                className="h-full w-full object-contain"
                controls
                playsInline
                autoPlay
                preload="metadata"
              />
            </div>
          </div>,
          document.body
        )}
    </section>
  );
};

export default UgcScrollHeading;
