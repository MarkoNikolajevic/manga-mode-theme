'use client';

import { useId } from 'react';
import { SwapText } from './motion';
import { useVolume } from './volume-context';

export function VolumeShelf() {
  const groupId = useId();
  const {
    state: { volumes, volume },
    actions: { selectVolume },
  } = useVolume();

  return (
    <fieldset className='flex h-full min-w-0 flex-col'>
      <legend className='font-bold text-lg'>Pick a volume</legend>
      <div aria-live='polite' className='mt-2 min-h-28'>
        <p className='flex flex-wrap items-center gap-2 text-sm'>
          <SwapText>{volume.name}</SwapText>
          <span className='border border-ink px-1.5 py-0.5 font-mono text-[10px] uppercase'>
            {volume.appearance}
          </span>
        </p>
        <p className='mt-2 max-w-xs text-sm/5'>{volume.description}</p>
      </div>
      <p className='mt-2 text-xs md:hidden'>
        Scroll the shelf to explore all {volumes.length} volumes →
      </p>
      <div className='mt-2 flex flex-1 items-end gap-1.5 overflow-x-auto border-ink border-b-8 pt-4'>
        {volumes.map(({ issue, name, palette }, index) => (
          <label
            key={issue}
            style={{
              backgroundColor: palette.background,
              color: palette.text,
              animationDelay: `${450 + index * 50}ms`,
            }}
            className='relative flex h-56 w-10 shrink-0 cursor-pointer flex-col items-center justify-between border-2 border-ink pt-2 has-checked:-translate-y-3 not-has-checked:hover:-translate-y-1 has-focus-visible:outline-2 has-focus-visible:outline-ink has-focus-visible:outline-offset-2 motion-safe:animate-drop motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-spring'
          >
            <input
              type='radio'
              name={groupId}
              value={issue}
              checked={issue === volume.issue}
              onChange={() => selectVolume(issue)}
              className='sr-only'
            />
            <span aria-hidden className='font-mono text-xs'>
              {issue}
            </span>
            <span className='font-display text-sm leading-none [writing-mode:vertical-rl]'>
              {name}
            </span>
            <span
              aria-hidden
              className='h-8 w-full'
              style={{ backgroundColor: palette.function }}
            />
          </label>
        ))}
      </div>
      <div className='mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs'>
        {volumes
          .filter(({ appearance }) => appearance !== 'Dark')
          .map(({ issue, name, appearance }) => (
            <button
              key={issue}
              type='button'
              onClick={() => selectVolume(issue)}
              className='min-h-8 cursor-pointer underline underline-offset-4 hover:no-underline'
            >
              {appearance}: {name}
            </button>
          ))}
      </div>
    </fieldset>
  );
}
