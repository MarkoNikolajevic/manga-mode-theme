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
