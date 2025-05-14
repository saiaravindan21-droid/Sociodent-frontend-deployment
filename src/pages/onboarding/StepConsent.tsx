import React, { useState } from "react";

/**
 * StepConsent Component
 * Props:
 * - data: object (current form data)
 * - updateData: function (to update parent form data)
 * - nextStep: function (to go to next step or finish)
 * - prevStep: function (to go to previous step)
 * - hideNext: boolean (if true, hides the Next button so you can render a custom Finish button outside)
 */
const StepConsent = ({
  data,
  updateData,
  nextStep,
  prevStep,
  hideNext = false,
}) => {
  const [local, setLocal] = useState({
    consent: data.consent || false,
    terms: data.terms || false,
  });

  const handleChange = (e) => {
    setLocal({ ...local, [e.target.name]: e.target.checked });
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData(local);
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <label className="block">
        <input
          type="checkbox"
          name="consent"
          checked={local.consent}
          onChange={handleChange}
          required
        />
        <span className="ml-2">Consent for Teleconsultation or Homecare</span>
      </label>
      <label className="block">
        <input
          type="checkbox"
          name="terms"
          checked={local.terms}
          onChange={handleChange}
          required
        />
        <span className="ml-2">
          Accept Terms & Conditions and Privacy Policy
        </span>
      </label>
      <div className="flex justify-between mt-6">
        {prevStep && (
          <button
            type="button"
            onClick={prevStep}
            className="px-4 py-2 bg-gray-300 rounded text-gray-700 font-semibold"
          >
            Back
          </button>
        )}
        {!hideNext && (
          <button
            type="submit"
            className="bg-[#0e5d9f] text-white px-6 py-2 rounded font-bold"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
};

export default StepConsent;
