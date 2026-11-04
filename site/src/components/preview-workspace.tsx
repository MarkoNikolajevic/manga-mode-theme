'use client';

import { useId, useState } from 'react';
import { CodeSample } from './code-sample';
import { EditorWindow } from './editor-window';
import { InstallLinks } from './install-links';
import { LANGUAGES, SAMPLE_LINES } from './preview-samples';
import { useVolume, VolumeSurface } from './volume-context';

export default function PreviewWorkspace() {
  const {
    state: { volume, volumes },
    actions: { selectVolume },
  } = useVolume();
  const [language, setLanguage] = useState<(typeof LANGUAGES)[number]>(
    LANGUAGES[0],
  );
  const themeId = useId();
  const languageId = useId();

  return (
    <div className='p-4 sm:p-6'>
      <div className='mb-5 flex flex-wrap items-end justify-between gap-5'>
        <div>
          <label htmlFor={themeId} className='mb-2 block font-bold text-xs'>
            Volume
          </label>
          <select
            id={themeId}
            value={volume.issue}
            onChange={(event) => selectVolume(Number(event.target.value))}
            className='min-h-11 max-w-full border-2 border-ink bg-paper px-3 text-ink text-sm'
          >
            {volumes.map(({ issue, name, appearance }) => (
              <option key={issue} value={issue}>
                {name} · {appearance}
              </option>
            ))}
          </select>
        </div>
        <fieldset>
          <legend className='mb-2 font-bold text-xs'>Code sample</legend>
          <div className='flex flex-wrap gap-2'>
            {LANGUAGES.map((option) => (
              <label
                key={option.id}
                className='relative flex min-h-11 cursor-pointer items-center border-2 border-ink px-3 text-sm has-checked:bg-ink has-checked:text-paper has-focus-visible:outline-2 has-focus-visible:outline-ink has-focus-visible:outline-offset-2'
              >
                <input
                  type='radio'
                  name={languageId}
                  checked={language.id === option.id}
                  value={option.id}
                  onChange={() => setLanguage(option)}
                  className='sr-only'
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>
      </div>
      <VolumeSurface className='overflow-hidden border-2 border-ink bg-(--tok-bg)'>
        <EditorWindow fileName={language.fileName}>
          <div className='min-h-96'>
            <CodeSample
              lines={
                language.id === 'typescript'
                  ? undefined
                  : SAMPLE_LINES[language.id]
              }
            />
          </div>
        </EditorWindow>
      </VolumeSurface>
      <div className='mt-5 flex flex-wrap items-center justify-between gap-4'>
        <p aria-live='polite' className='max-w-md text-sm/6'>
          <strong>
            {volume.name} · {volume.appearance}.
          </strong>{' '}
          {volume.description}
        </p>
        <InstallLinks />
      </div>
      <p className='mt-4 text-xs/5'>
        An illustrative preview using the shipped palette. Syntax highlighting
        in your editor varies by language and extensions.
      </p>
    </div>
  );
}
