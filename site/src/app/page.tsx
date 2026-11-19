import Image from 'next/image';
import { Fragment } from 'react';
import { CodeSample } from '@/components/code-sample';
import { ContrastTable } from '@/components/contrast-table';
import { EditorWindow } from '@/components/editor-window';
import { ExpandPreview } from '@/components/expand-preview';
import { InstallTabs } from '@/components/install-tabs';
import { TuningBench } from '@/components/tuning-bench';
import {
  HourSix,
  VolumeProvider,
  VolumeSurface,
} from '@/components/volume-context';
import { VolumeHeader } from '@/components/volume-header';
import { VolumeShelf } from '@/components/volume-shelf';
import { getInstallCount } from '@/lib/install-count';
import { AUTHOR_URL, GITHUB_URL, README_URL } from '@/lib/links';
import { VOLUMES } from '@/lib/volume-catalog';
import logo from '../../../images/icon.png';

const CONTAINER = 'mx-auto w-full max-w-7xl px-4 sm:px-6';
const SECTION_HEADING = 'font-display text-4xl sm:text-5xl';
const HEADLINE = 'Anime themes that don’t shout.';
const NAV = [
  ['#volumes', 'Volumes'],
  ['#tune', 'Tune a color'],
  ['#install', 'Install'],
] as const;

