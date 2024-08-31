import { useEffect, useState } from 'react'
import './App.css'
import { Invoice } from './components/CreateInvoice';
import { QuoteInvoice } from './components/QuoteInv';
import { StrikeUser } from './components/StrikeProfile';
import { SearchInvoices } from './components/SearchInvoice';
import { CurrencySelect } from './components/CurrencySelect';
import { BankPayout } from './components/BankPayout';
import { PayStrikeInv } from './components/PayInvoice';
import { getExchangeRates, rateCalculator } from '../utils';
import { UserInvoice } from './components/InvoiceFromHandle';
import { LightningPaymentQuote } from './components/LightningPaymentQuote';

function App() {
  const [rates, setRates] = useState([]);
  
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBTC, setTotalBTC] = useState(0);
  const [totalSats, setTotalSats] = useState(0);

  const [currency, setCurrency] = useState('BTC');
  const [invoiceId, setInvoiceId] = useState('');
  const [quoteId, setQuoteId] = useState('');
  
  const [lnInvoice, setLnInvoice] = useState('');

  const formattedUSD = `$${Number(totalUSD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const formattedBTC = `${(totalBTC).toString().slice(0, 10)} btc`
  const formattedSATS = `${(totalSats).toLocaleString().slice(0, 12)} sats`

  const deleteInvoice = () => {
    setInvoiceId('');
    setQuoteId('');
  };

  const fetchRates = async () => {
    const ratesQuote = await getExchangeRates();
    setRates(ratesQuote);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates.length > 0) {
        const intervalId = setInterval(() => {
            fetchRates();
        }, 60000);
        return () => clearInterval(intervalId)
    }
  }, [rates]);


  useEffect(() => {              
    if (currency === 'USD') {
      const formattedUSD = Number(totalUSD).toFixed(2);
      const usdToBTC = rateCalculator(formattedUSD, rates, 'USD', 'BTC');      
      setTotalBTC(usdToBTC);
      const btcToSats = usdToBTC * (100 * 1000000);
      setTotalSats(btcToSats);
    } else if (currency === 'BTC' ) {
        const btcToUsd = rateCalculator(totalBTC, rates, 'BTC', 'USD');
        const formattedUSD = Number(btcToUsd).toFixed(2)
        setTotalUSD(formattedUSD);
        const btcToSats = totalBTC *  (100 * 1000000);
        setTotalSats(btcToSats);
    } else { // SATS
        const satsToBtc = (totalSats /  (100 * 1000000));
        setTotalBTC(satsToBtc);
        const btcToUsd = rateCalculator(satsToBtc, rates, 'BTC', 'USD');
        const formattedUSD = Number(btcToUsd).toFixed(2)
        setTotalUSD(formattedUSD);
    }    
  }, [currency, totalBTC, totalUSD, totalSats]);

  
  return (
    <div>
       <div>
       {totalUSD > 0 && 
        <> 
          <p> {formattedUSD} </p> 
          <p>{formattedBTC}</p> 
          <p>{formattedSATS}</p>
        </>}
       <CurrencySelect 
        currency={currency}
        setCurrency={setCurrency}
      />
      <fieldset>
        <legend>Amount</legend>
      <label>
        <input 
        value={
            currency === 'USD' ? totalUSD :
            currency === 'BTC' ? totalBTC : 
            totalSats}
        onChange={(e) => 
            currency === 'USD' ? setTotalUSD(e.target.value) : 
            currency === 'BTC' ? setTotalBTC(e.target.value) : 
            setTotalSats(e.target.value)}
        />
      </label>     
      </fieldset>
      </div>
      <div className='getPaid'>
        <Invoice 
          currency={currency} 
          totalUSD={totalUSD}
          totalBTC={totalBTC}
          deleteInvoice={deleteInvoice}
        />      
        <QuoteInvoice />
      </div>
      <div className='payOut'>
        <UserInvoice 
        currency={currency}
        totalUSD={totalUSD}
        setTotalUSD={setTotalUSD}
        totalBTC={totalBTC}
        setTotalBTC={setTotalBTC}
        totalSats={totalSats}
        setTotalSats={setTotalSats}
        />
        <LightningPaymentQuote currency={currency} />
        <PayStrikeInv />
      </div>
      <div>
        {/* <BankPayout /> */}
      </div>   
    <div className='searchDiv'>
      <StrikeUser />
      <SearchInvoices />
    </div>
    </div>
  )
}

export default App
