import { useState } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const UserInvoice = ({ currency, totalUSD, totalBTC }) => {
    const [handle, setHandle] = useState('');
    const [userInvoice, setUserInvoice] = useState(null);    
    const [description, setDescription] = useState('');

    const createUserInvoice = async () => {
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
            const response = await axios.post(`${apiUrl}/invoices/handle/${handle}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },     
            })
            const responseData = response.data
            console.log('Inv from handle: ', responseData)
            setUserInvoice(responseData)
    
        } catch (error) {
            console.error('Error ', error.response?.data || error.message);
        }
    };

   const copyInvId = () => {
    navigator.clipboard.writeText(userInvoice.invoiceId)
   };

    return (
        <fieldset>
            <legend>Create an invoice on behalf of another user</legend>
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
            <label>Handle
                <input 
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                />
            </label>
           
           
            <button type='button' onClick={createUserInvoice}>Create Invoice</button>
            {userInvoice && 
                <>
                    <p>{userInvoice.quoteId}</p>    
                    <button type='button' onClick={copyInvId}>Copy Invoice Id to clipboard</button>
                </>
            }
        </fieldset>
    )
}