'use client';

import {
  type CSSProperties,
  createContext,
  type ReactNode,
  use,
  useState,
} from 'react';
import { hourSixCaption, noteRead, shelfIsRead } from '@/lib/easter-eggs';
import { paletteVars, type Volume } from '@/lib/volumes';
import { SwapText } from './motion';

interface VolumeContextValue {
  state: { volumes: Volume[]; volume: Volume; shelfRead: boolean };
  actions: { selectVolume: (issue: number) => void };
}

const VolumeContext = createContext<VolumeContextValue | null>(null);

export function VolumeProvider({
  volumes,
  children,
}: {
  volumes: Volume[];
  children: ReactNode;
}) {
  const [issue, setIssue] = useState(volumes[0].issue);
  // The volume on screen when the page loads already counts as read.
  const [read, setRead] = useState<ReadonlySet<number>>(
    () => new Set([volumes[0].issue]),
  );
  const volume =
    volumes.find((candidate) => candidate.issue === issue) ?? volumes[0];
  const shelfRead = shelfIsRead(
    read,
    volumes.map((candidate) => candidate.issue),
  );

  return (
    <VolumeContext
      value={{
        state: { volumes, volume, shelfRead },
        actions: {
          selectVolume: (next) => {
            setIssue(next);
            setRead((current) => noteRead(current, next));
          },
        },
      }}
    >
      {/* `contents` keeps layout untouched while every page element inherits the selection color. */}
      <div
        className='contents'
        style={{ '--sel-page-bg': volume.selection.page } as CSSProperties}
      >
        {children}
      </div>
    </VolumeContext>
  );
}

export function useVolume() {
  const context = use(VolumeContext);
  if (!context)
    throw new Error('useVolume must be used inside <VolumeProvider>');
  return context;
}

/** Paints its children with the selected volume's palette variables. */
export function VolumeSurface({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { volume } = useVolume().state;
  return (
    <div
      data-volume-surface
      data-selection-text={volume.selection.editorText ? '' : undefined}
      className={className}
      style={
        {
          ...paletteVars(volume.palette),
          '--sel-editor-bg': volume.selection.editor,
          ...(volume.selection.editorText && {
            '--sel-editor-fg': volume.selection.editorText,
          }),
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
}

export function VolumeName() {
  return <SwapText>{useVolume().state.volume.name}</SwapText>;
}

/** Hero caption. Switches once every volume on the shelf has been opened. */
export function HourSix() {
  return <SwapText>{hourSixCaption(useVolume().state.shelfRead)}</SwapText>;
}
