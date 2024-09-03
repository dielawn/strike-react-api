import { useEffect, useState } from "react";
import { getHandleProfile } from "../../strikeApi";

const StrikeUser = () => {
    const [profile, setProfile] = useState(null);
    const [handle, setHandle] = useState('');
    const [error, setError] = useState(null);

    const getProfile = async () => {
       try {
        if (handle !== '') {
            const handleProfile = await getHandleProfile(handle)
            if (typeof handleProfile === 'string' ) {
                setError(handleProfile)
            } else {
                setProfile(handleProfile)
            }
            console.log(typeof(handleProfile))
            
        }
        
       } catch (error) {
        console.error("Error fetching handle profile:", error);
        setError(error.message); // Set the error message
       }
    };
    
    useEffect(() => {
        if (profile !== null && profile !== undefined) {
            console.log(profile.canReceive)
        }
    }, [profile])

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
            <div>
            <legend>Get user profile</legend>
            <label>User Handle
            <input 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
            />
            </label>
            <button type="button" onClick={getProfile}>Get User Profile</button>
            {(profile && profile !== undefined || profile !== null) && 
                <fieldset>
                    <legend>Strike User</legend>
                    <h3>{handle}</h3>
                    <img src={profile.avatarUrl}/>
                    <p>{profile.canReceive ? 'Account can recieve payment' : 'Account can not recieve payment'}</p>
                    <p>Available currencies: {profile.currencies.map((currency) => (currency.currency)).join(', ')}</p>
                    <p>{profile.currencies.map((currency) => (currency.isDefaultCurrency))}</p>
                    <p>{profile.currencies.map((currency) => (currency.isInvoiceable ? 
                        `${currency.currency} is invoiceable` 
                        : 
                        `${currency.currency} is not invoiceable`))}</p>
                    <p>User id: {profile.id}</p>
                </fieldset>
            }
            
        </div>
          </div>
        )}

      </div>

    )
};

export default StrikeUser