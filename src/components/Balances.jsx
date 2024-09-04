import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { getBalances, getAcctLimits, depositHistory, payoutHistory } from "../../strikeApi";

const AcctBalances = () => {
    const [balanceData, setBalanceData] = useState(null);
    const [limitsData, setLimitsData] = useState(null);
    const [depositsData, setDepositsData] = useState(null);
    const [payoutData, setPayoutData] = useState(null);

    const [totalDepositUSD, setTotalDepositUSD] = useState(0);
    const [totalPayout, setTotalPayout] = useState(0);

    const acctBalances = async () => {
        try {
            const bal = await getBalances();
            console.log('balances', bal)
            setBalanceData(bal)
        } catch (error) {
            console.error("Error fetching account balances:", error);
        }
    };

    const acctLimits = async () => {
        try {
            const limits = await getAcctLimits();
            console.log('limits', limits)
            setLimitsData(limits)
        } catch (error) {
            console.error("Error fetching account limits:", error);
        }
    };

    const deposits = async () => {
        try {
            const history = await depositHistory();
            console.log('deposit history', history)
            setDepositsData(history)
        } catch (error) {
            console.error("Error fetching deposit history:", error);
        }
    };

    const payouts = async () => {
        try {
            const history = await payoutHistory();
            console.log('payout history', history)
            setPayoutData(history)
        } catch (error) {
            console.error("Error fetching deposit history:", error);
        }
    }
 
    useEffect(() => {
        acctBalances();
        // acctLimits();
        deposits();
        payouts();
    }, [])

    const calcTotalDepositAmount = () => {
        // depositData.items[0].amount.amount
        const sum = depositsData.items.reduce((acc, item) => acc + Number(item.amount.amount), 0);
        console.log('sum', sum)
        setTotalDepositUSD(sum)
        const fee = depositsData.items.reduce((acc, item) => acc + Number(item.fee.amount), 0);
        console.log('fee', fee)
        const total = depositsData.items.reduce((acc, item) => acc + Number(item.totalAmount.amount), 0);
        console.log('total', total)
    };

    useEffect(() => {
        if (depositsData !== null && depositsData !== undefined) {
            calcTotalDepositAmount();
        }
        
    }, [depositsData])
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
        {limitsData && 
            <>

            </>}
        </div>
    )
};

export default AcctBalances