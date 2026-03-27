const ALLOCATION = [
  { ticker: 'MSFT', weight: 50.9, color: '#4b8ef1' },
  { ticker: 'AAPL', weight: 31.4, color: '#3ecf8e' },
  { ticker: 'TSLA', weight: 17.8, color: '#f5a623' },
];

const TICKERS = ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'TSLA'];
const CORR = [
  [1.00, 0.68, 0.71, 0.73, 0.50],
  [0.68, 1.00, 0.70, 0.69, 0.49],
  [0.71, 0.70, 1.00, 0.77, 0.48],
  [0.73, 0.69, 0.77, 1.00, 0.50],
  [0.50, 0.49, 0.48, 0.50, 1.00],
];

function renderAllocation() {
  const list = document.getElementById('allocList');
  ALLOCATION.forEach(item => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    row.innerHTML = `
      <span style="font-family: monospace; width: 50px;">${item.ticker}</span>
      <div class="alloc-bar-bg"><div class="alloc-bar" style="width: ${item.weight}%; background: ${item.color};"></div></div>
      <span style="font-family: monospace; width: 40px; text-align: right;">${item.weight}%</span>
    `;
    list.appendChild(row);
  });
}

function renderHeatmap() {
  const grid = document.getElementById('heatmap');
  // Add spacer for top-left
  grid.appendChild(document.createElement('div'));
  TICKERS.forEach(t => {
    const label = document.createElement('div');
    label.style.textAlign = 'center'; label.textContent = t;
    grid.appendChild(label);
  });

  TICKERS.forEach((rowTicker, r) => {
    const rowLabel = document.createElement('div');
    rowLabel.className = 'hm-row-label'; rowLabel.textContent = rowTicker;
    grid.appendChild(rowLabel);
    TICKERS.forEach((_, c) => {
      const val = CORR[r][c];
      const cell = document.createElement('div');
      cell.className = 'hm-cell';
      cell.style.background = `rgba(75, 142, 241, ${val})`;
      cell.textContent = val.toFixed(2);
      grid.appendChild(cell);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAllocation();
  renderHeatmap();
  
  // Basic Donut Chart
  new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: ALLOCATION.map(a => a.ticker),
      datasets: [{
        data: ALLOCATION.map(a => a.weight),
        backgroundColor: ALLOCATION.map(a => a.color),
        borderWidth: 0
      }]
    },
    options: { cutout: '70%', plugins: { legend: { display: false } } }
  });
});
