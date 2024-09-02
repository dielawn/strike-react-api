import { useState } from "react";
import { quoteExchange, executeExchange } from "../../strikeApi";
import CountdownTimer from '../components/CountdownTImer';

const ExchangeCurrency = ({ currency, totalUSD, totalBTC }) => {
    const [sellCurrency, setSellCurrency] = useState('USD');
    const [buyCurrency, setBuyCurrency] = useState('BTC');
    const [exchangeQuote, setExchangeQuote] = useState(null);
    const [confirmation, setConfirmation] = useState(null);

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
        const quote = await quoteExchange(data);
        console.log('exchange quote', quote)
        setExchangeQuote(quote)
    };

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

    return (
        <div>
            <legend>Exchange pair</legend>
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
            <button onClick={() => getExchangeQuote()}>Get Exchange Quote</button>
            {exchangeQuote && (
                <div>
                    <p>Fee: {exchangeQuote.fee.amount} {exchangeQuote.fee.currency}</p>
                    <p>Conversion Rate: {exchangeQuote.conversionRate.amount} Source Currency: {exchangeQuote.conversionRate.sourceCurrency} Target Currency: {exchangeQuote.conversionRate.targetCurrency}</p>
                    <p>Source: {exchangeQuote.source.amount} {exchangeQuote.source.currency}</p>
                    <p>Target: {exchangeQuote.target.amount} {exchangeQuote.target.currency}</p>
                    <p>Best Before:</p> <CountdownTimer targetDate={exchangeQuote.validUntil}/>
                    <button onClick={async () => await handleExchange()}>Exchange</button>
                </div>
            )}
            {confirmation && 
            <>
              
            </>}
        </div>
    );
};

export default ExchangeCurrency