import { useEffect, useState } from 'react'
import './App.css'
import Invoice from './components/CreateInvoice';
import StrikeUser from './components/StrikeProfile';
import SearchInvoices from './components/SearchInvoice';
import CurrencySelect from './components/CurrencySelect';
import BankPayout from './components/BankPayout';
import UserInvoice from './components/InvoiceFromHandle';
import LightningPaymentQuote from './components/LightningPaymentQuote';
import InvoiceHistory from './components/InvoiceHistory';
import OnChainPaymentQuote from './components/OnChainPayQuote';
import ExchangeCurrency from './components/ExchangeCurrency';
import { exchangeRates } from '../strikeApi';
import { rateCalculator } from '../utils';


function App() {
  const [activeTab, setActiveTab] = useState('exchangeCurrency');
  const [rates, setRates] = useState([]);

  const [handle, setHandle] = useState('dmercill');
  const [quoteId, setQuoteId] = useState('');
  
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBTC, setTotalBTC] = useState(0);
  const [totalSats, setTotalSats] = useState(0);

  const [currency, setCurrency] = useState('SATS');
  const [currencies, setCurrencies] = useState([])

  const formattedUSD = `$${Number(totalUSD).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  const formattedBTC = `${Number(totalBTC).toString().slice(0, 10)} btc`
  const formattedSATS = `${(totalSats).toLocaleString().slice(0, 12)} sats`

  // User available and invoicable currencies
  // useEffect(() => {

  //   const fetchCurrencies = async () => {
  //     const profileData = await getHandleProfile(handle)
  //     const tempArray = profileData.currencies
  //       .filter((curr) => curr.isAvailable && curr.isInvoiceable)
  //       .map((curr) => curr.currency);

  //       setCurrencies(tempArray)
       
  //   }
  //   if (handle !== '') {
  //     fetchCurrencies();
  //   }
    
  // }, [handle])

  // useEffect(() => {
  //   console.log('currencies', currencies)
  // }, [currencies])

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const fetchRates = async () => {
    const ratesQuote = await exchangeRates();
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

  // format and convert currency values
  useEffect(() => {              
    if (rates.length > 0) {
      if (currency === 'USD') {

        // get btc from usd
        const formattedUSD = Number(totalUSD).toFixed(2);
        const usdToBTC = rateCalculator(formattedUSD, rates, 'USD', 'BTC');    
  
        // set btc
        const formattedBTC = parseFloat(usdToBTC).toFixed(8);
        setTotalBTC(formattedBTC);
  
        // convert to sats
        const btcToSats = formattedBTC * 100000000; // 1 BTC = 100,000,000 SATS
        setTotalSats(btcToSats);
  
      } else if (currency === 'BTC' ) {
  
        // get usd from btc
        const btcToUsd = rateCalculator(totalBTC, rates, 'BTC', 'USD');
        const formattedUSD = Number(btcToUsd).toFixed(2);
  
        // set usd
        setTotalUSD(formattedUSD);
  
        // convert to sats and set
        const btcToSats = totalBTC *  (100 * 1000000);
        setTotalSats(btcToSats);
  
      } else { // SATS
  
        // conver to btc and set
        const satsToBtc = (totalSats /  (100 * 1000000));
        setTotalBTC(satsToBtc);
        const btcToUsd = rateCalculator(satsToBtc, rates, 'BTC', 'USD');
  
        // get usd from btc and set
        const formattedUSD = Number(btcToUsd).toFixed(2)
        setTotalUSD(formattedUSD);
  
      }  
    }
  }, [currency, totalBTC, totalUSD, totalSats, rates]);

  
  return (
    <div>
      <h1>{}</h1>
      <div className="navDiv">
        <button onClick={() => handleTabChange('getPaid')}>Get Paid</button>
        <button onClick={() => handleTabChange('payOut')}>Pay Out</button>        
        <button onClick={() => handleTabChange('exchangeCurrency')}>Exchange Currencies</button>
        <button onClick={() => handleTabChange('searchDiv')}>Search</button>
        <button onClick={() => handleTabChange('historyDiv')}>History</button>
        
      </div>
      <div>
      {(activeTab === 'payOut' || activeTab === 'payHandle' || activeTab === 'payOnChain' || activeTab === 'payBank' || activeTab === 'payLightningInv') &&<>
        <button onClick={() => handleTabChange('payLightningInv')}>Pay Lightning Invoice</button>
        <button onClick={() => handleTabChange('payHandle')}>Pay Strike Handle</button>
        
        <button onClick={() => handleTabChange('payOnChain')}>On Chain</button>
        <button onClick={() => handleTabChange('payBank')}>Bank</button>
      </>}
      </div>
      {(activeTab === 'payHandle' || activeTab === 'payOnChain' || activeTab === 'getPaid' || activeTab === 'exchangeCurrency')  &&
       <div>
       {totalUSD > 0 && 
        <>  
          <p>{formattedBTC}</p> 
          <p>{formattedSATS}</p>
          <p>{formattedUSD}</p>
        </>}
       <CurrencySelect 
        currency={currency}
        setCurrency={setCurrency}
      />
      <div>
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
      </div>
    </div>}

    {activeTab === 'getPaid' && 
      <div className='getPaid'>
        <Invoice 
          currency={currency} 
          totalUSD={totalUSD}
          totalBTC={totalBTC}
        />        
         {/* <QuoteInvoice />       */}
      </div>}


    {activeTab === 'payHandle' && 
      <div className='payHandle'>
        <UserInvoice 
          currency={currency}
          totalUSD={totalUSD}
          totalBTC={totalBTC}
          totalSATS={totalSats}
        />      
      </div>}

      {activeTab === 'payLightningInv' && 
      <div>
        <LightningPaymentQuote currency={currency} totalUSD={totalUSD} totalBTC={totalBTC} totalSATS={totalSats}/>
      </div>}

    {activeTab === 'payOnChain' && 
    <div className="payOnChain">
      <OnChainPaymentQuote 
        currency={currency} 
        totalUSD={totalUSD} 
        totalBTC={totalBTC}
      />
     
    </div>
    }

    {activeTab === 'exchangeCurrency' && 
      <div>
        <ExchangeCurrency 
          currency={currency}
          totalUSD={totalUSD}
          totalBTC={totalBTC}
        />
         
      </div>
    }

    {activeTab === 'payBank' &&
      <div>
      <BankPayout />
        </div>}

    {activeTab === 'searchDiv' && 
      <div className='searchDiv'>
        <StrikeUser />
        <SearchInvoices />
       </div>}
    {activeTab === 'historyDiv' &&
      <div className="historyDiv">
        <InvoiceHistory />
        </div>
    }
    </div>
  )
}

export default App
