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
  modal?: {
    ondismiss: () => void;
  };
  handler?: (response: any) => void;
}

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID ?? '';

// Development fallback for testing
if (!RAZORPAY_KEY && process.env.NODE_ENV === 'development') {
  console.warn('Using test Razorpay key. Please set VITE_RAZORPAY_KEY_ID in .env for production.');
} else if (!RAZORPAY_KEY && process.env.NODE_ENV === 'production') {
  throw new Error('VITE_RAZORPAY_KEY_ID environment variable is not set in production');
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

export const createRazorpayOrder = async (amount: number): Promise<any> => {
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
      throw new Error(errorData.message ?? 'Failed to create order');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unknown error occurred while creating the order');
  }
};

export const initializeRazorpayPayment = (options: RazorpayOptions): Promise<any> => {
  return new Promise((resolve, reject) => {
    try {
      const rzp = new window.Razorpay(options);
      
      // Add error handler
      rzp.on('payment.failed', function (response: any){
        reject(new Error(response.error.description ?? 'Payment failed'));
      });

      rzp.open();
    } catch (error) {
      console.error('Razorpay initialization error:', error);
      if (error instanceof Error) {
        reject(error);
      } else {
        reject(new Error('Failed to initialize payment'));
      }
    }
  });
};