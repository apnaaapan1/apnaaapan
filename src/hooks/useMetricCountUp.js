import { useEffect, useMemo, useState } from 'react';

function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export function parseMetricValue(str) {
  const s = String(str).trim();
  const xMatch = /^(\d+(?:\.\d+)?)x$/i.exec(s);
  if (xMatch) {
    return { kind: 'decimal', target: parseFloat(xMatch[1]), suffix: 'x', decimals: 1 };
  }
  const pctMatch = /^(\d+)%$/.exec(s);
  if (pctMatch) {
    return { kind: 'int', target: parseInt(pctMatch[1], 10), suffix: '%' };
  }
  const lMatch = /^(\d+)L\+$/i.exec(s);
  if (lMatch) {
    return { kind: 'int', target: parseInt(lMatch[1], 10), suffix: 'L+' };
  }
  return null;
}

function formatMetric(parsed, current) {
  if (parsed.kind === 'decimal') {
    return `${current.toFixed(1)}${parsed.suffix}`;
  }
  return `${Math.round(current)}${parsed.suffix}`;
}

function formatZero(parsed) {
  if (parsed.kind === 'decimal') return `0.${'0'.repeat(parsed.decimals ?? 1)}${parsed.suffix}`;
  return `0${parsed.suffix}`;
}

/**
 * Count from 0 to target when `enabled` becomes true (once). Duration 2s, ease-out.
 */
export function useMetricCountUp(valueStr, enabled) {
  const parsed = useMemo(() => parseMetricValue(valueStr), [valueStr]);
  const [display, setDisplay] = useState(() => (parsed ? formatZero(parsed) : valueStr));

  useEffect(() => {
    if (!parsed) {
      setDisplay(valueStr);
      return;
    }
    if (!enabled) {
      setDisplay(formatZero(parsed));
      return;
    }

    let rafId;
    const start = performance.now();
    const duration = 2000;
    const { target } = parsed;

    const frame = (now) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const current = target * eased;
      setDisplay(formatMetric(parsed, current));
      if (t < 1) {
        rafId = requestAnimationFrame(frame);
      } else {
        setDisplay(formatMetric(parsed, target));
      }
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [enabled, parsed, valueStr]);

  return display;
}
