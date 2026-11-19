'use client';

import { useState } from 'react';
import { SwapText } from './motion';

const STATUS_LABEL = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Copy failed',
} as const;

/** A terminal command with a copy button, drawn for the ink install band. */
export function CopyCommand({ command }: { command: string }) {
  const [status, setStatus] = useState<keyof typeof STATUS_LABEL>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    setTimeout(() => setStatus('idle'), 2000);
  }

  return (
    <div className='flex min-w-0 shadow-[inset_0_0_0_1.5px_var(--color-graphite)]'>
      <code className='min-w-0 flex-1 overflow-x-auto whitespace-nowrap px-4 py-3.5 font-mono text-sm'>
        {command}
      </code>
      <button
        type='button'
        onClick={copy}
        className='min-h-11 min-w-24 shrink-0 cursor-pointer border-graphite border-l-[1.5px] px-4.5 font-semibold text-sm hover:bg-paper hover:text-ink focus-visible:outline-paper motion-safe:transition-colors'
      >
        <span aria-live='polite'>
          <SwapText>{STATUS_LABEL[status]}</SwapText>
        </span>
      </button>
    </div>
  );
}
