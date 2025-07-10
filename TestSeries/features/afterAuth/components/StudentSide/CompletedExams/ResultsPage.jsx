import React, { useState, useEffect } from 'react'
import HeadingUtil from '../../../utility/HeadingUtil'
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent'
import { Eye, Search, Filter, Calendar, Trophy, TrendingUp, CheckCircle, Clock, XCircle, BarChart3 } from 'lucide-react'
import dateFormatter from '../../../../../utils/dateFormatter'
import { getStudentResults } from '../../../../../utils/services/resultPage'
import { useNavigate } from 'react-router-dom'
import useStudentExamResults from './useExamResults'
import { useUser } from '../../../../../contexts/currentUserContext'
import { useTheme } from '../../../../../hooks/useTheme'
const ResultsPage = () => {
    const { user } = useUser()
    const { theme } = useTheme()
    const { results } = useStudentExamResults(user._id)
    const [loading, setLoading] = useState(true)
    const [selectedResult, setSelectedResult] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const navigate = useNavigate()
    const question = ""
    const answer = ""

    // Filter results based on search and status
    const filteredResults = results.filter(result => {
        const matchesSearch = result.examName?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || result.status.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    console.log("Filtered Results:", filteredResults)

    // Calculate statistics
    const stats = {
        total: results.length,
        attempted: results.filter(r => r.status === 'attempted').length,
        unattempted: results.filter(r => r.status === 'Unattempted').length,
        failed: results.filter(r => r.status === 'Failed').length,
        avgMarks: results.filter(r => r.status === 'attempted').reduce((acc, r) => acc + (r.marks || 0), 0) / Math.max(1, results.filter(r => r.status === 'attempted').length)
    }

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
        <div className={`min-h-screen transition-colors duration-200 ${
            theme === 'dark' ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'
        }`}>
            <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <HeadingUtil 
                        heading="Exam Results Dashboard" 
                        description="Track your academic performance and view detailed analytics for all completed exams" 
                    />
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
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

                {/* Need Help Component */}
                <div className="mb-8">
                    <NeedHelpComponent 
                        heading="What can you check for?" 
                        about="Detailed analytics for exam performance and insights" 
                        question={question} 
                        answer={answer} 
                    />
                </div>

                {/* Filters and Search */}
                <div className={`rounded-2xl p-6 border mb-8 ${
                    theme === 'dark' 
                        ? 'bg-gray-900 border-gray-800' 
                        : 'bg-white border-gray-200'
                }`}>
                    <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                        <div className="flex items-center gap-3">
                            <Trophy className={`w-5 h-5 ${
                                theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                            }`} />
                            <h2 className={`text-xl font-bold ${
                                theme === 'dark' ? 'text-white' : 'text-gray-900'
                            }`}>
                                Exam Results ({filteredResults.length})
                            </h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                            {/* Search */}
                            <div className="relative">
                                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <input
                                    type="text"
                                    placeholder="Search exams..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`pl-10 pr-4 py-2.5 rounded-xl border transition-colors duration-200 focus:outline-none focus:ring-2 w-full sm:w-64 ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-400/50 focus:border-indigo-400' 
                                            : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-indigo-600/50 focus:border-indigo-600'
                                    }`}
                                />
                            </div>

                            {/* Status Filter */}
                            <div className="relative">
                                <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className={`pl-10 pr-8 py-2.5 rounded-xl border transition-colors duration-200 focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
                                        theme === 'dark' 
                                            ? 'bg-gray-800 border-gray-700 text-white focus:ring-indigo-400/50 focus:border-indigo-400' 
                                            : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-indigo-600/50 focus:border-indigo-600'
                                    }`}
                                >
                                    <option value="all">All Status</option>
                                    <option value="attempted">Attempted</option>
                                    <option value="unattempted">Unattempted</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Table */}
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
                                        Status
                                    </th>
                                    <th className={`px-6 py-4 text-center text-sm font-semibold ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        Score
                                    </th>
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
                                {filteredResults.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <BarChart3 className={`w-12 h-12 mb-4 ${
                                                    theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                                                }`} />
                                                <p className={`text-lg font-medium ${
                                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}>
                                                    No results found
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
                                    filteredResults.map((result, idx) => (
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
                                                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(result.status)}`}>
                                                    {getStatusIcon(result.status)}
                                                    {result.status}
                                                </span>
                                            </td>
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
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResultsPage