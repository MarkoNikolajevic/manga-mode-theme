'use client';

import { type ReactNode, useId, useState } from 'react';
import { LOUD_PALETTE, paletteVars } from '@/lib/volumes';
import { VolumeSurface } from './volume-context';

/** Before/after slider: the loud palette is revealed from the left edge up to the handle. */
export function CalmComparison({ code }: { code: ReactNode }) {
  const [split, setSplit] = useState(50);
  const sliderId = useId();

  return (
    <div className='border-2 border-ink'>
      <div className='relative'>
        <VolumeSurface>{code}</VolumeSurface>
        <div
          aria-hidden
          className='absolute inset-0'
          style={{
            ...paletteVars(LOUD_PALETTE),
            clipPath: `inset(0 ${100 - split}% 0 0)`,
          }}
        >
          {code}
        </div>
        <span
          aria-hidden
          className='absolute inset-y-0 w-1 -translate-x-1/2 bg-paper'
          style={{ left: `${split}%` }}
        />
      </div>
      <div className='flex flex-wrap items-center gap-x-6 gap-y-2 border-ink border-t-2 px-4 py-3'>
        <label htmlFor={sliderId} className='font-bold text-sm'>
          Drag to compare with a loud theme
        </label>
        <input
          id={sliderId}
          type='range'
          min={0}
          max={100}
          value={split}
          onChange={(event) => setSplit(event.target.valueAsNumber)}
          aria-valuetext={`${split}% loud theme`}
          className='min-w-40 flex-1 accent-ink'
        />
      </div>
    </div>
  );
}
