import React from 'react';

const SubmitModal = ({ setShowSubmitModal, setSubmitted }) => {
  const handleConfirmSubmit = () => {
    setSubmitted(true);
    setShowSubmitModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 text-center">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Confirm Submit</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to submit?</p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setShowSubmitModal(false)}
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmSubmit}
            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
