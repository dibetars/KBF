import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.REACT_APP_PAYSTACK_SECRET_KEY;

export const initiateMobileMoneyPayment = async ({ email, amount, phone, provider }) => {
  try {
    const response = await axios.post(
      'https://api.paystack.co/charge',
      {
        email,
        amount: amount * 100, // Convert to pesewas
        currency: 'GHS',
        mobile_money: {
          phone,
          provider
        }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment initiation failed');
  }
};

export const verifyPayment = async (reference) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
}; 