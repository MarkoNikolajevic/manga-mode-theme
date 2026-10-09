'use client';

import { createContext, type ReactNode, use, useState } from 'react';
import { paletteVars, type Volume } from '@/lib/volumes';

interface VolumeContextValue {
  state: { volumes: Volume[]; volume: Volume };
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
  const volume =
    volumes.find((candidate) => candidate.issue === issue) ?? volumes[0];

  return (
    <VolumeContext
      value={{
        state: { volumes, volume },
        actions: { selectVolume: setIssue },
      }}
    >
      {children}
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
    <div className={className} style={paletteVars(volume.palette)}>
      {children}
    </div>
  );
}

export function VolumeName() {
  return useVolume().state.volume.name;
}
