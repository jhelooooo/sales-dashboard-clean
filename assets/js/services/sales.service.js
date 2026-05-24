async function loadSales(){

  const result =
    await supabaseClient
      .from('raw_sales')
      .select('*')
      .order(
        'sale_date',
        { ascending:false }
      );

  return result.data || [];

}
