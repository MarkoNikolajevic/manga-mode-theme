import Image from 'next/image';
import { Fragment } from 'react';
import { CalmComparison } from '@/components/calm-comparison';
import { CalmerNotes } from '@/components/calmer-notes';
import { CodeSample } from '@/components/code-sample';
import { ContrastTable } from '@/components/contrast-table';
import { CopyCommand } from '@/components/copy-command';
import { InstallLinks } from '@/components/install-links';
import { Reveal } from '@/components/motion';
import {
  VolumeName,
  VolumeProvider,
  VolumeSurface,
} from '@/components/volume-context';
import { VolumeShelf } from '@/components/volume-shelf';
import { getInstallCount } from '@/lib/install-count';
import {
  AUTHOR_URL,
  GITHUB_URL,
  INSTALL_COMMAND,
  README_URL,
} from '@/lib/links';
import { VOLUMES } from '@/lib/volumes';
import logo from '../../../images/icon.png';

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6';
const SECTION_HEADING = 'font-display text-4xl sm:text-5xl';
const HEADLINE = "Anime themes that don't shout.";

function SiteHeader() {
  return (
    <header
      className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4 py-5`}
    >
      <a href='/' className='flex items-center gap-2.5 font-display text-xl'>
        <Image src={logo} alt='' className='size-8 rounded-md' />
        MangaMode
      </a>
      <nav aria-label='Main'>
        <ul className='flex gap-5 text-sm underline underline-offset-4'>
          <li>
            <a href='#calmer'>Why it&apos;s calmer</a>
          </li>
          <li>
            <a href='#contrast'>Contrast</a>
          </li>
          <li>
            <a href='#install'>Install</a>
          </li>
          <li>
            <a href={GITHUB_URL}>GitHub</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      aria-labelledby='hero-heading'
      className='flex flex-col gap-5 md:[--slant:3rem]'
    >
      <div className='ink-outline grid gap-5 md:grid-cols-[3fr_2fr] md:gap-3'>
        <div className='bg-paper p-8 motion-safe:animate-panel-in sm:p-12 md:slash-end md:pr-20'>
          <h1
            id='hero-heading'
            aria-label={HEADLINE}
            className='font-display text-5xl sm:text-7xl'
          >
            {HEADLINE.split(' ').map((word, index) => (
              <Fragment key={word}>
                {index > 0 && ' '}
                <span aria-hidden className='-my-[0.1em] inline-block overflow-hidden py-[0.1em] align-bottom'>
                  <span
                    className='inline-block motion-safe:animate-rise'
                    style={{ animationDelay: `${150 + index * 70}ms` }}
                  >
                    {word}
                  </span>
                </span>
              </Fragment>
            ))}
          </h1>
          <p className='mt-6 max-w-sm text-sm/6 motion-safe:animate-panel-in motion-safe:[animation-delay:450ms]'>
            Eight VS Code and Cursor themes drawn from manga palettes and tuned
            for long sessions. Soft backgrounds, three-tone brackets, and every
            text color passes WCAG AA.
          </p>
        </div>
        <div className='halftone relative flex min-h-64 flex-col justify-between bg-paper p-6 motion-safe:animate-panel-in motion-safe:[animation-delay:100ms] md:slash-start md:pl-16'>
          <p className='self-start border-2 border-ink bg-paper px-3 py-1.5 font-bold text-xs motion-safe:animate-panel-in motion-safe:[animation-delay:400ms]'>
            Hour six of the refactor.
          </p>
          <p
            aria-hidden
            className='-rotate-12 self-end font-display text-7xl text-paper [paint-order:stroke_fill] [-webkit-text-stroke:6px_var(--color-ink)] motion-safe:animate-sfx-pop motion-safe:[animation-delay:700ms] sm:text-8xl'
          >
            shhh
          </p>
        </div>
      </div>

      <div className='ink-outline grid gap-5 md:grid-cols-[3fr_2fr] md:gap-3'>
        <VolumeSurface className='min-w-0 bg-(--tok-bg) motion-safe:animate-panel-in motion-safe:transition-colors motion-safe:duration-500 motion-safe:[animation-delay:200ms] md:backslash-end md:pr-12'>
          <div className='flex justify-between border-(--tok-line)/30 border-b px-4 py-2 font-mono text-(--tok-line) text-xs motion-safe:transition-colors motion-safe:duration-500 sm:px-6'>
            <span>chapter.ts</span>
            <span>
              MangaMode: <VolumeName />
            </span>
          </div>
          <CodeSample />
        </VolumeSurface>
        <div className='min-w-0 bg-paper p-6 motion-safe:animate-panel-in motion-safe:[animation-delay:300ms] md:backslash-start md:pl-16'>
          <VolumeShelf />
        </div>
      </div>

      <InstallStrip />
    </section>
  );
}

async function InstallStrip() {
  const installs = await getInstallCount();

  return (
    <div className='flex flex-wrap items-center justify-between gap-4 border-2 border-ink px-6 py-4 motion-safe:animate-panel-in motion-safe:[animation-delay:400ms]'>
      <p className='text-sm'>
        Free on both marketplaces
        {installs === null
          ? '.'
          : `, installed ${new Intl.NumberFormat('en').format(installs)} times so far.`}
      </p>
      <InstallLinks />
    </div>
  );
}

function CalmerSection() {
  return (
    <section
      id='calmer'
      aria-labelledby='calmer-heading'
      className='scroll-mt-6'
    >
      <Reveal>
        <h2 id='calmer-heading' className={SECTION_HEADING}>
          Why it&apos;s calmer
        </h2>
      </Reveal>
      <div className='mt-6 grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-14'>
        <Reveal>
          <figure>
            <CalmComparison code={<CodeSample />} />
            <figcaption className='mt-3 text-xs'>
              The loud theme on the left is invented for this comparison.
            </figcaption>
          </figure>
        </Reveal>
        <CalmerNotes />
      </div>
    </section>
  );
}

function ContrastSection() {
  return (
    <section
      id='contrast'
      aria-labelledby='contrast-heading'
      className='scroll-mt-6'
    >
      <Reveal className='flex flex-wrap items-end justify-between gap-4'>
        <h2 id='contrast-heading' className={SECTION_HEADING}>
          Every color, measured
        </h2>
        <p className='max-w-sm text-xs/5'>
          Ratios for <VolumeName /> against its editor background. Pick another
          volume from the shelf and the table follows. The same check runs on
          every release, so a color that fails never ships.
        </p>
      </Reveal>
      <div className='mt-4'>
        <ContrastTable />
      </div>
    </section>
  );
}

function InstallSection() {
  return (
    <section
      id='install'
      aria-labelledby='install-heading'
      className='halftone scroll-mt-6 border-2 border-ink px-4 py-12 sm:py-16'
    >
      <Reveal className='mx-auto flex max-w-2xl flex-col gap-6 border-2 border-ink bg-paper p-6 sm:p-8'>
        <h2 id='install-heading' className={SECTION_HEADING}>
          To be continued in your editor
        </h2>
        <InstallLinks />
        <CopyCommand command={INSTALL_COMMAND} />
        <p className='text-xs'>
          MIT licensed.{' '}
          <a href={GITHUB_URL} className='underline underline-offset-4'>
            Read the source on GitHub
          </a>
          .
        </p>
      </Reveal>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className={CONTAINER}>
      <div className='flex flex-wrap justify-between gap-4 border-ink border-t-2 py-6 text-xs'>
        <p className='max-w-xs'>
          MangaMode is an independent fan project, not affiliated with or
          endorsed by the owners of the series named here.
        </p>
        <p>
          Made by{' '}
          <a href={AUTHOR_URL} className='underline underline-offset-4'>
            Marko Nikolajevic
          </a>
          {' · '}
          <a href={README_URL} className='underline underline-offset-4'>
            How it was built
          </a>
        </p>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <VolumeProvider volumes={VOLUMES}>
      <SiteHeader />
      <main className={`${CONTAINER} flex flex-col gap-20 pb-20`}>
        <Hero />
        <CalmerSection />
        <ContrastSection />
        <InstallSection />
      </main>
      <SiteFooter />
    </VolumeProvider>
  );
}
