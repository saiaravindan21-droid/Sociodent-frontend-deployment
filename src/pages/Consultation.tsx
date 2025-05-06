import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Home as HomeIcon, MapPin, Video, ChevronRight, CreditCard, Smartphone, Banknote } from 'lucide-react';
import { loadRazorpayScript, createRazorpayOrder, initializeRazorpayPayment } from '@/lib/razorpay';
// import Navbar from '@/components/Navbar';
// import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

type ConsultationType = 'virtual' | 'home' | 'clinic';

const consultationTypes = [
  {
    type: 'virtual' as ConsultationType,
    title: 'Virtual Consultation',
    description: 'Connect with a dentist via video call without leaving your home',
    price: 599,
    icon: <Video className="text-sociodent-600" size={24} />,
  },
  {
    type: 'home' as ConsultationType,
    title: 'Home Visit',
    description: 'Have a qualified dentist visit your home for consultation',
    price: 1499,
    icon: <HomeIcon className="text-sociodent-600" size={24} />,
  },
  {
    type: 'clinic' as ConsultationType,
    title: 'Clinic Consultation',
    description: 'Visit our dental clinic for a comprehensive consultation',
    price: 999,
    icon: <MapPin className="text-sociodent-600" size={24} />,
  },
];

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const paymentMethods = [
  {
    id: 'razorpay',
    name: 'Card/UPI/Netbanking',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'cash',
    name: 'Cash on Visit',
    icon: <Banknote className="h-5 w-5" />,
    disabledFor: ['virtual'] as ConsultationType[],
  },
];

