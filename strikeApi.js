import axios from 'axios';

const apiUrl = import.meta.env.VITE_STRIKE_URL;
const apiKey = import.meta.env.VITE_STRIKE_API_KEY;

const HEADERS = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`, 
};  


// RECIEVING PAYMENT


// Create invoice
export const createInvoice = async (data) => {
   
    try {
       const response = await axios.post(`${apiUrl}/invoices`, data, { 
            headers: HEADERS
        })
        const responseData = response.data
        console.log('Invoice created:', responseData)
        return responseData

    } catch (error) {
        console.error('Error creating new invoice:', error.response?.data || error.message);
        throw error; 
    }
};

// Generate quote from invoiceId
export const quoteFromInvoice = async (invoiceId) => {
    try {
        const response = await axios.post(`${apiUrl}/invoices/${invoiceId}/quote`, null,{ 
            headers: HEADERS
         })
         const responseData = response.data
         console.log('Quote created:', responseData)
         return responseData

     } catch (error) {
         console.error('Error creating new quote:', error.response?.data || error.message);
         throw error; 
     }
};

export const createUserInvoice = async (handle, data) => {    
    try {   
        const response = await axios.post(`${apiUrl}/invoices/handle/${handle}`, data, {
            headers: HEADERS
        })
        const responseData = response.data
        console.log('Inv from handle: ', responseData)
        return responseData

    } catch (error) {
        console.error('Error ', error.response?.data || error.message);
    }
};

export const lightningPayQuote = async (data) => {
    try {
        const response = await axios.post(`${apiUrl}/payment-quotes/lightning`, data,{ 
            headers: HEADERS
         })
         const responseData = response.data
         console.log('Lightning quote created:', responseData)
         return responseData

     } catch (error) {
         console.error('Error creating new lightning quote:', error.response?.data || error.message);
         throw error; 
     }
};

export const executePay = async (quoteId) => {
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