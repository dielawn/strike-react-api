import { useState } from "react";
import axios from "axios";
const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

const BankPayout = () => {
    const [confirmation, setConfirmation] = useState(null);
    const [transferType, setTransferType] = useState('ACH');
    const [accountNumber, setAccountNumber] = useState('');
    const [routingNumber, setRoutingNumber] = useState('');
    const [accountType, setAccountType] = useState('CHECKING');
    const [bankName, setBankName] = useState('');
    const [bankAddress, setBankAddress] = useState({
        country: 'US',
        state: '',
        city: '',
        postCode: '',
        line1: ''
    });
    const [beneficiaries, setBeneficiaries] = useState([
        {
            dateOfBirth: '',
            type: 'INDIVIDUAL',
            name: '',
            address: {
                country: 'US',
                state: '',
                city: '',
                postCode: '',
                line1: ''
            }
        },
        {
            email: '',
            phoneNumber: '',
            url: '',
            type: 'INDIVIDUAL',
            name: '',
            address: {
                country: 'US',
                state: '',
                city: '',
                postCode: '',
                line1: ''
            }
        }
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBankAddress({
            ...bankAddress,
            [name]: value,
        });
    };

    const handleBeneficiaryChange = (index, field, value) => {
        const updatedBeneficiaries = [...beneficiaries];
        if (field.includes('address.')) {
            const addressField = field.split('.')[1];
            updatedBeneficiaries[index].address[addressField] = value;
        } else {
            updatedBeneficiaries[index][field] = value;
        }
        setBeneficiaries(updatedBeneficiaries);
    };

    const payout = async () => {
        const data = {
            transferType,
            accountNumber,
            routingNumber,
            accountType,
            bankName,
            bankAddress,
            beneficiaries
        };

        try {
            const response = await axios.post(`${apiUrl}/payment-methods/bank`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`, 
                },
            });
            const responseData = response.data;
            console.log('Bank payout request', responseData);
            setConfirmation(responseData);

        } catch (error) {
            console.error('Error ', error.response?.data || error.message);
        }
    };

    return (
        <div>
            <legend>Bank Payout</legend>
            <form onSubmit={(e) => {e.preventDefault(); payout();}}>
                <h2>Bank Information</h2>
                <input
                    type="text"
                    placeholder="Account Number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Routing Number"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Bank Name"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                />
                <input
                    type="text"
                    name="line1"
                    placeholder="Bank Address Line 1"
                    value={bankAddress.line1}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={bankAddress.city}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={bankAddress.state}
                    onChange={handleInputChange}
                />
                <input
                    type="text"
                    name="postCode"
                    placeholder="Post Code"
                    value={bankAddress.postCode}
                    onChange={handleInputChange}
                />

                <h2>Beneficiary 1</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={beneficiaries[0].name}
                    onChange={(e) => handleBeneficiaryChange(0, 'name', e.target.value)}
                />
                <input
                    type="date"
                    placeholder="Date of Birth"
                    value={beneficiaries[0].dateOfBirth}
                    onChange={(e) => handleBeneficiaryChange(0, 'dateOfBirth', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Beneficiary Address Line 1"
                    value={beneficiaries[0].address.line1}
                    onChange={(e) => handleBeneficiaryChange(0, 'address.line1', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={beneficiaries[0].address.city}
                    onChange={(e) => handleBeneficiaryChange(0, 'address.city', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="State"
                    value={beneficiaries[0].address.state}
                    onChange={(e) => handleBeneficiaryChange(0, 'address.state', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Post Code"
                    value={beneficiaries[0].address.postCode}
                    onChange={(e) => handleBeneficiaryChange(0, 'address.postCode', e.target.value)}
                />

                <h2>Beneficiary 2</h2>
                <input
                    type="text"
                    placeholder="Name"
                    value={beneficiaries[1].name}
                    onChange={(e) => handleBeneficiaryChange(1, 'name', e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={beneficiaries[1].email}
                    onChange={(e) => handleBeneficiaryChange(1, 'email', e.target.value)}
                />
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={beneficiaries[1].phoneNumber}
                    onChange={(e) => handleBeneficiaryChange(1, 'phoneNumber', e.target.value)}
                />
                <input
                    type="url"
                    placeholder="URL"
                    value={beneficiaries[1].url}
                    onChange={(e) => handleBeneficiaryChange(1, 'url', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Beneficiary Address Line 1"
                    value={beneficiaries[1].address.line1}
                    onChange={(e) => handleBeneficiaryChange(1, 'address.line1', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="City"
                    value={beneficiaries[1].address.city}
                    onChange={(e) => handleBeneficiaryChange(1, 'address.city', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="State"
                    value={beneficiaries[1].address.state}
                    onChange={(e) => handleBeneficiaryChange(1, 'address.state', e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Post Code"
                    value={beneficiaries[1].address.postCode}
                    onChange={(e) => handleBeneficiaryChange(1, 'address.postCode', e.target.value)}
                />

                <button type="submit">Submit Payout</button>
            </form>
        </div>
    );
};

export default BankPayout

