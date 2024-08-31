import { useEffect, useState } from 'react'
import './App.css'
import { Invoice } from './components/CreateInvoice';
import { QuoteInvoice } from './components/QuoteInv';
import { StrikeUser } from './components/StrikeProfile';
import { SearchInvoices } from './components/SearchInvoice';
import { CurrencySelect } from './components/CurrencySelect';
import { BankPayout } from './components/BankPayout';

function App() {
  const [totalUSD, setTotalUSD] = useState(0);
  const [totalBTC, setTotalBTC] = useState(0);
  const [totalSats, setTotalSats] = useState(0);

  const [currency, setCurrency] = useState('BTC');
  const [invoiceId, setInvoiceId] = useState('');
  const [quoteId, setQuoteId] = useState('');
  
  const [description, setDescription] = useState('');
  const [lnInvoice, setLnInvoice] = useState('');

  const deleteInvoice = () => {
    setInvoiceId('')
    setQuoteId('')
};

useEffect(() => {
  // Convert to sats
  if (currency === 'BTC' || 'USD') {
    const sats = totalBTC * 100000000
    console.log('sats', sats)
    setTotalSats(sats);
  } else {
    // Convert sats to btc
    const btc = sats / 100000000
    console.log('btc', btc)
    setTotalBTC(btc)
  }
 
  
}, [currency])

  return (
    <div>
       <div>
        <StrikeUser />
        <SearchInvoices />
      </div>
      <CurrencySelect 
        currency={currency}
        setCurrency={setCurrency}
      />
      <Invoice 
        setInvoiceId={setInvoiceId}
        currency={currency} 
        totalUSD={totalUSD}
        setTotalUSD={setTotalUSD}
        totalBTC={totalBTC}
        setTotalBTC={setTotalBTC}
        totalSats={totalSats}
        setTotalSats={setTotalSats}
        description={description}
        setDescription={setDescription}
        deleteInvoice={deleteInvoice}
      />
      <QuoteInvoice 
        invoiceId={invoiceId}
        quoteId={quoteId}
        setQuoteId={setQuoteId}
        lnInvoice={lnInvoice}
        setLnInvoice={setLnInvoice}
      />
     {/* <BankPayout /> */}
    </div>
  )
}

export default App
