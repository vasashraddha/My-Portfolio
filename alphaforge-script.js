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
    row.style.display = 'flex';
    row.style.alignItems = 'center';
    row.style.marginBottom = '12px';

    row.innerHTML = `
      <span style="width: 60px; font-family: 'DM Mono'; font-size: 13px; color: ${item.weight === 0 ? '#555b6e' : '#f0f2f7'}">${item.ticker}</span>
      <div style="flex: 1; height: 6px; background: rgba(255,255,255,0.05); border-radius: 3px; margin: 0 15px; overflow: hidden;">
        <div class="alloc-bar" style="width: 0%; height: 100%; background: ${item.color}; transition: width 1s ease-out; border-radius: 3px;"
             data-target="${item.weight}"></div>
      </div>
      <span style="width: 50px; text-align: right; font-family: 'DM Mono'; font-size: 13px; color: ${item.weight === 0 ? '#555b6e' : '#8b90a4'}">${item.weight.toFixed(1)}%</span>
    `;
    list.appendChild(row);
  });

  // Trigger animation
  setTimeout(() => {
    document.querySelectorAll('.alloc-bar').forEach(bar => {
      bar.style.width = bar.getAttribute('data-target') + '%';
    });
  }, 100);
}

/* ── Donut Chart ── */
function renderDonut() {
  const canvas = document.getElementById('donutChart');
  if (!canvas) return;

  const active = ALLOCATION.filter(a => a.weight > 0);
  
  new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels: active.map(a => a.ticker),
      datasets: [{
        data: active.map(a => a.weight),
        backgroundColor: active.map(a => a.color),
        borderWidth: 0,
        hoverOffset: 10,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1a1e2b',
          titleFont: { family: 'DM Sans' },
          bodyFont: { family: 'DM Mono' },
          callbacks: {
            label: (ctx) => ` ${ctx.label}: ${ctx.raw.toFixed(1)}%`
          }
        }
      }
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
        data: RETURNS.values,
        backgroundColor: RETURNS.colors.map(c => c + 'cc'),
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
          backgroundColor: '#1a1e2b',
          callbacks: {
            label: (ctx) => ` Return: +${ctx.raw.toFixed(1)}%`
          }
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: '#8b90a4', font: { family: 'DM Mono', size: 11 } }
        },
        y: {
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { 
            color: '#555b6e', 
            font: { family: 'DM Mono', size: 10 },
            callback: (val) => '+' + val + '%'
          }
        }
      }
    }
  });
}

/* ── Correlation Heatmap ── */
function renderHeatmap() {
  const grid = document.getElementById('heatmap');
  if (!grid) return;

  function corrColor(val) {
    const t = (val - 0.4) / 0.6; 
    const clamped = Math.max(0, Math.min(1, t));
    const r = Math.round(30  + clamped * (75  - 30));
    const g = Math.round(60  + clamped * (142 - 60));
    const b = Math.round(100 + clamped * (241 - 100));
    const alpha = 0.15 + clamped * 0.75;
    return `rgba(${r},${g},${b},${alpha})`;
  }

  // Header Row
  const spacer = document.createElement('div');
  grid.appendChild(spacer);
  TICKERS.forEach(t => {
    const label = document.createElement('div');
    label.style.textAlign = 'center';
    label.style.fontSize = '11px';
    label.style.color = '#8b90a4';
    label.style.paddingBottom = '8px';
    label.style.fontFamily = 'DM Mono';
    label.textContent = t;
    grid.appendChild(label);
  });

  // Matrix Rows
  TICKERS.forEach((rowTicker, r) => {
    const rowLabel = document.createElement('div');
    rowLabel.style.fontSize = '11px';
    rowLabel.style.color = '#8b90a4';
    rowLabel.style.fontFamily = 'DM Mono';
    rowLabel.style.display = 'flex';
    rowLabel.style.alignItems = 'center';
    rowLabel.textContent = rowTicker;
    grid.appendChild(rowLabel);

    TICKERS.forEach((_, c) => {
      const val = CORR[r][c];
      const cell = document.createElement('div');
      cell.style.background = corrColor(val);
      cell.style.color = val > 0.75 ? '#fff' : '#8b90a4';
      cell.style.height = '45px';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.borderRadius = '4px';
      cell.style.fontSize = '11px';
      cell.style.fontFamily = 'DM Mono';
      cell.textContent = val.toFixed(2);
      grid.appendChild(cell);
    });
  });
}

/* ── Initialization ── */
document.addEventListener('DOMContentLoaded', () => {
  renderAllocation();
  renderDonut();
  renderReturns();
  renderHeatmap();
});
