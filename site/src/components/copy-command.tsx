'use client';

import { useState } from 'react';
import { SwapText } from './motion';

const STATUS_LABEL = {
  idle: 'Copy',
  copied: 'Copied',
  failed: 'Copy failed',
} as const;

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
    <div className='flex flex-col overflow-hidden rounded-2xl border-2 border-ink sm:flex-row sm:rounded-full'>
      <code className='min-w-0 flex-1 overflow-x-auto whitespace-pre-wrap break-all px-4 py-2.5 font-mono text-xs sm:whitespace-nowrap sm:break-normal sm:text-sm'>
        {command}
      </code>
      <button
        type='button'
        onClick={copy}
        className='min-h-11 min-w-32 shrink-0 cursor-pointer bg-ink px-6 font-bold text-paper text-sm hover:bg-ink/85 motion-safe:transition-colors'
      >
        <span aria-live='polite'>
          <SwapText>{STATUS_LABEL[status]}</SwapText>
        </span>
      </button>
    </div>
  );
}
