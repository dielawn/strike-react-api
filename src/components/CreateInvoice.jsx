import axios from 'axios';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const Invoice = ({ currency, totalUSD, totalBTC, deleteInvoice }) => {
    const [invoice, setInvoice] = useState(null);
    const [description, setDescription] = useState('');
    
    const createInvoice = async () => {
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
        try {
           const response = await axios.post(`${apiUrl}/invoices`, data, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },  
            })
            const responseData = response.data
            console.log('Invoice created:', responseData)
            setInvoice(responseData)
    
        } catch (error) {
            console.error('Error creating new invoice:', error.response?.data || error.message);
            throw error; 
        }
    };

    const handleDeleteInvoice = () => {
        deleteInvoice();
        setInvoice(null);
    };

    const copyInvId = () => {
        navigator.clipboard.writeText(invoice.invoiceId)
    };

 
    return (
        <div>
            <legend>Create Strike Invoice</legend>
            
            {/* <label>Amount: 
                <input 
                value={
                    currency === 'USD' ? totalUSD :
                    currency === 'BTC' ? totalBTC : 
                    totalSats}
                onChange={(e) => 
                    currency === 'USD' ? setTotalUSD(e.target.value) : 
                    currency === 'BTC' ? setTotalBTC(e.target.value) : 
                    setTotalSats(e.target.value)}
                />
            </label> */}
            <label>Description
                <input 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </label>
           
            <button type='button' onClick={createInvoice}>Create Invoice</button>
            {invoice && 
            <>
            <p>Invoice Id: {invoice.invoiceId}</p>
            <button type='button' onClick={copyInvId}>Copy Invoice Id to clipboard</button>
            <button type='button' onClick={handleDeleteInvoice}>Delete Invoice</button>
            </>}
        </div>
    )
};




