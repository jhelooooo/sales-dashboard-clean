function formatNumber(value){

  return Number(
    value || 0
  ).toLocaleString();

}

function formatMoney(value){

  return 'PHP ' + Number(
    value || 0
  ).toLocaleString(undefined,{
    minimumFractionDigits:2,
    maximumFractionDigits:2
  });

}
