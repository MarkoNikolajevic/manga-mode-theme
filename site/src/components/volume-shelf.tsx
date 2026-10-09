'use client';

import { useVolume } from './volume-context';

export function VolumeShelf() {
  const {
    state: { volumes, volume },
    actions: { selectVolume },
  } = useVolume();

  return (
    <fieldset className='flex h-full min-w-0 flex-col'>
      <legend className='font-bold text-lg'>Pick a volume</legend>
      <p aria-live='polite' className='mt-1 text-sm'>
        Reading {volume.name}, vol. {volume.issue}
      </p>
      <div className='mt-4 flex flex-1 items-end gap-1.5 overflow-x-auto border-ink border-b-8 pt-4'>
        {volumes.map(({ issue, name, palette }) => (
          <label
            key={issue}
            style={{ backgroundColor: palette.background, color: palette.text }}
            className='flex h-56 w-10 shrink-0 cursor-pointer flex-col items-center justify-between border-2 border-ink pt-2 has-checked:-translate-y-3 has-focus-visible:outline-2 has-focus-visible:outline-ink has-focus-visible:outline-offset-2 motion-safe:transition-transform'
          >
            <input
              type='radio'
              name='volume'
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
    </fieldset>
  );
}