const Consultation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const searchParams = new URLSearchParams(location.search);
  const initialType = searchParams.get('type') as ConsultationType || 'virtual';
  
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [consultationType, setConsultationType] = useState<ConsultationType>(initialType);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cash'>('razorpay');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  
  useEffect(() => {
    // Load Razorpay script when component mounts
    loadRazorpayScript();
  }, []);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState(localStorage.getItem('lastUsedPhone') || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [address, setAddress] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [hasReport, setHasReport] = useState(false);
  const [reportFile, setReportFile] = useState<File | null>(null);
  
  const selectedConsultation = consultationTypes.find(c => c.type === consultationType)!;

  const handleRazorpayPayment = async () => {
    try {
      setIsProcessingPayment(true);
      
      // Convert price to smallest currency unit (paise for INR)
      const amount = Math.round(selectedConsultation.price * 100);
      
      // Create order on backend
      const order = await createRazorpayOrder(amount);
      
      // Initialize Razorpay payment
      await initializeRazorpayPayment({
        key: RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: "Socio Smile Market",
        description: `${selectedConsultation.title} Consultation`,
        order_id: order.id,
        prefill: {
          name,
          email: '', // Add email field if needed
          contact: phone,
        },
        notes: {
          consultationType,
          date,
          time,
          address: consultationType !== 'virtual' ? address : undefined,
        },
        theme: {
          color: "#0F766E",
        },
      });
      
      // Payment successful
      setStep(3);
      toast({
        title: "Payment Successful",
        description: "Your consultation has been booked successfully.",
      });
      
    } catch (error) {
      console.error("Payment failed:", error);
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleContinue = () => {
    if (step === 1) {
      // Validate form
      if (!name || !phone || !date || !time || (consultationType !== 'virtual' && !address) || !symptoms) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
      
      if (!hasReport) {
        toast({
          title: "Report Required",
          description: "Please confirm you have a dental report or upload one",
          variant: "destructive"
        });
        return;
      }
      
      // Save phone for future use
      localStorage.setItem('lastUsedPhone', phone);
      
      setStep(2);
    } else if (step === 2) {
      if (paymentMethod === 'razorpay') {
        handleRazorpayPayment();
      } else {
        // Cash payment
        setStep(3);
        toast({
          title: "Success!",
          description: "Your appointment has been booked successfully.",
        });
      }
    } else {
      navigate('/');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Navbar /> */}
      
      <main className="flex-grow pt-20">
        <section className="py-12 bg-gray-50">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              {/* Progress Indicator */}
              <div className="mb-10">
                <div className="flex items-center justify-between">
                  {['Consultation Details', 'Payment', 'Confirmation'].map((label, index) => (
                    <div key={label} className="flex items-center">
                      <div className={`rounded-full h-10 w-10 flex items-center justify-center ${step > index + 1 ? 'bg-green-500 text-white' : step === index + 1 ? 'bg-sociodent-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                        {step > index + 1 ? '✓' : index + 1}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium">{label}</p>
                      </div>
                      
                      {index < 2 && (
                        <div className="hidden sm:block w-24 border-t border-gray-200 mx-4"></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass-card border border-white/50 rounded-2xl overflow-hidden shadow-md bg-white">
                {step === 1 && (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Your Consultation</h1>
                    
                    {/* Consultation Type */}
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">Select Consultation Type</Label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {consultationTypes.map((type) => (
                          <div
                            key={type.type}
                            className={`border rounded-xl p-4 cursor-pointer transition-all ${consultationType === type.type ? 'border-sociodent-600 bg-sociodent-50' : 'border-gray-200 hover:border-sociodent-300'}`}
                            onClick={() => setConsultationType(type.type)}
                          >
                            <div className="flex items-center mb-2">
                              {type.icon}
                              <span className="ml-2 font-medium">{type.title}</span>
                            </div>
                            <p className="text-sm text-gray-600">{type.description}</p>
                            <p className="mt-2 text-sociodent-600 font-semibold">₹{type.price.toFixed(2)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Personal Information */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input 
                            id="name" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder="John Doe" 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number *</Label>
                          <Input 
                            id="phone" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            placeholder="+91 12345 67890" 
                            required 
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="date">Preferred Date *</Label>
                          <Input 
                            id="date" 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                          />
                        </div>
                        <div>
                          <Label htmlFor="time">Preferred Time *</Label>
                          <Input 
                            id="time" 
                            type="time" 
                            value={time} 
                            onChange={(e) => setTime(e.target.value)} 
                            required 
                          />
                        </div>
                      </div>

                      {consultationType !== 'virtual' && (
                        <div className="mb-4">
                          <Label htmlFor="address">Address *</Label>
                          <Textarea 
                            id="address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            placeholder="Your full address" 
                            rows={3} 
                            required 
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Symptoms */}
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-4">Dental Symptoms</h2>
                      <div className="mb-4">
                        <Label htmlFor="symptoms">Describe your symptoms *</Label>
                        <Textarea 
                          id="symptoms" 
                          value={symptoms} 
                          onChange={(e) => setSymptoms(e.target.value)} 
                          placeholder="Describe what dental issues you're experiencing" 
                          rows={4} 
                          required 
                        />
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center mb-2">
                          <input 
                            type="checkbox" 
                            id="hasReport" 
                            checked={hasReport} 
                            onChange={(e) => setHasReport(e.target.checked)} 
                            className="mr-2" 
                            required
                          />
                          <Label htmlFor="hasReport" className="cursor-pointer">
                            I have a dental report or X-ray (required)
                          </Label>
                        </div>
                        
                        {hasReport && (
                          <div className="mt-2">
                            <Label htmlFor="reportFile">Upload your dental report or X-ray</Label>
                            <Input 
                              id="reportFile" 
                              type="file" 
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  setReportFile(e.target.files[0]);
                                }
                              }} 
                              accept=".pdf,.jpg,.jpeg,.png" 
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              Accepted formats: PDF, JPG, PNG (Max size: 5MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t pt-6 mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Total:</span>
                        <span className="text-xl font-bold text-sociodent-600">₹{selectedConsultation.price.toFixed(2)}</span>
                      </div>
                      <Button className="w-full" onClick={handleContinue}>
                        Continue to Payment <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {step === 2 && (
                  <div className="p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h1>
                    
                    <div className="mb-6">
                      <Label className="text-base font-medium mb-3 block">Select Payment Method</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {paymentMethods.map((method) => {
                          const isDisabled = method.disabledFor?.includes(consultationType);
                          return (
                            <div
                              key={method.id}
                              className={`
                                border rounded-lg p-4 flex items-center cursor-pointer transition-all
                                ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                                ${paymentMethod === method.id && !isDisabled ? 'border-sociodent-600 bg-sociodent-50' : 'border-gray-200 hover:border-sociodent-300'}
                              `}
                              onClick={() => !isDisabled && setPaymentMethod(method.id as 'razorpay' | 'cash')}
                            >
                              <div className="flex items-center">
                                <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${paymentMethod === method.id && !isDisabled ? 'border-sociodent-600' : 'border-gray-300'}`}>
                                  {paymentMethod === method.id && !isDisabled && (
                                    <div className="w-3 h-3 rounded-full bg-sociodent-600"></div>
                                  )}
                                </div>
                                {method.icon}
                                <span className="ml-2 font-medium">{method.name}</span>
                              </div>
                              {isDisabled && (
                                <span className="ml-auto text-sm text-gray-500">Not available for {consultationType} consultation</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {paymentMethod === 'cash' && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-4">Cash Payment</h2>
                        <p className="text-gray-600">
                          You will need to pay the amount in cash during the consultation.
                          Our dentist will provide a receipt for your payment.
                        </p>
                      </div>
                    )}
                    
                    <div className="border-t pt-6 mt-6">
                      <div className="mb-4">
                        <h3 className="font-medium mb-2">Booking Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Consultation Type:</span>
                            <span className="font-medium">{selectedConsultation.title}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Date & Time:</span>
                            <span className="font-medium">{date} at {time}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="font-bold text-sociodent-600">₹{selectedConsultation.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button variant="outline" onClick={() => setStep(1)}>
                          Back
                        </Button>
                        <Button className="flex-1" onClick={handleContinue} disabled={isProcessingPayment}>
                          {isProcessingPayment ? 'Processing...' : 'Complete Payment'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                
                {step === 3 && (
                  <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600 mb-6">
                      Your {consultationType} consultation has been successfully booked.
                    </p>
                    
                    <div className="max-w-md mx-auto bg-gray-50 rounded-lg p-4 mb-6 text-left">
                      <h3 className="font-medium mb-3">Appointment Details</h3>
                      <div className="grid grid-cols-2 gap-y-2 text-sm">
                        <div className="text-gray-600">Consultation:</div>
                        <div className="font-medium">{selectedConsultation.title}</div>
                        
                        <div className="text-gray-600">Date:</div>
                        <div className="font-medium">{date}</div>
                        
                        <div className="text-gray-600">Time:</div>
                        <div className="font-medium">{time}</div>
                        
                        <div className="text-gray-600">Payment Method:</div>
                        <div className="font-medium">
                          {paymentMethod === 'razorpay' && 'Card/UPI/Netbanking'}
                          {paymentMethod === 'cash' && 'Cash on Visit'}
                        </div>
                        
                        <div className="text-gray-600">Amount Paid:</div>
                        <div className="font-medium text-sociodent-600">₹{selectedConsultation.price.toFixed(2)}</div>
                      </div>
                    </div>
                    
                    <Button onClick={handleContinue}>
                      Return to Home
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
    </div>
  );
};

export default Consultation;
