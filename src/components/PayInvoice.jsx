import { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const PayStrikeInv = ({ quoteId, setQuoteId }) => {
    const [payment, setPayment] = useState(null);
    
    const pay = async () => {
        console.log(quoteId)
        try {
            const response = await axios.patch(`${apiUrl}/payment-quotes/${quoteId}/execute`, null, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },     
            });
            const responseData = response.data;
            console.log('Payment executed:', responseData);
            setPayment(responseData);
        } catch (error) {
            console.error('Error ', error.response?.data || error.message);
        }
    };

    const handlePay = async () => {
        if (quoteId === '') {
            throw new Error('Quote ID Required')
        } 
        await pay();
    };

    return (
        <div>
            <legend>Pay Strike Invoice</legend>
            <label>Enter Strike Pay Quote id: 
                <input 
                    value={quoteId}
                    onChange={(e) => setQuoteId(e.target.value)}
                />
            </label>
            <button type="button" onClick={handlePay}>Pay</button>
            {payment && 
            <>
                <p>Payment staus: {payment.state} Id: {payment.paymentId}</p>

            </>}
        </div>
    )
};