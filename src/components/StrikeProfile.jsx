import { useEffect, useState } from "react";
import axios from 'axios';
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

export const StrikeUser = () => {
    const [profile, setProfile] = useState(null);
    const [handle, setHandle] = useState('');

    const getProfile = async () => {
        try {
            const response = await axios.get(`${apiUrl}/accounts/handle/${handle}/profile`, { 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },          
            });
            const responseData = response.data
            console.log(`Acct Profile ${handle}:`, responseData)
            setProfile(responseData);
                
        } catch (error) {
            console.error('Error ', error.response?.data || error.message)
        }
    };
    
    useEffect(() => {
        if (profile !== null) {
            console.log(profile.canReceive)
        }
    }, [profile])
    
    return (
        <div>
            <legend>Get user profile</legend>
            <label>User Handle
            <input 
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
            />
            </label>
            <button type="button" onClick={getProfile}>Get User Profile</button>
            {profile && 
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

    )
}