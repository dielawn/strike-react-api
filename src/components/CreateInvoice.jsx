import './CreateInvoice.css'
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createInvoice } from '../../strikeApi';
import { QuoteInvoice } from './QuoteInv';
import lightningIcon from '../assets/bolt_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import deleteIcon from '../assets/delete_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'


const Invoice = ({ currency, totalUSD, totalBTC, setLnInv }) => {
    const [invoice, setInvoice] = useState(null);
    const [description, setDescription] = useState('');
    const [quote, setQuote] = useState(null);
    const [message, setMessage] = useState('');
    
    const createNewInvoice = async () => {
      
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
        const isValid = validateData(data);
        if (!isValid) {
            return 
        } else {
            const newInv = await createInvoice(data);
            setInvoice(newInv)
        }
       
    };

    const validateData = (data) => {
       
        if (typeof data.correlationId !== 'string') {
            setMessage(`Invalid correlationId: ${data.correlationId}`)
            return false
        }
        
        if (typeof data.amount.amount !== 'number' || data.amount.amount <= 0) {
            setMessage('Invalid amount, must be a positive number')
            return false
        }
        if (typeof data.amount.currency !== 'string' 
            || (data.amount.currency !== 'BTC' && data.amount.currency !== 'USD')) {
            setMessage('Invalid currency')
            return false
        }
        return true
    }

    // Clear validation messages after 5 seconds
    useEffect(() => {
        if (message !== '') {
            const intervalId = setInterval(() => {
                setMessage('')
            }, 5000);

            return () => clearInterval(intervalId);
        }
    }, [message])


    const deleteInvoice = () => {
        setInvoice(null);
        setQuote(null);
        setLnInv('')
    };
    
    
    useEffect(() => {
        if (invoice && invoice !== undefined) {
            setLnInv(invoice.lnInvoice)
        }
    }, [invoice])

    return (
        <div className='flexColumn'>
             
            {invoice ? 
            (<div className='invoiceDiv'>
            
                <QuoteInvoice invoiceId={invoice.invoiceId} quote={quote} setQuote={setQuote} />
                <button className='btn' type='button' onClick={deleteInvoice}><img className='icon' src={deleteIcon} alt='Delete'/>Delete</button>
               </div>)
            :
            (<>
                <h3 className='inputLabel'>Memo: 
                    <input 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </h3>
               
                <button className='btn' type='button' onClick={createNewInvoice}><img className='icon' src={lightningIcon} alt='Lightning' /> Invoice</button>
                {<h3>{message}</h3>}
                </>)
            }
               
             
        </div>
    )
};

export default Invoice;



