import React, { useState } from "react";

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
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files) {
      updateData({ [name]: files[0] });
    } else {
      updateData({ [name]: value });
    }
  };

  const handleFinishClick = () => {
    setShowModal(true); // Show the confirmation modal
  };

  const handleConfirm = () => {
    setShowModal(false); // Close the modal
    onSubmit(); // Complete the registration
  };

  const handleBack = () => {
    setShowModal(false); // Close the modal
  };

  return (
    <div>
      <div className="space-y-4">
        {/* Email Address */}
        <input
          type="email"
          name="email"
          placeholder="Email Address (Optional)"
          value={data.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* History of Dental Treatments */}
        <input
          type="text"
          name="dentalHistory"
          placeholder="History of Dental Treatments"
          value={data.dentalHistory}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Behavioral Challenges */}
        <input
          type="text"
          name="behavioralChallenges"
          placeholder="Behavioral Challenges During Treatment"
          value={data.behavioralChallenges}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        {/* Upload Previous Prescriptions */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">
            Upload Previous Prescriptions (PDF/JPG):
          </label>
          <input
            type="file"
            name="previousRecords"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className="block w-full border rounded p-2"
          />
        </div>

        {/* Upload Profile Photo */}
        <div className="flex flex-col space-y-2">
          <label className="font-medium text-gray-700">
            Upload Profile Photo:
          </label>
          <input
            type="file"
            name="profilePhoto"
            accept=".jpg,.jpeg,.png"
            onChange={handleChange}
            className="block w-full border rounded p-2"
          />
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        {/* Back Button */}
        <button
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Back
        </button>

        {/* Finish Button */}
        <button
          onClick={handleFinishClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Finish
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirm Registration</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to complete the registration? 
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleBack}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Back
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepOptional;