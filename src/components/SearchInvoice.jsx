import { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const SearchInvoices = () => {
    const [searchedInvId, setSearchedInvId] = useState('');
    const [foundInvoice, setFoundInvoiceId] = useState('');

    const searchInvoices = async () => {
        try {
            const response = await axios.get(`${apiUrl}/invoices/${searchedInvId}`, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },    
            })
            const responseData = response.data
            console.log('Invoice:', responseData)
            setFoundInvoiceId(responseData)
                
        } catch (error) {
            console.error('Error ', error.response?.data || error.message)
        }
    };

    return (
        <fieldset>
            <legend>Search by invoice id</legend>
            <label>Invoice Id
                <input 
                    value={searchedInvId}
                    onChange={(e) => setSearchedInvId(e.target.value)}
                />
            </label>
            <button type="button" onClick={searchInvoices}>Search</button>
            {foundInvoice && 
            <>
                <p>{foundInvoice.amount.currency === 'USD' ? 
                    `$${foundInvoice.amount.amount}` 
                    : 
                    `${foundInvoice.amount.amount} btc` }
                </p>
                <p>{foundInvoice.description}</p>
                <p>{foundInvoice.created}</p>
                <p>{foundInvoice.state}</p>
            </>
            }
        </fieldset>
    )
};