import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollFloat.css';

gsap.registerPlugin(ScrollTrigger);

const ScrollFloat = ({
  children,
  scrollContainerRef,
  containerClassName = '',
  textClassName = '',
  animationDuration = 1,
  ease = 'back.inOut(2)',
  scrollStart = 'center bottom+=50%',
  scrollEnd = 'bottom bottom-=40%',
  stagger = 0.03,
}) => {
  const containerRef = useRef(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split('').map((char, index) => (
      <span className="char" key={`${char}-${index}`}>
        {char === ' ' ? '\u00a0' : char}
      </span>
    ));
  }, [children]);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return undefined;

    const scroller = scrollContainerRef?.current || window;
    const context = gsap.context(() => {
      gsap.fromTo(
        element.querySelectorAll('.char'),
        {
          willChange: 'opacity, transform',
          opacity: 0,
          yPercent: 160,
          scaleY: 2.6,
          scaleX: 0.65,
          transformOrigin: '50% 0%',
        },
        {
          duration: animationDuration,
          ease,
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          stagger,
          scrollTrigger: {
            trigger: element,
            scroller,
            start: scrollStart,
            end: scrollEnd,
            scrub: true,
          },
        },
      );
    }, element);

    return () => context.revert();
  }, [scrollContainerRef, animationDuration, ease, scrollStart, scrollEnd, stagger]);

  return (
    <h2 ref={containerRef} className={`scroll-float ${containerClassName}`.trim()}>
      <span className={`scroll-float-text ${textClassName}`.trim()}>{splitText}</span>
    </h2>
  );
};

export default ScrollFloat;
