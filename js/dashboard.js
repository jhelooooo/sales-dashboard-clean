let actualTargetChart = null;

function renderDashboard(){
  renderKpis();
  renderTargetBalance();
  renderActualTargetChart();
}

function renderKpis(){
  const rows = dashboardState.salesRows;

  const totalSales = rows.reduce((sum, row) => {
    return sum + cleanNumber(row['CLIENT TOTAL AMOUNT']);
  }, 0);

  const totalOrders = rows.length;

  const uniqueDealers = new Set(
    rows.map(row => row.CUSTOMERNAME).filter(Boolean)
  );

  document.getElementById('totalSales').textContent = formatPeso(totalSales);
  document.getElementById('totalOrders').textContent = totalOrders.toLocaleString();
  document.getElementById('dealerCount').textContent = uniqueDealers.size;
  document.getElementById('buyingDealerCount').textContent = uniqueDealers.size;
}

function renderTargetBalance(){
  const tbody = document.getElementById('targetBalanceTable');

  if(!tbody)return;

  const salesByBrand = {};

  dashboardState.salesRows.forEach(row => {
    const brand = row.BRAND || 'NO BRAND';

    if(!salesByBrand[brand]){
      salesByBrand[brand] = 0;
    }

    salesByBrand[brand] += cleanNumber(row['CLIENT TOTAL AMOUNT']);
  });

  tbody.innerHTML = dashboardState.targetRows.map(target => {
    const actual = salesByBrand[target.brand] || 0;
    const targetValue = cleanNumber(target.target);
    const balance = targetValue - actual;
    const percentage = targetValue ? ((actual / targetValue) * 100) : 0;
    const commission = percentage >= 100 ? actual * 0.003 : 0;

    return `
      <tr>
        <td>${target.brand}</td>
        <td>${formatPeso(targetValue)}</td>
        <td>${formatPeso(actual)}</td>
        <td>${formatPeso(balance)}</td>
        <td>${percentage.toFixed(1)}%</td>
        <td>${formatPeso(commission)}</td>
      </tr>
    `;
  }).join('');
}

function renderActualTargetChart(){
  const canvas = document.getElementById('actualTargetChart');

  if(!canvas)return;

  const salesByBrand = {};

  dashboardState.salesRows.forEach(row => {
    const brand = row.BRAND || 'NO BRAND';

    if(!salesByBrand[brand]){
      salesByBrand[brand] = 0;
    }

    salesByBrand[brand] += cleanNumber(row['CLIENT TOTAL AMOUNT']);
  });

  const labels = [];
  const targetData = [];
  const actualData = [];

  dashboardState.targetRows.forEach(target => {
    labels.push(target.brand);
    targetData.push(cleanNumber(target.target));
    actualData.push(salesByBrand[target.brand] || 0);
  });

  if(actualTargetChart){
    actualTargetChart.destroy();
  }

  actualTargetChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Target',
          data: targetData,
          backgroundColor: 'rgba(148,163,184,.35)',
          borderRadius: 8,
          barThickness: 42
        },
        {
          label: 'Actual',
          data: actualData,
          backgroundColor: actualData.map((value, index) => {
            return value >= targetData[index]
              ? 'rgba(34,197,94,.88)'
              : 'rgba(59,130,246,.88)';
          }),
          borderRadius: 8,
          barThickness: 24
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: getComputedStyle(document.body).getPropertyValue('--text-primary')
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue('--text-primary')
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: getComputedStyle(document.body).getPropertyValue('--text-primary')
          },
          grid: {
            color: getComputedStyle(document.body).getPropertyValue('--chart-grid')
          }
        }
      }
    }
  });
}
