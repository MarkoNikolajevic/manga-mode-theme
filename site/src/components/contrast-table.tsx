'use client';

import {
  contrastRatio,
  formatRatio,
  type WcagLevel,
  wcagLevel,
} from '@/lib/contrast';
import { CONTRAST_TOKENS } from '@/lib/volumes';
import { useVolume } from './volume-context';

const LEVEL_CLASS: Record<WcagLevel, string> = {
  AAA: 'bg-ink text-paper',
  AA: 'bg-paper text-ink',
  Fail: 'bg-paper text-ink line-through',
};

export function ContrastTable() {
  const { palette } = useVolume().state.volume;

  return (
    <div className='overflow-x-auto border-2 border-ink'>
      <table className='w-full min-w-xl text-left text-sm'>
        <thead className='border-ink border-b-2 text-xs'>
          <tr>
            {['Token', 'Sample', 'Color', 'Contrast', 'WCAG level'].map(
              (heading) => (
                <th key={heading} scope='col' className='px-4 py-3 font-bold'>
                  {heading}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody className='divide-y-2 divide-ink'>
          {CONTRAST_TOKENS.map(({ label, key }) => {
            const color = palette[key];
            const ratio = contrastRatio(color, palette.background);
            const level = wcagLevel(ratio);
            return (
              <tr key={key}>
                <th scope='row' className='px-4 py-3 font-normal'>
                  {label}
                </th>
                <td className='px-4 py-3'>
                  <span
                    aria-hidden
                    className='inline-block px-2 py-1 font-mono text-xs'
                    style={{ backgroundColor: palette.background, color }}
                  >
                    Aa
                  </span>
                </td>
                <td className='px-4 py-3 font-mono text-xs'>{color}</td>
                <td className='px-4 py-3 font-mono text-xs'>
                  {formatRatio(ratio)}
                </td>
                <td className='px-4 py-3'>
                  <span
                    className={`inline-block min-w-14 rounded-full border-2 border-ink px-3 py-0.5 text-center font-bold text-xs ${LEVEL_CLASS[level]}`}
                  >
                    {level}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
