import { useEffect, useState } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

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
                currency: sellCurrency === 'SATS' ? 'BTC' : sellCurrency,
                amount: sellCurrency === 'USD' ? totalUSD : totalBTC
            }
        }
        try {
            const response = await axios.post(`${apiUrl}/currency-exchange-quotes`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },   
            })
            const responseData = response.data
            console.log('exchange quote', responseData)
            setExchangeQuote(responseData)

        } catch (error) {
            console.error('Error ', error.response?.data || error.message);
        }
    };

    const handleCurrencyChange = (event) => {
        const selectedOption = event.target.value.split('/');
        setSellCurrency(selectedOption[0]);
        setBuyCurrency(selectedOption[1]);
    };

    const executeExchange = async (quoteId) => {
        console.log(quoteId)
        try {
            const response = await axios.patch(`${apiUrl}/currency-exchange-quotes/${quoteId}/execute`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },    
            })
            const responseData = response.data
            console.log('Executed exchange', responseData)
            setConfirmation(responseData)
    
        } catch (error) {
            console.error('Error ', error.response?.data || error.message);
        }
    }

    const handleExchange = async (id) => {
        try {
            const executedEx = await executeExchange(id);
            setConfirmation(executedEx);
        } catch (error) {
            console.error('Error ', error.response?.data || error.message);
        }       
        
    }

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
                    <button onClick={() => handleExchange(exchangeQuote.id)}>Exchange</button>
                </div>
            )}
        </div>
    );
};

export default ExchangeCurrency