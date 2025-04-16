function combinations(array, tamanho) {
    if (tamanho === 1) return array.map(el => [el]);
  
    const result = [];
    array.forEach((current, index) => {
      const smallerCombos = combinations(array.slice(index + 1), tamanho - 1);
      smallerCombos.forEach(smaller => {
        result.push([current, ...smaller]);
      });
    });
  
    return result;
  }
  
  module.exports = { combinations };