'use client';

import { useState } from "react";
import AddressAutoComplete from "@/Components/AddressAutoComplete";
import { useRouter } from 'next/navigation';
import Alert from '@/Components/Alert';


const employeeSizeOptions = [
  { value: '0-10', label: '0-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-100', label: '51-100 employees' },
  { value: '101-1000', label: '101-1000 employees' },
  { value: '1000+', label: '1000+ employees' },
];

const industryOptions = [
  { value: 'agriculture', label: 'Agriculture, Forestry, Fishing and Hunting' },
  { value: 'mining', label: 'Mining, Quarrying, and Oil and Gas Extraction' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'construction', label: 'Construction' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'wholesale', label: 'Wholesale Trade' },
  { value: 'retail', label: 'Retail Trade' },
  { value: 'transportation', label: 'Transportation and Warehousing' },
  { value: 'information', label: 'Information' },
  { value: 'finance', label: 'Finance and Insurance' },
  { value: 'realestate', label: 'Real Estate and Rental and Leasing' },
  { value: 'professional', label: 'Professional, Scientific, and Technical Services' },
  { value: 'management', label: 'Management of Companies and Enterprises' },
  { value: 'administrative', label: 'Administrative and Support Services' },
  { value: 'educational', label: 'Educational Services' },
  { value: 'healthcare', label: 'Health Care and Social Assistance' },
  { value: 'arts', label: 'Arts, Entertainment, and Recreation' },
  { value: 'accommodation', label: 'Accommodation and Food Services' },
  { value: 'other', label: 'Other Services (except Public Administration)' },
  { value: 'public', label: 'Public Administration' }
];

const BusinessData = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    employeeSize: '',
    businessLocation: '',
    industry: ''
  });
  const [showAlert, setShowAlert] = useState(false);
const [alertMessage, setAlertMessage] = useState('');
const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>('success');


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationChange = (address: string) => {
    setFormData(prev => ({
      ...prev,
      businessLocation: address
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/businessData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error(errorData.error || 'Failed to save business data');
      }

      const data = await response.json();
      console.log('Business data saved:', data);
      alert('Business information saved successfully!');
      setAlertType('success');
      setAlertMessage('Business information saved successfully!');
      setShowAlert(true);
    } catch (error) {
      console.error('Error saving business data:', error);
      setAlertType('error');
      setAlertMessage(error instanceof Error ? error.message : 'Error saving business information. Please try again.');
      setShowAlert(true);
    }
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <>
        <Alert
          isOpen={showAlert}
          message={alertMessage}
          type={alertType}
          onClose={() => setShowAlert(false)}
        />
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-[#501214] mt-16">
      <h1 className="text-3xl font-bold text-[#501214] mb-6 text-center">Business Information</h1>

      <div className="h-[300px] w-[500px] flex flex-col justify-between items-center mx-auto">
        <div className="w-full h-full flex flex-col justify-center items-center">
          {step === 1 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">Employee Size:</label>
              <div className="flex flex-wrap gap-3 p-4 border rounded-md border-[#AC9155] bg-white">
                {employeeSizeOptions.map(option => (
                  <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="employeeSize"
                      value={option.value}
                      checked={formData.employeeSize === option.value}
                      onChange={handleChange}
                      className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                    />
                    <span className="text-[#363534]">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">Business Location:</label>
              <AddressAutoComplete
                value={formData.businessLocation}
                onChange={handleLocationChange}
              />
            </div>
          )}

          {step === 3 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">Primary Industry:</label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
              >
                <option value="">Select Industry</option>
                {industryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between w-full">
          {step > 1 && (
            <button
              onClick={prevStep}
              className="px-4 py-2 bg-[#363534] hover:bg-[#6A5638] text-white rounded-md transition duration-200"
            >
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-[#6A5638] hover:bg-[#419E69] text-white rounded-md transition duration-200"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-[#6A5638] hover:bg-[#419E69] text-white rounded-md transition duration-200"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default BusinessData;