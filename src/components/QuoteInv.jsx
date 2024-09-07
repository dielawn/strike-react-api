import { useEffect } from "react";
import CountdownTimer from "./CountdownTImer";
import { quoteInvoice } from "../../strikeApi";
import React from 'react';



export const QuoteInvoice = ({ invoiceId, quote, setQuote }) => {    
    
    // Use invoice id to generate a new quote
    const fetchNewQuote = async () => {
       if (invoiceId !== '') {
        const newQuote = await quoteInvoice(invoiceId);
        setQuote(newQuote);
       }
    };

    useEffect(() => {
        if (invoiceId !== '' && invoiceId !== undefined) {
            fetchNewQuote();
        }
    }, [invoiceId])

    // New Quote on expiration
    useEffect(() => {
        const interval = setInterval(() => {
            if (quote) {
                const now = new Date();
                const exp = new Date(quote.expiration); 
                if (now > exp) {
                    clearInterval(interval)
                    fetchNewQuote();
                    console.log('Quote renewed')
                }
            }
        }, 60000);

        return () => clearInterval(interval); // cleanup on unmount
      }, [quote]);
    
    const copyLnInv = () => {
        navigator.clipboard.writeText(quote.lnInvoice)
    };


    return (
        <div>
             
            {quote && 
            <>               
                <CountdownTimer targetDate={quote.expiration} />
                <p>Lightning Invoice: {quote.lnInvoice.slice(0, 9)}...{quote.lnInvoice.slice(-10, quote.lnInvoice.length)}</p>
                
                
                <button type="button" onClick={copyLnInv}>Copy Lightning Inv</button>
            </>}
        </div>
    )
};