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

    if (response.data && response.data.response && response.data.response.result && response.data.response.result.data) {
      const paymentResult = response.data.response.result.data;
      return {
        reference: paymentResult.reference,
        status: paymentResult.status,
        displayText: paymentResult.display_text
      };
    } else {
      throw new Error('Invalid payment response structure');
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Payment initiation failed');
  }
};

export const submitOtp = async (otp, reference, retryCount = 0) => {
  try {
    const response = await axios.get(
      'https://x8ki-letl-twmt.n7.xano.io/api:2T4UiE5R/charge_otp',
      {
        headers: {
          'Content-Type': 'application/json'
        },
        params: {
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
    if (retryCount < 3) { // Maximum 3 retries
      // Wait for 10 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 10000));
      return submitOtp(otp, reference, retryCount + 1);
    }
    throw new Error(error.response?.data?.message || 'OTP verification failed after retries');
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