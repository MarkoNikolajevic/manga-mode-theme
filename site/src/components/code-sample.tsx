type TokenKind =
  | 'comment'
  | 'keyword'
  | 'function'
  | 'string'
  | 'number'
  | 'type'
  | 'b1'
  | 'b2'
  | 'b3';
type Token = string | readonly [TokenKind, string];

const TOKEN_CLASS: Record<TokenKind, string> = {
  comment: 'text-(--tok-comment)',
  keyword: 'text-(--tok-keyword)',
  function: 'text-(--tok-function)',
  string: 'text-(--tok-string)',
  number: 'text-(--tok-number)',
  type: 'text-(--tok-type)',
  b1: 'text-(--tok-b1)',
  b2: 'text-(--tok-b2)',
  b3: 'text-(--tok-b3)',
};

// Hand-tokenized so the sample renders without shipping a highlighter.
// Brackets on lines 6 to 9 nest three deep, which the comparison copy relies on.
const LINES: readonly Token[][] = [
  [['comment', '// Personality, under control.']],
  [
    ['keyword', 'import'],
    ' ',
    ['b1', '{'],
    ' defineTheme ',
    ['b1', '}'],
    ' ',
    ['keyword', 'from'],
    ' ',
    ['string', '"mangamode"'],
    ';',
  ],
  [],
  [
    ['keyword', 'type'],
    ' ',
    ['type', 'Volume'],
    ' = ',
    ['b1', '{'],
    ' name: ',
    ['type', 'string'],
    '; issue: ',
    ['type', 'number'],
    ' ',
    ['b1', '}'],
    ';',
  ],
  [],
  [
    ['keyword', 'export'],
    ' ',
    ['keyword', 'function'],
    ' ',
    ['function', 'readChapter'],
    ['b1', '('],
    'vol: ',
    ['type', 'Volume'],
    ', page = ',
    ['number', '1'],
    ['b1', ')'],
    ' ',
    ['b1', '{'],
  ],
  ['  ', ['keyword', 'const'], ' panels = vol.issue * ', ['number', '24'], ';'],
  [
    '  ',
    ['keyword', 'return'],
    ' ',
    ['function', 'format'],
    ['b2', '('],
    'vol.name, ',
    ['b3', '['],
    'page, panels',
    ['b3', ']'],
    ['b2', ')'],
    ';',
  ],
  [['b1', '}']],
  [],
  [
    ['function', 'defineTheme'],
    ['b1', '('],
    ['b2', '{'],
    ' glare: ',
    ['string', '"low"'],
    ', focus: ',
    ['string', '"high"'],
    ' ',
    ['b2', '}'],
    ['b1', ')'],
    ';',
  ],
];

/** Colored entirely through `--tok-*` variables, so any ancestor can theme it. */
export function CodeSample() {
  return (
    <pre className='overflow-x-auto bg-(--tok-bg) p-4 font-mono text-(--tok-text) text-xs/6 sm:p-6 sm:text-sm/7'>
      <code>
        {LINES.map((tokens, lineIndex) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static content, lines never reorder
          <span key={lineIndex} className='block'>
            <span
              aria-hidden
              className='inline-block w-8 select-none text-(--tok-line)'
            >
              {lineIndex + 1}
            </span>
            {tokens.map((token, tokenIndex) =>
              typeof token === 'string' ? (
                token
              ) : (
                // biome-ignore lint/suspicious/noArrayIndexKey: static content, tokens never reorder
                <span key={tokenIndex} className={TOKEN_CLASS[token[0]]}>
                  {token[1]}
                </span>
              ),
            )}
          </span>
        ))}
      </code>
    </pre>
  );
}
