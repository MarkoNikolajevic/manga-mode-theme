'use client';

import {
  contrastRatio,
  formatRatio,
  type WcagLevel,
  wcagLevel,
} from '@/lib/contrast';
import { CONTRAST_TOKENS } from '@/lib/volumes';
import { SwapText } from './motion';
import { useVolume, VolumeName } from './volume-context';

const LEVEL_CLASS: Record<WcagLevel, string> = {
  AAA: 'bg-ink text-paper',
  AA: 'shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
  Fail: 'line-through shadow-[inset_0_0_0_1.5px_var(--color-ink)]',
};

/** Each syntax color measured against the open volume's editor background. */
export function ContrastTable() {
  const { palette, highContrast } = useVolume().state.volume;

  return (
    <div className='panel px-5 py-5.5 sm:px-6'>
      <h3 className='font-bold text-xl'>Contrast, measured</h3>
      <p className='mt-1 text-ink/75 text-sm'>
        Against the <VolumeName /> editor background,{' '}
        <span className='font-mono'>{palette.background}</span>.
      </p>
      <table className='mt-3.5 w-full text-left text-[15px] tabular-nums'>
        <thead className='sr-only'>
          <tr>
            <th scope='col'>Swatch</th>
            <th scope='col'>Token</th>
            <th scope='col'>Color</th>
            <th scope='col'>Contrast and WCAG level</th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_TOKENS.map(({ label, key }) => {
            const color = palette[key];
            const ratio = contrastRatio(color, palette.background);
            const level = wcagLevel(ratio);
            return (
              <tr key={key} className='border-ink/15 border-b'>
                <td className='w-6 py-2.5'>
                  <span
                    aria-hidden
                    className='block size-3.5 shadow-[inset_0_0_0_1px_rgb(0_0_0/0.2)] motion-safe:transition-colors motion-safe:duration-500'
                    style={{ backgroundColor: color }}
                  />
                </td>
                <th scope='row' className='py-2.5 font-normal'>
                  {label}
                </th>
                <td className='py-2.5 text-right font-mono text-sm'>
                  <SwapText>{color}</SwapText>
                </td>
                <td className='py-2.5 text-right font-mono text-sm'>
                  <SwapText>{formatRatio(ratio)}</SwapText>
                  <span
                    className={`ml-2.5 inline-block min-w-10 px-1.5 py-0.5 text-center font-semibold text-[11px] ${LEVEL_CLASS[level]}`}
                  >
                    {level}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className='mt-3.5 text-ink/75 text-sm'>
        {highContrast
          ? 'High contrast volume: every token clears WCAG AAA (7:1).'
          : 'Every token clears WCAG AA (4.5:1). Ratios round down, so 4.46:1 never shows as 4.5:1.'}
      </p>
    </div>
  );
}
