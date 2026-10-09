import { OPEN_VSX_URL, VS_CODE_MARKETPLACE_URL } from '@/lib/links';

const BUTTON = 'rounded-full border-2 border-ink px-5 py-2.5 font-bold text-sm';

export function InstallLinks() {
  return (
    <div className='flex flex-wrap gap-3'>
      <a
        href={VS_CODE_MARKETPLACE_URL}
        className={`${BUTTON} bg-ink text-paper`}
      >
        Install for VS Code
      </a>
      <a
        href={OPEN_VSX_URL}
        className={`${BUTTON} bg-paper hover:bg-ink hover:text-paper`}
      >
        Install for Cursor
      </a>
    </div>
  );
}
