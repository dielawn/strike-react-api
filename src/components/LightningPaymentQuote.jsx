import axios from 'axios';
import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;
import { lightningPayQuote } from '../../strikeApi';

export const LightningPaymentQuote = ({ currency }) => {
    const [lnInvoice, setLnInvoice] = useState('');
    const [payment, setPayment] = useState(null);
    
    const getPayQuote = async () => {
        const formattedCurrency = currency.toUpperCase();
        const data = {
            lnInvoice: lnInvoice,
            sourceCurrency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
        }
        const payQuote = await lightningPayQuote(data);
        setLnInvoice(payQuote.lnInvoice)
    };

    const copyQuoteId = () => {
        navigator.clipboard.writeText(payment.paymentQuoteId)
    };


    return (
        <div>
            <legend>Create Lightning Pay Quote</legend>
            <label>Lightning Inv: 
                <input 
                 value={lnInvoice}
                 onChange={(e) => setLnInvoice(e.target.value)}
                />
            </label>
            <button type='button' onClick={getPayQuote}>Get Pay Quote</button>
            {payment &&
            <>
                <p>{payment.amount.currency === 'USD' ? `$${payment.amount.amount}` : `${payment.amount.amount} btc`}</p>
                <p>{payment.description}</p>
               
                <button type='button' onClick={copyQuoteId}>Copy Lightning Quote Id</button>
            </>
            }
        </div>
    )
}
