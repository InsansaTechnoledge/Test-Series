import { BarChart3, Calendar, CheckCircle, Clock, Eye, XCircle } from "lucide-react"
import dateFormatter from '../../../../../../utils/dateFormatter'

const ResultsTable = ({ results, theme, navigate, activeTab }) => {
    const getStatusIcon = (status) => { 
        switch (status.toLowerCase()) {
            case 'attempted':
                return <CheckCircle className="w-4 h-4" />
            case 'unattempted':
                return <Clock className="w-4 h-4" />
            case 'failed':
                return <XCircle className="w-4 h-4" />
            default:
                return <Clock className="w-4 h-4" />
        }
    }

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'attempted':
                return theme === 'dark' 
                    ? 'bg-green-900/30 text-green-400 border-green-400/30' 
                    : 'bg-green-50 text-green-700 border-green-200'
            case 'unattempted':
                return theme === 'dark' 
                    ? 'bg-yellow-900/30 text-yellow-400 border-yellow-400/30' 
                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
            case 'failed':
                return theme === 'dark' 
                    ? 'bg-red-900/30 text-red-400 border-red-400/30' 
                    : 'bg-red-50 text-red-700 border-red-200'
            default:
                return theme === 'dark' 
                    ? 'bg-gray-800 text-gray-400 border-gray-600' 
                    : 'bg-gray-50 text-gray-700 border-gray-200'
        }
    }

    return (
        <div className={`rounded-2xl border overflow-hidden ${
            theme === 'dark' 
                ? 'bg-gray-900 border-gray-800' 
                : 'bg-white border-gray-200'
        }`}>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className={`${
                        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
                    }`}>
                        <tr>
                            <th className={`px-6 py-4 text-left text-sm font-semibold ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Exam Name
                            </th>
                            <th className={`px-6 py-4 text-center text-sm font-semibold ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Type
                            </th>
                            <th className={`px-6 py-4 text-center text-sm font-semibold ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Status
                            </th>
                            {activeTab === 'current' && (
                                <th className={`px-6 py-4 text-center text-sm font-semibold ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                }`}>
                                    Score
                                </th>
                            )}
                            <th className={`px-6 py-4 text-center text-sm font-semibold ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Date
                            </th>
                            <th className={`px-6 py-4 text-center text-sm font-semibold ${
                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                        {results.length === 0 ? (
                            <tr>
                                <td colSpan={activeTab === 'current' ? "6" : "5"} className="px-6 py-12 text-center">
                                    <div className="flex flex-col items-center">
                                        <BarChart3 className={`w-12 h-12 mb-4 ${
                                            theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                        }`} />
                                        <p className={`text-lg font-medium ${
                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            No {activeTab} results found
                                        </p>
                                        <p className={`text-sm ${
                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                        }`}>
                                            Try adjusting your search or filter criteria
                                        </p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            results.map((result, idx) => (
                                <tr key={idx} className={`transition-colors duration-200 ${
                                    theme === 'dark' 
                                        ? 'hover:bg-gray-800/50' 
                                        : 'hover:bg-gray-50'
                                }`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className={`w-2 h-2 rounded-full mr-3 ${
                                                result.status === 'Attempted' 
                                                    ? 'bg-green-500' 
                                                    : result.status === 'Unattempted' 
                                                    ? 'bg-yellow-500' 
                                                    : 'bg-red-500'
                                            }`}></div>
                                            <div>
                                                <p className={`font-semibold ${
                                                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                                                }`}>
                                                    {result.examName || "No data"}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${
                                            theme === 'dark' 
                                                ? 'bg-blue-900/30 text-blue-400 border-blue-400/30' 
                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                            {result.examType || "Unknown"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(result.status)}`}>
                                            {getStatusIcon(result.status)}
                                            {result.status}
                                        </span>
                                    </td>
                                    {activeTab === 'current' && (
                                        <td className="px-6 py-4 text-center">
                                            {result.status.toLowerCase() === 'attempted' ? (
                                                <div className="flex flex-col items-center">
                                                    <span className={`text-2xl font-bold ${
                                                        result.marks >= 80 
                                                            ? 'text-green-600' 
                                                            : result.marks >= 60 
                                                            ? 'text-yellow-600' 
                                                            : 'text-red-600'
                                                    }`}>
                                                        {result.marks}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className={`text-2xl font-bold ${
                                                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                                }`}>
                                                    -
                                                </span>
                                            )}
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <Calendar className={`w-4 h-4 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`} />
                                            <span className={`text-sm ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                            }`}>
                                                {dateFormatter(result.resultDate).split(' ')[0]}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {activeTab === 'current' ? (
                                            <button
                                                onClick={() => navigate(`/student/result/${result.examId}?name=${encodeURIComponent(result.examName)}&resultId=${result._id}`)}
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                                    theme === 'dark' 
                                                        ? 'bg-indigo-400 hover:bg-indigo-300 text-gray-900 focus:ring-indigo-400 focus:ring-offset-gray-900' 
                                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-600 focus:ring-offset-white'
                                                }`}
                                            >
                                                <Eye className="w-4 h-4" />
                                                View Details
                                            </button>
                                        ) : (
                                            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
                                                theme === 'dark' 
                                                    ? 'bg-gray-800 text-gray-400 border border-gray-700' 
                                                    : 'bg-gray-100 text-gray-500 border border-gray-300'
                                            }`}>
                                                <Clock className="w-4 h-4" />
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ResultsTable;