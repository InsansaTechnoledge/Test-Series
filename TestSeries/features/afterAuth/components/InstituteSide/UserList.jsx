import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import { Edit, Eye, NotepadText, PlusSquare, Search, Trash } from 'lucide-react'
import HeadingUtil from '../../utility/HeadingUtil'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import {fetchUserList} from '../../../../utils/services/userService'

const UserList = () => {
    const [filteredUsers, setFilteredUsers] = useState([]);
       const [selectedYear, setSelectedYear] = useState('');
   
       const fetchUserListFunction = async () => {
           const response = await fetchUserList();
           if (response.status !== 200) {
               throw new Error('Network response was not ok');
           }
           console.log(response.data);
           setFilteredUsers(response.data);
           return response.data;
       }
   
       const { data: users = [], isLoading, isError } = useQuery({
           queryKey: ['Users'],
           queryFn: () => fetchUserListFunction(),
           refetchOnWindowFocus: false,
           refetchOnMount: false,
           staleTime: Infinity,
           cacheTime: 24 * 60 * 60 * 1000,
           retry: 0,
       });

       
   
    //    const uniqueYears = [...new Set(users.map(user => user.year))];
   
    //    useEffect(() => {
    //        if (selectedYear) {
    //            setFilteredUsers(users.filter(user => user.year === parseInt(selectedYear)));
    //        } else {
    //            setFilteredBatches(users);
    //        }
    //    }, [selectedYear]);
    const [expandedUsers, setExpandedUsers] = useState({});
    const navigate=useNavigate();

    const handleExpandedUsers = (id) => {
        setExpandedUsers(prev => ({
            ...prev,
            [id]: prev[id] ? !prev[id] : true
        }));
    }

    useEffect(() => {
        console.log(expandedUsers);
    }, [expandedUsers])

    return (
        <> 
            <div className='h-full flex flex-col'>
                <div>
                    <HeadingUtil heading="All Users" description="you can view all users of your institute and filter them based on year"/>
      
                </div>
                <div className='rounded-xl p-5 bg-gray-200 inset-shadow-md flex-grow flex flex-col overflow-auto'>
                    <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>
                        <div className='my-auto'>
                            <h2 className='font-bold text-lg text-blue-900'>Total Users: {users.length}</h2>
                        </div>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <button className='bg-blue-900 text-white py-2 px-4 rounded-md hover:cursor-pointer font-semibold hover:scale-105 flex space-x-2 transition-all duration-300'
                            onClick={()=>{
                                navigate('/institute/create-user')
                            }}>
                                <span>
                                    Add User
                                </span>
                                <div>
                                    <PlusSquare />
                                </div>
                            </button>
                            <select className='rounded-md bg-white py-2 px-4'>
                                <option>--select year--</option>
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
                                users.map((user, idx) => (
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
                                                                            {batch}
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
                                                                        {batch}
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
                                                    {user.roleId}
                                                </div>
                                            </td>
                                            <td className="flex justify-center mx-auto w-fit px-6 py-4 gap-8">
                                                <button
                                                    className="font-medium text-black hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                    <Eye/>
                                                </button>
                                                <button
                                                    className="font-medium text-blue-500 hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                    <Edit/>
                                                </button>
                                                <button
                                                    className="font-medium text-red-500 hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                    <Trash/>
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