function SiteHeader() {
  return (
    <header
      className={`${CONTAINER} flex flex-wrap items-center justify-between gap-4 py-5`}
    >
      <a href='/' className='flex items-center gap-2.5 font-display text-xl'>
        <Image src={logo} alt='' className='size-8.5 rounded-md' priority />
        MangaMode
      </a>
      <nav aria-label='Main' className='flex items-center gap-6 text-[15px]'>
        <ul className='hidden gap-6 md:flex'>
          {NAV.map(([href, label]) => (
            <li key={href}>
              <a href={href} className='underline-offset-4 hover:underline'>
                {label}
              </a>
            </li>
          ))}
          <li>
            <a href={GITHUB_URL} className='underline-offset-4 hover:underline'>
              GitHub <span aria-hidden>↗</span>
            </a>
          </li>
        </ul>
        {/* The strip under the button takes the open volume's accent. */}
        <a
          href='#install'
          className='relative overflow-hidden bg-ink px-4.5 py-2.75 font-semibold text-paper after:absolute after:inset-x-0 after:bottom-0 after:h-0.75 after:bg-accent hover:bg-ink/85 motion-safe:after:transition-colors motion-safe:after:duration-400'
        >
          Install
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      aria-labelledby='hero-heading'
      className='grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]'
    >
      <div className='panel flex items-end p-6 motion-safe:animate-panel-in sm:p-11'>
        <h1
          id='hero-heading'
          aria-label={HEADLINE}
          className='font-display text-5xl tracking-[-0.025em] sm:text-7xl xl:text-8xl'
        >
          {HEADLINE.split(' ').map((word, index) => (
            <Fragment key={word}>
              {index > 0 && ' '}
              <span
                aria-hidden
                className='my-[-0.1em] inline-block overflow-hidden py-[0.1em] align-bottom'
              >
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
      </div>
      <div className='panel halftone relative grid place-items-center px-5.5 pt-14 pb-14 motion-safe:animate-panel-in motion-safe:[animation-delay:100ms] lg:min-h-72'>
        <p className='absolute top-3 left-3 border-2 border-ink bg-paper px-2.5 py-1 font-bold text-xs'>
          <HourSix />
        </p>
        {/* Speech balloon; the tail overlaps its border so the two read as one line. */}
        <p className='relative max-w-90 rounded-[50%] border-[2.5px] border-ink bg-paper px-10 py-11 text-center text-lg/snug motion-safe:animate-sfx-pop motion-safe:[animation-delay:450ms]'>
          Ten manga-inspired color themes for{' '}
          <strong>VS Code, Cursor and Zed</strong>. Calm backgrounds, measured
          contrast, made for long sessions.
          <svg
            aria-hidden='true'
            viewBox='0 0 40 40'
            className='absolute -bottom-9 left-1/4 size-10 overflow-visible'
          >
            <polygon points='0,-3 34,-3 4,38' className='fill-paper' />
            <polyline
              points='0,3 4,38 34,1'
              className='fill-none stroke-[2.5] stroke-ink [stroke-linejoin:round]'
            />
          </svg>
        </p>
      </div>
    </section>
  );
}

function VolumesSection() {
  return (
    <section id='volumes' aria-label='Volumes' className='scroll-mt-6'>
      <VolumeShelf />
      <div className='mt-10 grid items-start gap-3 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]'>
        <div className='lg:col-span-2'>
          <VolumeHeader />
        </div>
        <figure className='min-w-0'>
          <VolumeSurface className='panel flex min-w-0 flex-col bg-(--tok-bg) motion-safe:transition-colors motion-safe:duration-500'>
            <ExpandPreview>
              <EditorWindow className='flex-1'>
                <div className='flex-1'>
                  <CodeSample />
                </div>
              </EditorWindow>
            </ExpandPreview>
          </VolumeSurface>
          <figcaption className='mt-3 text-sm'>
            Nested brackets use three shades of one hue, so each level stays
            distinct.
          </figcaption>
        </figure>
        <ContrastTable />
      </div>
    </section>
  );
}

function TuneSection() {
  return (
    <section id='tune' aria-labelledby='tune-heading' className='scroll-mt-6'>
      <div className='flex flex-wrap items-end justify-between gap-4'>
        <h2 id='tune-heading' className={SECTION_HEADING}>
          Try to make it louder
        </h2>
        <p className='max-w-sm text-sm/6'>
          Pick a syntax color and drag its lightness slider. Watch the preview
          and contrast ratio change. This only changes the preview.
        </p>
      </div>
      <div className='mt-6'>
        <TuningBench />
      </div>
    </section>
  );
}

async function InstallSection() {
  const installs = await getInstallCount();

  return (
    <section
      id='install'
      aria-labelledby='install-heading'
      className='scroll-mt-6 bg-ink text-paper'
    >
      <div
        className={`${CONTAINER} grid gap-9 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)_auto] lg:gap-12`}
      >
        <div>
          <h2
            id='install-heading'
            className='font-display text-[2.125rem] tracking-[-0.03em] sm:text-6xl xl:text-7xl'
          >
            To be continued in your editor.
          </h2>
          <p className='mt-4.5 max-w-[42ch] text-paper/80'>
            Free and open source under the MIT license. One extension installs
            all ten volumes.
            {installs === null
              ? null
              : ` ${new Intl.NumberFormat('en').format(installs)} installs and downloads so far.`}
          </p>
        </div>
        <InstallTabs />
        {/* つづく: "to be continued", printed on a chapter's last page. */}
        <p
          lang='ja'
          aria-hidden
          className='-order-1 self-start font-sfx text-[2.5rem] text-accent-ink leading-none tracking-[0.08em] motion-safe:transition-colors motion-safe:duration-400 lg:order-none lg:text-6xl lg:[writing-mode:vertical-rl]'
        >
          つづく
        </p>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer
      className={`${CONTAINER} flex flex-wrap justify-between gap-4 py-7 text-sm text-ink/75`}
    >
      <p className='max-w-md'>
        MangaMode is an independent fan project, not affiliated with or endorsed
        by the owners of the series named here.
      </p>
      <p>
        Made by{' '}
        <a href={AUTHOR_URL} className='underline underline-offset-4'>
          Marko Nikolajevic
        </a>
        {' · '}
        <a href={README_URL} className='underline underline-offset-4'>
          Source on GitHub
        </a>
      </p>
    </footer>
  );
}

export default function Home() {
  return (
    <VolumeProvider volumes={VOLUMES}>
      <SiteHeader />
      <main>
        <div className={`${CONTAINER} flex flex-col gap-20 pt-3 pb-20`}>
          <Hero />
          <VolumesSection />
          <TuneSection />
        </div>
        <InstallSection />
      </main>
      <SiteFooter />
    </VolumeProvider>
  );
}
