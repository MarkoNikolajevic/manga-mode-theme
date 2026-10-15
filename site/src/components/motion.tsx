'use client';

import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  MotionConfig,
  m,
} from 'motion/react';
import type { ReactNode } from 'react';

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * `m` components with only the DOM animation features keep the bundle small;
 * `strict` throws if a full `motion.*` component sneaks in.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion='user'>{children}</MotionConfig>
    </LazyMotion>
  );
}

/** Fades content up once as it scrolls into view. */
export function Reveal({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
    >
      {children}
    </m.div>
  );
}

/** Cross-fades text when it changes; renders statically on first paint. */
export function SwapText({ children }: { children: string }) {
  return (
    <AnimatePresence mode='wait' initial={false}>
      <m.span
        key={children}
        className='inline-block'
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
      >
        {children}
      </m.span>
    </AnimatePresence>
  );
}
