import { motion } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';

import './BlurText.css';

const buildKeyframes = (from, steps) => {
  const keys = new Set([...Object.keys(from), ...steps.flatMap((step) => Object.keys(step))]);
  return Object.fromEntries(
    [...keys].map((key) => [key, [from[key], ...steps.map((step) => step[key])]]),
  );
};

const BlurText = ({
  as: Component = 'span',
  text = '',
  delay = 90,
  startDelay = 0,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  animationFrom,
  animationTo,
  easing = [0.16, 1, 0.3, 1],
  onAnimationComplete,
  stepDuration = 0.35,
  style,
  ...rest
}) => {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  const segments = useMemo(
    () => (animateBy === 'words' ? text.split(' ') : Array.from(text)),
    [animateBy, text],
  );

  useEffect(() => {
    if (!ref.current) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(ref.current);
      }
    }, { threshold, rootMargin });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const defaultFrom = useMemo(() => ({
    filter: 'blur(12px)',
    opacity: 0,
    y: direction === 'top' ? -42 : 42,
    scale: 0.96,
  }), [direction]);

  const defaultTo = useMemo(() => [
    {
      filter: 'blur(5px)',
      opacity: 0.65,
      y: direction === 'top' ? 4 : -4,
      scale: 1.01,
    },
    { filter: 'blur(0px)', opacity: 1, y: 0, scale: 1 },
  ], [direction]);

  const fromSnapshot = animationFrom ?? defaultFrom;
  const toSnapshots = animationTo ?? defaultTo;
  const stepCount = toSnapshots.length + 1;
  const times = Array.from({ length: stepCount }, (_, index) => index / (stepCount - 1));
  const animateKeyframes = buildKeyframes(fromSnapshot, toSnapshots);

  return (
    <Component
      ref={ref}
      className={`blur-text-root ${className}`.trim()}
      style={{ display: 'flex', flexWrap: 'wrap', ...style }}
      {...rest}
    >
      {segments.map((segment, index) => {
        if (segment === '\n') return <span className="blur-line-break" key={`break-${index}`} aria-hidden="true" />;
        const visibleSegment = segment === '' ? '\u00a0' : segment;
        const suffix = animateBy === 'words' && index < segments.length - 1 ? '\u00a0' : '';
        return (
          <motion.span
            className="blur-text-segment"
            key={`${segment}-${index}`}
            initial={fromSnapshot}
            animate={inView ? animateKeyframes : fromSnapshot}
            transition={{
              duration: stepDuration * (stepCount - 1),
              times,
              delay: (startDelay + index * delay) / 1000,
              ease: easing,
            }}
            onAnimationComplete={index === segments.length - 1 ? onAnimationComplete : undefined}
          >
            {visibleSegment}{suffix}
          </motion.span>
        );
      })}
    </Component>
  );
};

export default BlurText;
