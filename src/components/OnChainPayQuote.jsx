import axios from 'axios';
import { useEffect, useState } from 'react';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const OnChainPaymentQuote = ({ currency, totalUSD, totalBTC }) => {
    const [quote, setQuote] = useState(null);
    const [tier, setTier] = useState('tier_free');
    const [allTiers, setAllTiers] = useState([]);
    const [btcAddress, setBtcAddress] = useState('');
    const [description, setDescription] = useState('');
    const formattedCurrency = currency.toUpperCase();

    const onChainQuote = async () => {
                
        const data = {
            btcAddress,
            amount: {
                currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
                amount: currency === 'USD' ? totalUSD : totalBTC
            }
        }
        try {
            const response = await axios.post(`${apiUrl}/payment-quotes/onchain/tiers`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },   
            })
            const responseData = response.data
            console.log('On chain quote:', responseData)
            setAllTiers(responseData)
           
    
        } catch (error) {
             console.error('Error creating on chain tx quote:', error.response?.data || error.message);
             throw error; 
         }
    };

// test address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
    useEffect(() => {
        const fetchQuotes = async () => {
            if (btcAddress !== '' && totalBTC > 0 && totalUSD > 0 ) {
               await onChainQuote();
            }
        }
        fetchQuotes();
    }, [btcAddress, currency, totalBTC, totalUSD])

    const quoteTier = async () => {
        const data = {
            btcAddress,
            sourceCurrency: formattedCurrency,
            description,
            amount: {
                currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
                amount: currency === 'USD' ? totalUSD : totalBTC,
                feePolicy: 'INCLUSIVE'
            },
            onchainTierId: tier
        }
        try {
            const response = await axios.post(`${apiUrl}/payment-quotes/onchain`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },    
            })
            const responseData = response.data
            console.log('On chain quote:', responseData)
            setQuote(responseData)
    
        } catch (error) {
             console.error('Error creating on chain tx quote:', error.response?.data || error.message);
             throw error; 
         }
    }

    const copyQuoteId = (id) => {
        navigator.clipboard.writeText(id)
    }

    return (
    <fieldset>
        <legend>On Chain Quote</legend>
        <label>Bitcoin address: 
            <input
                value={btcAddress}
                onChange={(e) => setBtcAddress(e.target.value)}
            />
        </label>
        <label>Description:
            <input 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
        </label>
        <button onClick={() => quoteTier()}>Get Quote</button>
        {tier && <p>{tier.id === 'tier_fast' ? 'Fast' : tier.id === 'tier_standard' ? 'Standard' : 'Free'} tier selected</p>}
        {allTiers && allTiers.map((tier) => (
            <div key={tier.id}>
                <p>{tier.estimatedDurationInMin}</p>
                <p>Fee: {tier.estimatedFee.amount}{tier.estimatedFee.currency}</p>
                <button onClick={() => setTier(tier.id)}>{tier.id === 'tier_fast' ? 'Fast' : tier.id === 'tier_standard' ? 'Standard' : 'Free'}</button>
            </div>
        ))}
        {quote && 
        <>
            <p>Deposited: {quote.amount.amount}</p>
            <p>Fee: {quote.totalFee.amount}</p>
            <p>Total: {quote.totalAmount.amount}</p>
            <p>{quote.description}</p>
            <p>Best Before: {quote.validUntil}</p>
            <button onClick={() => copyQuoteId(quote.paymentQuoteId)}>Copy Payment Quote</button>
        </>
        }
    </fieldset>
    )
};