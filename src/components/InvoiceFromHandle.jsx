import { useState } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;
import { PayStrikeInv } from "./PayInvoice";


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

   const handlePay = () => {
    console.log('nothing happened')
   };


    return (
        <div>
            <legend>Create an invoice on behalf of another user</legend>
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
                    <p>{userInvoice.invoiceId}</p>    
                    <button type='button' onClick={handlePay}>Pay Invoice</button>
                    <PayStrikeInv quoteId={userInvoice.invoiceId}/>
                </>
            }
        </div>
    )
}