import { useLocation, useNavigate } from "react-router-dom";
import HeadingUtil from "../../../utility/HeadingUtil";
import { useCachedBatches } from "../../../../../hooks/useCachedBatches";
import { useCachedUser } from "../../../../../hooks/useCachedUser";
import RefreshButton from "../../../utility/RefreshButton";
import { ArrowDownNarrowWideIcon, Edit, Search } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import dateFormatter from "../../../../../utils/dateFormatter";
import { useEffect, useState } from "react";
import { useUser } from "../../../../../contexts/currentUserContext";
import { useCachedStudents } from "../../../../../hooks/useCachedStudents";

const BatchViewPage = () => {
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
    const [fileteredStudents, setFilteredStudents] = useState([]);
    const navigate=useNavigate();

    useEffect(() => {
        if (students && batchId) {
            const filteredStudents = students.filter(student =>
                student.batch.currentBatch === batchId ||
                student.batch.previousBatches?.includes(batchId)
            );
            setFilteredStudents(filteredStudents);

        }
    }, [students, batchId]);


    const [faculty, setFaculty] = useState(() =>
        users?.filter(user => Array.isArray(user.batch) && user.batch.includes(batchId)) || []
    );


    useEffect(() => {
        if (users && batchId) {
            const filteredFaculty = users.filter(
                user => Array.isArray(user.batch) && user.batch.includes(batchId)
            );
            setFaculty(filteredFaculty);
        }
    }, [users, batchId]);


    if (!batch) {
        return <div>Loading...</div>;
    }

    const refreshFunction = async () => {
        await queryClient.invalidateQueries(['batches', user._id]);
        await queryClient.invalidateQueries(['Users', user._id]);
    }

    return (
        <>
            <HeadingUtil heading={`Batch Information`} description={`This is the detailed information of batch ${batch.name}`} />

            <div className="p-6 space-y-6 text-gray-800">

                <div className='rounded-xl p-5 bg-gray-200 inset-shadow-md flex-grow flex flex-col overflow-auto'>

                    <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>

                        <div className='my-auto'>
                            <h1 className='font-bold text-xl text-blue-900'>{`Name :  ${batch.name}`}</h1>
                        </div>
                        <div className='flex flex-col md:flex-row gap-4'>
                            <RefreshButton refreshFunction={refreshFunction} />
                            <button className='hover:bg-gray-300 hover:cursor-pointer flex bg-gray-100 px-4 py-2 rounded-md gap-2'
                                onClick={() => navigate('/institute/edit-batch', { state: { batchId: batch.id } })}>
                                <span>
                                    Edit Batch
                                </span>
                                <div>
                                    <Edit />
                                </div>
                            </button>
                            {/* <select className='rounded-md bg-white py-2 px-4'
                                onChange={(e) => setSelectedYear(e.target.value)}>
                                <option value={""}>--select year--</option>
                                {uniqueYears.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}

                            </select> */}
                            <label className='hover:bg-gray-300 hover:cursor-pointer flex bg-gray-100 px-4 py-2 rounded-md gap-2'>
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
                    <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>
                        <div className='my-auto'>
                            <h2 className='font-bold text-lg text-blue-900'>{`Overview`}</h2>
                            <div className="text-sm text-gray-600">{`Created by : ${userMap[batch.created_by]}`}</div>
                            <div className="text-sm text-gray-600">{`Year : ${batch.year}`}</div>
                            <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                                Subjects :
                                {
                                    batch.subjects?.length > 0 ?
                                        batch.subjects?.map((sub) => (
                                            <span key={sub} className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm">
                                                {sub}
                                            </span>
                                        ))
                                        :
                                        <span>No subject added yet!!</span>}
                            </div>
                        </div>

                        <div className="my-auto">
                            <div className="text-right text-sm text-gray-600">
                                <div>{`Created on : ${dateFormatter(batch.created_at)}`}</div>
                                {
                                    batch.updated_at != batch.created_at ? null : <>
                                        <div>{`Updated at : ${userMap[batch.updated_at]}`}</div>
                                        <div>{`Updated by : ${userMap[batch.updated_by]}`}</div>
                                    </>
                                }

                                <button className="mt-2 inline-flex items-center gap-1 text-blue-600 hover:underline">
                                    View Syllabus →
                                </button>
                            </div>
                        </div>
                    </div>


                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
                            onClick={() => {
                                { }
                                // console.log("hide faculty", hideFaculty);
                                setHideFaculty(!hideFaculty);
                            }}>
                            <span className="flex items-center gap-2">
                                <span>
                                    {
                                        hideFaculty
                                            ? "Show Assigned Faculties"
                                            : "Hide Assigned Faculties"
                                    }
                                </span>
                                <ArrowDownNarrowWideIcon className="w-4 h-4" />
                            </span>
                        </button>
                        {!hideFaculty && (
                            <table className="w-full text-sm text-left rtl:text-right text-blue-950">
                                <thead className="text-xs text-blue-950 text-center uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="w-1/10 px-6 py-3">
                                            Sr. No.
                                        </th>
                                        <th scope="col" className="w-2/10 px-6 py-3">
                                            Assigned Faculty
                                        </th>
                                        <th scope="col" className="w-2/10 px-6 py-3">
                                            Email
                                        </th>
                                        <th scope="col" className="w-2/10 px-6 py-3">
                                            UserId
                                        </th>
                                        {/* <th scope="col" className="w-2/10 px-6 py-3">
                                        Role
                                    </th> */}
                                    </tr>
                                </thead>
                                {
                                    faculty?.map((faculty, idx) => (
                                        <tbody key={idx}>
                                            <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 text-lg text-gray-600 text-center">
                                                <td scope="row" className="px-6 py-4">
                                                    {idx + 1}
                                                </td>
                                                <td scope="row" className="px-6 py-4">
                                                    {faculty.name}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {faculty.email}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {faculty.userId}
                                                </td>

                                            </tr>

                                        </tbody>
                                    ))
                                }
                            </table>
                        )}
                    </div>


                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg mt-6">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
                            onClick={() => setHideStudents(!hideStudents)}
                        >
                            <span className="flex items-center gap-2">
                                <span>
                                    {hideStudents ? "Show Assigned Students" : "Hide Assigned Students"}
                                </span>
                                <ArrowDownNarrowWideIcon className="w-4 h-4" />
                            </span>
                        </button>

                        {!hideStudents && (
                            <table className="w-full text-sm text-left rtl:text-right text-blue-950">
                                <thead className="text-xs text-blue-950 text-center uppercase bg-gray-50">
                                    <tr>
                                        <th scope="col" className="w-1/10 px-6 py-3">Sr. No.</th>
                                        <th scope="col" className="w-2/10 px-6 py-3">Student Name</th>
                                        <th scope="col" className="w-2/10 px-6 py-3">Email</th>
                                        <th scope="col" className="w-2/10 px-6 py-3">currentBatch</th>
                                        <th scope="col" className="w-2/10 px-6 py-3">Previous Batches</th>
                                    </tr>
                                </thead>
                                {fileteredStudents?.map((student, idx) => (
                                    <tbody key={idx}>
                                        <tr className="bg-white border-b border-gray-200 hover:bg-gray-50 text-lg text-gray-600 text-center">
                                            <td className="px-6 py-4">{idx + 1}</td>
                                            <td className="px-6 py-4">{student.name}</td>
                                            <td className="px-6 py-4">{student.email}</td>
                                            <td className="px-6 py-4">{batchMap[student.batch?.currentBatch].name}</td>
                                            <td className="px-6 py-4">{
                                                student.batch?.previousBatch.length > 0
                                                    ? student.batch?.previousBatch.map(prevBatchId => batchMap[prevBatchId].name).join(', ')
                                                    : "No previous batches"
                                            }</td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </>

    )
};

export default BatchViewPage;
