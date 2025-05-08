import axios from 'axios';

const PAYSTACK_SECRET_KEY = process.env.REACT_APP_PAYSTACK_SECRET_KEY;

export const initiatePayment = async (paymentData) => {
  try {
    const response = await axios.get(
      'https://x8ki-letl-twmt.n7.xano.io/api:2T4UiE5R/paystack_charge',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          email: paymentData.email,
          provider: paymentData.provider,
          phone: paymentData.phone
        }
      }
    );

    if (response.data && response.data.response && response.data.response.result && response.data.response.result.data && response.data.response.result.data.reference) {
      return response.data.response.result.data;
    } else {
      throw new Error('Invalid payment response structure');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment initiation failed');
  }
};

export const submitOtp = async (otp, reference) => {
  try {

    const response = await axios.get(
      'https://x8ki-letl-twmt.n7.xano.io/api:2T4UiE5R/charge_otp',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {  // Changed from 'data' to 'params'
          otp,
          reference
        }
      }
    );

    if (response.data && response.data.response && response.data.response.result.status) {
      return response.data.response.result.status;
    } else {
      throw new Error('Invalid OTP response structure');
    }
  } catch (error) {
    console.error('OTP submission error:', error);
    throw new Error(error.response?.data?.message || 'OTP verification failed');
  }
};

export const verifyPayment = async (reference) => {
  try {
    console.log('Verifying payment with reference:', reference);
    
    const response = await axios.get(
      'https://x8ki-letl-twmt.n7.xano.io/api:2T4UiE5R/verify',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
          reference
        }
      }
    );
    return response.data.response.result.status;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment verification failed');
  }
}; 