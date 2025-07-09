import { Trophy, Medal, Award, Users } from 'lucide-react'
import { useTheme } from '../../../../hooks/useTheme'


const LeaderBoard = ({ exams,exam, setExam, examData, loading, error }) => {
const {theme} = useTheme()
    const getRankIcon = (rank) => {
        switch (rank) {
            case 1:
                return <Trophy className="w-6 h-6 text-gray-300" />
            case 2:
                return <Medal className="w-6 h-6 text-gray-200" />
            case 3:
                return <Award className="w-6 h-6 text-amber-600" />
            default:
                return <span className="w-6 h-6 flex items-center justify-center text-gray-600 font-semibold">{rank}</span>
        }
    }

    const getRankBgColor = (rank) => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-lg'
            case 2:
                return 'bg-gradient-to-r from-orange-300 to-orange-200 text-gray-800 shadow-md'
            case 3:
                return 'bg-gradient-to-r from-orange-200 to-orange-100 text-gray-800 shadow-sm'
            default:
                return 'bg-white text-gray-800 hover:bg-gray-50'
        }
    }

    // const sortedData = examData.sort((a, b) => (b.marks || 0) - (a.marks || 0))
    const sortedData = Array.isArray(examData) ? [...examData].sort((a, b) => (b.marks || 0) - (a.marks || 0)) : []



    // Get current exam name for display
    const currentExamName = exams.find(e => e.id === exam)?.name || 'Loading...'

    return (
        <div className={`max-w-6xl mx-auto p-6 min-h-screen transition-all duration-300 ${
            theme === 'light' ? 'bg-white' : 'bg-gray-900'
          }`}>
            {/* Header */}
            <div className="mb-8">
              <div className="gap-3 mb-4">
                <h2 className={`text-4xl font-bold ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}>
                  Exam Leaderboard
                </h2>
              </div>
            </div>
          
            {/* Exam Selection */}
          
            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                <p className={`mt-4 text-lg ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  Loading leaderboard...
                </p>
              </div>
            )}
          
            {/* Error State */}
            {error && (
              <div className={`border-l-4 border-red-500 p-4 rounded-lg mb-6 ${
                theme === 'light' ? 'bg-red-50' : 'bg-red-900 bg-opacity-20'
              }`}>
                <p className={`font-medium ${
                  theme === 'light' ? 'text-red-700' : 'text-red-400'
                }`}>
                  {error}
                </p>
              </div>
            )}
          
            {/* Top 3 Podium */}
            {sortedData.length >= 2 && !loading && (
              <div className={`mb-8 border-3 border-amber-600 py-8 rounded-4xl transition-all duration-300 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}>
                <h2 className={`text-2xl font-bold text-center mb-6 ${
                  theme === 'light' ? 'text-gray-800' : 'text-gray-100'
                }`}>
                  Top Performers
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {/* 2nd Place */}
                  <div className="bg-gradient-to-br from-orange-300 to-orange-200 rounded-2xl p-6 text-center shadow-lg transform hover:scale-105 transition-transform">
                    <Medal className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1">2nd</div>
                    <div className="text-lg font-semibold text-gray-800 mb-2">{sortedData[1]?.studentName}</div>
                    <div className="text-2xl font-bold text-gray-800">{sortedData[1]?.marks || 0} pts</div>
                  </div>
          
                  {/* 1st Place */}
                  <div className="bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl p-8 text-center shadow-xl transform hover:scale-105 transition-transform order-first md:order-none">
                    <Trophy className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                    <div className="text-4xl font-bold text-white mb-2">1st</div>
                    <div className="text-xl font-bold text-white mb-3">{sortedData[0]?.studentName}</div>
                    <div className="text-3xl font-bold text-white">{sortedData[0]?.marks || 0} pts</div>
                  </div>
          
                  {/* 3rd Place */}
                  <div className="bg-gradient-to-br from-orange-200 to-orange-100 rounded-2xl p-6 text-center shadow-lg transform hover:scale-105 transition-transform">
                    <Award className="w-12 h-12 text-amber-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-gray-800 mb-1">3rd</div>
                    <div className="text-lg font-semibold text-gray-800 mb-2">{sortedData[2]?.studentName}</div>
                    <div className="text-2xl font-bold text-gray-800">{sortedData[2]?.marks || 0} pts</div>
                  </div>
                </div>
              </div>
            )}
          
            {/* Full Leaderboard Table */}
            {sortedData.length > 0 && !loading && (
              <div className={`rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}>
                <div className={`px-6 py-4 ${
                  theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-blue-900 to-blue-800'
                }`}>
                  <h2 className={`text-2xl font-bold flex items-center gap-2 ${
                    theme === 'light' ? 'text-gray-500' : 'text-gray-200'
                  }`}>
                    Complete Rankings
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`${
                      theme === 'light' ? 'bg-gradient-to-r from-blue-50 to-blue-100' : 'bg-gradient-to-r from-blue-900 to-blue-800'
                    }`}>
                      <tr>
                        <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Rank
                        </th>
                        <th className={`px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Student Name
                        </th>
                        <th className={`px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider ${
                          theme === 'light' ? 'text-gray-700' : 'text-gray-300'
                        }`}>
                          Score
                        </th>
                      </tr>
                    </thead>
                    <tbody className={`${
                      theme === 'light' ? 'divide-y divide-gray-200' : 'divide-y divide-gray-700'
                    }`}>
                      {sortedData.map((entry, index) => {
                        const rank = index + 1
                        return (
                          <tr 
                            key={entry._id || index} 
                            className={`${getRankBgColor(rank)} transition-colors border-l-4 ${rank <= 3 ? 'border-orange-400' : 'border-transparent'}`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {getRankIcon(rank)}
                                <span className={`font-bold text-lg ${rank <= 3 ? (rank === 1 ? 'text-white' : 'text-gray-800') : (theme === 'light' ? 'text-gray-700' : 'text-gray-300')}`}>
                                  #{rank}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className={`font-semibold text-lg ${rank === 1 ? 'text-white' : (theme === 'light' ? 'text-gray-800' : 'text-gray-200')}`}>
                                {entry.studentName || 'Unknown Student'}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-lg font-bold ${
                                rank === 1 ? 'bg-yellow-400 bg-opacity-20 text-gray-600' : 
                                rank <= 3 ? 'bg-orange-500 bg-opacity-20 text-gray-800' : 
                                (theme === 'light' ? 'bg-gray-100 text-gray-800' : 'bg-gray-700 text-gray-200')
                              }`}>
                                {entry.marks || 0} pts
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          
            {/* Empty State */}
            {sortedData.length === 0 && exam && !loading && !error && (
              <div className={`text-center py-12 rounded-2xl shadow-lg transition-all duration-300 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}>
                <Users className={`w-16 h-16 mx-auto mb-4 ${
                  theme === 'light' ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  No Results Found
                </h3>
                <p className={`${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  No student results available for this exam.
                </p>
              </div>
            )}
          
            {/* Loading Initial State */}
            {!exam && exams.length === 0 && (
              <div className={`text-center py-12 rounded-2xl shadow-lg transition-all duration-300 ${
                theme === 'light' ? 'bg-white' : 'bg-gray-800'
              }`}>
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  theme === 'light' ? 'text-gray-600' : 'text-gray-300'
                }`}>
                  Loading Exams
                </h3>
                <p className={`${
                  theme === 'light' ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  Please wait while we load the available exams...
                </p>
              </div>
            )}
          </div>
    )
}

export default LeaderBoard