import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Calendar, ChevronDown, Edit, RefreshCw, Trash, User, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../../../contexts/currentUserContext";
import { useCachedBatches } from "../../../../../hooks/useCachedBatches";
import { useCachedStudents } from "../../../../../hooks/useCachedStudents";
import { useCachedUser } from "../../../../../hooks/useCachedUser";
import dateFormatter from "../../../../../utils/dateFormatter";

import BackButton from "../../../../constants/BackButton";
import { useTheme } from "../../../../../hooks/useTheme";

const Page = () => {
    const location = useLocation();
    const { batchId } = location.state || {};
    const { batchMap } = useCachedBatches();
    const batch = batchMap[batchId];
    const { users, userMap } = useCachedUser();
    const queryClient = useQueryClient();
    const [hideFaculty, setHideFaculty] = useState(false);
    const [hideStudents, setHideStudents] = useState(false);
    const { user } = useUser();
    const { students } = useCachedStudents();
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const navigate = useNavigate();

    const [faculty, setFaculty] = useState(() =>
        users?.filter(user => Array.isArray(user.batch) && user.batch.includes(batchId)) || []
    );

    const {theme} = useTheme();

    useEffect(() => {
        if (students && batchId) {
            const filteredStudents = students.filter(student =>
                student.batch.currentBatch === batchId ||
                student.batch.previousBatches?.includes(batchId)
            );
            setFilteredStudents(filteredStudents);
        }
    }, [students, batchId]);

    useEffect(() => {
        if (users && batchId) {
            const filteredFaculty = users.filter(
                user => Array.isArray(user.batch) && user.batch.includes(batchId)
            );
            setFaculty(filteredFaculty);
        }
    }, [users, batchId]);

    const refreshFunction = async () => {
        await queryClient.invalidateQueries(['batches', user._id]);
        await queryClient.invalidateQueries(['Users', user._id]);
    };

    if (!batch) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            {/* Animated Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 "></div>
                <div className="absolute inset-0 "></div>
                
             
                
                <div className="relative z-10 px-6 py-16">
                    <div className="max-w-7xl mx-auto">
                        {/* Back Button */}
                        {/* <button
                            onClick={() => navigate(-1)}
                            className="mb-6 inline-flex items-center space-x-2 bg-white bg-opacity-20 text-gray-700 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:bg-opacity-30 backdrop-blur-sm"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back</span>
                        </button> */}
                        <BackButton/>

                        <div className="text-center">
                            <div className="inline-flex items-center space-x-3 mb-4">
                              
                                <h1 className={`text-5xl md:text-6xl font-black ${theme === 'light' ? 'text-indigo-600' : 'text-indigo-200 '} tracking-tight`}>
                                    Batch Information
                                </h1>
                               
                            </div>
                            <p className={` ${theme === 'light' ? 'text-indigo-500' : 'text-indigo-300'} text-xl`}>
                                This is the detailed information of batch {batch.name}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                {/* Main Card */}
                <div className={` ${theme === 'light' ? 'bg-white border border-gray-100' : 'bg-gray-800'} rounded-3xl shadow-xl p-8 mb-8 `}>
                    {/* Header Section with Controls */}
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
                        <div className="flex-1">
                            <h1 className={`text-3xl font-black ${theme === 'light' ? 'text-indigo-900' : 'text-indigo-100'}  mb-2`}>
                                {batch.name}
                            </h1>
                        </div>
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                onClick={refreshFunction}
                                className="inline-flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                            >
                                <RefreshCw className="w-4 h-4" />
                            
                            </button>
                            
                            <button
                                onClick={() => navigate('/institute/edit-batch', { state: { batchId: batch.id } })}
                                className={` ${theme === 'light' ? 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700' : 'bg-indigo-600 text-indigo-100 hover:bg-indigo-700 hover:text-indigo-200' } inline-flex items-center space-x-2  px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105`}
                            >
                                <Edit className="w-4 h-4" />
                                <span>Edit Batch</span>
                            </button>
                            
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className={` ${theme === 'light' ? ' bg-red-100 hover:bg-red-200 text-red-700' : 'bg-red-600 text-red-100 hover:bg-red-700 hover:text-red-200'} inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105`}
                            >
                                <Trash className="w-4 h-4" />
                                <span>Delete Batch</span>
                            </button>
                        </div>
                    </div>

                    {/* Overview Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="space-y-4">
                            <h2 className={`text-2xl font-bold ${theme === 'light' ? 'text-indigo-900' : 'text-indigo-200'}  mb-6`}>Overview</h2>
                            
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <User className={`w-5 h-5 ${theme === 'light' ? ' text-gray-500' : 'text-indigo-600 '}`} />
                                    <span className={` ${theme === 'light' ? 'text-gray-600' : 'text-gray-100'}`}>
                                        <span className="font-medium">Created by:</span> {
                                            userMap[batch.created_by] || 
                                            (batch.created_by === user._id ? user.name : 
                                            (batch.created_by === user.organizationId ? user.organizationName : 'Unknown Creator'))
                                        }
                                    </span>
                                </div>
                                
                                <div className="flex items-center space-x-3">
                                    <Calendar className={`w-5 h-5 ${theme === 'light' ? ' text-gray-500' : 'text-indigo-600 '}`} />
                                    <span className={` ${theme === 'light' ? 'text-gray-600' : 'text-gray-100'}`}>
                                        <span className="font-medium">Year:</span> {batch.year}
                                    </span>
                                </div>
                            </div>

                            <div className="">
                                <div className="flex items-center space-x-3 mb-3">
                                    <BookOpen className={`w-5 h-5 ${theme === 'light' ? ' text-gray-500' : 'text-indigo-600 '}`} />
                                    <span className={` ${theme === 'light' ? 'text-gray-600' : 'text-gray-100'}`}>Subjects:</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {batch.subjects?.length > 0 ? 
                                        batch.subjects.map((sub, idx) => (
                                            <span key={idx} className={` ${theme === 'light' ? ' bg-indigo-600 text-indigo-100 ' : 'bg-indigo-100 text-indigo-700 '}px-4 py-2 rounded-full text-sm font-medium`}>
                                                {sub}
                                            </span>
                                        )) :
                                        <span className={`font-bold ${theme === 'light' ? ' text-gray-700' : ' text-gray-100'} mb-4`}>No subjects added yet!!</span>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-gray-600'} rounded-2xl p-6`}>
                                <h3 className={`font-bold ${theme === 'light' ? ' text-gray-700' : ' text-gray-100'} mb-4`}>Timeline</h3>
                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className={`${theme !== 'light' && 'text-gray-100'}`}>
                                        <span className={`font-bold ${theme === 'light' ? ' text-gray-700' : ' text-gray-100'} mb-4`}>Created on:</span> {dateFormatter(batch.created_at)}
                                    </div>
                                    {batch.updated_at !== batch.created_at && (
                                        <>
                                            <div className={`${theme !== 'light' && 'text-gray-100'}`}>
                                                <span className={`font-bold ${theme === 'light' ? ' text-gray-700' : ' text-gray-100'} mb-4`}>Updated at:</span> {dateFormatter(batch.updated_at)}
                                            </div>
                                            <div className={`${theme !== 'light' && 'text-gray-100'}`}>
                                                <span className={`font-bold ${theme === 'light' ? ' text-gray-700' : ' text-gray-100'} mb-4`}>Updated by:</span> {userMap[batch.updated_by]}
                                            </div>
                                        </>
                                    )}
                                </div>
                                
                                {batch.syllabus_id ? (
                                    <button 
                                        onClick={() => navigate(`/institute/syllabus/${batch.syllabus_id}`)} 
                                        className="mt-6 inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        <span>View Syllabus →</span>
                                    </button>
                                ) : (
                                    <p className={`mt-6 ${theme === 'light' ? 'text-red-600' : 'text-red-400'}  font-medium`}>Syllabus not applicable</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Faculty Section */}
                    <div className="mb-8">
                        <button
                            className={`inline-flex items-center space-x-3 ${theme === 'light' ? ' bg-indigo-600 hover:bg-indigo-700 text-white ' : ' bg-indigo-400 hover:bg-indigo-500 text-gray-200 '} px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 mb-6`}
                            onClick={() => setHideFaculty(!hideFaculty)}
                        >
                           
                            <span>
                                {hideFaculty ? "Show Assigned Faculties" : "Hide Assigned Faculties"}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${hideFaculty ? 'rotate-180' : ''}`} />
                        </button>

                        {!hideFaculty && (
                            <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-indigo-600'} rounded-2xl overflow-hidden`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className={` ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                                            <tr>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Sr. No.
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Assigned Faculty
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Email
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    User ID
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {faculty?.map((facultyMember, idx) => (
                                                <tr key={idx} className={` ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-indigo-700'} transition-colors`}>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {idx + 1}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {facultyMember.name}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {facultyMember.email}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {facultyMember.userId}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Students Section */}
                    <div>
                        <button
                            className={`inline-flex items-center space-x-3  ${theme === 'light' ? ' bg-indigo-600 hover:bg-indigo-700 text-white ' : ' bg-indigo-400 hover:bg-indigo-500 text-gray-200 '} bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 mb-6`}
                            onClick={() => setHideStudents(!hideStudents)}
                        >
                         
                            <span>
                                {hideStudents ? "Show Assigned Students" : "Hide Assigned Students"}
                            </span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${hideStudents ? 'rotate-180' : ''}`} />
                        </button>

                        {!hideStudents && (
                            <div className={`${theme === 'light' ? 'bg-gray-50' : 'bg-indigo-600'} rounded-2xl overflow-hidden`}>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead c className={` ${theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-100'}`}>
                                            <tr>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Sr. No.
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Student Name
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Email
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Current Batch
                                                </th>
                                                <th className={`px-6 py-4 text-left text-sm font-bold ${theme === 'light' ? ' text-indigo-100' : ' text-indigo-900'} uppercase tracking-wider`}>
                                                    Previous Batches
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredStudents?.map((student, idx) => (
                                                <tr key={idx} className={` ${theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-indigo-700'} transition-colors`}>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {idx + 1}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {student?.name}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {student.email}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {batchMap[student.batch?.currentBatch]?.name}
                                                    </td>
                                                    <td className={`px-6 py-4 text-sm ${theme === 'light' ? ' text-gray-900' : ' text-gray-100'} font-medium`}>
                                                        {student.batch?.previousBatch?.length > 0 
                                                            ? student.batch.previousBatch.map(prevBatchId => batchMap[prevBatchId]?.name).join(', ')
                                                            : "No previous batches"
                                                        }
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Delete Modal */}
                {showDeleteModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Batch</h3>
                                <p className="text-gray-600 mb-6">
                                    Are you sure you want to delete batch "{batch.name}"? This action cannot be undone.
                                </p>
                                <div className="flex space-x-3">
                                    <button
                                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 rounded-xl font-medium transition-colors"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-medium transition-colors"
                                        onClick={() => {
                                            setShowDeleteModal(false);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;