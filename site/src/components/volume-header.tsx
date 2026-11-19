'use client';

import { AnimatePresence, m } from 'motion/react';
import { SwapText } from './motion';
import { useVolume } from './volume-context';

/**
 * The open volume's title panel. A page-turn sound effect pops whenever the
 * reader opens another volume; the first paint stays still.
 */
export function VolumeHeader() {
  const { issue, name, description, appearance } = useVolume().state.volume;

  return (
    <div
      aria-live='polite'
      className='panel halftone relative grid gap-x-6 gap-y-4 overflow-hidden p-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center sm:px-6.5 sm:py-5.5'
    >
      <p
        aria-hidden
        className='font-display text-7xl text-accent tracking-tighter motion-safe:transition-colors motion-safe:duration-400 sm:text-8xl lg:text-[7.5rem]'
      >
        <SwapText>{String(issue).padStart(2, '0')}</SwapText>
      </p>
      <div className='min-w-0'>
        <h2 className='font-display text-3xl sm:text-4xl'>
          <SwapText>{name}</SwapText>
        </h2>
        <p className='mt-2 max-w-[52ch] text-ink/80'>{description}</p>
        <p className='mt-3 inline-block border-[1.5px] border-ink bg-paper px-2.5 py-1 font-mono text-[13px]'>
          {appearance}
        </p>
      </div>
      <AnimatePresence initial={false} mode='popLayout'>
        <m.span
          key={issue}
          aria-hidden
          lang='ja'
          initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          transition={{ type: 'spring', bounce: 0.45, duration: 0.5 }}
          style={{ rotate: -8 }}
          className='pointer-events-none absolute top-5 right-4 font-sfx text-5xl text-accent tracking-tighter [-webkit-text-stroke:2.5px_var(--color-ink)] [paint-order:stroke_fill] sm:top-1/2 sm:right-12 sm:-translate-y-1/2 sm:text-7xl lg:text-8xl'
        >
          パラッ
        </m.span>
      </AnimatePresence>
    </div>
  );
}
