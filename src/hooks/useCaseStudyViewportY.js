import { useEffect, useState } from 'react';

/** Scroll-reveal y offset: 15px mobile, 30px desktop (md+). */
export function useCaseStudyViewportY() {
  const [y, setY] = useState(30);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setY(mq.matches ? 30 : 15);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return y;
}
