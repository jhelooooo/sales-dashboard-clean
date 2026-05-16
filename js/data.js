const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const dashboardState = {
  salesRows: [],
  targetRows: []
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

    if(typeof renderDashboard === 'function'){
      renderDashboard();
    }

  }catch(error){
    console.error('Dashboard load error:', error);
  }
}
