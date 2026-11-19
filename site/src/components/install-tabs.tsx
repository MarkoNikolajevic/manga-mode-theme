'use client';

import { type KeyboardEvent, type ReactNode, useId, useState } from 'react';
import {
  EXTENSION_ID,
  GITHUB_URL,
  INSTALL_COMMAND,
  OPEN_VSX_URL,
  VS_CODE_MARKETPLACE_URL,
  ZED_SETUP_URL,
} from '@/lib/links';
import { CopyCommand } from './copy-command';
import { VolumeName } from './volume-context';

const PICK_THEME = (
  <>
    Open the Command Palette and run <b>Preferences: Color Theme</b>, then pick{' '}
    <b>
      MangaMode: <VolumeName />
    </b>
    .
  </>
);

const EDITORS: {
  id: string;
  label: string;
  command: string;
  steps: ReactNode[];
}[] = [
  {
    id: 'vscode',
    label: 'VS Code',
    command: INSTALL_COMMAND,
    steps: [
      <>
        Run the command, or install it from the{' '}
        <a href={VS_CODE_MARKETPLACE_URL}>Visual Studio Marketplace</a>.
      </>,
      PICK_THEME,
    ],
  },
  {
    id: 'cursor',
    label: 'Cursor',
    command: `cursor --install-extension ${EXTENSION_ID}`,
    steps: [
      <>
        Run the command, or search <b>MangaMode</b> in the Extensions view.
        Cursor installs it from <a href={OPEN_VSX_URL}>Open VSX</a>.
      </>,
      PICK_THEME,
    ],
  },
  {
    id: 'zed',
    label: 'Zed',
    command: `git clone ${GITHUB_URL}.git`,
    steps: [
      <>
        MangaMode isn&apos;t in the Zed registry yet. Clone the repository, then
        run <b>zed: install dev extension</b> and choose its <code>zed</code>{' '}
        folder.
      </>,
      <>
        Run <b>theme selector: toggle</b> and pick{' '}
        <b>
          MangaMode: <VolumeName />
        </b>
        . <a href={ZED_SETUP_URL}>Zed setup notes</a>.
      </>,
    ],
  },
];

/** Install steps per editor, as an ARIA tab set with arrow-key navigation. */
export function InstallTabs() {
  const baseId = useId();
  const [selected, setSelected] = useState(0);
  const editor = EDITORS[selected];
  const tabId = (index: number) => `${baseId}-tab-${EDITORS[index].id}`;

  function onKeyDown(event: KeyboardEvent) {
    const last = EDITORS.length - 1;
    const next = {
      ArrowRight: selected === last ? 0 : selected + 1,
      ArrowLeft: selected === 0 ? last : selected - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setSelected(next);
    document.getElementById(tabId(next))?.focus();
  }

  return (
    <div className='min-w-0'>
      <div
        role='tablist'
        aria-label='Editor'
        onKeyDown={onKeyDown}
        className='flex flex-wrap gap-1.5'
      >
        {EDITORS.map(({ id, label }, index) => (
          <button
            key={id}
            id={tabId(index)}
            type='button'
            role='tab'
            aria-selected={index === selected}
            aria-controls={`${baseId}-panel`}
            tabIndex={index === selected ? 0 : -1}
            onClick={() => setSelected(index)}
            className='cursor-pointer px-4 py-2.5 font-semibold text-[15px] shadow-[inset_0_0_0_1.5px_var(--color-graphite)] focus-visible:outline-paper aria-selected:bg-paper aria-selected:text-ink'
          >
            {label}
          </button>
        ))}
      </div>
      <div
        role='tabpanel'
        id={`${baseId}-panel`}
        aria-labelledby={tabId(selected)}
        className='mt-4'
      >
        <CopyCommand command={editor.command} />
        <ol className='mt-7 grid gap-4.5 text-[15px] text-paper/80 [counter-reset:step] [&_a]:underline [&_a]:underline-offset-4 [&_b]:font-semibold [&_b]:text-paper'>
          {editor.steps.map((step, index) => (
            <li
              // biome-ignore lint/suspicious/noArrayIndexKey: Steps are a fixed ordered list per editor.
              key={index}
              className='grid grid-cols-[2.125rem_1fr] before:pt-0.5 before:font-mono before:text-[13px] before:text-accent-ink before:content-[counter(step,decimal-leading-zero)] before:[counter-increment:step] before:motion-safe:transition-colors'
            >
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
