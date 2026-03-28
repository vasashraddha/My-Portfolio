const ALLOCATION = [
  { ticker: 'MSFT', weight: 50.9, color: '#4b8ef1' },
  { ticker: 'AAPL', weight: 31.4, color: '#3ecf8e' },
  { ticker: 'TSLA', weight: 17.8, color: '#f5a623' }
];

const RETURNS = {
  labels: ['Portfolio', 'TSLA', 'AAPL', 'MSFT', 'GOOGL', 'AMZN'],
  values: [549.9, 1062.8, 372.8, 368.7, 160.3, 155.6],
  colors: ['#4b8ef1', '#f5a623', '#3ecf8e', '#3ecf8e', '#3ecf8e', '#3ecf8e']
};

document.addEventListener('DOMContentLoaded', () => {
  // 1. Donut Chart
  new Chart(document.getElementById('donutChart'), {
    type: 'doughnut',
    data: {
      labels: ALLOCATION.map(a => a.ticker),
      datasets: [{ data: ALLOCATION.map(a => a.weight), backgroundColor: ALLOCATION.map(a => a.color), borderWidth: 0 }]
    },
    options: { maintainAspectRatio: false, plugins: { legend: { display: false } } }
  });

  // 2. Returns Comparison Bar Chart
  new Chart(document.getElementById('returnsChart'), {
    type: 'bar',
    data: {
      labels: RETURNS.labels,
      datasets: [{ data: RETURNS.values, backgroundColor: RETURNS.colors, borderRadius: 6 }]
    },
    options: {
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#8b90a4', callback: v => v + '%' }, grid: { color: 'rgba(255,255,255,0.05)' } },
        x: { ticks: { color: '#8b90a4' } }
      }
    }
  });

  // 3. Simple Heatmap
  const grid = document.getElementById('heatmap');
  const tickers = ['AAPL', 'AMZN', 'GOOGL', 'MSFT', 'TSLA'];
  grid.appendChild(document.createElement('div'));
  tickers.forEach(t => { const l = document.createElement('div'); l.style.textAlign='center'; l.textContent = t; grid.appendChild(l); });
  
  tickers.forEach((row, i) => {
    const rl = document.createElement('div'); rl.textContent = row; grid.appendChild(rl);
    tickers.forEach((col, j) => {
        const cell = document.createElement('div');
        cell.className = 'hm-cell';
        const val = i === j ? 1 : 0.4 + (Math.random() * 0.4);
        cell.style.background = `rgba(75, 142, 241, ${val})`;
        cell.textContent = val.toFixed(2);
        grid.appendChild(cell);
    });
  });
});
