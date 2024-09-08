import './LightningPaymentQuote.css'
import { useEffect, useState } from 'react';
import { quoteLightning, executePay } from '../../strikeApi';
import lightningIcon from '../assets/bolt_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'

const LightningPaymentQuote = ({ currency, activeTab }) => {

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

    // Execute pay when payQuote is valid
    useEffect(() => {
        if (payQuote !== null && payQuote !== undefined) {        
            handlePay();
        }
    }, [payQuote])

    // Confirm or cancel pay 
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
            <h1>Lightning Pay Quote</h1>
            <h3>Lightning Inv: 
                <input 
                 value={lnInvoice}
                 onChange={(e) => setLnInvoice(e.target.value)}
                />
            </h3>
            <button  
                type='button' 
                onClick={getPayQuote}
                className={`btn ${activeTab === 'payLightningInv' ? 'btn-active' : ''} md:btn-md`}
                >Pay <img className='icon' src={lightningIcon} alt='Lightning' /> </button>
            {payData &&
            <>
                <p>{payData.amount.currency === 'USD' ? `$${payData.amount.amount}` : `${payData.amount.amount} btc`}</p>
                <p>{payData.description}</p>
               
            </>
            }
        </div>
    )
};

export default LightningPaymentQuote
