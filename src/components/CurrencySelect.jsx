const CurrencySelect = ({ currency, setCurrency }) => {
    const currencies = ['USD', 'BTC', 'SATS' ];
    
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    return (
        <div>
            <legend>Preferred Unit</legend>
            <select 
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
        </div>
    );
};

export default CurrencySelect