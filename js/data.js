const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const MONTH_ORDER = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const dashboardState = {
  salesRows: [],
  targetRows: [],
  selectedYear: 'ALL',
  selectedMonth: 'ALL'
};

async function loadDashboardData(){
  try{
    const [salesResponse, targetsResponse] = await Promise.all([
      supabaseClient
        .from(SALES_TABLE)
        .select('*')
        .limit(5000),

      supabaseClient
        .from(TARGETS_TABLE)
        .select('*')
        .eq('active', true)
    ]);

    if(salesResponse.error){
      throw salesResponse.error;
    }

    if(targetsResponse.error){
      throw targetsResponse.error;
    }

    dashboardState.salesRows = salesResponse.data || [];
    dashboardState.targetRows = targetsResponse.data || [];

    populateFilters();

    if(typeof renderDashboard === 'function'){
      renderDashboard();
    }

  }catch(error){
    console.error('Dashboard load error:', error);
  }
}

function getRowDate(row){
  const rawDate = row.DATE || row.Date || row.date || row['ORDER DATE'] || row['Order Date'];

  if(!rawDate)return null;

  const date = new Date(rawDate);
  return Number.isNaN(date.getTime()) ? null : date;
}

function getRowYear(row){
  const directYear = row.YEAR || row.Year || row.year;

  if(directYear)return String(directYear);

  const date = getRowDate(row);
  return date ? String(date.getFullYear()) : '';
}

function getRowMonth(row){
  const directMonth = row.MONTH || row.Month || row.month;

  if(directMonth)return String(directMonth);

  const date = getRowDate(row);
  return date ? MONTH_ORDER[date.getMonth()] : '';
}

function getFilteredSalesRows(){
  return dashboardState.salesRows.filter(row => {
    const year = getRowYear(row);
    const month = getRowMonth(row);

    const yearMatch = dashboardState.selectedYear === 'ALL' || String(year) === String(dashboardState.selectedYear);
    const monthMatch = dashboardState.selectedMonth === 'ALL' || String(month) === String(dashboardState.selectedMonth);

    return yearMatch && monthMatch;
  });
}

function populateFilters(){
  const yearFilter = document.getElementById('yearFilter');
  const monthFilter = document.getElementById('monthFilter');

  if(!yearFilter || !monthFilter)return;

  const years = [...new Set(dashboardState.salesRows.map(getRowYear).filter(Boolean))]
    .sort((a,b) => Number(b) - Number(a));

  yearFilter.innerHTML = '<option value="ALL">All</option>' + years.map(year => {
    return `<option value="${year}">${year}</option>`;
  }).join('');

  monthFilter.innerHTML = '<option value="ALL">All</option>' + MONTH_ORDER.map(month => {
    return `<option value="${month}">${month}</option>`;
  }).join('');

  yearFilter.value = dashboardState.selectedYear;
  monthFilter.value = dashboardState.selectedMonth;

  yearFilter.addEventListener('change', () => {
    dashboardState.selectedYear = yearFilter.value;
    renderDashboard();
  });

  monthFilter.addEventListener('change', () => {
    dashboardState.selectedMonth = monthFilter.value;
    renderDashboard();
  });
}
