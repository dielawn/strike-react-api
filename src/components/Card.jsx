import './Card.css'
import { BitcoinIcon } from '@bitcoin-design/bitcoin-icons-react/filled'
import usdIcon from '../assets/paid_24dp_5F6368_FILL0_wght400_GRAD0_opsz24.png'
import { getBalances } from '../../strikeApi';
import { useEffect, useState } from "react";

  const iconMap = {
   btcIcon: BitcoinIcon,
   usdIcon,
  };
  
  export default function CardWrapper() {
    const [balanceData, setBalanceData] = useState(null);

    const acctBalances = async () => {
        try {
            const bal = await getBalances();
            console.log('balances', bal)
            setBalanceData(bal)
        } catch (error) {
            console.error("Error fetching account balances:", error);
        }
    };

    useEffect(() => {
       acctBalances();
    }, [])

    return (
        <>
          {balanceData &&
            balanceData.map((data) => (
              <Card
                className='card'
                key={data.currency} // Ensure unique key
                title={data.currency}
                value={data.total}
                type={data.currency === 'BTC' ? 'btcIcon' : 'usdIcon'} // Pass the key for the iconMap
              />
            ))}
        </>
      );
    }
  
  export function Card({ title,value,type }) {



    const Icon = iconMap[type];
  
    const handleBlur = (e) => {
        e.target.classList.toggle('blur');
    }

    return (
        <div className="card">
          <div className="card-header">
            {Icon && typeof Icon === 'function' ? (
              <Icon className="card-icon" />
            ) : (
              <img src={Icon} alt={`${title} icon`} className="card-icon" />
            )}
            
          </div>
          <button className='card-body' type='button' onClick={(e) => handleBlur(e)} >
          
            {title === 'BTC' ? value : `$${value}`}
          </button>
        </div>
      );
    }
  