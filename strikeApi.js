import axios from 'axios';

const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`, 
};  


// RECIEVING PAYMENT


// Create invoice
const createInvoice = async (data) => {
   
    try {
       const response = await axios.post(`${apiUrl}/invoices`, data, { 
            headers: HEADERS
        })
        const responseData = response.data
        console.log('Invoice created:', responseData)
        return responseData

    } catch (error) {
        console.error('Error creating new invoice:', error.response?.data);
        throw error; 
    }
};

// Generate quote from invoiceId
const quoteInvoice = async (invoiceId) => {
    try {
        const response = await axios.post(`${apiUrl}/invoices/${invoiceId}/quote`, null,{ 
            headers: HEADERS
         })
         const responseData = response.data
         console.log('Quote created:', responseData)
         return responseData

     } catch (error) {
         console.error('Error creating new quote:', error.response?.data);
         throw error; 
     }
};

const createHandleInvoice = async (handle, data) => {    
    try {   
        const response = await axios.post(`${apiUrl}/invoices/handle/${handle}`, data, {
            headers: HEADERS
        })
        const responseData = response.data
        console.log('Inv from handle: ', responseData)
        return responseData

    } catch (error) {
        console.error('Error ', error.response?.data);
    }
};

const quoteLightning = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/payment-quotes/lightning`, data,{ 
            headers: HEADERS
         })
         const responseData = response.data
         console.log('Lightning quote created:', responseData)
         return responseData

     } catch (error) {
         console.error('Error creating new lightning quote:', error.response?.data);
         throw error; 
     }
};

const executePay = async (quoteId) => {
    console.log(quoteId)
    try {
        const response = await axios.patch(`${apiUrl}/payment-quotes/${quoteId}/execute`, null, { 
            headers: HEADERS
        });
        const responseData = response.data;
        console.log('Payment executed:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error ', error.response?.data);
    }
};

const quoteOnChain = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/payment-quotes/onchain/tiers`, data, {
            headers: HEADERS
        })
        const responseData = response.data
        console.log('On chain quote:', responseData)
        return responseData
       
    } catch (error) {
         console.error('Error creating on chain tx quote:', error.response?.data);
         throw error; 
     }
};

const quoteOnChainTier = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/payment-quotes/onchain`, data, {
            headers: HEADERS
        })
        const responseData = response.data
        console.log('On chain quote:', responseData)
        return responseData

    } catch (error) {
         console.error('Error creating on chain tx quote:', error.response?.data);
         throw error; 
     }
};

const quoteExchange = async (data) => {
    console.log(data)
    try {
        const response = await axios.post(`${apiUrl}/currency-exchange-quotes`, data, {
            headers: HEADERS
        })
        const responseData = response.data
        console.log('exchange quote', responseData)
        return responseData

    } catch (error) {
        console.error('Error ', error.response?.data);
    }
};

const executeExchange = async (quoteId) => {
    
    try {
        const response = await axios.patch(`${apiUrl}/currency-exchange-quotes/${quoteId}/execute`, {
            headers: HEADERS
        })
        const responseData = response.data
        console.log('Executed exchange', responseData)
        return responseData

    } catch (error) {
        console.error('Error ', error.response?.data);
    }
};

const getHandleProfile = async (handle) => {
    try {
        const response = await axios.get(`${apiUrl}/accounts/handle/${handle}/profile`, { 
            headers: HEADERS
        });
 
        const responseData = response.data
        console.log(`Acct Profile ${handle}:`, responseData)
        return responseData;
            
    } catch (error) {
        if (error.response && error.response.status === 404) {
            const message = `No user by handle ${handle}.`;
            return message; 
        } else {
            console.error('Error:', error.response?.data || error.message);
            throw error; 
        }
    }
};

const searchInvoice = async (invoiceId) => {
    try {
        const response = await axios.get(`${apiUrl}/invoices/${invoiceId}`, { 
            headers: HEADERS
        })
        const responseData = response.data
        console.log('Invoice:', responseData)
        return responseData
            
    } catch (error) {
        if (error.response && error.response.status === 400) {
            const message = `Invalid invoiceId ${invoiceId}.`;
            console.error(message);
            return message; 
        } else {
        console.error('Error ', error.response?.data || error.message);
        throw error;
        }
    }
};

const allInvoiceByStatus = async (status) => {
    try {
        const response = await axios.get(`${apiUrl}/invoices?%24filter=state%20eq%20%27${status}%27&%24orderby=created%20asc&%24skip=1&%24top=2`, { 
            headers: HEADERS
        })
        const responseDataItems = response.data.items
        console.log(`Invoices of ${status} status:`, responseDataItems)
        return responseDataItems
            
    } catch (error) {
        console.error('Error ', error.response?.data || error.message)
    }
};

const payPaymentQuote = async (quoteId) => {
    console.log(quoteId)
    try {
        const response = await axios.patch(`${apiUrl}/payment-quotes/${quoteId}/execute`, null, { 
            headers: HEADERS
        });
        const responseData = response.data;
        console.log('Payment executed:', responseData);
        return responseData;

    } catch (error) {
        console.error('Error ', error.response?.data || error.message);
    }
};

const exchangeRates = async () => {
    try {
      const response = await axios.get(`${apiUrl}/rates/ticker`, { 
          headers: HEADERS
      })
      const responseData = response.data
      console.log('Exchange rate:', responseData)
      return responseData
          
    } catch (error) {
        console.error('Error ', error.response?.data || error.message)
    }
  };



export {
    createInvoice, 
    quoteInvoice, 
    createHandleInvoice, 
    quoteLightning, 
    executePay, 
    quoteOnChain, 
    quoteOnChainTier, 
    quoteExchange,    
    executeExchange,
    getHandleProfile,
    searchInvoice,
    allInvoiceByStatus,
    payPaymentQuote,
    exchangeRates,

}