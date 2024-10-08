import { useEffect, useState } from "react";
import { allInvoiceByStatus } from "../../strikeApi";
import { v4 as uuidv4 } from 'uuid';

const InvoiceHistory = () => {
    const [paid, setPaid] = useState([]);
    const [pending, setPending] = useState([]);
    const [unpaid, setUnpaid] = useState([]);

    const getHistory = async (status) => {
        try {
           const invoices = await allInvoiceByStatus(status)
           return invoices
                
        } catch (error) {
            console.error('Error ', error.response?.data || error.message)
        }
    };

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

    const copyInvId= (inv) => {
        navigator.clipboard.writeText(inv.invoiceId)
    };

    const Invoice = ({ inv }) => {
        const { amount, currency } = inv.amount;
        const description = inv.description;
        return (
            <div>
                <p>{amount} {currency}</p>
                <p>{description}</p>
                <button onClick={() => copyInvId(inv)}>Copy Invoice Id</button>
            </div>
        )
    };

    return (
        <div>
            <legend>History</legend>
            {paid && <h3>Paid Invoices</h3>}
            {paid.length > 0 ? paid.map((inv) => (
                <Invoice key={uuidv4()} inv={inv} />
            )) : <p>No Paid Invoices</p>
           }
           {pending && <h3>Pending Invoices</h3>}
            {pending.length > 0 ? pending.map((inv) => (
                <Invoice key={uuidv4()} inv={inv} />
            )) : <p>No Pending Invoices</p>
            }
            {unpaid && <h3>Unpaid Invoices</h3>}
            {unpaid.length > 0 ? unpaid.map((inv) => (
                  <Invoice key={uuidv4()} inv={inv} />
            )) : <p>No Unpaid Invoices</p>
            }
        </div>
    )
};

export default InvoiceHistory;