import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Users,
  Play,
  Trash2,
  AlertCircle,
  CheckCircle,
  Pause,
  Trophy,
  Timer
} from "lucide-react";

import { deleteContest, ToggleContest } from "../../../../../../utils/services/contestService";
import { ToastContainer, useToast } from "../../../../../../utils/Toaster";

const ContestTable = ({ contest, setContest, theme, canDeleteContest, canPublishContest }) => {
  const [loadingDelete, setLoadingDelete] = useState({});
  const [loadingGoLive, setLoadingGoLive] = useState({});
  const { toasts, showToast, showConfirmToast, removeToast } = useToast();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isValidityActive = (validity) => {
    if (!validity.start || !validity.end) return false;
    const now = new Date();
    const start = new Date(validity.start);
    const end = new Date(validity.end);
    return now >= start && now <= end;
  };

  const canGoLive = (contestItem) => {
    const now = new Date();

    if (contestItem.type === "participation_based") {
      return isValidityActive(contestItem.validity);
    } else if (contestItem.type === "scheduled") {
      const scheduled = new Date(contestItem.schedule);
      const timeDiff = Math.abs(now - scheduled);
      const minutesDiff = Math.ceil(timeDiff / (1000 * 60));
      return minutesDiff <= 15;
    }
    return true;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contest? This action cannot be undone.')) {
      return;
    }

    setLoadingDelete(prev => ({ ...prev, [id]: true }));

    try {
      await deleteContest(id);
      setContest((prevContests) =>
        prevContests.filter((item) => item.id !== id)
      );
      showToast("Contest deleted successfully", "success");
    } catch (error) {
      showToast("Failed to delete contest. Please try again.", "error");
    } finally {
      setLoadingDelete((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleGoLive = async (contestItem) => {
    if (!canGoLive(contestItem)) {
      showToast(
        "Contest cannot go live at this time. Please check the validity period or schedule.",
        "warning"
      );
      return;
    }

    setLoadingGoLive(prev => ({ ...prev, [contestItem.id]: true }));

    try {
      await ToggleContest(contestItem.id);
      setContest((prevContests) =>
        prevContests.map((item) =>
          item.id === contestItem.id ? { ...item, go_live: true } : item
        )
      );
      showToast("Contest is now live!", "success");
    } catch (error) {
      showToast("Failed to make contest live. Please try again.", "error");
    } finally {
      setLoadingGoLive((prev) => ({ ...prev, [contestItem.id]: false }));
    }
  };

  const handlePause = async (contestItem) => {
    setLoadingGoLive(prev => ({ ...prev, [contestItem.id]: true }));

    try {
      await ToggleContest(contestItem.id);
      setContest(prevContests =>
        prevContests.map(item =>
          item.id === contestItem.id ? { ...item, go_live: false } : item
        )
      );
      showToast('Contest has been paused.', "warning");
    } catch (error) {
      showToast('Failed to pause contest. Please try again.', "error");
    } finally {
      setLoadingGoLive(prev => ({ ...prev, [contestItem.id]: false }));
    }
  };

  const getContestStatus = (contestItem) => {
    if (contestItem.go_live) return { text: 'LIVE', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle };

    if (contestItem.type === "participation_based") {
      const active = isValidityActive(contestItem.validity);
      return active
        ? { text: 'ACTIVE', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: Play }
        : { text: 'INACTIVE', color: 'text-gray-500 bg-gray-50 border-gray-200', icon: AlertCircle };
    } else {
      const now = new Date();
      const scheduled = new Date(contestItem.schedule);
      return now < scheduled
        ? { text: 'UPCOMING', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock }
        : { text: 'ENDED', color: 'text-red-600 bg-red-50 border-red-200', icon: AlertCircle };
    }
  };

  const contestData = contest || [];

  return (
    <div className="p-6">
      {/* Table Container */}
      <div
        className={`${
          theme === 'dark'
            ? 'bg-gray-800 border border-gray-700'
            : 'bg-white border border-gray-200'
        } rounded-xl shadow-lg overflow-hidden`}
      >
        {/* Table Header */}
        <div
          className={`${
            theme === 'dark'
              ? 'bg-gray-700 border-b border-gray-600'
              : 'bg-gray-50 border-b border-gray-200'
          } px-6 py-4`}
        >
          <div className="flex items-center space-x-2">
            <Trophy className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
              Contest Management
            </h2>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={`${
                  theme === 'dark'
                    ? 'bg-gray-700 border-b border-gray-600'
                    : 'bg-gray-50 border-b border-gray-200'
                }`}
              >
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  Contest Details
                </th>
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  Type & Status
                </th>
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  Duration
                </th>
                <th
                  className={`text-left px-6 py-3 text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  Schedule / Validity
                </th>
                <th
                  className={`text-center px-6 py-3 text-xs font-medium ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  } uppercase tracking-wider`}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className={`${
                theme === 'dark' ? 'bg-gray-800 divide-y divide-gray-700' : 'bg-white divide-y divide-gray-200'
              }`}
            >
              {contestData?.map((contestItem) => {
                const status = getContestStatus(contestItem);
                const isParticipationBased = contestItem.type === 'participation_based';
                const StatusIcon = status.icon;
                const canMakeGoLive = canGoLive(contestItem) && !contestItem.go_live;

                return (
                  <tr
                    key={contestItem.id}
                    className={`${
                      theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    } transition-colors duration-150`}
                  >
                    {/* Contest Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div
                          className={`w-10 h-10 rounded-full ${
                            isParticipationBased
                              ? theme === 'dark'
                                ? 'bg-indigo-900 text-indigo-300'
                                : 'bg-indigo-100 text-indigo-600'
                              : theme === 'dark'
                                ? 'bg-purple-900 text-purple-300'
                                : 'bg-purple-100 text-purple-600'
                          } flex items-center justify-center font-semibold text-sm mr-4`}
                        >
                          {isParticipationBased ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <Calendar className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div
                            className={`text-sm font-medium ${
                              theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                            } line-clamp-1`}
                          >
                            {contestItem.name}
                          </div>
                          {contestItem.description && (
                            <div
                              className={`text-sm ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                              } line-clamp-2 mt-1`}
                            >
                              {contestItem.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Type & Status */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isParticipationBased
                              ? theme === 'dark'
                                ? 'bg-indigo-900 text-indigo-300'
                                : 'bg-indigo-100 text-indigo-800'
                              : theme === 'dark'
                                ? 'bg-purple-900 text-purple-300'
                                : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {isParticipationBased ? 'Participation' : 'Scheduled'}
                        </span>
                        <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.text}
                        </div>
                      </div>
                    </td>

                    {/* Duration */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Timer className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                        <span
                          className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                          }`}
                        >
                          {contestItem.duration} mins
                        </span>
                      </div>
                    </td>

                    {/* Schedule / Validity */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {isParticipationBased ? (
                          contestItem.validity.start && contestItem.validity.end ? (
                            <>
                              <div className="flex items-center">
                                <Calendar className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                <span
                                  className={`text-sm font-medium ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                  }`}
                                >
                                  Valid Period
                                </span>
                              </div>
                              <div
                                className={`text-xs ${
                                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                }`}
                              >
                                {formatDate(contestItem.validity.start)} - {formatDate(contestItem.validity.end)}
                              </div>
                              {!isValidityActive(contestItem.validity) && (
                                <div
                                  className={`text-xs flex items-center gap-1 ${
                                    theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                                  }`}
                                >
                                  <AlertCircle className="w-3 h-3" />
                                  Not in valid period
                                </div>
                              )}
                            </>
                          ) : (
                            <span
                              className={`text-sm italic ${
                                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                              }`}
                            >
                              No validity set
                            </span>
                          )
                        ) : contestItem.schedule ? (
                          <>
                            <div className="flex items-center">
                              <Clock className={`w-4 h-4 mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                              <span
                                className={`text-sm font-medium ${
                                  theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                }`}
                              >
                                Scheduled
                              </span>
                            </div>
                            <div
                              className={`text-xs ${
                                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                              }`}
                            >
                              {formatDateTime(contestItem.schedule)}
                            </div>
                            {!canGoLive(contestItem) && !contestItem.go_live && (
                              <div
                                className={`text-xs flex items-center gap-1 ${
                                  theme === 'dark' ? 'text-amber-300' : 'text-amber-600'
                                }`}
                              >
                                <AlertCircle className="w-3 h-3" />
                                Not ready to go live
                              </div>
                            )}
                          </>
                        ) : (
                          <span
                            className={`text-sm italic ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}
                          >
                            No schedule set
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        {/* Go Live / Pause Button */}
                        {canPublishContest && (!contestItem.go_live || (contestItem.go_live && !canMakeGoLive)) && (
                          <button
                            onClick={() => {
                              if (contestItem.go_live) {
                                handlePause(contestItem);
                              } else if (!contestItem.go_live) {
                                handleGoLive(contestItem);
                              }
                            }}
                            disabled={loadingGoLive[contestItem.id] || (!canMakeGoLive && !contestItem.go_live)}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              canMakeGoLive || contestItem.go_live
                                ? theme === 'dark'
                                  ? 'text-emerald-400 hover:bg-emerald-900 hover:text-emerald-300'
                                  : 'text-emerald-600 hover:bg-emerald-100 hover:text-emerald-800'
                                : theme === 'dark'
                                  ? 'text-gray-600 cursor-not-allowed'
                                  : 'text-gray-400 cursor-not-allowed'
                            } disabled:opacity-50`}
                            title={
                              contestItem.go_live
                                ? 'Pause Contest'
                                : canMakeGoLive
                                  ? 'Go Live'
                                  : 'Cannot Go Live'
                            }
                          >
                            {loadingGoLive[contestItem.id] ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : contestItem.go_live ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </button>
                        )}

                        {/* Delete Button */}
                        {canDeleteContest && (
                          <button
                            onClick={() => handleDelete(contestItem.id)}
                            disabled={loadingDelete[contestItem.id]}
                            className={`p-2 rounded-lg transition-colors duration-200 ${
                              theme === 'dark'
                                ? 'text-red-400 hover:bg-red-900 hover:text-red-300'
                                : 'text-red-600 hover:bg-red-100 hover:text-red-800'
                            } disabled:opacity-50`}
                            title="Delete Contest"
                          >
                            {loadingDelete[contestItem.id] ? (
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Helper text for disabled go-live button */}
                      {!canMakeGoLive && !contestItem.go_live && canPublishContest && (
                        <div
                          className={`text-xs mt-1 ${
                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                          }`}
                        >
                          Check validity/schedule
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {contestData.length === 0 && (
          <div className="text-center py-12">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Trophy className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
            </div>
            <h3
              className={`text-lg font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              No contests available
            </h3>
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Create your first contest to get started.
            </p>
          </div>
        )}
      </div>

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ContestTable;