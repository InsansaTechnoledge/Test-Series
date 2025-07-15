import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CryptoJS from "crypto-js";
import useCachedContests from "../../../../../hooks/useCachedContests";
import { useCachedOrganization } from "../../../../../hooks/useCachedOrganization";
import { useUser } from "../../../../../contexts/currentUserContext";
import { VITE_SECRET_KEY_FOR_CONTEST } from "../../../../constants/env";
import { useTheme } from "../../../../../hooks/useTheme";
import { useToast, ToastContainer } from "../../../../../utils/Toaster";

const ContestInstructionWindow = () => {
  const navigate = useNavigate();
  const { contestId } = useParams();
  const decodedId = decodeURIComponent(contestId);
  const SECRET_KEY_CONTEST =
    import.meta.env.VITE_SECRET_KEY_FOR_CONTEST || VITE_SECRET_KEY_FOR_CONTEST;
  const { user } = useUser();
  const { toasts, showToast, removeToast } = useToast();

  // Decrypt the contestId only once
  // const contest_id = useMemo(() => {
  //     try {
  //         return CryptoJS.AES.decrypt(decodedId, SECRET_KEY_CONTEST).toString(CryptoJS.enc.Utf8);
  //     } catch (error) {
  //         console.error("Error decrypting contestId:", error);
  //         return null;
  //     }
  // }, [decodedId, SECRET_KEY_CONTEST]);

  const { contestMap, isLoading: contestsLoading } = useCachedContests();

  const [contest, setContest] = useState({});
  const [loading, setLoading] = useState(true);
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  useEffect(() => {
    if (!contestId || contestsLoading) {
      setLoading(true);
      return;
    }

    const contestData = contestMap?.[contestId];

    if (contestData) {
      setContest(contestData);
    }

    setLoading(false);
  }, [contestId, contestMap, contestsLoading]);

  const { organization } = useCachedOrganization({
    userId: user._id,
    orgId: contest.organization_id,
  });

  const handleStartContest = async () => {
    if (!guidelinesAccepted) {
      showToast("Please accept the contest guidelines to proceed.", "error");
      return;
    }
    const encryptedId = CryptoJS.AES.encrypt(
      contestId,
      SECRET_KEY_CONTEST
    ).toString();
    const safeId = encodeURIComponent(encryptedId);
    navigate(`/student/code/${safeId}`);
  };
  const { theme } = useTheme();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 md:p-8 rounded-3xl shadow-2xl mb-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-green-700/20"></div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-center mb-3 tracking-tight">
            {contest?.name || `Contest: ${contestId}`}
          </h1>
          <p className="text-center text-green-100 text-lg font-medium">
            Organized by {organization?.name || "The Contest Team"}
          </p>
        </div>
      </div>

      {/* Contest Details Bar */}
      <div
        className={`${
          theme === "light"
            ? "bg-white border border-gray-100"
            : "bg-gray-800 border border-gray-700"
        } rounded-3xl shadow-xl p-6 mb-8 backdrop-blur-sm`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className={`p-4 rounded-2xl ${
              theme === "light"
                ? "bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200"
                : "bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-700"
            } text-center transform hover:scale-105 transition-all duration-300`}
          >
            <p
              className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                theme === "light" ? "text-blue-600" : "text-blue-400"
              }`}
            >
              Start Date
            </p>
            <p
              className={`font-black text-lg ${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              {new Date(contest?.schedule?.startDate).toLocaleDateString() ||
                "TBD"}
            </p>
          </div>
          <div
            className={`p-4 rounded-2xl ${
              theme === "light"
                ? "bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200"
                : "bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-700"
            } text-center transform hover:scale-105 transition-all duration-300`}
          >
            <p
              className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                theme === "light" ? "text-purple-600" : "text-purple-400"
              }`}
            >
              End Date
            </p>
            <p
              className={`font-black text-lg ${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              {new Date(contest?.schedule?.endDate).toLocaleDateString() ||
                "TBD"}
            </p>
          </div>
          <div
            className={`p-4 rounded-2xl ${
              theme === "light"
                ? "bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200"
                : "bg-gradient-to-br from-indigo-900/30 to-indigo-800/30 border border-indigo-700"
            } text-center transform hover:scale-105 transition-all duration-300`}
          >
            <p
              className={`text-sm font-semibold uppercase tracking-wide mb-2 ${
                theme === "light" ? "text-indigo-600" : "text-indigo-400"
              }`}
            >
              Duration
            </p>
            <p
              className={`font-black text-lg ${
                theme === "light" ? "text-gray-800" : "text-gray-100"
              }`}
            >
              {contest?.validity.start} to {contest.validity.end}
            </p>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Contest Description */}
          <div
            className={`${
              theme === "light"
                ? "bg-white border border-gray-100"
                : "bg-gray-800 border border-gray-700"
            } rounded-3xl shadow-xl p-6 md:p-8 backdrop-blur-sm hover:scale-102 transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full"></div>
              <h2
                className={`text-2xl font-black ${
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                }`}
              >
                Contest Description
              </h2>
            </div>
            <p
              className={`text-lg leading-relaxed ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {contest?.description ||
                "Participate in this contest to showcase your skills and win exciting prizes. Open to all eligible participants."}
            </p>
          </div>

          {/* Eligibility & Requirements */}
          <div
            className={`${
              theme === "light"
                ? "bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200"
                : "bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-700"
            } rounded-3xl p-6 md:p-8 shadow-xl backdrop-blur-sm hover:scale-102 transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-2 h-8 rounded-full ${
                  theme === "light"
                    ? "bg-gradient-to-b from-yellow-500 to-orange-500"
                    : "bg-gradient-to-b from-yellow-400 to-orange-400"
                }`}
              ></div>
              <h2
                className={`text-2xl font-black ${
                  theme === "light" ? "text-yellow-800" : "text-yellow-200"
                }`}
              >
                Eligibility & Requirements
              </h2>
            </div>
            <ul
              className={`space-y-3 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {(
                contest?.requirements || [
                  "Must be 18 years or older",
                  "Valid government-issued ID required",
                  "Open only to residents of specified regions",
                ]
              ).map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      theme === "light" ? "bg-yellow-500" : "bg-yellow-400"
                    }`}
                  ></div>
                  <span className="text-lg leading-relaxed">{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Contest Rules */}
          <div
            className={`${
              theme === "light"
                ? "bg-white border border-gray-100"
                : "bg-gray-800 border border-gray-700"
            } rounded-3xl shadow-xl p-6 md:p-8 backdrop-blur-sm hover:scale-102 transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
              <h2
                className={`text-2xl font-black ${
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                }`}
              >
                Contest Rules
              </h2>
            </div>
            <ol
              className={`space-y-3 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              {(
                contest?.rules || [
                  "Only one entry per participant is allowed.",
                  "Entries must be original and created by the participant.",
                  "No plagiarism or use of AI-generated content unless specified.",
                  "The decision of the jury will be final.",
                  "Winners will be contacted via registered email.",
                ]
              ).map((rule, idx) => (
                <li key={idx} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                      theme === "light"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-blue-900/50 text-blue-300"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <span className="text-lg leading-relaxed pt-1">{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Important Notes */}
          <div
            className={`${
              theme === "light"
                ? "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
                : "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
            } rounded-3xl shadow-xl p-6 md:p-8 backdrop-blur-sm hover:scale-102 transition-all duration-300`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-2 h-8 rounded-full ${
                  theme === "light"
                    ? "bg-gradient-to-b from-gray-500 to-gray-600"
                    : "bg-gradient-to-b from-gray-400 to-gray-500"
                }`}
              ></div>
              <h2
                className={`text-2xl font-black ${
                  theme === "light" ? "text-gray-800" : "text-gray-100"
                }`}
              >
                Additional Information
              </h2>
            </div>
            <div
              className={`space-y-4 ${
                theme === "light" ? "text-gray-700" : "text-gray-300"
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">🕒</span>
                <p className="text-lg leading-relaxed">
                  All entries must be submitted before the contest end date.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl">🛠️</span>
                <p className="text-lg leading-relaxed">
                  Technical issues should be reported immediately to the support
                  team.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl">🔐</span>
                <p className="text-lg leading-relaxed">
                  Participant data is handled securely and in compliance with
                  privacy policies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agreement and Start Button */}
      <div
        className={`${
          theme === "light"
            ? "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
            : "bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700"
        } rounded-3xl shadow-2xl p-6 md:p-8 mb-6 backdrop-blur-sm`}
      >
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="max-w-2xl w-full">
            <label className="flex items-start cursor-pointer group">
              <input
                type="checkbox"
                className="h-6 w-6 text-green-600 rounded-lg border-2 border-gray-300 focus:ring-green-500 focus:ring-2 mt-1 transition-all duration-300"
                checked={guidelinesAccepted}
                onChange={() => setGuidelinesAccepted(!guidelinesAccepted)}
              />
              <span
                className={`ml-4 text-lg leading-relaxed ${
                  theme === "light" ? "text-gray-700" : "text-gray-300"
                } group-hover:text-green-600 transition-colors duration-300`}
              >
                I have read and understood the contest rules, eligibility
                criteria, and agree to abide by all terms during my
                participation.
              </span>
            </label>
          </div>

          <button
            onClick={handleStartContest}
            disabled={!guidelinesAccepted}
            className={`${
              !guidelinesAccepted
                ? theme === "light"
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 hover:scale-105 hover:shadow-2xl"
            } text-white px-12 py-4 rounded-2xl font-black shadow-xl transition-all duration-300 text-xl w-80 transform`}
          >
            Start Contest
          </button>

          {!guidelinesAccepted && (
            <p
              className={`text-sm ${
                theme === "light" ? "text-gray-500" : "text-gray-400"
              } animate-pulse`}
            >
              You must accept the contest terms to proceed
            </p>
          )}
        </div>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ContestInstructionWindow;
