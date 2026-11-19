'use client';

import { useId } from 'react';
import type { Palette } from '@/lib/volumes';
import { SwapText } from './motion';
import { useVolume } from './volume-context';

// Uneven spine heights read as real books on a shelf.
const SPINE_HEIGHT = [
  'h-88',
  'h-84',
  'h-80',
  'h-84',
  'h-82',
  'h-80',
  'h-84',
  'h-82',
  'h-86',
  'h-82',
];
const BAND: readonly Exclude<keyof Palette, 'brackets'>[] = [
  'keyword',
  'function',
  'string',
  'number',
  'type',
];

const pad = (issue: number) => String(issue).padStart(2, '0');

/** Every volume as a book spine. A native radio group, so arrow keys move between spines. */
export function VolumeShelf() {
  const groupId = useId();
  const {
    state: { volumes, volume },
    actions: { selectVolume },
  } = useVolume();

  return (
    <fieldset className='min-w-0'>
      <legend className='flex w-full items-baseline justify-between gap-4 font-bold'>
        Pull a volume off the shelf
        <span aria-hidden className='font-mono font-normal text-sm'>
          <SwapText>{pad(volume.issue)}</SwapText> / {pad(volumes.length)}
        </span>
      </legend>
      <div className='snap-x snap-proximity overflow-x-auto pt-9'>
        <div className='grid min-w-158 grid-cols-[repeat(10,minmax(3.5rem,1fr))] items-end gap-2 border-ink border-b-6'>
          {volumes.map(({ issue, name, appearance, palette }, index) => (
            <label
              key={issue}
              style={{
                backgroundColor: palette.background,
                color: palette.text,
                animationDelay: `${300 + index * 50}ms`,
              }}
              className={`${SPINE_HEIGHT[index % SPINE_HEIGHT.length]} relative flex snap-start cursor-pointer flex-col items-center rounded-t-sm shadow-[inset_-6px_0_0_rgb(0_0_0/0.12)] has-checked:-translate-y-7 has-checked:shadow-[inset_-6px_0_0_rgb(0_0_0/0.12),0_18px_30px_-18px_rgb(0_0_0/0.6)] not-has-checked:hover:-translate-y-2 has-focus-visible:outline-3 has-focus-visible:outline-ink has-focus-visible:outline-offset-3 max-sm:h-75 motion-safe:animate-drop motion-safe:transition-[translate,box-shadow] motion-safe:duration-450 motion-safe:ease-out-expo`}
            >
              <input
                type='radio'
                name={groupId}
                value={issue}
                checked={issue === volume.issue}
                onChange={() => selectVolume(issue)}
                aria-label={`${name}, ${appearance}`}
                className='sr-only'
              />
              <span aria-hidden className='pt-3.5 font-mono text-xs opacity-75'>
                {pad(issue)}
              </span>
              <span
                aria-hidden
                className='flex-1 py-4.5 font-extrabold text-lg/tight [font-stretch:112%] [writing-mode:vertical-rl] lg:text-[1.375rem]'
              >
                {name}
              </span>
              <span
                aria-hidden
                className='pb-3 font-mono text-[11px] uppercase tracking-wider opacity-75 [writing-mode:vertical-rl]'
              >
                {appearance}
              </span>
              <span aria-hidden className='grid h-8.5 w-full grid-cols-5'>
                {BAND.map((key) => (
                  <span key={key} style={{ backgroundColor: palette[key] }} />
                ))}
              </span>
            </label>
          ))}
        </div>
      </div>
    </fieldset>
  );
}
