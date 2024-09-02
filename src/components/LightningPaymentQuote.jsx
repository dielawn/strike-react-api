import { useEffect, useState } from 'react';
import { quoteLightning, executePay } from '../../strikeApi';

export const LightningPaymentQuote = ({ currency }) => {

    const [lnInvoice, setLnInvoice] = useState('');
    // using lnInvoice from quote sets payQuote in fetchPayQuote
    const [payQuote, setPayQuote] = useState(null);
    const [payData, setPayData] = useState(null);
    
    // Post lnInvoice get payment quote
    const getPayQuote = async () => {
        const formattedCurrency = currency.toUpperCase();
        const data = {
            lnInvoice: lnInvoice,
            sourceCurrency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
        }
        const quote = await quoteLightning(data);
        console.log(quote)
        setPayQuote(quote)
    };

    useEffect(() => {
        if (payQuote !== null && payQuote !== undefined) {        
            handlePay();
        }
    }, [payQuote])

    const handlePay = async () => {
        const userConfirmed = confirm(`Pay ${currency === 'USD' ? `$${payQuote.amount.amount}` : `${payQuote.amount.amount} btc`}, Execute?`);
        if (userConfirmed) {       
                const payment = await executePay(payQuote.paymentQuoteId);
                console.log('payment', payment)
                setPayData(payment)
            
        } else {
            console.log('Payment canceled')
        }
    }

    return (
        <div>
            <legend>Create Lightning Pay Quote</legend>
            <label>Lightning Inv: 
                <input 
                 value={lnInvoice}
                 onChange={(e) => setLnInvoice(e.target.value)}
                />
            </label>
            <button type='button' onClick={getPayQuote}>Pay Lightning Invoice</button>
            {payData &&
            <>
                <p>{payData.amount.currency === 'USD' ? `$${payData.amount.amount}` : `${payData.amount.amount} btc`}</p>
                <p>{payData.description}</p>
               
            </>
            }
        </div>
    )
}
