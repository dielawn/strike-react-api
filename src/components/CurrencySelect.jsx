export const CurrencySelect = ({ currency, setCurrency }) => {
    const currencies = ['USD', 'BTC', 'SATS' ];
    
    const handleCurrencyChange = (event) => {
        setCurrency(event.target.value);
    };

    return (
        <fieldset>
            <legend>Preferred Currency</legend>
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
        </fieldset>
    );
};