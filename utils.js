export const rateCalculator = (amount, rates, sourceCurrency, targetCurrency) => {
    const rate = rates.filter(element => element.sourceCurrency === sourceCurrency && element.targetCurrency === targetCurrency)
    let  convertedAmount = null
    if (rate.length > 0) {
      convertedAmount = Number(amount) * Number(rate[0].amount);
    } else {
      console.error('Rates not available')
    }
    return convertedAmount
};

