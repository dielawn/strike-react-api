import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { createHandleInvoice, executePay, quoteLightning, quoteInvoice } from "../../strikeApi";

const UserInvoice = ({ currency, totalUSD, totalBTC, totalSATS }) => {

    const [handle, setHandle] = useState('becke543');
    const [description, setDescription] = useState('test');
    const [lnInvoice, setLnInvoice] = useState('');

    // set by invoice from handle
    const [invoice, setInvoice] = useState(null);
    // using invoice id sets quote in fetchNewQuote
    const [quote, setQuote] = useState(null);
    // using lnInvoice from quote sets payQuote in fetchPayQuote
    const [payQuote, setPayQuote] = useState(null);
    // using paymentQuoteId from payQuote execute pay setsData
    const [payData, setPayData] = useState(null);

    // Create a new invoice on behalf of another strike user
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
        const invFromHandle = await createHandleInvoice(handle, data);
        setInvoice(invFromHandle)
    };

    // Set quote from invoice id
    const fetchNewQuote = async () => {
        if (invoice.invoiceId !== '') {
         const newQuote = await quoteInvoice(invoice.invoiceId);
         setQuote(newQuote);
        }
     };

     // Quote request when invoice is valie
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
        const payQuote = await quoteLightning(data);
        console.log('payQuote',payQuote)
        setPayQuote(payQuote)
     };
     // Set lightning invoice from quote
     useEffect(() => {        
        if (quote !== null) {
            console.log('lnInv', quote.lnInvoice)
            const lnInv = quote.lnInvoice;
            fetchPayQuote(lnInv);
            setLnInvoice(lnInv);
        }   
    }, [quote]);
    // Execute pay lightning ivoice
    const payLightning = async () => {
        if (payQuote) {
            const payment = await executePay(payQuote.paymentQuoteId);
            console.log('payment', payment)
            setPayData(payment)
        }        
    };

    useEffect(() => {
        if (payData !== null || payData !== undefined) {
            console.log('pay data', payData)
        }
    }, [payData]);

    const handlePay = async () => {
        
        const userConfirmed = confirm(`Pay ${currency === 'USD' ? `$${totalUSD}` : currency === 'BTC' ? `${totalBTC} btc` : `${totalSATS} sats`}, Execute?`);
        if (userConfirmed) {
           await payLightning();
        } else {
            console.log('Payment canceled')
        }
    }

    useEffect(() => {
        if (payQuote && totalBTC > 0) {
            handlePay();
        }
    }, [payQuote]);

    const copyLnInv = () => {
        navigator.clipboard.writeText(lnInvoice)
    }

    return (
        <div>
            <h1>Send to handle</h1>
            
            <h3>
                <input 
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                />@strike.me
            </h3>
            <h3>Memo
                <input 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </h3>
            <button type='button' onClick={invoiceFromHandle}>Pay</button>
            {lnInvoice !== '' && <button onClick={() => copyLnInv()}>Copy Lightning Invoice</button>}
          
            {payData && <p>Payment: {payData.result} Status: {payData.state}</p>}
        </div>
    )
};

export default UserInvoice