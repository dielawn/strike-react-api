import './ExchangeCurrency.css'
import { useEffect, useState } from "react";
import { quoteExchange, executeExchange } from "../../strikeApi";
import CountdownTimer from '../components/CountdownTImer';

const ExchangeCurrency = ({ currency, totalUSD, totalBTC }) => {
    const [sellCurrency, setSellCurrency] = useState('USD');
    const [buyCurrency, setBuyCurrency] = useState('BTC');
    const [exchangeQuote, setExchangeQuote] = useState(null);
    const [confirmation, setConfirmation] = useState(null);
    const [message, setMessage] = useState('');

    const exchangeOptions = [['USD', 'BTC'], ['BTC', 'USD']]
    
    const getExchangeQuote = async () => {
        const data = {
            sell: sellCurrency,
            buy: buyCurrency,
            amount: {
                amount: sellCurrency === 'USD' ? totalUSD : totalBTC,
                currency: sellCurrency === 'SATS' ? 'BTC' : sellCurrency
            }
        }
        const isValid = validateData(data)
        if (!isValid) {
            return
        } else {
            try {           
                const quote = await quoteExchange(data);
               
                console.log('exchange quote', quote)
                if (quote !== undefined) {
                    if (quote.message) {
                        setMessage(quote.message)
                    } else {
                        setExchangeQuote(quote)
                    }                
                } 
                
            } catch (error) {
                console.error(`Exchange error`, error)
            }
        }
    };

    const validateData = (data) => {
        if (typeof data.sell !== 'string' && (data.sell !== 'BTC' || data.sell !== 'USD')) {
            setMessage('Invalid sell currency')
            return false
        }
        if (typeof data.buy !== 'string' && (data.buy !== 'BTC' || data.buy !== 'USD')) {
            setMessage('Invalid buy currency')
            return false
        }
        if (typeof data.amount !== 'object' 
            || typeof data.amount.amount !== 'number' 
            || data.amount.amount <= 0 
            || (data.amount.currency !== 'BTC' && data.amount.currency !== 'USD')) {
                setMessage('Invalid amount must be a positive number')
                return false
        }
        // All checks pass
        return true
    }

    const handleCurrencyChange = (event) => {
        const selectedOption = event.target.value.split('/');
        setSellCurrency(selectedOption[0]);
        setBuyCurrency(selectedOption[1]);
    };

    const handleExchange = async () => {        
        try {
            const executedEx = await executeExchange(exchangeQuote.id);
            console.log('executed exchange', executedEx)
            setConfirmation(executedEx);
        } catch (error) {
            console.error('Error ', error.response?.data || error.message);
        }       
    };

    useEffect(() => {
        if (message !== '') {
            const intervalId = setInterval(() => {
                setMessage('')
             }, 5000);

             return () => clearInterval(intervalId);
        }
    }, [message])

    return (
        <div>
             
           <div className='payDiv'>
           <h1>Exchange</h1> 
                <div className='exchangeDiv'>
                <select 
                    value={`${sellCurrency}/${buyCurrency}`} 
                    onChange={handleCurrencyChange}
                    id="currency-select"
                    name="currency"
                >
                    {exchangeOptions.map((curr) => (
                        <option key={curr.join('/')} value={curr.join('/')}>
                            {curr.join('/')}
                        </option>
                    ))}
                </select>
                <button className='btn' onClick={() => getExchangeQuote()}>Quote</button>
                
                </div>
                {message && <p className='messageTxt'>{message}</p>}
           </div>
           {exchangeQuote && 
                <div className='quoteInfo'>
                    <h3>{exchangeQuote.source.amount} {exchangeQuote.source.currency} to {exchangeQuote.target.amount} {exchangeQuote.target.currency}</h3>
                    <h3>Fee: {exchangeQuote.fee.amount} {exchangeQuote.fee.currency}</h3>
                    <CountdownTimer targetDate={exchangeQuote.validUntil}/>
                    <button onClick={async () => await handleExchange()}>Exchange</button>
                </div>
            }
            
            {confirmation && 
            <>
              
            </>}
        </div>
    );
};

export default ExchangeCurrency