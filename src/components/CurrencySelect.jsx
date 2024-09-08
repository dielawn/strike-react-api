import './CurrencySelect.css'
const CurrencySelect = ({ currency, setCurrency }) => {
    const currencies = ['USD', 'BTC', 'SATS' ];
    
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    return (
        <div>
            <h3 className='inputLabel'>
            <select 
                className="currencySelect"
                value={currency} 
                onChange={handleCurrencyChange}
                id="currency-select"
                name="currency"
            >
                {currencies.map((curr) => (
                    <option key={curr} value={curr}>
                        {curr}
                    </option>
                ))}
            </select>
            </h3>
        </div>
    );
};

export default CurrencySelect