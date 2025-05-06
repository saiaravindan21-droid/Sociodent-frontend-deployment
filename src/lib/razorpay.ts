declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: any;
  theme: {
    color: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

if (!RAZORPAY_KEY) {
  throw new Error('VITE_RAZORPAY_KEY_ID environment variable is not set');
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const createRazorpayOrder = async (amount: number) => {
  try {
    const response = await fetch(`${API_URL}/razorpay/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to create order');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyPayment = async (paymentData: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const response = await fetch(`${API_URL}/razorpay/verify-payment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    throw new Error('Payment verification failed');
  }

  return response.json();
};

export const initializeRazorpayPayment = (options: RazorpayOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: RAZORPAY_KEY,
      ...options,
      handler: async (response: any) => {
        try {
          // Verify the payment
          const verificationResponse = await verifyPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          
          if (verificationResponse.success) {
            resolve(response);
          } else {
            reject(new Error('Payment verification failed'));
          }
        } catch (error) {
          reject(error);
        }
      },
      modal: {
        ondismiss: () => {
          reject(new Error('Payment cancelled'));
        },
      },
    });
    
    rzp.open();
  });
};