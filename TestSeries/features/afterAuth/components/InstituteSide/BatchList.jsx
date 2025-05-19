import React from 'react'
import Heading from './Heading'
import { NotepadText, Search } from 'lucide-react'

const BatchList = () => {
    const batches = [
        {
            name: "BE-4",
            year: 2025
        }
    ]

    return (
        <>
            <div className='mb-5'>
                <Heading title={"All Batches"} />
            </div>
            <div className='rounded-xl p-5 bg-gray-200 inset-shadow-md'>
                <div className='flex justify-end space-x-4 mb-5'>
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

                {/* batch list */}


                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-blue-950">
                        <thead className="text-xs text-blue-950 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="w-3/10 px-6 py-3">
                                    Batch name
                                </th>
                                <th scope="col" className="w-1/10 px-6 py-3">
                                    Year
                                </th>
                                <th scope="col" className="w-2/10 px-6 py-3">
                                    Syllabus
                                </th>

                                <th scope="col" className="w-2/10 px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        {
                            batches.map((batch, idx) => (
                                <tbody key={idx}>
                                    <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 text-blue-600 text-lg">
                                        <th scope="row" className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap ">
                                            {batch.name}
                                        </th>
                                        <td className="px-6 py-4">
                                            {batch.year}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className='flex space-x-2 hover:cursor-pointer hover:underline'>
                                                <div>
                                                    <NotepadText />
                                                </div>
                                                <span>
                                                    View Syllabus
                                                </span>
                                            </button>
                                        </td>
                                        <td className="w-fit px-6 py-4 space-x-8">
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

export default BatchList