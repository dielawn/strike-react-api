import { useState, useEffect } from 'react';
import { exchangeRates } from '../../strikeApi';

export const PriceConverter = ({ totalUSD, totalBTC, setTotalBTC, currency }) => {
  const [rates, setRates] = useState([]);


  const getExchangeRates = async () => {
    try {
      const newRates = await exchangeRates()
      console.log('new rates', newRates)
      setRates(newRates)
          
    } catch (error) {
        console.error('Error ', error.response?.data || error.message)
    }
  };

  useEffect( () => {
    getExchangeRates();
  }, [])

  const rateCalculator = (amount, sourceCurrency, targetCurrency) => {
    const rate = rates.filter(element => element.sourceCurrency === sourceCurrency && element.targetCurrency === targetCurrency)
    let  convertedAmount = null
    if (rate.length > 0) {
      convertedAmount = Number(amount) * Number(rate[0].amount);
    } else {
      console.error('Rates not available')
    }
    return convertedAmount
  };

  useEffect(() => {
    if (totalUSD > 0) {
     const btcTotal = rateCalculator(totalUSD, 'USD', 'BTC')
     setTotalBTC(btcTotal)
    }
  }, [rates])
  

  if (totalBTC === null) {
    return <p>Converting...</p>;
  }

  return (
    <>
      <p>{currency === 'BTC' && `${totalBTC} btc`}</p>
    </>
  );
};
