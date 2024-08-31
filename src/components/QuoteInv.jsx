import { useEffect, useState } from "react";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const QuoteInvoice = () => {
    const [invoiceId, setInvoiceId] = useState('')
    const [quote, setQuote] = useState(null);

    const quoteFromInvoice = async () => {
        try {
            const response = await axios.post(`${apiUrl}/invoices/${invoiceId}/quote`, null,{ 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },       
             })
             const responseData = response.data
             console.log('Quote created:', responseData)
             setQuote(responseData)
    
         } catch (error) {
             console.error('Error creating new quote:', error.response?.data || error.message);
             throw error; 
         }
    };
    
    const copyLnInv = () => {
        navigator.clipboard.writeText(quote.lnInvoice)
    };

    const copyQuoteId = () => {
        navigator.clipboard.writeText(quote.quoteId)
    };

    return (
        <fieldset>
            <legend>Quote from Strike Invoice</legend>
            <label>
                <input 
                    value={invoiceId}
                    onChange={(e) => setInvoiceId(e.target.value)}
                />
            </label>
            <button type="button" onClick={quoteFromInvoice} >Create Quote</button>
    
            {quote && 
            <>
                <p>Expiration: {quote.expiration}</p>
                <p>Quote id: {quote.quoteId}</p>
                <button type="button" onClick={copyQuoteId}>Copy Quote Id</button>
                <p>Lightning Invoice: {quote.lnInvoice.slice(0, 9)}...{quote.lnInvoice.slice(-10, quote.lnInvoice.length)}</p>
                <button type="button" onClick={copyLnInv}>Copy Lightning Inv</button>
            </>}
        </fieldset>
    )
};