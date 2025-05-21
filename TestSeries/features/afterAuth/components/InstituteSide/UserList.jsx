import React, { useEffect, useState } from 'react'
import { Edit, Eye, PlusSquare, Search, Trash } from 'lucide-react'
import HeadingUtil from '../../utility/HeadingUtil'
import { useNavigate } from 'react-router-dom'
import RefreshButton from '../../utility/RefreshButton'
import { useCachedUser } from '../../../../hooks/useCachedUser'
import { useCachedBatches } from '../../../../hooks/useCachedBatches'
import { useCachedRoleGroup } from '../../../../hooks/useCachedRoleGroup'
import { useQueryClient } from '@tanstack/react-query'
import { useUser } from '../../../../contexts/currentUserContext'

const UserList = () => {
    const {user} = useUser();
    const { users, isLoading, isError } = useCachedUser();
    const { batches } = useCachedBatches();
    const { roleGroups, rolesLoading } = useCachedRoleGroup();
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [selectedBatch, setSelectedBatch] = useState('');
    const queryClient = useQueryClient();

    const refreshFunction = () => {
        queryClient.invalidateQueries(['Users', user._id]);
        queryClient.invalidateQueries(['roleGroups', user._id]);
        queryClient.invalidateQueries(['batches', user._id]);
    }

    useEffect(()=>{
        if(users){
            setFilteredUsers(users);
        }
    },[users])

    const uniqueYears = [...new Set(batches.map(batch => batch.year))];

    useEffect(() => {
        if (selectedBatch) {
            setFilteredUsers(users.filter(user => user.batch?.includes(selectedBatch)));
        } else {
            setFilteredUsers(users);
        }
    }, [selectedBatch]);

    const [expandedUsers, setExpandedUsers] = useState(filteredUsers);
    const navigate = useNavigate();

    const handleExpandedUsers = (id) => {
        setExpandedUsers(prev => ({
            ...prev,
            [id]: prev[id] ? !prev[id] : true
        }));
    }

    const batchMap = Object.fromEntries(batches?.map(b => [b.id, b]));
    const roleMap = Object.fromEntries(roleGroups?.map(r => [r._id, r]));


    return (
        <>
            <div className='h-full flex flex-col'>
                <div>
                    <HeadingUtil heading="All Users" description="you can view all users of your institute and filter them based on year" />

                </div>
                <div className='rounded-xl p-5 bg-gray-200 inset-shadow-md flex-grow flex flex-col overflow-auto'>
                    <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>
                        <div className='my-auto'>
                            <h2 className='font-bold text-lg text-blue-900'>Total Users: {filteredUsers.length}</h2>
                        </div>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <RefreshButton refreshFunction={refreshFunction}/>
                            <button className='bg-blue-900 text-white py-2 px-4 rounded-md hover:cursor-pointer font-semibold hover:scale-105 flex space-x-2 transition-all duration-300'
                                onClick={() => {
                                    navigate('/institute/create-user')
                                }}>
                                <span>
                                    Add User
                                </span>
                                <div>
                                    <PlusSquare />
                                </div>
                            </button>
                            <select className='rounded-md bg-white py-2 px-4'
                                onChange={(e) => setSelectedBatch(e.target.value)}>
                                <option value=''>--select Batch--</option>
                                {batches.map(batch => (
                                    <option key={batch.id} value={batch.id}>{batch.name}</option>
                                ))}
                            </select>
                            <label className='space-x-2 flex rounded-md bg-white py-2 px-4'>
                                <div>
                                    <Search />
                                </div>
                                <input

                                    className='focus: outline-0'
                                    placeholder='search batch'
                                />
                            </label>
                        </div>
                    </div>

                    {/* user list */}


                    <div className="relative overflow-auto shadow-md sm:rounded-lg h-[100%]">
                        <table className="w-full text-sm text-left rtl:text-right text-blue-950">
                            <thead className="text-xs text-blue-950 uppercase bg-gray-50">
                                <tr className='text-center'>
                                    <th scope="col" className="w-2/10 px-6 py-3">
                                        Name
                                    </th>
                                    <th scope="col" className="w-2/10 px-6 py-3">
                                        Batches allotted
                                    </th>
                                    <th scope="col" className="w-1/10 px-6 py-3">
                                        Role
                                    </th>

                                    <th scope="col" className="w-2/10 px-6 py-3">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            {
                                filteredUsers.map((user, idx) => (
                                    <tbody key={idx}>
                                        <tr className=" bg-white border-b border-gray-200 hover:bg-gray-50 text-blue-600 text-lg">
                                            <th scope="row" className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap ">
                                                {user.name}
                                            </th>
                                            <td className="px-6 py-4 ">
                                                <div className='flex justify-center flex-wrap gap-2 w-full'>
                                                    {
                                                        // expandedUsers?.user?._id
                                                        expandedUsers[user._id || true]
                                                            ?
                                                            <>
                                                                {
                                                                    user.batch?.map((batch, idx) => (
                                                                        <div key={idx}
                                                                            className='flex rounded-md bg-blue-50  px-4 py-1'
                                                                        >
                                                                            {batchMap[batch]?.name} - {batchMap[batch]?.year}
                                                                        </div>
                                                                    ))
                                                                }
                                                                <div
                                                                    className='my-auto hover:cursor-pointer hover:underline'
                                                                    onClick={() => handleExpandedUsers(user?._id)}
                                                                >
                                                                    ...hide extra
                                                                </div>
                                                            </>
                                                            :
                                                            <>
                                                                {user.batch?.slice(0, 2).map((batch, idx) => (
                                                                    <div key={idx}
                                                                        className='flex rounded-md bg-blue-50  px-4 py-1'
                                                                    >
                                                                        {batchMap[batch]?.name} - {batchMap[batch]?.year}
                                                                    </div>

                                                                ))}
                                                                {
                                                                    user.batch?.length > 2 &&
                                                                    <div
                                                                        className='my-auto hover:cursor-pointer hover:underline'
                                                                        onClick={() => handleExpandedUsers(user?._id)}
                                                                    >
                                                                        ... + {user.batch?.length - 2} more
                                                                    </div>
                                                                }
                                                            </>

                                                    }
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 ">
                                                <div className='mx-auto py-1 px-4 rounded-full bg-blue-50 w-fit'>
                                                    {roleMap[user.roleId]?.name}
                                                </div>
                                            </td>
                                            <td className="flex justify-center mx-auto w-fit px-6 py-4 gap-8">
                                                <button
                                                    className="font-medium text-black hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                    <Eye />
                                                </button>
                                                <button
                                                    className="font-medium text-blue-500 hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                    <Edit />
                                                </button>
                                                <button
                                                    className="font-medium text-red-500 hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                    <Trash />
                                                </button>
                                            </td>
                                        </tr>

                                    </tbody>
                                ))
                            }
                        </table>
                    </div>


                </div>
            </div>
        </>
    )
}

export default UserList