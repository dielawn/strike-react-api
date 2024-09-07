import './CreateInvoice.css'
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { createInvoice } from '../../strikeApi';
import { QuoteInvoice } from './QuoteInv';


const Invoice = ({ currency, totalUSD, totalBTC, setLnInv }) => {
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
               
        const strikeData = { 
            correlationId,
            description,
            amount: {
                currency: formattedCurrency === 'SATS' ? 'BTC' : formattedCurrency,
                amount: currency === 'USD' ? totalUSD : totalBTC
            }
         }
       const newInv = await createInvoice(strikeData);
       setInvoice(newInv)
    };

    const deleteInvoice = () => {
        setInvoice(null);
        setQuote(null);
        setLnInv('')
    };
    
    useEffect(() => {
        if (invoice && invoice !== undefined) {
            setLnInv(invoice.lnInvoice)
            console.log('lnInvoice set')
        }
    }, [invoice])

    return (
        <div className='flexColumn'>
             
            {invoice ? 
            (<div className='invoiceDiv'>
            
                <QuoteInvoice invoiceId={invoice.invoiceId} quote={quote} setQuote={setQuote} />
                <button type='button' onClick={deleteInvoice}>Delete Invoice</button>
               </div>)
            :
            (<>
                <h3 className='inputLabel'>Memo: 
                    <input 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </h3>
               
                <button type='button' onClick={createNewInvoice}>Create Invoice</button>
                
                </>)
            }
               
             
        </div>
    )
};

export default Invoice;



