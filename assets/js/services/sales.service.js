async function loadSales(){

  const result =
    await supabaseClient
      .from('raw_sales')
      .select('*')
      .range(0,100000)
      .order(
        'sale_date',
        { ascending:false }
      );

  return result.data || [];

}
