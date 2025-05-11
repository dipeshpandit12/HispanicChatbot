'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import AddressAutoComplete from "@/Components/AddressAutoComplete";
import Alert from "@/Components/Alert";

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


/*const socialMediaToolsOptions = [
  { value: 'hootsuite', label: 'Hootsuite' },
  { value: 'buffer', label: 'Buffer' },
  { value: 'sproutsocial', label: 'Sprout Social' },
  { value: 'canva', label: 'Canva' },
  { value: 'other', label: 'Other' },
];

const successMetricsOptions = [
  { value: 'engagement', label: 'Engagement metrics' },
  { value: 'sales', label: 'Sales/conversions' },
  { value: 'growth', label: 'Follower growth' },
  { value: 'none', label: 'Don’t track' },
];*/

const documentedStrategyOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' },
];

const supportOptions = [
  { value: 'strategy', label: 'Social media strategy' },
  { value: 'content', label: 'Content creation' },
  { value: 'setup', label: 'Account setup' },
  { value: 'ads', label: 'Paid ads' },
  { value: 'other', label: 'Other – please specify' },
];

const holdingBackOptions = [
  { value: 'time', label: 'Time' },
  { value: 'knowledge', label: 'Knowledge' },
  { value: 'resources', label: 'Resources' },
  { value: 'no-plan', label: 'No clear plan' },
  { value: 'other', label: 'Other – please specify' },
];

const helpfulServicesOptions = [
  { value: 'setup', label: 'Account setup' },
  { value: 'strategy', label: 'Content strategy' },
  { value: 'ads', label: 'Paid ads' },
  { value: 'management', label: 'Ongoing management' },
  { value: 'analytics', label: 'Analytics' },
  { value: 'other', label: 'Other – please specify' },
];

const strategyChallengesOptions = [
  { value: 'lack-time', label: 'Lack of time' },
  { value: 'lack-knowledge', label: 'Lack of knowledge' },
  { value: 'not-sure', label: 'Not sure how to get started' },
  { value: 'no-need', label: 'Don’t see the need' },
  { value: 'other', label: 'Other – please specify' },
];

const strategyGuidanceAreasOptions = [
  { value: 'content', label: 'Content creation' },
  { value: 'audience', label: 'Target audience identification' },
  { value: 'schedule', label: 'Posting schedule' },
  { value: 'goals', label: 'Goal setting' },
  { value: 'tracking', label: 'Performance tracking' },
  { value: 'other', label: 'Other – please specify' },
];

