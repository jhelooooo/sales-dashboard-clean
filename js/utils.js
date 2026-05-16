function formatPeso(value){
  const number = Number(value || 0);

  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(number);
}

function cleanNumber(value){
  return Number(String(value || 0).replace(/,/g, '')) || 0;
}

function groupBy(array, key){
  return array.reduce((acc, item) => {
    const value = item[key] || 'Unknown';

    if(!acc[value]){
      acc[value] = [];
    }

    acc[value].push(item);
    return acc;
  }, {});
}
