import Heading from './Heading'
import { useQuery } from '@tanstack/react-query'
import { fetchBatchList } from '../../../../utils/services/batchService';
import { LucidePlusSquare, NotepadText, PlusSquare, Search } from 'lucide-react'
import { useEffect, useState } from 'react';

const BatchList = () => {

    const [filteredBatches, setFilteredBatches] = useState([]);
    const [selectedYear, setSelectedYear] = useState('');

    const fetchBatchListFunction = async () => {
        const response = await fetchBatchList();
        if (response.status !== 200) {
            throw new Error('Network response was not ok');
        }
        console.log(response.data);
        setFilteredBatches(response.data);
        return response.data;
    }

    const { data: batches = [], isLoading, isError } = useQuery({
        queryKey: ['batches'],
        queryFn: () => fetchBatchListFunction(),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        staleTime: Infinity,
        cacheTime: 24 * 60 * 60 * 1000,
        retry: 0,
    });



    const uniqueYears = [...new Set(batches.map(batch => batch.year))];

    useEffect(() => {
        if (selectedYear) {
            setFilteredBatches(batches.filter(batch => batch.year === parseInt(selectedYear)));
        } else {
            setFilteredBatches(batches);
        }
    }, [selectedYear]);


    // const batches = [
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    //     {
    //         name: "BE-4",
    //         year: 2025,

    //     },
    // ]

    return (
        <>
            <div className='h-full flex flex-col'>
                <div className='mb-5'>
                    <Heading title={selectedYear ? `Batch List for ${selectedYear}` : "All Batches"}
                    />
                </div>
                <div className='rounded-xl p-5 bg-gray-200 inset-shadow-md flex-grow flex flex-col overflow-auto'>
                    <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>
                        <div className='my-auto'>
                            <h2 className='font-bold text-lg text-blue-900'>Total Batches: {filteredBatches?.length}</h2>
                        </div>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <button className='bg-blue-900 text-white py-2 px-4 rounded-md hover:cursor-pointer font-semibold hover:scale-105 flex space-x-2 transition-all duration-300'>
                                <span>
                                    Create Batch
                                </span>
                                <div>
                                    <PlusSquare />
                                </div>
                            </button>
                            <select className='rounded-md bg-white py-2 px-4'
                                onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value={""}>--select year--</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
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

                    {/* batch list */}


                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-blue-950">
                            <thead className="text-xs text-blue-950 text-center uppercase bg-gray-50">
                                <tr>
                                    <th scope="col" className="w-2/10 px-6 py-3">
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
                                filteredBatches?.map((batch, idx) => (
                                    <tbody key={idx}>
                                        <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 text-blue-600 text-lg">
                                            <th scope="row" className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap ">
                                                {batch.name}
                                            </th>
                                            <td className="px-6 py-4 text-center">
                                                {batch.year}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className='mx-auto flex space-x-2 hover:cursor-pointer hover:underline'>
                                                    <div className='my-auto'>
                                                        <NotepadText />
                                                    </div>
                                                    <span>
                                                        View Syllabus
                                                    </span>
                                                </button>
                                            </td>
                                            <td className="mx-auto w-fit px-6 py-4  flex flex-wrap justify-center gap-8">

                                                <button
                                                    className=" font-medium text-black hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer">
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
            </div>

        </>
    )
}

export default BatchList