/* ─────────────────────────────────────────────
   AlphaForge Portfolio Dashboard — script.js
   ───────────────────────────────────────────── */

/* ── 1. Data Definitions ── */
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

/* ── 2. Render Allocation List ── */
function renderAllocation() {
  const list = document.getElementById('allocList');
  if (!list) return;
  list.innerHTML = ''; 

  ALLOCATION.filter(item => item.weight > 0).forEach(item => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    row.innerHTML = `
      <span style="font-family: 'DM Mono'; width: 50px; font-size: 13px;">${item.ticker}</span>
      <div class="alloc-bar-bg">
        <div class="alloc-bar" style="width: ${item.weight}%; background: ${item.color};"></div>
      </div>
      <span style="font-family: 'DM Mono'; width: 45px; text-align: right; font-size: 13px;">${item.weight}%</span>
    `;
    list.appendChild(row);
  });
}

/* ── 3. Render Correlation Heatmap ── */
function renderHeatmap() {
  const grid = document.getElementById('heatmap');
  if (!grid) return;
  grid.innerHTML = '';

  // Spacer for the top-left corner
  grid.appendChild(document.createElement('div'));

  // Column Headers
  TICKERS.forEach(t => {
    const label = document.createElement('div');
    label.style.textAlign = 'center';
    label.style.fontSize = '11px';
    label.style.color = '#8b90a4';
    label.textContent = t;
    grid.appendChild(label);
  });

  // Rows
  TICKERS.forEach((rowTicker, r) => {
    const rowLabel = document.createElement('div');
    rowLabel.style.fontSize = '11px';
    rowLabel.style.color = '#8b90a4';
    rowLabel.textContent = rowTicker;
    grid.appendChild(rowLabel);

    TICKERS.forEach((_, c) => {
      const val = CORR[r][c];
      const cell = document.createElement('div');
      cell.className = 'hm-cell';
      cell.style.background = `rgba(75, 142, 241, ${val})`;
      cell.style.color = val > 0.7 ? '#fff' : '#8b90a4';
      cell.style.fontSize = '10px';
      cell.style.height = '40px';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.borderRadius = '4px';
      cell.textContent = val.toFixed(2);
      grid.appendChild(cell);
    });
  });
}

/* ── 4. Initialize Charts ── */
document.addEventListener('DOMContentLoaded', () => {
  renderAllocation();
  renderHeatmap();

  // 1. Donut Chart
  const donutCtx = document.getElementById('donutChart');
  if (donutCtx) {
    new Chart(donutCtx, {
      type: 'doughnut',
      data: {
        labels: ALLOCATION.map(a => a.ticker),
        datasets: [{
          data: ALLOCATION.map(a => a.weight),
          backgroundColor: ALLOCATION.map(a => a.color),
          hoverOffset: 4,
          borderWidth: 0
        }]
      },
      options: {
        cutout: '70%',
        plugins: { legend: { display: false } }
      }
    });
  }

  // 2. Returns Comparison Bar Chart (THE MISSING PIECE)
  const barCtx = document.getElementById('returnsChart');
  if (barCtx) {
    new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: RETURNS.labels,
        datasets: [{
          label: 'Total Return (%)',
          data: RETURNS.values,
          backgroundColor: RETURNS.colors,
          borderRadius: 6,
          barThickness: 25
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#8b90a4', font: { size: 11 } }
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)' },
            ticks: { 
              color: '#8b90a4', 
              font: { size: 11 },
              callback: (value) => value + '%' 
            }
          }
        }
      }
    });
  }
});
