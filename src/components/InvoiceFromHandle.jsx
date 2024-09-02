import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { createUserInvoice, executePay, lightningPayQuote } from "../../strikeApi";
import { quoteFromInvoice } from "../../strikeApi";
import { QuoteInvoice } from "./QuoteInv";
import CountdownTimer from "./CountdownTImer";

export const UserInvoice = ({ currency, totalUSD, totalBTC, totalSATS }) => {

    const [handle, setHandle] = useState('becke543');
    const [description, setDescription] = useState('test');
    // set by invoice from handle
    const [invoice, setInvoice] = useState(null);
    // using invoice id sets quote in fetchNewQuote
    const [quote, setQuote] = useState(null);
    // using lnInvoice from quote sets payQuote in fetchPayQuote
    const [payQuote, setPayQuote] = useState(null);
    // using paymentQuoteId from payQuote execute pay setsData
    const [payData, setPayData] = useState(null);

    const invoiceFromHandle = async () => {
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
        const invFromHandle = await createUserInvoice(handle, data);
        setInvoice(invFromHandle)
    };

    const fetchNewQuote = async () => {
        if (invoice.invoiceId !== '') {
         const newQuote = await quoteFromInvoice(invoice.invoiceId);
         setQuote(newQuote);
        }
     };

     // invoice id to get quote
     useEffect(() => {
        console.log('invoice', invoice)
         if (invoice !== undefined && invoice !== null) {
             fetchNewQuote();
         }
     }, [invoice])

     // Quote returns lnInv
     const fetchPayQuote = async (inv) => {
        const formattedCurrency = currency.toUpperCase();
        const data = {
            lnInvoice: inv,
            currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency
        } 
        const payQuote = await lightningPayQuote(data);
        console.log('payQuote',payQuote)
        setPayQuote(payQuote)
     };

     useEffect(() => {        
        if (quote !== null) {
            console.log('lnInv', quote.lnInvoice)
            const lnInv = quote.lnInvoice;
            fetchPayQuote(lnInv)
        }   
    }, [quote])

    const payLightning = async () => {
        const payment = await executePay(payQuote.paymentQuoteId);
        console.log('payment', payment)
        setPayData(payment)
    }

    useEffect(() => {
        if (payData !== null || payData !== undefined) {
            console.log('pay data', payData)
        }
    }, [payData])

    const handlePay = () => {
        const userConfirmed = confirm(`Pay ${currency === 'USD' ? `$${totalUSD}` : currency === 'BTC' ? `${totalBTC} btc` : `${totalSATS} sats`}, Execute?`);
        if (userConfirmed) {
            payLightning();
        } else {
            console.log('Payment canceled')
        }
    }
   
    return (
        <div>
            <legend>Create an invoice on behalf of another user</legend>
            <label>Description
                <input 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
            <label>Handle
                <input 
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                />
            </label>
            <button type='button' onClick={invoiceFromHandle}>Create Invoice</button>
            {invoice && 
                <>
                    <p>{invoice.invoiceId}</p>    
                    <button type='button' onClick={() => handlePay()}>Pay Invoice</button>
          
                </>
            }
           
        </div>
    )
}