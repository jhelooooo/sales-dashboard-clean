function applyFilters(){

  let rows = [
    ...appState.sales
  ];

  const {
    fiscal_year,
    fiscal_month,
    sales_agent
  } = appState.filters;

  if(fiscal_year !== 'ALL'){

    rows = rows.filter(
      row =>
        String(
          row.fiscal_year
        ) === String(
          fiscal_year
        )
    );

  }

  if(fiscal_month !== 'ALL'){

    rows = rows.filter(
      row =>
        row.fiscal_month ===
        fiscal_month
    );

  }

  if(sales_agent !== 'ALL'){

    rows = rows.filter(
      row =>
        row.sales_agent ===
        sales_agent
    );

  }

  appState.filteredSales =
    rows;

}
