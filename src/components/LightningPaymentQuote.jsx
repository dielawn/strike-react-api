import axios from 'axios';
import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const LightningPaymentQuote = ({ currency }) => {
    const [lnInvoice, setLnInvoice] = useState('');
    const [payment, setPayment] = useState(null);
    const [fee, setFee] = useState(0);

    const getPayQuote = async () => {
        const formattedCurrency = currency.toUpperCase();
        const data = {
            lnInvoice: lnInvoice,
            sourceCurrency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
        }
        try {
            const response = await axios.post(`${apiUrl}/payment-quotes/lightning`, data,{ 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },     
             })
             const responseData = response.data
             console.log('Lightning quote created:', responseData)
             setPayment(responseData)
    
         } catch (error) {
             console.error('Error creating new lightning quote:', error.response?.data || error.message);
             throw error; 
         }
    };

    const copyQuoteId = () => {
        navigator.clipboard.writeText(payment.paymentQuoteId)
    };

    const calcFee = () => {
        const submittedAmount = payment.amount.amount;
        const totalAmount = payment.totalAmount;
        const feeAmount = totalAmount - submittedAmount
        setFee(feeAmount);
    }

    useEffect(() => {
       if (lnInvoice !== '') {
        const submittedAmount = payment.amount.amount;
        const totalAmount = payment.totalAmount;
        if (totalAmount > submittedAmount) {
            calcFee();
        }
       }
    }, [lnInvoice]);

    return (
        <fieldset>
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
                <p>Fee: {fee}</p>
                <button type='button' onClick={copyQuoteId}>Copy Lightning Quote Id</button>
            </>
            }
        </fieldset>
    )
}
