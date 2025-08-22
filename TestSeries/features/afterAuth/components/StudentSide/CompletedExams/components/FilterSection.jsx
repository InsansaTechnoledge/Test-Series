import { Filter, Search, Trophy } from "lucide-react";

const FiltersSection = ({ 
    searchTerm, 
    setSearchTerm, 
    statusFilter, 
    setStatusFilter, 
    filteredResultsLength, 
    activeTab, 
    theme 
}) => {
    return (
        <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
                <div className="flex items-center gap-3">
                    <Trophy className={`w-5 h-5 ${
                        theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
                    }`} />
                    <h2 className={`text-xl font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                        {activeTab === 'current' ? 'Current' : 'Upcoming'} Results ({filteredResultsLength})
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
    )
}

export default FiltersSection;