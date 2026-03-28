const ALLOCATION = [
  { ticker: 'MSFT', weight: 50.9, color: '#3b82f6' },
  { ticker: 'AAPL', weight: 31.4, color: '#10b981' },
  { ticker: 'TSLA', weight: 17.8, color: '#f59e0b' }
];

const RETURNS = {
  labels: ['Portfolio', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN'],
  values: [549.9, 1062.8, 372.8, 368.7, 160.3, 155.6],
  colors: ['#3b82f6', '#f59e0b', '#10b981', '#10b981', '#10b981', '#10b981']
};

function renderAllocation() {
  const container = document.getElementById('allocList');
  if (!container) return;

  ALLOCATION.forEach(item => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    row.innerHTML = `
      <div class="alloc-ticker">${item.ticker}</div>
      <div class="alloc-bar-wrapper">
        <div class="alloc-bar-fill" style="width: 0%; background: ${item.color};" data-val="${item.weight}%"></div>
      </div>
      <div class="alloc-pct">${item.weight}%</div>
    `;
    container.appendChild(row);
  });

  setTimeout(() => {
    document.querySelectorAll('.alloc-bar-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-val');
    });
  }, 200);
}

function initCharts() {
  // Donut Chart
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
    options: { maintainAspectRatio: false, cutout: '75%', plugins: { legend: { display: false } } }
  });

  // Bar Chart
  new Chart(document.getElementById('returnsChart'), {
    type: 'bar',
    data: {
      labels: RETURNS.labels,
      datasets: [{
        data: RETURNS.values,
        backgroundColor: RETURNS.colors,
        borderRadius: 5
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#94a3b8', callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function renderHeatmap() {
  const grid = document.getElementById('heatmap');
  const tks = ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'TSLA'];
  grid.appendChild(document.createElement('div'));
  tks.forEach(t => {
    const d = document.createElement('div');
    d.style.textAlign = 'center'; d.style.fontSize = '10px'; d.textContent = t;
    grid.appendChild(d);
  });

  tks.forEach((row, i) => {
    const rl = document.createElement('div'); rl.style.fontSize = '10px'; rl.textContent = row; grid.appendChild(rl);
    tks.forEach((col, j) => {
      const cell = document.createElement('div');
      cell.className = 'hm-cell';
      const v = i === j ? 1.00 : 0.4 + (Math.random() * 0.4);
      cell.style.background = `rgba(59, 130, 246, ${v})`;
      cell.textContent = v.toFixed(2);
      grid.appendChild(cell);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderAllocation();
  initCharts();
  renderHeatmap();
});
