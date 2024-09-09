import { useEffect } from "react";
import CountdownTimer from "./CountdownTImer";
import { quoteInvoice } from "../../strikeApi";
import React from 'react';
import copyIcon from '../assets/content_copy_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'


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
                
                <button className="addBtn" type="button" onClick={copyLnInv}><img className="icon" src={copyIcon} alt="Copy" />{quote.lnInvoice.slice(0, 9)}...{quote.lnInvoice.slice(-10, quote.lnInvoice.length)}</button>
            </>}
        </div>
    )
};