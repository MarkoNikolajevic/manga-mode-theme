'use client';

import { m, type Variants } from 'motion/react';
import type { ReactNode } from 'react';
import { contrastRatio, formatRatio, luminance } from '@/lib/contrast';
import { CONTRAST_TOKENS } from '@/lib/volumes';
import { SwapText } from './motion';
import { useVolume } from './volume-context';

const DIALOGUE: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.15, staggerChildren: 0.2 } },
};

const BUBBLE: Variants = {
  hidden: { opacity: 0, scale: 0.85, x: -16 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: { type: 'spring', bounce: 0.35, duration: 0.6 },
  },
};

function SpeechBubble({ children }: { children: ReactNode }) {
  return (
    <m.li
      variants={BUBBLE}
      className='relative origin-left rounded-[50%] border-2 border-ink bg-paper px-10 py-7 text-center text-sm'
    >
      <svg
        aria-hidden='true'
        viewBox='0 0 28 18'
        className='absolute top-1/2 -left-6 hidden h-4.5 w-7 -translate-y-1/2 lg:block'
      >
        <path d='M28 2 0 9l28 7' className='fill-paper stroke-2 stroke-ink' />
      </svg>
      {children}
    </m.li>
  );
}

export function CalmerNotes() {
  const { palette } = useVolume().state.volume;
  const ratioOf = (color: string) => contrastRatio(color, palette.background);
  const quietest = CONTRAST_TOKENS.map(({ label, key }) => ({
    label: label.toLowerCase(),
    ratio: ratioOf(palette[key]),
  })).reduce((min, token) => (token.ratio < min.ratio ? token : min));
  const extreme = luminance(palette.background) > 0.5 ? 'white' : 'black';

  return (
    <m.ul
      variants={DIALOGUE}
      initial='hidden'
      whileInView='visible'
      viewport={{ once: true, amount: 0.4 }}
      className='flex flex-col justify-center gap-6'
    >
      <SpeechBubble>
        The background is <SwapText>{palette.background}</SwapText>, not pure{' '}
        <SwapText>{extreme}</SwapText>. Text reads at{' '}
        <SwapText>{formatRatio(ratioOf(palette.text))}</SwapText> instead of a
        glaring 21:1.
      </SpeechBubble>
      <SpeechBubble>
        Nested brackets on lines 6 to 9 use three shades of one hue, not a
        rainbow.
      </SpeechBubble>
      <SpeechBubble>
        Even the quietest color, <SwapText>{quietest.label}</SwapText>, still
        reads at <SwapText>{formatRatio(quietest.ratio)}</SwapText>.
      </SpeechBubble>
    </m.ul>
  );
}
