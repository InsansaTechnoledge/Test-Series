const StatisticsCards = ({ stats, theme }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg ${
                theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800 hover:border-indigo-400/50' 
                    : 'bg-white border-gray-200 hover:border-indigo-600/50 hover:shadow-indigo-600/5'
            }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Total Exams</p>
                        <p className={`text-3xl font-bold ${
                            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                        }`}>{stats.total}</p>
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg ${
                theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800 hover:border-green-400/50' 
                    : 'bg-white border-gray-200 hover:border-green-600/50 hover:shadow-green-600/5'
            }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Current Results</p>
                        <p className={`text-3xl font-bold ${
                            theme === 'dark' ? 'text-green-400' : 'text-green-600'
                        }`}>{stats.current}</p>
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg ${
                theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800 hover:border-yellow-400/50' 
                    : 'bg-white border-gray-200 hover:border-yellow-600/50 hover:shadow-yellow-600/5'
            }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Upcoming Results</p>
                        <p className={`text-3xl font-bold ${
                            theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                        }`}>{stats.upcoming}</p>
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl p-6 border transition-all duration-200 hover:shadow-lg ${
                theme === 'dark' 
                    ? 'bg-gray-900 border-gray-800 hover:border-purple-400/50' 
                    : 'bg-white border-gray-200 hover:border-purple-600/50 hover:shadow-purple-600/5'
            }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-sm font-medium ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>Avg Score</p>
                        <p className="text-3xl font-bold text-purple-600">
                            {stats.avgMarks.toFixed(1)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StatisticsCards;