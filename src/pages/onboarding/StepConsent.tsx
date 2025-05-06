import React, { useState } from "react";

const StepConsent = ({ data, updateData, nextStep, prevStep }) => {
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
      <div className="flex justify-between">
        <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Back</button>
        <button className='bg-[#0e5d9f] text-white px-4 py-2 rounded mx-auto block'>
  Next
</button>


      </div>
    </form>
  );
};

export default StepConsent;
