/** Quiet status-bar branch for each volume. Original words, not catchphrases. */
const BRANCH_BY_NAME: Record<string, string> = {
  'One Piece': 'grand-line',
  Pokemon: 'pallet',
  'Dragon Ball': 'kame',
  'Demon Slayer': 'nichirin',
  'Jujutsu Kaisen': 'domain',
  DanDaDan: 'occult',
  'Sailor Moon': 'moon',
  'Death Note': 'notebook',
};

export function branchFor(name: string): string {
  const branch = BRANCH_BY_NAME[name];
  if (!branch) throw new Error(`${name} has no status-bar branch`);
  return branch;
}

/** Adds a volume the reader opened. The same set comes back if it was already read. */
export function noteRead(
  read: ReadonlySet<number>,
  issue: number,
): ReadonlySet<number> {
  if (read.has(issue)) return read;
  const next = new Set(read);
  next.add(issue);
  return next;
}

export function shelfIsRead(
  read: ReadonlySet<number>,
  issues: readonly number[],
): boolean {
  return issues.every((issue) => read.has(issue));
}

export function hourSixCaption(shelfRead: boolean): string {
  return shelfRead
    ? 'Hour six. You read the whole shelf.'
    : 'Hour six of the refactor.';
}
