import './OnChainPayQuote.css'
import { useEffect, useState } from 'react';
import CountdownTimer from './CountdownTImer';
import { quoteOnChain, quoteOnChainTier } from '../../strikeApi';
import copyIcon from '../assets/content_copy_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import sendIcon from '../assets/send_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import trashIcon from '../assets/delete_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import quoteIcon from '../assets/request_quote_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'

const OnChainPaymentQuote = ({ currency, totalUSD, totalBTC }) => {
    const [payQuote, setPayQuote] = useState(null);
    const [payData, setPayData] = useState(null);
    const [tier, setTier] = useState('tier_free');
    const [allTiers, setAllTiers] = useState([]);
    const [btcAddress, setBtcAddress] = useState('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
    const [description, setDescription] = useState('');
    const formattedCurrency = currency.toUpperCase();

    // Returns quotes for each pay tier
    const onChainQuotes = async () => {                
        const data = {
            btcAddress,
            amount: {
                currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
                amount: currency === 'USD' ? totalUSD : totalBTC
            }
        }
        console.log('quotes data', data)
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
            console.log(totalBTC, totalUSD)
     
    }, [btcAddress, currency, totalBTC, totalUSD])

    const getPayQuote = async (tierId) => {
        const data = {
            btcAddress,
            sourceCurrency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
            description,
            amount: {
                currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
                amount: currency === 'USD' ? totalUSD : totalBTC,
                feePolicy: 'INCLUSIVE'
            },
            onchainTierId: tierId
        }
        console.log('payOutData', data)
        const quote = await quoteOnChainTier(data);
        console.log('quote', quote)
        setPayQuote(quote)
    }

   
    useEffect(() => {
        if (tier && totalBTC > 0) {
            console.log(tier)
            const fetchTierQuote = async () => {
                await getPayQuote(tier)
            }
            fetchTierQuote();    
        }        
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

    const deleteQuote = () => {
        setPayQuote(null);
        setDescription('');
        setBtcAddress('');
    }

    return (
    <div>
         {payData ?
            (
            <>
                <p>{payData.amount.currency === 'USD' ? `$${payData.amount.amount}` : `${payData.amount.amount} btc`}</p>
                <p>{payData.description}</p>               
            </>
            ) 
            : 
            (payQuote ? 
                (
                    <>                        
                        <div className="tierList">
                        {allTiers && allTiers.map((item) => (
                            <div key={item.id} className='tier'>
                                <button className={`${item.id} tierBtn`} onClick={() => setTier(item.id)}>{item.id === 'tier_fast' ? '~10min' : item.id === 'tier_standard' ? '~1hr' : `24hr`} Fee {item.estimatedFee.amount} {item.estimatedFee.currency}</button>
                            </div>
                            ))}
                        </div>    

                        <div className="onchainQuote">
                        <p>
                            BTC Address: {btcAddress.slice(0, 7) + '...' + btcAddress.slice(-7, btcAddress.length)} <br />
                            Amount: {payQuote.amount.amount}
                            <br />
                            Fee: {payQuote.totalFee.amount}
                            <br />
                            Total: {payQuote.totalAmount.amount}
                            <br />
                            Memo: {payQuote.description}
                        </p>
                        <CountdownTimer targetDate={payQuote.validUntil} />
                        <div className='btnDiv'>
                            <button className='payBtns' onClick={() => handlePay()}><img className='icon' src={sendIcon} /> Send</button>
                            <button className='payBtns' onClick={() => copyQuoteId(payQuote.paymentQuoteId)}><img className='icon' src={copyIcon} alt='Copy' /> Copy</button>
                            <button className='payBtns' onClick={() => deleteQuote()}><img className='icon' src={trashIcon} alt='Delete'/> Delete</button>
                        </div>
                        
                    </div>
                    </>
                ) 
                : 
                (
                <>
                    <h1>On Chain</h1>
                    <h3>BTC Address: 
                        <input
                            value={btcAddress}
                            onChange={(e) => setBtcAddress(e.target.value)}
                        />
                    </h3>
                    <h3>Memo:
                        <input 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </h3>
                    <button className='payBtns' onClick={() => getPayQuote(tier)}><img className='icon' src={quoteIcon} alt='Quote'/> Get Quote</button>
                </>)
            )
        }
        
    </div>
    )
};

export default OnChainPaymentQuote