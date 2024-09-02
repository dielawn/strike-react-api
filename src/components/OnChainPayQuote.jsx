import { useEffect, useState } from 'react';
import CountdownTimer from './CountdownTImer';
import { quoteOnChain, quoteOnChainTier } from '../../strikeApi';

export const OnChainPaymentQuote = ({ currency, totalUSD, totalBTC }) => {
    const [payQuote, setPayQuote] = useState(null);
    const [payData, setPayData] = useState(null);
    const [tier, setTier] = useState('tier_free');
    const [allTiers, setAllTiers] = useState([]);
    const [btcAddress, setBtcAddress] = useState('');
    const [description, setDescription] = useState('');
    const formattedCurrency = currency.toUpperCase();

    const onChainQuotes = async () => {
                
        const data = {
            btcAddress,
            amount: {
                currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
                amount: currency === 'USD' ? totalUSD : totalBTC
            }
        }
        const onChainQuote = await quoteOnChain(data);
        console.log(onChainQuote)
        setAllTiers(onChainQuote);
    };

// test address: 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
    useEffect(() => {
        const fetchQuotes = async () => {
            if (btcAddress !== '' && totalBTC > 0 && totalUSD > 0 ) {
               await onChainQuotes();
            }
        }
        fetchQuotes();
    }, [btcAddress, currency, totalBTC, totalUSD])

    const getPayQuote = async () => {
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
        
        const quote = await quoteOnChainTier(data);
        console.log('quote', quote)
        setPayQuote(quote)
    }

    useEffect(() => {
        console.log(tier)
    }, [tier])

    const copyQuoteId = (id) => {
        navigator.clipboard.writeText(id)
    };

    const handlePay = async () => {
        const userConfirmed = confirm(`${btcAddress},
            Pay ${currency === 'USD' ? `$${payQuote.amount.amount}` : `${payQuote.amount.amount} btc`}, Execute?`);
        if (userConfirmed) {       
                const payment = await executePay(payQuote.paymentQuoteId);
                console.log('payment', payment)
                setPayData(payment)
            
        } else {
            console.log('Payment canceled')
        }
    }

    useEffect(() => {
        if (payData !== null) {
            console.log(payData)
        }
    }, [payData])

    return (
    <div>
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
        <button onClick={() => getPayQuote()}>Get Quote</button>
        {tier && <h3>{tier.id === 'tier_fast' ? 'Fast' : tier.id === 'tier_standard' ? 'Standard' : 'Free'} tier selected</h3>}
        <h4>Select tier </h4>
        {allTiers && allTiers.map((tier) => (
            <div key={tier.id}>
                
                <p>Fee: {tier.estimatedFee.amount} {tier.estimatedFee.currency}</p>
                <button onClick={() => setTier(tier)}>{tier.id === 'tier_fast' ? '~10min' : tier.id === 'tier_standard' ? '~1hr' : `24hr`}</button>
            </div>
        ))}
        {payQuote && 
        <>
            
            <p>BTC Address: {btcAddress.slice(0, 7)+'...'+btcAddress.slice(-7, btcAddress.length)}</p>
            <p>Amount: {payQuote.amount.amount}</p>
            <p>Fee: {payQuote.totalFee.amount}</p>
            <p>Total: {payQuote.totalAmount.amount}</p>

            <p>Description: {payQuote.description}</p>
            <CountdownTimer targetDate={payQuote.validUntil}/>
            <button onClick={() => copyQuoteId(payQuote.paymentQuoteId)}>Copy Payment Quote</button>
            <button onClick={() => handlePay()}>Pay</button>
        </>
        }
          {payData &&
            <>
                <p>{payData.amount.currency === 'USD' ? `$${payData.amount.amount}` : `${payData.amount.amount} btc`}</p>
                <p>{payData.description}</p>
               
            </>
            }
    </div>
    )
};