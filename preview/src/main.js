import './styles.css';

const code = `// Eye-comfort sample
import { focusMode } from 'anime-comfort';

const themes = ['One Piece', 'Pokemon', 'Dragon Ball', 'Demon Slayer', 'Jujutsu Kaisen'];

function pickTheme(hour) {
  return hour > 18 ? themes[3] : themes[1];
}

export function renderEditor(ctx) {
  const chosen = pickTheme(new Date().getHours());
  ctx.setTheme(chosen);

  if (ctx.hasSelection) {
    focusMode.enable({ subtleContrast: true });
  }

  return { chosen, smooth: true };
}`;

const variants = [
  {
    name: 'One Piece',
    gradient: 'linear-gradient(135deg, #0E3E63 0%, #0A141D 48%, #D1A25B 100%)',
    colors: [
      ['Background', '#0C1A2B'],
      ['Foreground', '#DCE9F7'],
      ['Keyword', '#D3A14D'],
      ['Function', '#67B7EA'],
      ['String', '#87C9A6']
    ]
  },
  {
    name: 'Pokemon',
    gradient: 'linear-gradient(135deg, #BD2E4E 0%, #1A1016 48%, #5C6ED2 100%)',
    colors: [
      ['Background', '#1A1016'],
      ['Foreground', '#F2E9EF'],
      ['Keyword', '#FF646E'],
      ['Function', '#7399FF'],
      ['String', '#86D1B2']
    ]
  },
  {
    name: 'Dragon Ball',
    gradient: 'linear-gradient(135deg, #5A7A1F 0%, #171D0D 50%, #E08532 100%)',
    colors: [
      ['Background', '#171C0F'],
      ['Foreground', '#E7EDD8'],
      ['Keyword', '#F09343'],
      ['Function', '#8FCA49'],
      ['String', '#AADB7C']
    ]
  },
  {
    name: 'Demon Slayer',
    gradient: 'linear-gradient(135deg, #1D6A60 0%, #0F1514 48%, #B13E52 100%)',
    colors: [
      ['Background', '#0F1312'],
      ['Foreground', '#DEE5E2'],
      ['Keyword', '#E06B74'],
      ['Function', '#70CEC1'],
      ['String', '#9ED8A6']
    ]
  },
  {
    name: 'Jujutsu Kaisen',
    gradient: 'linear-gradient(135deg, #6E4CC8 0%, #110F20 48%, #2A8596 100%)',
    colors: [
      ['Background', '#0F0E18'],
      ['Foreground', '#E5E2F2'],
      ['Keyword', '#B186FF'],
      ['Function', '#7ECDF4'],
      ['String', '#96D6DF']
    ]
  }
];

const select = document.getElementById('theme-select');
const sample = document.getElementById('code-sample');
const swatches = document.getElementById('swatches');

sample.textContent = code;

variants.forEach((variant, index) => {
  const option = document.createElement('option');
  option.value = String(index);
  option.textContent = variant.name;
  select.appendChild(option);
});

function renderVariant(index) {
  const variant = variants[index];
  document.body.style.setProperty('--hero-gradient', variant.gradient);

  swatches.innerHTML = '';
  variant.colors.forEach(([label, hex]) => {
    const item = document.createElement('div');
    item.className = 'swatch';
    item.innerHTML = `<span class="swatch-dot" style="background:${hex}"></span><span>${label}</span><code>${hex}</code>`;
    swatches.appendChild(item);
  });
}

select.addEventListener('change', (event) => {
  renderVariant(Number(event.target.value));
});

renderVariant(0);
