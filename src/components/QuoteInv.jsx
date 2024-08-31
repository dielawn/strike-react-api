import { useEffect, useState } from "react";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const QuoteInvoice = ({ invoiceId, quoteId, setQuoteId, lnInvoice, setLnInvoice }) => {
    const [quote, setQuote] = useState(null);
    const [isExpired, setIsExpired] = useState(true);

    // set is expired when quote expires
    useEffect(() => {
        if (!quote) {
            setIsExpired(true)
        } else {
            const expiration = new Date(quote.expiration)
            const currentTime = Date.now()
            const expired = expiration > currentTime
            setIsExpired(expired)
        }
    }, [quote, invoiceId])

    // if invoce is deleted, delete quote when expired
    useEffect(() => {
        if (isExpired) {
            setQuote(null)
            setQuoteId('');
            setLnInvoice('');
        }
    }, [isExpired])

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
    // Create a quote from invoiceId
    useEffect(() => {
        if (invoiceId !== '') {
            quoteFromInvoice();
        }
    }, [invoiceId]);

    // Set quoteId and lnInvoice
    useEffect(() => {
        if (quote !== null) {
            setQuoteId(quote.quoteId);
            setLnInvoice(quote.lnInvoice);
            
        }        
    }, [quote]);

    // Renew quote before expiration
    useEffect(() => {
        if (invoiceId !== '') {
            const intervalId = setInterval(() => {
                if (quote !== null) {
                    console.log('New quote')
                    quoteFromInvoice();
                }
            }, 45000); //Quotes expire after 57 sec
            return () => clearInterval(intervalId);    
        }
          
    }, [quote]);

    const copyLnInv = () => {
        navigator.clipboard.writeText(quote.lnInvoice)
    };

    return (
        <fieldset>
            <legend>Quote from Invoice</legend>
            {quoteId && <p>Quote Id: {quoteId}</p>}
            {quote && <p>Expiration: {quote.expiration}</p>}
            {lnInvoice && <button type="button" onClick={copyLnInv}>Copy Lightning Inv: {lnInvoice.slice(0, 9)}...{lnInvoice.slice(263, 268)}</button>}
        </fieldset>
    )
};