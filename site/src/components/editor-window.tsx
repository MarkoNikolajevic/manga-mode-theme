'use client';

import type { ReactNode } from 'react';
import { chromeVars } from '@/lib/volumes';
import { useVolume, VolumeName } from './volume-context';

const ACTIVE_FILE = 'chapter.ts';

// Files, search, source control, extensions: outline glyphs in the activity bar.
const ACTIVITY_ICONS = [
  'M6 3h8l4 4v14H6zM14 3v4h4',
  'M10.5 17a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM15.5 15.5 21 21',
  'M7 4v16M7 8a4 4 0 0 0 4 4h2a4 4 0 0 1 4 4M17 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  'M4 4h7v7H4zM13 13h7v7h-7zM4 13h7v7H4zM15 3l5 5-5 5-5-5z',
];

/**
 * VS Code chrome around the code sample, colored from the selected volume's
 * workbench colors. No explorer: at hero width it would push the code into
 * horizontal scroll. The activity bar hides when the panel is narrow.
 */
export function EditorWindow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { chrome } = useVolume().state.volume;

  return (
    <div
      className={`@container flex flex-col font-mono text-xs [&_*]:motion-safe:transition-colors [&_*]:motion-safe:duration-500 ${className ?? ''}`}
      style={chromeVars(chrome)}
    >
      <div className='flex min-h-0 flex-1'>
        <div
          aria-hidden
          className='hidden w-10 shrink-0 flex-col items-center gap-4 bg-(--ed-activityBar-background) py-3 text-(--ed-activityBar-foreground) @md:flex'
        >
          {ACTIVITY_ICONS.map((path, index) => (
            <span key={path} className='relative'>
              <svg
                aria-hidden='true'
                viewBox='0 0 24 24'
                className={`size-4 fill-none stroke-2 stroke-current ${index > 0 ? 'opacity-50' : ''}`}
              >
                <path d={path} />
              </svg>
              {index === 0 && (
                <span className='absolute -right-1 -bottom-1 size-2 rounded-full bg-(--ed-activityBarBadge-background)' />
              )}
            </span>
          ))}
        </div>

        <div className='flex min-w-0 flex-1 flex-col'>
          <div
            aria-hidden
            className='flex bg-(--ed-editorGroupHeader-tabsBackground)'
          >
            <span className='border-(--ed-tab-activeBorder) border-b-2 bg-(--ed-tab-activeBackground) px-3 py-1.5 text-(--ed-tab-activeForeground)'>
              {ACTIVE_FILE}
            </span>
            <span className='bg-(--ed-tab-inactiveBackground) px-3 py-1.5 text-(--ed-tab-inactiveForeground)'>
              volumes.json
            </span>
          </div>
          {children}
        </div>
      </div>

      <div className='flex justify-between gap-4 bg-(--ed-statusBar-background) px-3 py-1 text-(--ed-statusBar-foreground)'>
        <span aria-hidden>main</span>
        <span>
          MangaMode: <VolumeName />
        </span>
      </div>
    </div>
  );
}
