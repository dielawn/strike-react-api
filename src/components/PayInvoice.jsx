import { useState } from "react";
import { payPaymentQuote } from "../../strikeApi";

const PayStrikeInv = ({ quoteId, setQuoteId }) => {
    const [payData, setPayData] = useState(null);
    
    const pay = async () => {
        console.log(quoteId)
        try {
            const payment = await payPaymentQuote(quoteId);
            setPayData(payment);
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
            {payData && 
            <>
                <p>Payment staus: {payData.state} Id: {payData.paymentId}</p>

            </>}
        </div>
    )
};

export default PayStrikeInv