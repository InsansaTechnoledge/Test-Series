import { User, Users, GraduationCap, Activity, TrendingUp, Clock } from 'lucide-react'
import React from 'react'

const LogsHeader = ({OnlineStudentCount, TotalStudentCount, OnlineFacultyCount, TotalFacultyCount}) => {

    
    const totalOnline = (OnlineStudentCount || 0) + (OnlineFacultyCount || 0);
    const totalUsers = (TotalStudentCount || 0) + (TotalFacultyCount || 0);
    
    const quickLook = [
        {
            name: 'Online Students',
            icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
            onlineCount: OnlineStudentCount || 0,
            totalCount: TotalStudentCount || 0,
            
            color: 'bg-blue-50 border-blue-200',
            // iconBg: 'bg-blue-100'
        },
        {
            name: 'Online Faculty',
            icon: <Users className="w-8 h-8 text-indigo-600" />,
            onlineCount: OnlineFacultyCount || 0,
            totalCount: TotalFacultyCount || 0,
            color: 'bg-purple-50 border-purple-200',
            // iconBg: 'bg-purple-100'
        }
    ]

    return (
        <div className='bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl'>
            {/* Header Section */}
            <div className='text-center py-6 relative overflow-hidden'>
                <div className='absolute inset-0 bg-indigo-600 rounded-2xl bg-opacity-5'></div>
                <div className='relative z-10'>
                    <div className='flex items-center justify-center gap-3 mb-2'>
                        <h1 className='text-3xl font-bold'>Activity Logs</h1>
                    </div>
                    <p className='text-indigo-200 text-sm font-medium'>
                        Real-time monitoring dashboard
                    </p>
                </div>
            </div>

            

            {/* Enhanced Stats Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 py-6 px-4 gap-6 mx-auto'>
                {quickLook.map((item, index) => (
                    <div key={index} className='bg-white text-gray-800 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
                        <div className='space-y-4'>
                            {/* Header with icon and title */}
                            <div className='flex items-center justify-between'>
                                <div className='text-sm font-semibold text-gray-600 uppercase tracking-wide'>
                                    {item.name}
                                </div>
                                {item.icon}
                                {/* <div className={`${item.iconBg} rounded-lg p-2`}>
                                </div> */}
                            </div>
                            
                            {/* Main count display */}
                            <div className='flex items-baseline gap-2'>
                                <span className='text-3xl font-bold text-gray-900'>
                                    {item.onlineCount}
                                </span>
                                <span className='text-lg text-gray-500'>
                                    of {item.totalCount}
                                </span>
                            </div>
                            
                            {/* Progress bar */}
                            {/* <div className='space-y-2'>
                                <div className='flex justify-between items-center'>
                                    <span className='text-xs text-gray-500'>Activity Rate</span>
                                    <span className='text-sm font-medium text-indigo-600'>
                                        {item.percentage}%
                                    </span>
                                </div>
                                <div className='w-full bg-gray-200 rounded-full h-2'>
                                    <div 
                                        className='bg-gradient-to-r from-indigo-500 to-indigo-600 h-2 rounded-full transition-all duration-500'
                                        style={{ width: `${item.percentage}%` }}
                                    ></div>
                                </div>
                            </div> */}
                            
                            {/* Status indicator */}
                            {/* <div className='flex items-center gap-2'>
                                <div className={`w-2 h-2 rounded-full ${item.onlineCount > 0 ? 'bg-green-400' : 'bg-gray-400'} animate-pulse`}></div>
                                <span className='text-xs text-gray-500'>
                                    {item.onlineCount > 0 ? 'Currently Active' : 'No Active Users'}
                                </span>
                            </div> */}
                        </div>
                    </div>
                ))}
            </div>

            {/* Overall Stats Banner */}
            <div className='bg-indigo-500 bg-opacity-10 mx-4 rounded-xl mb-6 p-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        
                        <div>
                            <div className='text-lg font-bold'>{totalOnline} Total Online</div>
                            <div className='text-indigo-200 text-sm'>out of {totalUsers} users</div>
                        </div>
                    </div>
                    <div className='text-right'>
                        <div className='text-2xl font-bold'>
                            {totalUsers > 0 ? Math.round((totalOnline / totalUsers) * 100) : 0}%
                        </div>
                        <div className='text-indigo-200 text-sm'>Active Rate</div>
                    </div>
                </div>
            </div>
            {/* Last Updated Footer */}
            <div className='bg-indigo-700 bg-opacity-5 px-4 py-3 border-t border-white rounded-b-2xl border-opacity-10'>
                <div className='flex items-center justify-center gap-2 text-indigo-200'>
                    <Clock className="w-4 h-4" />
                    <span className='text-sm'>
                        Last updated: {new Date().toLocaleTimeString()}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default LogsHeader