const BusinessData = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // Ensure step starts at 1
  const [formData, setFormData] = useState<{
    employeeSize: string;
    industry: string;
    socialMediaTools: string[];
    successMetrics: string[];
    hasDocumentedStrategy: string;
    supportNeeded: string[];
    otherSupport: string;
    holdingBackReason: string;
    otherHoldingBackReason: string;
    helpfulServices: string[];
    otherHelpfulService: string;
    strategyChallenges: string[];
    otherStrategyChallenge: string;
    interestedInGuidance: string;
    guidanceAreas: string[];
    otherGuidanceArea: string;
    hasSetGoals: string;
    setGoalsDetails: string;
    wantsHelpWithGoals: string;
    socialMediaIdeas: string;
    businessLocation: string;
    socialMediaPlatforms: string[]; // Add the missing property
    usesSocialMedia: string; // Add the missing property
    otherSocialMediaPlatform: string; // Add the missing property
    postingFrequency: string; // Add the missing property
  }>({
    employeeSize: '',
    industry: '',
    socialMediaTools: [],
    successMetrics: [],
    hasDocumentedStrategy: '',
    supportNeeded: [],
    otherSupport: '',
    holdingBackReason: '',
    otherHoldingBackReason: '',
    helpfulServices: [],
    otherHelpfulService: '',
    strategyChallenges: [],
    otherStrategyChallenge: '',
    interestedInGuidance: '',
    guidanceAreas: [],
    otherGuidanceArea: '',
    hasSetGoals: '',
    setGoalsDetails: '',
    wantsHelpWithGoals: '',
    socialMediaIdeas: '',
    businessLocation: '', // Initialize the missing property
    socialMediaPlatforms: [], // Initialize the new property
    usesSocialMedia: '', // Initialize the new property
    otherSocialMediaPlatform: '', // Add the missing property
    postingFrequency: '', // Initialize the new property
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof typeof formData) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item: string) => item !== value),
    }));
  };

  const nextStep = () => {
    setStep((prev) => {
      console.log('Current Step:', prev);
  
      // If the user answers "No" to Step 4, skip to Step 8
      if (prev === 4 && formData.usesSocialMedia === 'no') {
        console.log('Skipping to Step 8');
        return 8;
      }
  
      // If the user answers "Yes" to Step 7, skip to Step 15
      if (prev === 7 && formData.hasDocumentedStrategy === 'yes') {
        console.log('Skipping to Step 15');
        return 15;
      }
  
      // If the user is on the last step they can answer, stop advancing
      if (prev === 16 || (prev === 10 && formData.usesSocialMedia === 'no')) {
        console.log('No more questions left');
        return prev; // Stay on the current step
      }
  
      return prev + 1; // Otherwise, go to the next step
    });
  };
  const prevStep = () => {
    setStep((prev) => {
      // If the user is on Step 8 and answered "No" to Step 4, go back to Step 4
      if (prev === 8 && formData.usesSocialMedia === 'no') {
        return 4;
      }
  
      // If the user is on Step 15 and answered "Yes" to Step 7, go back to Step 7
      if (prev === 15 && formData.hasDocumentedStrategy === 'yes') {
        return 7;
      }
  
      return prev > 1 ? prev - 1 : prev; // Otherwise, go to the previous step
    });
  };
  const handleSubmit = async () => {
    try {
      // First save business data
      const response = await fetch('/api/businessData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401) {
          router.push('/auth/login');
          return;
        }
        throw new Error(errorData.error || 'Failed to save business data');
      }

      const updateResponse = await fetch('/api/changeHasBusiness', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!updateResponse.ok) {
      console.error('Failed to update business data status');
    }
  
      const data = await response.json();
      console.log('Business data saved:', data);
      
      // Show success message and redirect
      <Alert isOpen={true} message="Business information saved successfully!" type="success" />;
      router.push('/pages/stage'); // Redirect to the stage page');
  
    } catch (error) {
      console.error('Error saving business data:', error);
      <Alert 
        isOpen={true} 
        message={error instanceof Error ? error.message : 'Error saving business information. Please try again.'}
        type="error"
      />
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border-2 border-[#501214] mt-16">
      <h1 className="text-3xl font-bold text-[#501214] mb-6 text-center">Business Information</h1>

      <div className="h-[300px] w-[500px] flex flex-col justify-between items-center mx-auto">
        <div className="w-full h-full flex flex-col justify-center items-center">
          {/* Step 1: Employee Size */}
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

          {/* Step 2: Industry */}
{step === 2 && (
  <div className="w-full">
    <label className="block mb-2 font-medium text-[#501214]">What industry is the business?</label>
    <select
      name="industry"
      value={formData.industry}
      onChange={handleChange}
      className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
    >
      <option value="" disabled>Select an industry</option>
      {industryOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
)}
          {/* Step 3: Business Location */}
{step === 3 && (
  <div className="w-full">
    <label className="block mb-2 font-medium text-[#501214]">What is the location of the business?</label>
    <AddressAutoComplete
      value={formData.businessLocation}
      onChange={(value: string) => setFormData(prev => ({ ...prev, businessLocation: value }))}
    />
  </div>
)}

{/* Step 4: Social Media Usage */}
{step === 4 && (
  <div className="w-full">
    <label className="block mb-2 font-medium text-[#501214]">
      Do you currently use any social media for your business? <br />
      (This includes things like a Facebook page, Instagram profile, or any other place online where you post updates, photos, or connect with customers.)
    </label>
    <div className="flex gap-4 mb-4">
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="usesSocialMedia"
          value="yes"
          checked={formData.usesSocialMedia === 'yes'}
          onChange={handleChange}
          className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
        />
        <span>Yes</span>
      </label>
      <label className="inline-flex items-center space-x-2 cursor-pointer">
        <input
          type="radio"
          name="usesSocialMedia"
          value="no"
          checked={formData.usesSocialMedia === 'no'}
          onChange={handleChange}
          className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
        />
        <span>No</span>
      </label>
    </div>
  </div>
)}

{/* Step 5: Social Media Platforms */}
{step === 5 && formData.usesSocialMedia === 'yes' && (
  <div className="w-full">
    <label className="block mb-2 font-medium text-[#501214]">
      Which social media platforms are you using? <br />
      (Please check all that apply — these are websites or apps where you might share photos, updates, or communicate with your audience.)
    </label>
    <div className="flex flex-wrap gap-4">
      {[
        'Facebook',
        'Instagram',
        'X (formerly Twitter)',
        'TikTok',
        'LinkedIn',
        'Pinterest',
        'YouTube',
      ].map((platform) => (
        <label key={platform} className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            value={platform}
            checked={formData.socialMediaPlatforms?.includes(platform)}
            onChange={(e) => handleCheckboxChange(e, 'socialMediaPlatforms')}
            className="form-checkbox text-[#EB2E47] focus:ring-[#EBBA45]"
          />
          <span>{platform}</span>
        </label>
      ))}
    </div>

    <div className="mt-4">
      <label className="block mb-2 font-medium text-[#501214]">Other:</label>
      <input
        type="text"
        name="otherSocialMediaPlatform"
        value={formData.otherSocialMediaPlatform || ''}
        onChange={handleChange}
        className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
        placeholder="Specify other platforms"
      />
    </div>
  </div>
)}

{/* Step 6: Posting Frequency */}
{step === 6 && (
  <div className="w-full">
    <label className="block mb-2 font-medium text-[#501214]">How frequently do you post on social media?</label>
    <div className="flex flex-wrap gap-4">
      {['Daily', '2–3 times a week', 'Weekly', 'Less than once a week'].map((option) => (
        <label key={option} className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="postingFrequency"
            value={option}
            checked={formData.postingFrequency === option}
            onChange={handleChange}
            className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  </div>
)}

{/* Step 4: Documented Strategy */}
{step === 7 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">Do you have a documented social media strategy?</label>
              <div className="flex gap-4">
                {documentedStrategyOptions.map(option => (
                  <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="hasDocumentedStrategy"
                      value={option.value}
                      checked={formData.hasDocumentedStrategy === option.value}
                      onChange={handleChange}
                      className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

{/* Step 5: Support Needed */}
{step === 8 && (
            <div className="w-full">
<label className="block mb-2 font-medium text-[#501214]">What kind of support would you need to get started?</label>
              <div className="flex flex-wrap gap-4">
                {supportOptions.map(option => (
                  <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.supportNeeded.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, 'supportNeeded')}
                      className="form-checkbox text-[#EB2E47] focus:ring-[#EBBA45]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              {formData.supportNeeded.includes('other') && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-[#501214]">Please specify:</label>
                  <input
                    type="text"
                    name="otherSupport"
                    value={formData.otherSupport}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
                  />
                </div>
              )}
            </div>
          )}
{/* Step 6: Holding Back */}
{step === 9 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">What’s holding you back from starting now?</label>
<div className="flex flex-wrap gap-4">
                {holdingBackOptions.map(option => (
                  <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="holdingBackReason"
                      value={option.value}
                      checked={formData.holdingBackReason === option.value}
                      onChange={handleChange}
                      className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              {formData.holdingBackReason === 'other' && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-[#501214]">Please specify:</label>
                  <input
                    type="text"
                    name="otherHoldingBackReason"
                    value={formData.otherHoldingBackReason}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
                  />
                </div>
              )}
            </div>
          )}

          {/* Step 7: Helpful Services */}
          {step === 10 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">What type of services would be most helpful to you?</label>
              <div className="flex flex-wrap gap-4">
                {helpfulServicesOptions.map(option => (
                  <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.helpfulServices.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, 'helpfulServices')}
                      className="form-checkbox text-[#EB2E47] focus:ring-[#EBBA45]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>

              {formData.helpfulServices.includes('other') && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-[#501214]">Please specify:</label>
                  <input
                    type="text"
                    name="otherHelpfulService"
                    value={formData.otherHelpfulService}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
                  />
                  </div>
              )}
            </div>
          )}

          {/* Step 8: Strategy Challenges */}
          {step === 11 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">What challenges have you faced in creating a social media strategy?</label>
              <div className="flex flex-wrap gap-4">
                {strategyChallengesOptions.map(option => (
                  <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.strategyChallenges.includes(option.value)}
                      onChange={(e) => handleCheckboxChange(e, 'strategyChallenges')}
                      className="form-checkbox text-[#EB2E47] focus:ring-[#EBBA45]"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>


              {formData.strategyChallenges.includes('other') && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-[#501214]">Please specify:</label>
                  <input
                    type="text"
                    name="otherStrategyChallenge"
                    value={formData.otherStrategyChallenge}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
                  />
                </div>
              )}
            </div>
          )}


          
                    {/* Step 12: Interested in Guidance */}
                    {step === 12 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">Would you be interested in guidance for creating a social media strategy?</label>
              <div className="flex gap-4 mb-4">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="interestedInGuidance"
                    value="yes"
                    checked={formData.interestedInGuidance === 'yes'}
                    onChange={handleChange}
                    className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                  />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="interestedInGuidance"
                    value="no"
                    checked={formData.interestedInGuidance === 'no'}
                    onChange={handleChange}
                    className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                  />
                  <span>No</span>
                </label>
              </div>

              {/* Conditionally show guidance areas if interested */}
              {formData.interestedInGuidance === 'yes' && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-[#501214]">In which areas would you like guidance? (Select all that apply)</label>
                  <div className="flex flex-wrap gap-4 p-4 border rounded-md border-[#AC9155] bg-white">
                    {strategyGuidanceAreasOptions.map(option => (
                      <label key={option.value} className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={formData.guidanceAreas.includes(option.value)}
                          onChange={(e) => handleCheckboxChange(e, 'guidanceAreas')}
                          className="form-checkbox text-[#EB2E47] focus:ring-[#EBBA45]"
                        />
                        <span className="text-[#363534]">{option.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Conditionally show 'Other' text input */}
                  {formData.guidanceAreas.includes('other') && (
                    <div className="mt-4">
                      <label className="block mb-2 font-medium text-[#501214]">Please specify other guidance area:</label>
                      <input
                        type="text"
                        name="otherGuidanceArea"
                        value={formData.otherGuidanceArea}
                        onChange={handleChange}
                        className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
                        placeholder="Specify other area"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

                    {/* Step 13: Social Media Goals */}
                    {step === 13 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">Have you tried setting any social media goals for your business?</label>
              <div className="flex gap-4 mb-4">
                 <label className="inline-flex items-center space-x-2 cursor-pointer">
                   <input
                     type="radio"
                     name="hasSetGoals"
                     value="yes"
                     checked={formData.hasSetGoals === 'yes'}
                     onChange={handleChange}
                     className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                   />
                   <span>Yes</span>
                 </label>
                 <label className="inline-flex items-center space-x-2 cursor-pointer">
                   <input
                     type="radio"
                     name="hasSetGoals"
                     value="no"
                     checked={formData.hasSetGoals === 'no'}
                     onChange={handleChange}
                     className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                   />
                   <span>No</span>
                 </label>
              </div>

              {/* Conditionally show details input if 'yes' */}
              {formData.hasSetGoals === 'yes' && (
                <div className="mt-4">
                  <label className="block mb-2 font-medium text-[#501214]">If yes, please briefly describe the goals you set:</label>
                  <textarea
                    name="setGoalsDetails"
                    value={formData.setGoalsDetails}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
                    rows={3}
                    placeholder="e.g., Increase followers, drive website traffic..."
                  />
                </div>
              )}

              {/* Conditionally ask about help if 'no' */}
              {formData.hasSetGoals === 'no' && (
                <div className="mt-4">
                   <label className="block mb-2 font-medium text-[#501214]">If no, would you like help setting social media goals?</label>
                   <div className="flex gap-4">
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="wantsHelpWithGoals"
                          value="yes"
                          checked={formData.wantsHelpWithGoals === 'yes'}
                          onChange={handleChange}
                          className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                        />
                        <span>Yes</span>
                      </label>
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="wantsHelpWithGoals"
                          value="no"
                          checked={formData.wantsHelpWithGoals === 'no'}
                          onChange={handleChange}
                          className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
                        />
                        <span>No</span>
                      </label>
                   </div>
                </div>
              )}
            </div>
          )}

          {/* Step 11: Social Media Ideas */}
          {step === 14 && (
            <div className="w-full">
              <label className="block mb-2 font-medium text-[#501214]">Do you have any ideas on what you’d like to achieve with your social media presence?</label>
              <textarea
                name="socialMediaIdeas"
                value={formData.socialMediaIdeas}
                onChange={handleChange}
                className="w-full p-2 border rounded-md border-[#AC9155] focus:border-[#EB2E47] focus:ring-[#EBBA45] bg-white"
                rows={4}
                placeholder="Share your ideas here..."
              />
            </div>
          )}
          {/* Step 15: Social Media Management Tools */}
{step === 15 && (
  <div className="w-full">
    <label className="block mb-2 font-medium text-[#501214]">
      Do you use any tools for social media management?
    </label>
    <div className="flex flex-wrap gap-4">
      {[
        'Scheduling tools like Buffer',
        'Personal team or social media employee',
        'Hootsuite',
        'Analytics tools like Google Analytics',
        'No tools',
      ].map((option) => (
        <label key={option} className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="socialMediaTools"
            value={option}
            checked={formData.socialMediaTools.includes(option)}
            onChange={(e) => handleCheckboxChange(e, 'socialMediaTools')}
            className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  </div>
)}
{/* Step 16: Success Metrics */}
{step === 16 && (
  <div className="w-full">
    <label className="block mb-2 font-medium text-[#501214]">
      How do you measure the success of your social media efforts?
    </label>
    <div className="flex flex-wrap gap-4">
      {[
        'Engagement metrics',
        'Sales/conversions',
        'Follower growth',
        'Don’t track',
      ].map((option) => (
        <label key={option} className="inline-flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name="successMetrics"
            value={option}
            checked={formData.successMetrics.includes(option)}
            onChange={(e) => handleCheckboxChange(e, 'successMetrics')}
            className="form-radio text-[#EB2E47] focus:ring-[#EBBA45]"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  </div>
)}
        </div>

        {/* Navigation Buttons */}
<div className="mt-6 flex justify-between w-full">
  {step > 1 && (
    <button
      onClick={prevStep}
      className="px-4 py-2 bg-[#363534] hover:bg-[#6A5638] text-white rounded-md transition duration-200"
    >
      Previous
    </button>
  )}
  {step === 16 || (step === 10 && formData.usesSocialMedia === 'no') ? (
    <button
      onClick={handleSubmit}
      className="px-4 py-2 bg-[#6A5638] hover:bg-[#419E69] text-white rounded-md transition duration-200"
    >
      Submit
    </button>
  ) : (
    <button
      onClick={nextStep}
      className="px-4 py-2 bg-[#6A5638] hover:bg-[#419E69] text-white rounded-md transition duration-200"
    >
      Next
    </button>
  )}
</div>
  </div>
  </div>
  );
};

export default BusinessData;
