import axios from 'axios';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const getExchangeRates = async () => {
    try {
      const response = await axios.get(`${apiUrl}/rates/ticker`, { 
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`, 
        },    
      })
      const responseData = response.data
      console.log('Exchange rate:', responseData)
      return responseData
          
    } catch (error) {
        console.error('Error ', error.response?.data || error.message)
    }
  };

  export  const rateCalculator = (amount, rates, sourceCurrency, targetCurrency) => {
    const rate = rates.filter(element => element.sourceCurrency === sourceCurrency && element.targetCurrency === targetCurrency)
    let  convertedAmount = null
    if (rate.length > 0) {
      convertedAmount = Number(amount) * Number(rate[0].amount);
    } else {
      console.error('Rates not available')
    }
    return convertedAmount
  };

