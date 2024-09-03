import { useEffect, useState } from "react";
import { getBalances } from "../../strikeApi";
import { v4 as uuidv4 } from 'uuid';

const AcctBalances = () => {
    const [balanceData, setBalanceData] = useState(null);

    const acctBalances = async () => {
        try {
            const bal = await getBalances();
            console.log(bal)
            setBalanceData(bal)
        } catch (error) {
            console.error("Error fetching account balances:", error);
        }
    };

    useEffect(() => {
        acctBalances();
    }, [])

    return (
        <div>
            {balanceData && 
        <>
            {balanceData.map((data) => (
                <div key={uuidv4()}>
                    <h3>{data.available} {data.currency}</h3>                    
                    {data.outgoing > 0 && <p>Outgoing: {data.outgoing}</p>}
                    {data.pending > 0 && <p>Pending: {data.pending}</p>}
                    {data.reserved > 0 && <p>Reserved: {data.reserved}</p>}
                    <p>Total: {data.total}</p>
                </div>
            ))}
        </>}
        </div>
    )
};

export default AcctBalances