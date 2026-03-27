/* ─────────────────────────────────────────────
   AlphaForge Portfolio Dashboard — script.js
   ───────────────────────────────────────────── */

/* ── Data ── */
const ALLOCATION = [
  { ticker: 'MSFT', weight: 50.9, color: '#4b8ef1' },
  { ticker: 'AAPL', weight: 31.4, color: '#3ecf8e' },
  { ticker: 'TSLA', weight: 17.8, color: '#f5a623' },
  { ticker: 'GOOGL', weight: 0,   color: '#555b6e' },
  { ticker: 'AMZN',  weight: 0,   color: '#555b6e' },
];

const RETURNS = {
  labels: ['Portfolio', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN'],
  values: [549.9, 1062.8, 372.8, 368.7, 160.3, 155.6],
  colors: ['#4b8ef1', '#f5a623', '#3ecf8e', '#3ecf8e', '#3ecf8e', '#3ecf8e'],
};

const TICKERS = ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'TSLA'];

const CORR = [
  [1.00, 0.68, 0.71, 0.73, 0.50],
  [0.68, 1.00, 0.70, 0.69, 0.49],
  [0.71, 0.70, 1.00, 0.77, 0.48],
  [0.73, 0.69, 0.77, 1.00, 0.50],
  [0.50, 0.49, 0.48, 0.50, 1.00],
];

/* ── Allocation Bars ── */
function renderAllocation() {
  const list = document.getElementById('allocList');
  if (!list) return;

  ALLOCATION.forEach(item => {
    const row = document.createElement('div');
    row.className = 'alloc-row';

    row.innerHTML = `
      <span class="alloc-ticker ${item.weight === 0 ? 'muted' : ''}">${item.ticker}</span>
      <div class="alloc-bar-bg">
        <div class="alloc-bar" style="width: 0%; background: ${item.color};"
             data-target="${item.weight}"></div>
      </div>
      <span class="alloc-pct ${item.weight === 0 ? 'muted' : ''}">${item.weight.toFixed(1)}%</span>
    `;
    list.appendChild(row);
  });

  /* Animate bars after paint */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.querySelectorAll('.alloc-bar[data-target]').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    });
  });
}

/* ── Donut Chart ── */
function renderDonut() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;

  const active = ALLOCATION.filter(a => a.weight > 0);
  const remaining = 100 - active.reduce((s, a) => s + a.weight, 0);

  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: [...active.map(a => a.ticker), 'Excluded'],
      datasets: [{
        data: [...active.map(a => a.weight), remaining > 0 ? remaining : 0],
        backgroundColor: [...active.map(a => a.color), 'rgba(255,255,255,0.04)'],
        borderColor: 'transparent',
        borderWidth: 0,
        hoverOffset: 6,
      }]
    },
    options: {
      responsive: false,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` ${ctx.label}: ${ctx.parsed.toFixed(1)}%`
          }
        }
      },
      animation: { animateRotate: true, duration: 900 }
    }
  });
}

/* ── Returns Bar Chart ── */
function renderReturns() {
  const canvas = document.getElementById('returnsChart');
  if (!canvas) return;

  new Chart(canvas, {
    type: 'bar',
    data: {
      labels: RETURNS.labels,
      datasets: [{
        label: 'Total Return (%)',
        data: RETURNS.values,
        backgroundColor: RETURNS.colors.map(c => c + 'cc'),
        borderColor: RETURNS.colors,
        borderWidth: 1.5,
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => ` Return: +${ctx.parsed.y.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: {
            color: '#8b90a4',
            font: { family: "'DM Mono', monospace", size: 12 }
          },
          border: { display: false }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.04)' },
          ticks: {
            color: '#555b6e',
            font: { family: "'DM Mono', monospace", size: 11 },
            callback: val => '+' + val + '%'
          },
          border: { display: false }
        }
      },
      animation: { duration: 800, easing: 'easeOutQuart' }
    }
  });
}

/* ── Correlation Heatmap ── */
function renderHeatmap() {
  const grid = document.getElementById('heatmap');
  if (!grid) return;

  /* Helper: interpolate color based on correlation value */
  function corrColor(val) {
    /* Low corr → dark teal, high corr → bright blue */
    const t = (val - 0.4) / 0.6; /* normalize 0.4–1.0 → 0–1 */
    const clamped = Math.max(0, Math.min(1, t));
    const r = Math.round(30  + clamped * (75  - 30));
    const g = Math.round(60  + clamped * (142 - 60));
    const b = Math.round(100 + clamped * (241 - 100));
    const alpha = 0.15 + clamped * 0.75;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function textColor(val) {
    return val > 0.7 ? '#f0f2f7' : '#8b90a4';
  }

  /* Column headers row */
  const spacer = document.createElement('div');
  spacer.className = 'hm-spacer';
  grid.appendChild(spacer);

  TICKERS.forEach(t => {
    const label = document.createElement('div');
    label.className = 'hm-col-label';
    label.textContent = t;
    grid.appendChild(label);
  });

  /* Data rows */
  TICKERS.forEach((rowTicker, r) => {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'hm-row-label';
    rowLabel.textContent = rowTicker;
    grid.appendChild(rowLabel);

    TICKERS.forEach((_, c) => {
      const val = CORR[r][c];
      const cell = document.createElement('div');
      cell.className = 'hm-cell';
      cell.style.background = corrColor(val);
      cell.style.color = textColor(val);
      cell.textContent = val.toFixed(2);
      cell.title = `${rowTicker} vs ${TICKERS[c]}: ${val.toFixed(2)}`;
      grid.appendChild(cell);
    });
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderAllocation();
  renderDonut();
  renderReturns();
  renderHeatmap();
});
