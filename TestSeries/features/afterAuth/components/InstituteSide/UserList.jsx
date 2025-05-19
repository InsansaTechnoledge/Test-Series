import React, { useEffect, useState } from 'react'
import Heading from './Heading'
import { NotepadText, PlusSquare, Search } from 'lucide-react'

const UserList = () => {
    const users = [
        {
            _id: 1,
            name: "User Demo",
            role: "Admin",
            batches: ["batch1", "batch2", "batch1", "batch2", "batch1", "batch2", "batch1", "batch2"]
        },
        {
            _id: 2,
            name: "User Demo",
            role: "Admin",
            batches: ["batch2", "batch1", "batch2", "batch1", "batch2"]
        },
        {
            _id: 3,
            name: "User Demo",
            role: "Admin",
            batches: ["batch1", "batch2", "batch1", "batch2", "batch1", "batch2", "batch1", "batch2"]
        },
    ]

    const [expandedUsers, setExpandedUsers] = useState({});

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
            <div className='mb-5'>
                <Heading title={"All Users"} />
            </div>
            <div className='rounded-xl p-5 bg-gray-200 inset-shadow-md'>
                <div className='flex justify-between space-x-4 mb-5'>
                    <div className='my-auto'>
                        <h2 className='font-bold text-lg text-blue-900'>Total Users: {users.length}</h2>
                    </div>
                    <div className='flex space-x-4'>
                        <button className='bg-blue-900 text-white py-2 px-4 rounded-md hover:cursor-pointer font-semibold hover:scale-105 flex space-x-2 transition-all duration-300'>
                            <span>
                                Add Admin 
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


                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                                                user.batches.map((batch, idx) => (
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
                                                            {user.batches.slice(0, 2).map((batch, idx) => (
                                                                <div key={idx}
                                                                    className='flex rounded-md bg-blue-50  px-4 py-1'
                                                                >
                                                                    {batch}
                                                                </div>

                                                            ))}
                                                            <div
                                                                className='my-auto hover:cursor-pointer hover:underline'
                                                                onClick={() => handleExpandedUsers(user?._id)}
                                                            >
                                                                ...{user.batches.length - 2} more
                                                            </div>
                                                        </>

                                                }
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 flex justify-center">
                                            <div className='py-1 px-4 rounded-full bg-blue-50 w-fit'>
                                                {user.role}
                                            </div>
                                        </td>
                                        <td className="text-center w-fit px-6 py-4 space-x-8">
                                            <button
                                                className="font-medium text-black hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                view
                                            </button>
                                            <button
                                                className="font-medium text-blue-500 hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                Edit
                                            </button>
                                            <button
                                                className="font-medium text-red-500 hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>

                                </tbody>
                            ))
                        }
                    </table>
                </div>


            </div>
        </>
    )
}

export default UserList