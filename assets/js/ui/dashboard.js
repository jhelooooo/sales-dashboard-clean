const NAV_ITEMS = [
  { id:'dashboard', label:'Dashboard', roles:['admin','manager','agent'] },
  { id:'sales', label:'Sales', roles:['admin','manager','agent'] },
  { id:'targets', label:'Targets', roles:['admin','manager'] },
  { id:'users', label:'Users', roles:['admin'] },
  { id:'settings', label:'Settings', roles:['admin','manager','agent'] }
];

function getUserRole(){
  return appState.profile?.role || 'agent';
}

function getAllowedNavItems(){
  const role = getUserRole();
  return NAV_ITEMS.filter(item => item.roles.includes(role));
}

function getActivePage(){
  return appState.activePage || 'dashboard';
}

function setActivePage(pageId){
  appState.activePage = pageId;
  renderDashboard();
}

function renderDashboard(){
  const app = document.getElementById('app');
  if(!app) return;

  app.innerHTML = `
    <div class="dashboard-layout">
      ${renderSidebar()}
      <main class="main-content">
        ${renderTopbar()}
        <section id="pageContent" class="page-content">
          ${renderActivePage()}
        </section>
      </main>
    </div>
  `;

  bindDashboardEvents();
}

function renderSidebar(){
  const name = appState.profile?.full_name || appState.user?.email || 'User';
  const role = appState.profile?.role || 'agent';
  const agent = appState.profile?.sales_agent || '-';
  const items = getAllowedNavItems();
  const activePage = getActivePage();

  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <h2>Sales Dashboard</h2>
        <small>Clean v2</small>
      </div>

      <div class="user-card">
        <strong>${name}</strong>
        <span>${role}</span>
        <small>Agent: ${agent}</small>
      </div>

      <nav class="sidebar-nav">
        ${items.map(item => `
          <button class="nav-btn ${activePage === item.id ? 'active' : ''}" data-page="${item.id}">
            ${item.label}
          </button>
        `).join('')}
      </nav>

      <button id="logoutBtn" class="logout-btn">
        Logout
      </button>
    </aside>
  `;
}

function renderTopbar(){
  const active = NAV_ITEMS.find(item => item.id === getActivePage());
  return `
    <header class="topbar">
      <div>
        <h1>${active?.label || 'Dashboard'}</h1>
        <p>Light theme foundation. Dark mode will be added later.</p>
      </div>
    </header>
  `;
}

function renderActivePage(){
  const page = getActivePage();

  if(page === 'sales') return renderSalesPage();
  if(page === 'targets') return renderTargetsPage();
  if(page === 'users') return renderUsersPage();
  if(page === 'settings') return renderSettingsPage();

  return renderDashboardPage();
}

function renderDashboardPage(){
  const sales = appState.sales || [];
  const totalSales = sales.reduce((sum,row) => sum + Number(row.client_total_amount || row.total || 0),0);
  const uniqueDealers = new Set(sales.map(row => String(row.dealer_name || '').trim()).filter(Boolean));
  const uniqueBrands = new Set(sales.map(row => String(row.brand || '').trim()).filter(Boolean));

  return `
    <div class="kpi-grid">
      ${renderKpiCard('Total Sales', formatMoney(totalSales))}
      ${renderKpiCard('Total Records', formatNumber(sales.length))}
      ${renderKpiCard('Dealers', formatNumber(uniqueDealers.size))}
      ${renderKpiCard('Brands', formatNumber(uniqueBrands.size))}
    </div>

    <div class="content-grid">
      <div class="panel-card">
        <div class="panel-header">
          <h2>Sales Overview</h2>
          <span>Chart placeholder</span>
        </div>
        <div class="empty-state">Charts will be added after the core layout is stable.</div>
      </div>

      <div class="panel-card">
        <div class="panel-header">
          <h2>Top Dealers</h2>
          <span>Preview</span>
        </div>
        ${renderSimpleDealerList(sales)}
      </div>
    </div>
  `;
}

function renderSalesPage(){
  const sales = appState.sales || [];

  return `
    <div class="panel-card">
      <div class="panel-header">
        <h2>Raw Sales</h2>
        <span>${formatNumber(sales.length)} record(s)</span>
      </div>
      ${renderSalesTable(sales)}
    </div>
  `;
}

function renderTargetsPage(){
  return `
    <div class="panel-card">
      <div class="panel-header">
        <h2>Brand Targets</h2>
        <span>Admin / Manager</span>
      </div>
      <div class="empty-state">Target management will be connected next.</div>
    </div>
  `;
}

function renderUsersPage(){
  return `
    <div class="panel-card">
      <div class="panel-header">
        <h2>Users</h2>
        <span>Admin only</span>
      </div>
      <div class="empty-state">User management will be added after policies are finalized.</div>
    </div>
  `;
}

function renderSettingsPage(){
  return `
    <div class="panel-card">
      <div class="panel-header">
        <h2>Settings</h2>
        <span>Coming soon</span>
      </div>
      <div class="empty-state">Theme toggle and font size slider will be added here later.</div>
    </div>
  `;
}

function renderKpiCard(label,value){
  return `
    <div class="kpi-card">
      <span>${label}</span>
      <h3>${value}</h3>
    </div>
  `;
}

function renderSalesTable(rows){
  if(!rows.length){
    return '<div class="empty-state">No sales data found for this user.</div>';
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>SO#</th>
            <th>Dealer</th>
            <th>Brand</th>
            <th>Order</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows.slice(0,50).map(row => `
            <tr>
              <td>${row.sale_date || '-'}</td>
              <td>${row.so_no || '-'}</td>
              <td>${row.dealer_name || '-'}</td>
              <td>${row.brand || '-'}</td>
              <td>${row.order_name || '-'}</td>
              <td>${formatNumber(row.qty || 0)}</td>
              <td>${formatMoney(row.client_total_amount || row.total || 0)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderSimpleDealerList(rows){
  if(!rows.length){
    return '<div class="empty-state">No dealer data yet.</div>';
  }

  const map = new Map();
  rows.forEach(row => {
    const dealer = row.dealer_name || 'No Dealer';
    const sales = Number(row.client_total_amount || row.total || 0);
    map.set(dealer,(map.get(dealer) || 0) + sales);
  });

  const dealers = [...map.entries()]
    .sort((a,b) => b[1] - a[1])
    .slice(0,5);

  return `
    <div class="mini-list">
      ${dealers.map(([dealer,total]) => `
        <div class="mini-list-row">
          <span>${dealer}</span>
          <strong>${formatMoney(total)}</strong>
        </div>
      `).join('')}
    </div>
  `;
}

function bindDashboardEvents(){
  document.querySelectorAll('.nav-btn').forEach(button => {
    button.addEventListener('click',() => setActivePage(button.dataset.page));
  });

  document
    .getElementById('logoutBtn')
    ?.addEventListener('click',signOutUser);
}
