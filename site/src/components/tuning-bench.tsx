'use client';

import { useId, useState } from 'react';
import { contrastRatio, formatRatio, wcagLevel } from '@/lib/contrast';
import { hexToOklch, oklchToHex } from '@/lib/oklch';
import { CONTRAST_TOKENS, type Palette } from '@/lib/volumes';
import { CodeSample } from './code-sample';
import { SwapText } from './motion';
import { useVolume, VolumeSurface } from './volume-context';

// Text and line numbers aren't syntax colors, so they stay out of the bench.
const TUNABLE = CONTRAST_TOKENS.filter(
  ({ key }) => key !== 'text' && key !== 'lineNumber',
);
type TunableKey = (typeof TUNABLE)[number]['key'];

const STEPS = 48;
const VERDICT = {
  AAA: 'Passes AAA. Room to spare.',
  AA: 'Passes AA. Readable for a full day.',
  Fail: 'Fails AA. This one would not ship.',
} as const;

/** Resets whenever the volume changes, so every palette starts as shipped. */
export function TuningBench() {
  const { volume } = useVolume().state;
  return <Bench key={volume.issue} palette={volume.palette} />;
}

function Bench({ palette }: { palette: Palette }) {
  const [key, setKey] = useState<TunableKey>('keyword');
  const [lightness, setLightness] = useState<number | null>(null);
  const sliderId = useId();

  const shipped = hexToOklch(palette[key]);
  const color =
    lightness === null
      ? palette[key]
      : oklchToHex({ ...shipped, l: lightness });
  const ratio = contrastRatio(color, palette.background);
  const level = wcagLevel(ratio);

  // The ramp the slider walks along, and which stops of it fail AA.
  const ramp = Array.from({ length: STEPS + 1 }, (_, step) =>
    oklchToHex({ ...shipped, l: step / STEPS }),
  );
  const fails = ramp.map(
    (stop) => wcagLevel(contrastRatio(stop, palette.background)) === 'Fail',
  );

  return (
    <div className='grid grid-cols-1 border-2 border-ink lg:grid-cols-[3fr_2fr]'>
      <VolumeSurface className='min-w-0 border-ink border-b-2 bg-(--tok-bg) lg:border-r-2 lg:border-b-0'>
        <div style={{ [`--tok-${key}`]: color }}>
          <CodeSample />
        </div>
      </VolumeSurface>

      <div className='flex flex-col gap-6 p-6'>
        <fieldset>
          <legend className='font-bold text-sm'>Token</legend>
          <div className='mt-2 flex flex-wrap gap-1.5'>
            {TUNABLE.map(({ label, key: option }) => (
              <label
                key={option}
                className='cursor-pointer border-2 border-ink px-2.5 py-1 text-xs has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-ink has-focus-visible:outline-offset-2'
              >
                <input
                  type='radio'
                  name='tune-token'
                  value={option}
                  checked={option === key}
                  onChange={() => {
                    setKey(option);
                    setLightness(null);
                  }}
                  className='sr-only'
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <div aria-live='polite'>
          <p className='font-display text-6xl tabular-nums'>
            <SwapText>{formatRatio(ratio)}</SwapText>
          </p>
          <p className='mt-2 text-sm'>
            <span className='font-mono'>{color}</span> on{' '}
            <span className='font-mono'>{palette.background}</span>.{' '}
            {VERDICT[level]}
          </p>
        </div>

        <div>
          <label htmlFor={sliderId} className='font-bold text-sm'>
            Lightness
          </label>
          <input
            id={sliderId}
            type='range'
            min={0}
            max={1}
            step={0.005}
            value={lightness ?? shipped.l}
            onChange={(event) => setLightness(Number(event.target.value))}
            aria-valuetext={`${color}, ${formatRatio(ratio)}, ${level === 'Fail' ? 'fails AA' : `passes ${level}`}`}
            className='tuner mt-2 w-full'
            style={{ background: `linear-gradient(to right, ${ramp.join()})` }}
          />
          <div aria-hidden className='relative mt-1 flex h-2'>
            {fails.map((fail, step) => (
              <span
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length ramp
                key={step}
                className={`flex-1 ${fail ? 'bg-ink' : ''}`}
              />
            ))}
            <span
              className='absolute -top-1 h-4 w-0.5 bg-ink outline-2 outline-paper'
              style={{ left: `${shipped.l * 100}%` }}
            />
          </div>
          <p className='mt-2 text-xs'>
            Black bars mark lightness that fails AA. The tick is the shipped
            color.
          </p>
        </div>

        <button
          type='button'
          disabled={lightness === null}
          onClick={() => setLightness(null)}
          className='self-start border-2 border-ink px-3 py-1.5 font-bold text-xs disabled:opacity-40'
        >
          Reset to shipped color
        </button>
      </div>
    </div>
  );
}
