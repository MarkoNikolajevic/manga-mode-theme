'use client';

import dynamic from 'next/dynamic';
import { type ReactNode, useEffect, useId, useRef, useState } from 'react';
import { VolumeName } from './volume-context';

// Keep the larger workspace and its samples out of the initial page bundle.
// https://nextjs.org/docs/app/guides/lazy-loading#importing-client-components
const PreviewWorkspace = dynamic(() => import('./preview-workspace'), {
  loading: () => (
    <p role='status' className='p-8'>
      Opening your preview…
    </p>
  ),
});

export function ExpandPreview({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <>
      {children}
      <div className='flex justify-end bg-(--tok-bg) px-4 py-3 md:pr-16'>
        <button
          type='button'
          aria-haspopup='dialog'
          onClick={() => {
            dialogRef.current?.showModal();
            setOpen(true);
          }}
          className='cursor-pointer border-2 border-paper bg-paper px-3 py-2 font-bold text-ink text-xs hover:underline focus-visible:outline-(--tok-function) motion-safe:transition-transform motion-safe:active:scale-97'
        >
          Expand preview <span aria-hidden>↗</span>
        </button>
      </div>
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        className='preview-dialog fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-6xl overflow-y-auto overscroll-contain border-2 border-ink bg-paper p-0 text-ink backdrop:bg-ink/65'
      >
        <div className='sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-ink border-b-2 bg-paper px-4 py-4 sm:px-6'>
          <h2 id={titleId} className='font-display text-xl sm:text-2xl'>
            Inside the editor · <VolumeName />
          </h2>
          <button
            type='button'
            onClick={() => dialogRef.current?.close()}
            className='min-h-10 cursor-pointer border-2 border-ink px-4 font-bold text-xs hover:bg-ink hover:text-paper'
          >
            Close <span aria-hidden>×</span>
          </button>
        </div>
        {open ? <PreviewWorkspace /> : null}
      </dialog>
    </>
  );
}
