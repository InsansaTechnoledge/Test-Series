import React, { useState, useEffect } from 'react'
import HeadingUtil from '../../../utility/HeadingUtil'
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent'
import { Trophy, BarChart3, Clock, CheckCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useStudentExamResults from './useExamResults'
import { useUser } from '../../../../../contexts/currentUserContext'
import { useTheme } from '../../../../../hooks/useTheme'
import StatisticsCards from './ResultsComponents/StatisticCards'
import FiltersSection from './ResultsComponents/FilterSection'
import ResultsTable from './ResultsComponents/ResultTable'

const ResultsPage = () => {
    const { user } = useUser()
    const { theme } = useTheme()
    const { results } = useStudentExamResults(user._id)
    const [loading, setLoading] = useState(true)
    const [selectedResult, setSelectedResult] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [activeTab, setActiveTab] = useState('current')
    const navigate = useNavigate()
    const question = ""
    const answer = ""

    // Separate current and upcoming results
    const currentResults = results.filter(result => {
        const isFullResult = (result.examType === "subjective" || result.examType === "semi_subjective") 
            ? result.examStatus === "published" 
            : result.examType === "objective"
        return isFullResult
    })

    const upcomingResults = results.filter(result => {
        const isFullResult = (result.examType === "subjective" || result.examType === "semi_subjective") 
            ? result.examStatus === "published" 
            : result.examType === "objective"
        return !isFullResult
    })

    // Filter results based on active tab, search and status
    const getFilteredResults = (resultsList) => {
        return resultsList.filter(result => {
            const matchesSearch = result.examName?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === 'all' || result.status.toLowerCase() === statusFilter.toLowerCase()
            return matchesSearch && matchesStatus
        })
    }

    const filteredCurrentResults = getFilteredResults(currentResults)
    const filteredUpcomingResults = getFilteredResults(upcomingResults)
    const filteredResults = activeTab === 'current' ? filteredCurrentResults : filteredUpcomingResults

    console.log("Current Results:", filteredCurrentResults)
    console.log("Upcoming Results:", filteredUpcomingResults)

    // Calculate statistics
    const stats = {
        total: results.length,
        current: currentResults.length,
        upcoming: upcomingResults.length,
        attempted: currentResults.filter(r => r.status === 'attempted').length,
        unattempted: currentResults.filter(r => r.status === 'Unattempted').length,
        failed: currentResults.filter(r => r.status === 'Failed').length,
        avgMarks: currentResults.filter(r => r.status === 'attempted').reduce((acc, r) => acc + (r.marks || 0), 0) / Math.max(1, currentResults.filter(r => r.status === 'attempted').length)
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
                <StatisticsCards stats={stats} theme={theme} />

                {/* Need Help Component */}
                <div className="mb-8">
                    <NeedHelpComponent 
                        heading="What can you check for?" 
                        about="Detailed analytics for exam performance and insights" 
                        question={question} 
                        answer={answer} 
                    />
                </div>

                {/* Tab Navigation */}
                <div className={`rounded-2xl border mb-8 ${
                    theme === 'dark' 
                        ? 'bg-gray-900 border-gray-800' 
                        : 'bg-white border-gray-200'
                }`}>
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        <button
                            onClick={() => setActiveTab('current')}
                            className={`px-6 py-4 font-medium text-sm rounded-tl-2xl transition-colors duration-200 flex items-center gap-2 ${
                                activeTab === 'current'
                                    ? theme === 'dark'
                                        ? 'bg-indigo-900/50 text-indigo-400 border-b-2 border-indigo-400'
                                        : 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            Current Results ({currentResults.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-6 py-4 font-medium text-sm transition-colors duration-200 flex items-center gap-2 ${
                                activeTab === 'upcoming'
                                    ? theme === 'dark'
                                        ? 'bg-indigo-900/50 text-indigo-400 border-b-2 border-indigo-400'
                                        : 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                                    : theme === 'dark'
                                        ? 'text-gray-400 hover:text-gray-300'
                                        : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            Upcoming Results ({upcomingResults.length})
                        </button>
                    </div>

                    {/* Filters and Search */}
                    <FiltersSection
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        filteredResultsLength={filteredResults.length}
                        activeTab={activeTab}
                        theme={theme}
                    />
                </div>

                {/* Results Table */}
                <ResultsTable
                    results={filteredResults}
                    theme={theme}
                    navigate={navigate}
                    activeTab={activeTab}
                />
            </div>
        </div>
    )
}

export default ResultsPage