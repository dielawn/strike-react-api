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
import AcctBalances from './components/Balances';
import CardWrapper from './components/Card';
import { exchangeRates } from '../strikeApi';
import { rateCalculator } from '../utils';
import NavLinks from './components/NavLinks';
import QRCode from 'react-qr-code'; // default import
import lightningBoltIcon from './assets/bolt_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import chainIcon from './assets/link_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import savingsIcon from './assets/savings_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import bankIcon from './assets/account_balance_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [activeBtns, setActiveBtns] = useState([]);

  const [rates, setRates] = useState([]);

  const [handle, setHandle] = useState('dmercill');
  const [quoteId, setQuoteId] = useState('');
  const [lnInv, setLnInv] = useState('');
  
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBTC, setTotalBTC] = useState(0);
  const [totalSats, setTotalSats] = useState(0);

  const [currency, setCurrency] = useState('SATS');
  const [currencies, setCurrencies] = useState([])

  const [balanceData, setBalanceData] = useState(null);
  const [limitsData, setLimitsData] = useState(null);
  const [depositsData, setDepositsData] = useState(null);
  const [payoutData, setPayoutData] = useState(null);

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
      <main className="main-layout">
        <div className="header header-md">
          {handle && <h1>{handle}@strike.me</h1>}
          <CardWrapper />
        </div>

        <div className="content-layout content-layout-md">

          <div className="left-section left-section-md">
            {/* <div className={styles.shape} /> */}
            <NavLinks activeTab={activeTab} handleTabChange={handleTabChange}/>
              <span>Log in</span>
              {/* <img src={arrowRightIcon} className="w-5 md:w-6" /> */}
          
          </div>

          <div className="right-section right-section-md">
            {/* relevant tab */}
           
              {(activeTab === 'payOut' || 
                activeTab === 'payHandle' || 
                activeTab === 'payOnChain' || 
                activeTab === 'payBank' || 
                activeTab === 'payLightningInv') &&
                <div className='sendNav'>
                  <button className='payBtn' onClick={() => handleTabChange('payLightningInv')}><img className='icon' alt='Lightning' src={lightningBoltIcon}/>Lightning</button>
                  <button className='payBtn' onClick={() => handleTabChange('payHandle')}>@strike.me</button>                
                  <button className='payBtn' onClick={() => handleTabChange('payOnChain')}><img className='icon' src={savingsIcon} /> On Chain</button>
                  <button className='payBtn' onClick={() => handleTabChange('payBank')}><img className='icon' src={bankIcon} alt='Bank'/>Bank</button>
                </div>}
            
              {(activeTab === 'payHandle' || activeTab === 'payOnChain' || activeTab === 'getPaid' || activeTab === 'exchangeCurrency')  &&
              <div className='inputDiv'>
                
                <h3 className='inputLabel'>Amount:               
                <input 
                className='amountInput'
                value={
                    currency === 'USD' ? totalUSD :
                    currency === 'BTC' ? totalBTC : 
                    totalSats}
                onChange={(e) => 
                    currency === 'USD' ? setTotalUSD(e.target.value) : 
                    currency === 'BTC' ? setTotalBTC(e.target.value) : 
                    setTotalSats(e.target.value)}
                />
                </h3> <CurrencySelect 
                  currency={currency}
                  setCurrency={setCurrency}
                />
              
            </div>}
            {activeTab === 'getPaid' && <>
              <div className='getPaid'>
                <Invoice 
                  currency={currency} 
                  totalUSD={totalUSD}
                  totalBTC={totalBTC}
                  setLnInv={setLnInv}
                />                      
              </div>
               {lnInv !== '' &&      
                <div className="qrCode" >
                  <QRCode value={lnInv || ' '} size={256} />  
                </div>               
                                       
              }</>
              }
          


            {activeTab === 'payHandle' && 
              <div className='payHandle payDiv'>
                <UserInvoice 
                  currency={currency}
                  totalUSD={totalUSD}
                  totalBTC={totalBTC}
                  totalSATS={totalSats}
                />      
              </div>}

              {activeTab === 'payLightningInv' && 
              <div className='payDiv'>
                <LightningPaymentQuote 
                  currency={currency} 
                  totalUSD={totalUSD} 
                  totalBTC={totalBTC} 
                  totalSATS={totalSats}
                />
              </div>}

            {activeTab === 'payOnChain' && 
            <div className="payOnChain payDiv">
              <OnChainPaymentQuote 
                currency={currency} 
               
                totalBTC={totalBTC}
                totalUSD={totalUSD}
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
              <div className='payDiv'>
                <BankPayout />
              </div>}

            {activeTab === 'searchDiv' && 
              <div className='searchDiv'>
                <StrikeUser />
                <SearchInvoices />
              </div>}
            {activeTab === 'history' &&
              <div className="history">
                <InvoiceHistory />

                {/* Deposit history */}

              </div>
            }
          {totalUSD > 0 && 
                <div className='currencyConversion'>  
                  <h2>{formattedBTC}</h2> 
                  <h2>{formattedSATS}</h2>
                  <h2>{formattedUSD}</h2>
                </div>}
          </div>

        </div>
        </main>      
    </div>
  )
}

export default App
