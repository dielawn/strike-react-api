import { useEffect, useState } from "react";
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

const InvoiceHistory = () => {
    const [paid, setPaid] = useState([]);
    const [pending, setPending] = useState([]);
    const [unpaid, setUnpaid] = useState([]);

    const getHistory = async (status) => {
        try {
            const response = await axios.get(`${apiUrl}/invoices?%24filter=state%20eq%20%27${status}%27&%24orderby=created%20asc&%24skip=1&%24top=2`, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },       
            })
            const responseDataItems = response.data.items
            console.log(`Invoices of ${status} status:`, responseDataItems)
            return responseDataItems
                
        } catch (error) {
            console.error('Error ', error.response?.data || error.message)
        }
    }

    useEffect(() => {

      const fetchHistory = async () => {
        const paidHistory = await getHistory('PAID');
        setPaid(paidHistory);
 
        const pendingHistory = await getHistory('PENDING');
        setPending(pendingHistory);
 
        const unpaidHistory = await getHistory('UNPAID');
        setUnpaid(unpaidHistory);
      }
      fetchHistory();

    }, []);

    const Invoice = ({ inv }) => {
        const { amount, currency } = inv.amount;
        const description = inv.description;
        return (
            <>
                <p>{amount} {currency}</p>
                <p>{description}</p>
            </>
        )
    };

    const copyInvId= (inv) => {
        navigator.clipboard.writeText(inv.invoiceId)
    }

    return (
        <fieldset>
            <legend>History</legend>
            {paid && <h3>Paid Invoices</h3>}
            {paid.length > 0 ? paid.map((inv) => (
                <>
                    <Invoice inv={inv} />
                    <button onClick={() => copyInvId()}>Copy Invoice Id</button>
                </>
            )) : <p>No Paid Invoices</p>
           }
           {pending && <h3>Pending Invoices</h3>}
            {pending.length > 0 ? pending.map((inv) => (
                <>
                    <Invoice inv={inv} />
                    <button onClick={() => copyInvId()}>Copy Invoice Id</button>
                </>
            )) : <p>No Pending Invoices</p>
            }
            {unpaid && <h3>Unpaid Invoices</h3>}
            {unpaid.length > 0 ? unpaid.map((inv) => (
                 <>
                    <Invoice inv={inv} />
                    <button onClick={() => copyInvId()}>Copy Invoice Id</button>
                </>
            )) : <p>No Unpaid Invoices</p>
            }
        </fieldset>
    )
};

export default InvoiceHistory;