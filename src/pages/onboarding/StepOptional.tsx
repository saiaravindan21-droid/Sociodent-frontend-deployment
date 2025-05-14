import React, { useState } from 'react';

interface StepOptionalProps {
  data: any;
  updateData: (data: any) => void;
  prevStep: () => void;
  onSubmit: () => void;
}

const StepOptional: React.FC<StepOptionalProps> = ({
  data,
  updateData,
  prevStep,
  onSubmit,
}) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = event.target.files?.[0];
    if (file) {
      updateData({ [field]: file });
    }
  };

  return (
    <div>
      <div className="mb-2 text-center text-2xl font-bold text-gray-800">
        Optional Information
      </div>
      <div className="mb-6 text-center text-gray-500 text-base">
        Step 7 of 7: Additional Documents
      </div>

      <div className="mb-6">
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Previous Prescriptions (PDF/JPG)
          </label>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg"
            onChange={(e) => handleFileChange(e, 'prescriptions')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Dental X-rays (JPG/PNG)
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'xrays')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            Profile Photo
          </label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={(e) => handleFileChange(e, 'profilePhoto')}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1976d2]"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-2 rounded-lg bg-gray-300 text-gray-700 font-semibold hover:bg-gray-400 transition-colors duration-150"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="flex-1 py-2 rounded-lg bg-[#F44336] text-white font-semibold hover:bg-[#d32f2f] transition-colors duration-150"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default StepOptional;