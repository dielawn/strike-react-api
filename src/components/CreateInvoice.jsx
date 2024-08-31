import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getExchangeRates, rateCalculator } from '../../utils';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const Invoice = ({ setInvoiceId, currency, totalUSD, setTotalUSD, totalSats, setTotalSats, description, setDescription, totalBTC, setTotalBTC, deleteInvoice }) => {
    const [invoice, setInvoice] = useState(null);
    const [rates, setRates] = useState([]);

    const fetchRates = async () => {
        const ratesQuote = await getExchangeRates();
        setRates(ratesQuote)
    };

    useEffect(() => {
        fetchRates();
      }, [])

    useEffect(() => {    
        fetchRates();

        if (currency === 'USD') {
            const usdToBTC = rateCalculator(totalUSD, rates, 'USD', 'BTC')
            setTotalBTC(usdToBTC)
        } else if (currency === 'BTC' ) {
            const btcToUsd = rateCalculator(totalBTC, rates, 'BTC', 'USD')
            setTotalUSD(btcToUsd)
        } else {
            const satsToBtc = totalSats / 100000000;
            setTotalBTC(satsToBtc)
        }  
        
    }, [currency, totalBTC, totalUSD, totalSats]);
    
    useEffect(() => {
        if (invoice !== null) {
            setInvoiceId(invoice.invoiceId)
        }       
    }, [invoice]);

    const createInvoice = async () => {
        console.log(description, currency, totalUSD, totalBTC)
        if (!description || !currency || totalUSD === 0 || totalBTC === 0) {
            throw new Error('Missing required parameters');
        }
        const correlationId = uuidv4();
        
       const formattedCurrency = currency.toUpperCase();
               
        const data = { 
            correlationId,
            description,
            amount: {
                currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
                amount: currency === 'USD' ? totalUSD : totalBTC
            }
         }
        try {
           const response = await axios.post(`${apiUrl}/invoices`, data, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },  
            })
            const responseData = response.data
            console.log('Invoice created:', responseData)
            setInvoice(responseData)
    
        } catch (error) {
            console.error('Error creating new invoice:', error.response?.data || error.message);
            throw error; 
        }
    };

    const handleDeleteInvoice = () => {
        deleteInvoice();
        setInvoice(null);
    }

    

    return (
        <fieldset>
            <legend>Create Strike Invoice</legend>
            {totalUSD > 0 && <p>${totalUSD} {totalBTC} btc {totalSats} sats</p>}
            <label>Amount: 
                <input 
                value={currency === 'USD' ? totalUSD : currency === 'BTC' ? totalBTC : totalSats}
                onChange={(e) => currency === 'USD' ? setTotalUSD(e.target.value) : currency === 'BTC' ? setTotalBTC(e.target.value) : setTotalSats(e.target.value)}
                />
            </label>
            <label>Description
                <input 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
           
            <button type='button' onClick={createInvoice}>Create Invoice</button>
            {invoice && 
            <>
            <p>Invoice Id: {invoice.invoiceId}</p>
            <button type='button' onClick={handleDeleteInvoice}>Delete Invoice</button>
            </>}
        </fieldset>
    )
};




