'use client';

import type { ReactNode } from 'react';
import { contrastRatio, formatRatio, luminance } from '@/lib/contrast';
import { CONTRAST_TOKENS } from '@/lib/volumes';
import { useVolume } from './volume-context';

function SpeechBubble({ children }: { children: ReactNode }) {
  return (
    <li className='relative rounded-[50%] border-2 border-ink bg-paper px-10 py-7 text-center text-sm'>
      <svg
        aria-hidden='true'
        viewBox='0 0 28 18'
        className='absolute top-1/2 -left-6 hidden h-4.5 w-7 -translate-y-1/2 lg:block'
      >
        <path d='M28 2 0 9l28 7' className='fill-paper stroke-2 stroke-ink' />
      </svg>
      {children}
    </li>
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
    <ul className='flex flex-col justify-center gap-6'>
      <SpeechBubble>
        The background is {palette.background}, not pure {extreme}. Text reads
        at {formatRatio(ratioOf(palette.text))} instead of a glaring 21:1.
      </SpeechBubble>
      <SpeechBubble>
        Nested brackets on lines 6 to 9 use three shades of one hue, not a
        rainbow.
      </SpeechBubble>
      <SpeechBubble>
        Even the quietest color, {quietest.label}, still reads at{' '}
        {formatRatio(quietest.ratio)}.
      </SpeechBubble>
    </ul>
  );
}
