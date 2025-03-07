'use client';

import { useState} from "react";
import AddressAutoComplete from "@/Components/AddressAutoComplete";
import Logout from "@/Components/Logout";

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
  const [formData, setFormData] = useState({
    employeeSize: '',
    location: '',
    industry: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

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
      location: address
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Business Information</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Employee Size:</label>
          <div className="flex flex-wrap gap-3 p-4 border rounded-md">
            {employeeSizeOptions.map(option => (
              <label
                key={option.value}
                className="inline-flex items-center space-x-2 cursor-pointer bg-black text-white hover:bg-gray-600 px-4 py-2 rounded-full border transition-colors"
              >
                <input
                  type="radio"
                  name="employeeSize"
                  value={option.value}
                  checked={formData.employeeSize === option.value}
                  onChange={handleChange}
                  className="form-radio text-blue-500 h-4 w-4"
                  required
                />
                <span className="whitespace-nowrap">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
  
        <div>
          <label className="block mb-2 font-medium">Business Location:</label>
          <AddressAutoComplete 
            value={formData.location}
            onChange={handleLocationChange}
          />
        </div>
  
        <div>
          <label className="block mb-2 font-medium">Primary Industry:</label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full p-2 mt-1 border rounded-md bg-black text-white"
            required
          >
            <option value="">Select primary industry</option>
            {industryOptions.map(option => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </form>

      <div className="mt-6">
        <Logout />
      </div>
    </div>
  );
};

export default BusinessData;
