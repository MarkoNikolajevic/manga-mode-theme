import { cacheLife } from 'next/cache';
import { EXTENSION_ID } from './links';

async function fetchJson(url: string, init?: RequestInit): Promise<unknown> {
  const response = await fetch(url, init);
  if (!response.ok) throw new Error(`${url} responded ${response.status}`);
  return response.json();
}

function assertCount(value: unknown, source: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`${source} returned no install count`);
  }
  return value;
}

async function fetchVsMarketplaceInstalls() {
  const body = await fetchJson(
    'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json;api-version=7.2-preview.1',
      },
      body: JSON.stringify({
        filters: [{ criteria: [{ filterType: 7, value: EXTENSION_ID }] }],
        flags: 256, // IncludeStatistics
      }),
    },
  );
  const statistics = (
    body as {
      results?: {
        extensions?: {
          statistics?: { statisticName: string; value: number }[];
        }[];
      }[];
    }
  ).results?.[0]?.extensions?.[0]?.statistics;
  const installs = statistics?.find(
    (stat) => stat.statisticName === 'install',
  )?.value;
  return assertCount(installs, 'VS Marketplace');
}

async function fetchOpenVsxDownloads() {
  const body = await fetchJson(
    'https://open-vsx.org/api/markonikolajevic/mangamode',
  );
  return assertCount(
    (body as { downloadCount?: unknown }).downloadCount,
    'Open VSX',
  );
}

/** Combined installs across both marketplaces, or `null` if either is unreachable. */
export async function getInstallCount(): Promise<number | null> {
  'use cache';
  cacheLife('days');

  try {
    const [vsCode, openVsx] = await Promise.all([
      fetchVsMarketplaceInstalls(),
      fetchOpenVsxDownloads(),
    ]);
    return vsCode + openVsx;
  } catch (error) {
    console.error('Install count unavailable:', error);
    return null;
  }
}
