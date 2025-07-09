import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { getLeaderBoard } from "../../../../../../utils/services/contestService";
import { useUser } from "../../../../../../contexts/currentUserContext";
import useCachedContests from "../../../../../../hooks/useCachedContests";

const COLORS = ["#4CAF50", "#F44336"]; 

const LeaderBoard = () => {
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [expandedContest, setExpandedContest] = useState(null);
  const [groupedByContest, setGroupedByContest] = useState({});
  const [progress, setProgress] = useState([]);
  const { user } = useUser();
  const {contestMap} = useCachedContests();

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderBoard = async () => {
      try {
        const response = await getLeaderBoard();
        if (Array.isArray(response?.data)) {
          setLeaderBoardData(response.data);

          // Group by contest ID
          const grouped = {};
          response.data.forEach((entry) => {
            if (!grouped[entry.contest_id]) grouped[entry.contest_id] = [];
            grouped[entry.contest_id].push(entry);
          });
          setGroupedByContest(grouped);
        }
      } catch (err) {
        console.error("Error fetching leaderboard", err);
      }
    };

    fetchLeaderBoard();
  }, []);

  // Filter progress for current user
  useEffect(() => {
    if (leaderBoardData.length > 0 && user?._id) {
      const studentProgress = leaderBoardData.filter(
        (entry) => entry.participant_id === user._id
      );
      setProgress(studentProgress);
    }
  }, [leaderBoardData, user]);

  // Prepare data for line chart
  const chartData = progress.map((entry) => ({
    contest: entry.contest_id.slice(0, 6) + "...",
    obtained: entry.total_score.totalObtainedMarks,
    total: entry.total_score.totalMarks,
  }));

  const toggleAccordion = (contestId) => {
    setExpandedContest((prev) => (prev === contestId ? null : contestId));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-12">
      {/* Student Line Chart */}
      {progress.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            📈 Your Progress Across Contests
          </h2>
          <div className="bg-white shadow-md rounded-lg p-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="contest" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="obtained"
                  stroke="#4CAF50"
                  strokeWidth={2}
                  name="Obtained Marks"
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="#2196F3"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Total Marks"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Pie Chart Per Contest */}
      {progress.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            🥧 Your Performance Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progress.map((entry) => {
              const { totalObtainedMarks, totalMarks } = entry.total_score;
              const pieData = [
                { name: "Obtained", value: totalObtainedMarks },
                { name: "Missed", value: totalMarks - totalObtainedMarks },
              ];

              return (
                <div
                  key={entry.contest_id}
                  className="bg-white rounded-lg shadow-md p-4"
                >
                  <h3 className="text-md font-semibold mb-2 text-gray-700">
                    Contest: {contestMap[entry.contest_id]?.title}
                  </h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {pieData.map((_, index) => (
                          <Cell
                            key={index}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div>
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          🏆 Leaderboard by Contest
        </h2>
        {Object.entries(groupedByContest).map(([contestId, participants]) => {
          const questionIds = Array.from(
            new Set(
              participants.flatMap((p) =>
                p.total_score.results.map((r) => r.questionId)
              )
            )
          );

          return (

            <div
              key={contestId}
              className="mb-8 rounded-xl overflow-hidden border shadow-md transition-all duration-300"
            >
              {/* Accordion Header */}
              <button
                onClick={() => toggleAccordion(contestId)}
                className={`w-full text-left px-6 py-4 flex justify-between items-center font-semibold text-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:brightness-105 transition duration-200 ${expandedContest === contestId ? "rounded-t-xl" : "rounded-xl"
                  }`}
              >
                <span>📘 Contest ID: {contestMap[contestId]?.title}</span>
                <span className="text-2xl">
                  {expandedContest === contestId ? "−" : "+"}
                </span>
              </button>

              {expandedContest === contestId && (
                <div className="overflow-x-auto p-4 bg-white rounded-b-lg">
                  <div className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
                    <table className="min-w-full text-sm text-left">
                      <thead className="bg-indigo-100 text-indigo-800">
                        <tr className="text-sm font-semibold uppercase">
                          <th className="px-5 py-3 border-b">Rank</th>
                          <th className="px-5 py-3 border-b">Participants</th>
                          {questionIds.map((qid, idx) => (
                            <th
                              key={qid}
                              className="px-5 py-3 border-b text-center"
                              title={`Question ID: ${qid}`}
                            >
                              Q{idx + 1}
                            </th>
                          ))}
                          <th className="px-5 py-3 border-b text-center">Total Marks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...participants]
                          .sort(
                            (a, b) =>
                              b.total_score.totalObtainedMarks - a.total_score.totalObtainedMarks
                          )
                          .map((participant, index) => {
                            const scoreMap = {};
                            participant.total_score.results.forEach((r) => {
                              scoreMap[r.questionId] = r.obtainedMarks;
                            });

                            const isCurrentUser = participant.participant_id === user?._id;

                            const rankBadge =
                              index === 0
                                ? "🥇"
                                : index === 1
                                  ? "🥈"
                                  : index === 2
                                    ? "🥉"
                                    : index + 1;

                            return (
                              <tr
                                key={participant.participant_id}
                                className={`transition-all duration-200 ${isCurrentUser
                                    ? "bg-yellow-100 text-yellow-800 font-semibold"
                                    : index % 2 === 0
                                      ? "bg-white"
                                      : "bg-gray-50"
                                  } hover:bg-indigo-50`}
                              >
                                <td className="px-5 py-3 border-b text-center">{rankBadge}</td>
                                <td className="px-5 py-3 border-b font-mono text-blue-600">
                                  {isCurrentUser ? '👤 You' : 'student'}
                                </td>
                                {questionIds.map((qid) => (
                                  <td
                                    key={qid}
                                    className="px-5 py-3 border-b text-center text-gray-700"
                                  >
                                    {scoreMap[qid] ?? "-"}
                                  </td>
                                ))}
                                <td className="px-5 py-3 border-b text-center font-bold text-emerald-600">
                                  {participant.total_score.totalObtainedMarks}
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>

              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderBoard;
