async function loadSales(){

  const pageSize = 1000;
  let from = 0;

  let allRows = [];

  while(true){

    const result =
      await supabaseClient
        .from('raw_sales')
        .select('*')
        .range(
          from,
          from + pageSize - 1
        );

    const rows =
      result.data || [];

    allRows = [
      ...allRows,
      ...rows
    ];

    if(rows.length < pageSize){
      break;
    }

    from += pageSize;

  }

  return allRows;

}
