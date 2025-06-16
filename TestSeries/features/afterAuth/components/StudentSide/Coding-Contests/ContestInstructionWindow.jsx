import { useState } from "react";
import { useParams } from "react-router-dom";
import CryptoJS from "crypto-js";

const ContestInstructionWindow = () => {
    const urlParams=useParams();
    const contestId =urlParams.contestId;
    const SECRET_KEY_CONTEST = import.meta.env.VITE_SECRET_KEY_FOR_CONTEST;
    const [contest_id, setContestId] = useState(CryptoJS.AES.decrypt(contestId, SECRET_KEY_CONTEST).toString(CryptoJS.enc.Utf8));
    const [contest,setContest]=useState(null);
    const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
  {/* Header */}
  <div className="bg-green-600 text-white p-4 md:p-6 rounded-lg shadow-lg mb-6">
    <h1 className="text-2xl md:text-3xl font-bold text-center mb-2">
      {contest?.name || `Contest: ${contest_id}`}
    </h1>
    <p className="text-center text-green-100">
      Organized by {contest?.organizer || "The Contest Team"}
    </p>
  </div>

  {/* Contest Details Bar */}
  <div className="bg-white rounded-lg shadow-md p-4 mb-6">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="p-2 border-r border-gray-200">
        <p className="text-gray-600 text-sm">Start Date</p>
        <p className="font-semibold text-lg">
          {new Date(contest?.schedule?.startDate).toLocaleDateString() || "TBD"}
        </p>
      </div>
      <div className="p-2 border-r border-gray-200">
        <p className="text-gray-600 text-sm">End Date</p>
        <p className="font-semibold text-lg">
          {new Date(contest?.schedule?.endDate).toLocaleDateString() || "TBD"}
        </p>
      </div>
      <div className="p-2 border-r border-gray-200">
        <p className="text-gray-600 text-sm">Duration</p>
        <p className="font-semibold text-lg">{contest?.validity || "30"} days</p>
      </div>
      <div className="p-2">
        <p className="text-gray-600 text-sm">Prize Pool</p>
        <p className="font-semibold text-lg">{contest?.prizes || "$1000"}</p>
      </div>
    </div>
  </div>

  {/* Main Layout */}
  <div className="grid md:grid-cols-2 gap-6 mb-6">
    {/* Left Column */}
    <div className="space-y-6">
      {/* Contest Description */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">Contest Description</h2>
        <p className="text-gray-800">
          {contest?.description || "Participate in this contest to showcase your skills and win exciting prizes. Open to all eligible participants."}
        </p>
      </div>

      {/* Eligibility & Requirements */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-3 text-yellow-800 border-b border-yellow-300 pb-2">Eligibility & Requirements</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {(contest?.requirements || [
            "Must be 18 years or older",
            "Valid government-issued ID required",
            "Open only to residents of specified regions"
          ]).map((req, idx) => (
            <li key={idx}>{req}</li>
          ))}
        </ul>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-6">
      {/* Contest Rules */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">Contest Rules</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          {(contest?.rules || [
            "Only one entry per participant is allowed.",
            "Entries must be original and created by the participant.",
            "No plagiarism or use of AI-generated content unless specified.",
            "The decision of the jury will be final.",
            "Winners will be contacted via registered email."
          ]).map((rule, idx) => (
            <li key={idx}>{rule}</li>
          ))}
        </ol>
      </div>

      {/* Important Notes */}
      <div className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6">
        <h2 className="text-xl font-semibold mb-3 text-gray-800 border-b pb-2">Additional Information</h2>
        <div className="space-y-3 text-sm text-gray-700">
          <p>🕒 All entries must be submitted before the contest end date.</p>
          <p>🛠️ Technical issues should be reported immediately to the support team.</p>
          <p>🔐 Participant data is handled securely and in compliance with privacy policies.</p>
        </div>
      </div>
    </div>
  </div>

  {/* Agreement and Start Button */}
  <div className="bg-gray-50 rounded-lg shadow-md p-4 md:p-6 mb-6">
    <div className="flex flex-col items-center justify-center">
      <div className="mb-4 max-w-xl w-full">
        <label className="flex items-start cursor-pointer">
          <input
            type="checkbox"
            className="h-5 w-5 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-1"
            checked={guidelinesAccepted}
            onChange={() => setGuidelinesAccepted(!guidelinesAccepted)}
          />
          <span className="ml-2 text-gray-700">
            I have read and understood the contest rules, eligibility criteria, and agree to abide by all terms during my participation.
          </span>
        </label>
      </div>

      <button
        // onClick={handleStartContest}
        disabled={!guidelinesAccepted}
        className={`${
          !guidelinesAccepted
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        } text-white px-8 py-3 rounded-md font-medium shadow-md transition-colors text-lg w-64`}
      >
        Start Contest
      </button>

      {!guidelinesAccepted && (
        <p className="mt-2 text-xs text-gray-500">
          You must accept the contest terms to proceed
        </p>
      )}
    </div>
  </div>
</div>

    )
};

export default ContestInstructionWindow;