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
import { useTheme } from "../../../../../../hooks/useTheme";
  
const LeaderBoard = () => {
  const [leaderBoardData, setLeaderBoardData] = useState([]);
  const [groupedByContest, setGroupedByContest] = useState({});
  const [progress, setProgress] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const { user } = useUser();
  const { contestMap } = useCachedContests();
  const { theme } = useTheme();

  console.log("d",contestMap[selectedContest])

  const isDark = theme === 'dark';

  // Theme-based colors
  const colors = {
    primary: isDark ? '#6366f1' : '#4f46e5',
    secondary: isDark ? '#1f2937' : '#ffffff',
    background: isDark ? '#111827' : '#f8fafc',
    surface: isDark ? '#1f2937' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    textSecondary: isDark ? '#d1d5db' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    accent: isDark ? '#8b5cf6' : '#7c3aed',
    success: isDark ? '#10b981' : '#059669',
    warning: isDark ? '#f59e0b' : '#d97706',
    danger: isDark ? '#ef4444' : '#dc2626',
  };

  const CHART_COLORS = [colors.success, colors.danger];

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

          // Auto-select first contest
          if (Object.keys(grouped).length > 0) {
            setSelectedContest(Object.keys(grouped)[0]);
          }
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
    contest: contestMap[entry.contest_id]?.name || 'Unnamed Contest',
    obtained: entry.total_score.totalObtainedMarks,
    total: entry.total_score.totalMarks,
  }));
  

  const getRankDisplay = (index) => {
    const ranks = ["1st", "2nd", "3rd"];
    return ranks[index] || `${index + 1}th`;
  };

  const getScorePercentage = (obtained, total) => {
    return total > 0 ? Math.round((obtained / total) * 100) : 0;
  };

  const getRankIcon = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `#${index + 1}`;
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
            Contest Leaderboard
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Track your progress and compete with others
          </p>
        </div>

        {/* Student Progress Line Chart */}
        {progress.length > 0 && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden transition-all duration-300`}>
            <div className="p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Your Progress Journey
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Performance across all contests
              </p>
            </div>
            <div className="p-6">
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis 
                    dataKey="contest" 
                    stroke={colors.textSecondary}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={colors.textSecondary}
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '8px',
                      color: colors.text
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="obtained"
                    stroke={colors.success}
                    strokeWidth={3}
                    name="Obtained Marks"
                    dot={{ fill: colors.success, strokeWidth: 2, r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke={colors.primary}
                    strokeWidth={3}
                    strokeDasharray="8 8"
                    name="Total Marks"
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Performance Breakdown Pie Charts */}
        {progress.length > 0 && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
            <div className="p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                Performance Breakdown
              </h2>
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Score distribution for each contest
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {progress.map((entry) => {
                  const { totalObtainedMarks, totalMarks } = entry.total_score;
                  const percentage = getScorePercentage(totalObtainedMarks, totalMarks);
                  const pieData = [
                    { name: "Obtained", value: totalObtainedMarks },
                    { name: "Missed", value: totalMarks - totalObtainedMarks },
                  ];

                  return (
                    <div
                      key={entry.contest_id}
                      className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 border ${isDark ? 'border-gray-600' : 'border-gray-200'} transition-all duration-300 hover:shadow-md`}
                    >
                      <div className="mb-4">
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                          {contestMap[entry.contest_id]?.name || 'Contest'}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {totalObtainedMarks}/{totalMarks} points
                          </span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            percentage >= 80 ? 'bg-green-100 text-green-800' :
                            percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {percentage}%
                          </span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={70}
                            label={({ value, percent }) => `${value} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            {pieData.map((_, index) => (
                              <Cell
                                key={index}
                                fill={CHART_COLORS[index % CHART_COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: colors.surface,
                              border: `1px solid ${colors.border}`,
                              borderRadius: '8px',
                              color: colors.text
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* New Leaderboard Design */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Contest Rankings
            </h2>
            <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Competition results by contest
            </p>
          </div>

          {/* Contest Selector */}
          {Object.keys(groupedByContest).length > 0 && (
            <div className="flex justify-center">
              <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-2 shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="flex space-x-2 overflow-x-auto">
                  {Object.keys(groupedByContest).map((contestId) => (
                    <button
                      key={contestId}
                      onClick={() => setSelectedContest(contestId)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                        selectedContest === contestId
                          ? 'bg-indigo-600 text-white shadow-md'
                          : isDark 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {contestMap[contestId]?.name || 'Contest'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Display */}
          {selectedContest && groupedByContest[selectedContest] && (
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
              {/* Contest Header */}
              <div className={ ` ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-400'} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">
                      {contestMap[selectedContest]?.name || 'Unknown Contest'}
                    </h3>
                    <p className="text-indigo-100">
                      {groupedByContest[selectedContest].length} participants competing
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      {groupedByContest[selectedContest].reduce((max, p) => 
                        Math.max(max, p.total_score.totalMarks), 0)}
                    </div>
                    <div className="text-indigo-200 text-sm">Max Points</div>
                  </div>
                </div>
              </div>

              {/* Top 3 Podium */}
              <div className="p-6 bg-gradient-to-b from-gray-50 to-white">
                <div className="flex justify-center items-end space-x-4 mb-8">
                  {[...groupedByContest[selectedContest]]
                    .sort((a, b) => b.total_score.totalObtainedMarks - a.total_score.totalObtainedMarks)
                    .slice(0, 3)
                    .map((participant, index) => {
                      const isCurrentUser = participant.participant_id === user?._id;
                      const heights = ['h-32', 'h-40', 'h-28'];
                      const positions = [1, 0, 2]; // 2nd, 1st, 3rd
                      const actualIndex = positions[index];
                      
                      return (
                        <div key={participant.participant_id} className="flex flex-col items-center">
                          <div className={`${heights[actualIndex]} w-24 rounded-t-lg flex flex-col justify-end items-center p-4 text-white font-bold ${
                            actualIndex === 0 ? 'bg-gradient-to-t from-yellow-500 to-yellow-400' :
                            actualIndex === 1 ? 'bg-gradient-to-t from-gray-500 to-gray-400' :
                            'bg-gradient-to-t from-orange-500 to-orange-400'
                          }`}>
                            <div className="text-2xl mb-1">{getRankIcon(actualIndex)}</div>
                            <div className="text-lg">{participant.total_score.totalObtainedMarks}</div>
                            <div className="text-xs opacity-90">points</div>
                          </div>
                          <div className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                            isCurrentUser 
                              ? 'bg-indigo-100 text-indigo-800 border-2 border-indigo-300' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {isCurrentUser ? 'You' : 'Student'}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Full Rankings Table */}
              <div className="p-6">
                <h4 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
                  Complete Rankings
                </h4>
                <div className="space-y-2">
                  {[...groupedByContest[selectedContest]]
                    .sort((a, b) => b.total_score.totalObtainedMarks - a.total_score.totalObtainedMarks)
                    .map((participant, index) => {
                      const isCurrentUser = participant.participant_id === user?._id;
                      const percentage = getScorePercentage(
                        participant.total_score.totalObtainedMarks,
                        participant.total_score.totalMarks
                      );

                      return (
                        <div
                          key={participant.participant_id}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                            isCurrentUser
                              ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100'
                              : isDark 
                              ? 'bg-gray-900 border-gray-700 hover:bg-gray-800' 
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                              index < 3 
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white' 
                                : isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {index < 3 ? getRankIcon(index) : index + 1}
                            </div>
                            <div>
                              <div className={`font-medium ${
                                isCurrentUser 
                                  ? 'text-indigo-700' 
                                  : isDark ? 'text-gray-300' : 'text-gray-900'
                              }`}>
                                {isCurrentUser ? 'You' : 'Student'}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                Rank {index + 1}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className={`text-lg font-bold ${
                                isCurrentUser 
                                  ? 'text-indigo-600' 
                                  : isDark ? 'text-green-400' : 'text-green-600'
                              }`}>
                                {participant.total_score.totalObtainedMarks}
                              </div>
                              <div className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                                /{participant.total_score.totalMarks} points
                              </div>
                            </div>
                            
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                              percentage >= 80 ? 'bg-green-100 text-green-800' :
                              percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {percentage}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderBoard;