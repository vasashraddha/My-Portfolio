const ALLOCATION_DATA = [
  { ticker: 'MSFT', weight: 50.9, color: '#4b8ef1' },
  { ticker: 'AAPL', weight: 31.4, color: '#3ecf8e' },
  { ticker: 'TSLA', weight: 17.8, color: '#f5a623' }
];

const PERFORMANCE_DATA = {
  labels: ['Portfolio', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN'],
  values: [549.9, 1062.8, 372.8, 368.7, 160.3, 155.6],
  colors: ['#4b8ef1', '#f5a623', '#3ecf8e', '#3ecf8e', '#3ecf8e', '#3ecf8e']
};

function initAllocation() {
  const container = document.getElementById('allocList');
  if (!container) return;

  ALLOCATION_DATA.forEach(item => {
    const row = document.createElement('div');
    row.className = 'alloc-row';
    row.innerHTML = `
      <div class="alloc-ticker">${item.ticker}</div>
      <div class="alloc-progress-bg">
        <div class="alloc-progress-fill" style="width: 0%; background: ${item.color};" data-width="${item.weight}%"></div>
      </div>
      <div class="alloc-pct">${item.weight}%</div>
    `;
    container.appendChild(row);
  });

  // Trigger animation after a short delay
  setTimeout(() => {
    document.querySelectorAll('.alloc-progress-fill').forEach(bar => {
      bar.style.width = bar.getAttribute('data-width');
    });
  }, 300);
}

function initCharts() {
  // 1. Donut Chart
  new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: ALLOCATION_DATA.map(a => a.ticker),
      datasets: [{
        data: ALLOCATION_DATA.map(a => a.weight),
        backgroundColor: ALLOCATION_DATA.map(a => a.color),
        borderWidth: 0,
        hoverOffset: 15
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      cutout: '70%'
    }
  });

  // 2. Returns Bar Chart
  new Chart(document.getElementById('returnsChart'), {
    type: 'bar',
    data: {
      labels: PERFORMANCE_DATA.labels,
      datasets: [{
        data: PERFORMANCE_DATA.values,
        backgroundColor: PERFORMANCE_DATA.colors,
        borderRadius: 8
      }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { 
          grid: { color: 'rgba(255,255,255,0.05)' },
          ticks: { color: '#8b90a4', callback: v => v + '%' }
        },
        x: { ticks: { color: '#8b90a4' } }
      }
    }
  });
}

function initHeatmap() {
  const grid = document.getElementById('heatmap');
  const tickers = ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'TSLA'];
  grid.appendChild(document.createElement('div'));
  tickers.forEach(t => {
    const header = document.createElement('div');
    header.style.textAlign = 'center';
    header.style.fontSize = '11px';
    header.style.color = '#8b90a4';
    header.textContent = t;
    grid.appendChild(header);
  });

  tickers.forEach((row, i) => {
    const rowLabel = document.createElement('div');
    rowLabel.style.fontSize = '11px';
    rowLabel.style.color = '#8b90a4';
    rowLabel.textContent = row;
    grid.appendChild(rowLabel);
    
    tickers.forEach((_, j) => {
      const cell = document.createElement('div');
      cell.className = 'hm-cell';
      const val = i === j ? 1.00 : 0.4 + (Math.random() * 0.4);
      cell.style.background = `rgba(75, 142, 241, ${val})`;
      cell.style.color = val > 0.7 ? '#fff' : '#8b90a4';
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
