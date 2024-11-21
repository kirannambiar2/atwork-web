"use client";

import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Brain, Wallet, Building } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Replace this with your Google Apps Script deployment URL
const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_DEPLOYMENT_URL';

// Separate the form component
const RequestForm = ({ 
  handleSubmit, 
  handleInputChange, 
  formData, 
  requestType, 
  isSubmitting, 
  submitError, 
  brandColors,
  handleSelectChange 
}) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
      <Input
        type="text"
        name="name"
        required
        value={formData.name}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
      <Input
        type="email"
        name="email"
        required
        value={formData.email}
        onChange={handleInputChange}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
      <Input
        type="text"
        name="company"
        required
        value={formData.company}
        onChange={handleInputChange}
      />
    </div>
    {requestType === 'demo' && (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Number of Employees</label>
          <Select
            value={formData.employeeCount}
            onValueChange={(value) => handleSelectChange('employeeCount', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select employee count" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50</SelectItem>
              <SelectItem value="51-200">51-200</SelectItem>
              <SelectItem value="201-500">201-500</SelectItem>
              <SelectItem value="501+">501+</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
          />
        </div>
      </>
    )}
    {submitError && (
      <Alert variant="destructive">
        <AlertDescription>{submitError}</AlertDescription>
      </Alert>
    )}
    <Button
      type="submit"
      disabled={isSubmitting}
      className="w-full"
      style={{ backgroundColor: brandColors.primary }}
    >
      {isSubmitting ? 'Submitting...' : requestType === 'demo' ? 'Submit Request' : 'Join Waitlist'}
    </Button>
  </form>
);

export default function LandingPage() {
  const brandColors = {
    primary: '#65313E',
    secondary: '#DAA520',
  };

  // Use useState with useEffect to handle hydration
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    employeeCount: '',
    message: '',
    type: ''
  });

  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, render a placeholder to avoid hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen bg-white" />;
  }

  const openModal = (type) => {
    setRequestType(type);
    setIsModalOpen(true);
    setFormData(prev => ({ ...prev, type }));
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Create a URLSearchParams object to send as form data
      const formDataObj = new URLSearchParams();
      for (const [key, value] of Object.entries(formData)) {
        formDataObj.append(key, value.toString());
      }

      // Send data to Google Apps Script
      // const response = await fetch(GOOGLE_SCRIPT_URL, {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formDataObj,
      });

      setFormSubmitted(true);
      
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          name: '',
          email: '',
          company: '',
          employeeCount: '',
          message: '',
          type: ''
        });
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
      setSubmitError('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-white" suppressHydrationWarning>
      <header className="bg-white">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold" style={{ color: brandColors.primary }}>@Work</div>
          <Button 
            variant="secondary"
            style={{ backgroundColor: brandColors.secondary }}
            onClick={() => openModal('waitlist')}
          >
            Join Waitlist
          </Button>
        </nav>
        
        <div className="container mx-auto px-6 py-24 flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6" style={{ color: brandColors.primary }}>
            Your AI-Powered Employee Benefits Assistant
          </h1>
          <p className="text-xl mb-8 max-w-2xl text-gray-700">
            Empower your employees with instant, accurate answers about benefits, payroll, and personalized financial guidance.
          </p>
          <Button 
            size="lg"
            className="flex items-center gap-2"
            style={{ backgroundColor: brandColors.primary }}
            onClick={() => openModal('demo')}
          >
            Request Demo <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-16" style={{ color: brandColors.primary }}>
            Why Choose Our Platform?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Shield className="w-12 h-12 mb-4" style={{ color: brandColors.secondary }} />
              <h3 className="text-xl font-semibold mb-3" style={{ color: brandColors.primary }}>
                Compliance & Accuracy
              </h3>
              <p className="text-gray-600">
                Stay compliant with up-to-date information on benefits and tax regulations
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Brain className="w-12 h-12 mb-4" style={{ color: brandColors.secondary }} />
              <h3 className="text-xl font-semibold mb-3" style={{ color: brandColors.primary }}>
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Intelligent responses tailored to each employee&apos;s unique situation
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <Wallet className="w-12 h-12 mb-4" style={{ color: brandColors.secondary }} />
              <h3 className="text-xl font-semibold mb-3" style={{ color: brandColors.primary }}>
                Financial Wellness
              </h3>
              <p className="text-gray-600">
                Guide employees toward better financial health with personalized advice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      {/* Benefits Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-16">
            {/* Employers Benefits */}
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: brandColors.primary }}>
                Benefits for Employers
              </h2>
              <ul className="space-y-4 flex flex-col items-center">
                <li className="flex items-center gap-3 w-fit">
                  <Building className="w-6 h-6 flex-shrink-0" style={{ color: brandColors.secondary }} />
                  <span className="text-gray-700">Reduce HR workload with automated responses</span>
                </li>
                <li className="flex items-center gap-3 w-fit">
                  <Building className="w-6 h-6 flex-shrink-0" style={{ color: brandColors.secondary }} />
                  <span className="text-gray-700">Improve employee satisfaction and retention</span>
                </li>
                <li className="flex items-center gap-3 w-fit">
                  <Building className="w-6 h-6 flex-shrink-0" style={{ color: brandColors.secondary }} />
                  <span className="text-gray-700">Ensure consistent and accurate information</span>
                </li>
              </ul>
            </div>
            
            {/* Employees Benefits */}
            <div className="w-full max-w-2xl">
              <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: brandColors.primary }}>
                Benefits for Employees
              </h2>
              <ul className="space-y-4 flex flex-col items-center">
                <li className="flex items-center gap-3 w-fit">
                  <Wallet className="w-6 h-6 flex-shrink-0" style={{ color: brandColors.secondary }} />
                  <span className="text-gray-700">24/7 access to benefits information</span>
                </li>
                <li className="flex items-center gap-3 w-fit">
                  <Wallet className="w-6 h-6 flex-shrink-0" style={{ color: brandColors.secondary }} />
                  <span className="text-gray-700">Personalized financial guidance</span>
                </li>
                <li className="flex items-center gap-3 w-fit">
                  <Wallet className="w-6 h-6 flex-shrink-0" style={{ color: brandColors.secondary }} />
                  <span className="text-gray-700">Easy-to-understand answers to complex questions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: brandColors.primary }}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Transform Employee Support?
          </h2>
          <p className="text-xl mb-8 text-white">
            Join the waitlist to be among the first to experience the future of employee benefits assistance.
          </p>
          <Button 
            size="lg"
            style={{ backgroundColor: brandColors.secondary }}
            onClick={() => openModal('waitlist')}
          >
            Join Waitlist
          </Button>
        </div>
      </section>

      {mounted && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {requestType === 'demo' ? 'Request a Demo' : 'Join the Waitlist'}
              </DialogTitle>
            </DialogHeader>
            {formSubmitted ? (
              <Alert className="bg-green-50 border-green-200">
                <AlertDescription>
                  {requestType === 'demo' 
                    ? 'Thanks for your interest! Our team will contact you shortly to schedule your demo.'
                    : "Thanks for joining our waitlist! We'll be in touch soon."}
                </AlertDescription>
              </Alert>
            ) : (
              <RequestForm 
                handleSubmit={handleSubmit}
                handleInputChange={handleInputChange}
                handleSelectChange={handleSelectChange}
                formData={formData}
                requestType={requestType}
                isSubmitting={isSubmitting}
                submitError={submitError}
                brandColors={brandColors}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}