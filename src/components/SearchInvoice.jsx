import { useEffect, useState } from "react";
import { searchInvoice } from "../../strikeApi";

 const SearchInvoices = () => {
    const [searchedInvId, setSearchedInvId] = useState('');
    const [foundInvoice, setFoundInvoiceId] = useState(null);
    const [error, setError] = useState(null);

    const search = async () => {
        try {
            if (searchedInvId !== '') {
               const results = await searchInvoice(searchedInvId)
               if (typeof results === 'string') {
                setError(results)
               } else {
                console.log('search results', results)
                setFoundInvoiceId(results)
               }
            }           
                
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            setError(error.message || 'An error occurred while searching for the invoice.');
        }
    };

    useEffect(() => {
        if (foundInvoice) {
            console.log('found', foundInvoice)
        }
        
    }, [foundInvoice])

    useEffect(() => {
        if (error !== null) {
            const timeout = setTimeout(() => {
                setError(null)
            }, 5000)
            return () => clearTimeout(timeout); 
        }
        
    }, [error])

    return (
        <div>
            {error ? (
                <p>Error: {error}</p> // Display error message
                ) : (
                <div>
                    <legend>Search by invoice id</legend>
                    <label>Invoice Id
                        <input 
                            value={searchedInvId}
                            onChange={(e) => setSearchedInvId(e.target.value)}
                        />
                    </label>
                    <button type="button" onClick={search}>Search</button>
                    {(foundInvoice !== null && foundInvoice !== undefined) &&
                    <>
                        <p>{foundInvoice.amount.currency === 'USD' ? 
                            `$${foundInvoice.amount.amount}` 
                            : 
                            `${foundInvoice.amount.amount} btc` }
                        </p>
                        <p>{foundInvoice.description}</p>
                        <p>{foundInvoice.created}</p>
                        <p>{foundInvoice.state}</p>
                    </>
            }
                </div>
                )}
            
        </div>
    )
};

export default SearchInvoices