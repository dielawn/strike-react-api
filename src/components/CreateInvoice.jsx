import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createInvoice } from '../../strikeApi';
import { QuoteInvoice } from './QuoteInv';

const Invoice = ({ currency, totalUSD, totalBTC }) => {
    const [invoice, setInvoice] = useState(null);
    const [description, setDescription] = useState('');
    const [quote, setQuote] = useState(null);
    
    const createNewInvoice = async () => {
        console.log(description, currency, totalUSD, totalBTC)
        if (!description || !currency || totalUSD === 0 || totalBTC === 0) {
            throw new Error('Missing required parameters');
        }
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
       const newInv = await createInvoice(data);
       setInvoice(newInv)
    };


    return (
        <div>
            <legend>Create Strike Invoice</legend>      
           
            <label>Description
                <input 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
           
            <button type='button' onClick={createNewInvoice}>Create Invoice</button>
            {invoice && 
            <>
            <p>Invoice Id: {invoice.invoiceId}</p>
             <QuoteInvoice invoiceId={invoice.invoiceId} quote={quote} setQuote={setQuote} />
            
            </>}
        </div>
    )
};

export default Invoice;



