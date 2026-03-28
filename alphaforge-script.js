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

function initAllocation() {
  const list = document.getElementById('allocList');
  ALLOCATION.forEach(item => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    row.innerHTML = `
      <span class="alloc-ticker">${item.ticker}</span>
      <div class="alloc-bar-bg"><div class="alloc-bar" style="width: 0%; background: ${item.color};" data-target="${item.weight}"></div></div>
      <span class="alloc-pct">${item.weight}%</span>
    `;
    list.appendChild(row);
  });

  setTimeout(() => {
    document.querySelectorAll('.alloc-bar').forEach(bar => {
      bar.style.width = bar.dataset.target + '%';
    });
  }, 300);
}

function initCharts() {
  // Donut
  new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: ALLOCATION.map(a => a.ticker),
      datasets: [{ data: ALLOCATION.map(a => a.weight), backgroundColor: ALLOCATION.map(a => a.color), borderWidth: 0 }]
    },
    options: { responsive: true, maintainAspectRatio: false, cutout: '70%', plugins: { legend: { display: false } } }
  });

  // Returns Bar
  new Chart(document.getElementById('returnsChart'), {
    type: 'bar',
    data: {
      labels: RETURNS.labels,
      datasets: [{ data: RETURNS.values, backgroundColor: RETURNS.colors, borderRadius: 8 }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#94a3b8', callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { ticks: { color: '#94a3b8' } }
      }
    }
  });
}

function initHeatmap() {
    const grid = document.getElementById('heatmap');
    const tickers = ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'TSLA'];
    grid.appendChild(document.createElement('div')); // spacer
    tickers.forEach(t => {
        const h = document.createElement('div');
        h.style.textAlign = 'center'; h.style.fontSize = '11px'; h.textContent = t;
        grid.appendChild(h);
    });
    tickers.forEach((row, i) => {
        const l = document.createElement('div'); l.style.fontSize = '11px'; l.textContent = row; grid.appendChild(l);
        tickers.forEach((col, j) => {
            const cell = document.createElement('div');
            cell.className = 'hm-cell';
            const val = i === j ? 1 : 0.4 + (Math.random() * 0.4);
            cell.style.background = `rgba(59, 130, 246, ${val})`;
            cell.textContent = val.toFixed(2);
            grid.appendChild(cell);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
  initAllocation();
  initCharts();
  initHeatmap();
});
