import React, {useState , useEffect} from 'react'
import HeadingUtil from '../../../utility/HeadingUtil'
import NeedHelpComponent from '../../InstituteSide/components/NeedHelpComponent'
import { Eye, Search } from 'lucide-react'
import dateFormatter from '../../../../../utils/dateFormatter'
import { getStudentResults } from '../../../../../utils/services/resultPage'
import { useNavigate } from 'react-router-dom';
import useStudentExamResults from './useExamResults'
import { useUser } from '../../../../../contexts/currentUserContext'

const ResultsPage = () => {

    // const [results, setResults] = useState([]);
    const {user}=useUser();
    const { results } = useStudentExamResults(user._id);
    const [loading, setLoading] = useState(true);
    const [selectedResult, setSelectedResult] = useState(null);
    const navigate = useNavigate();

    const question = ""
    const answer = ""

    return (
        <div>
            <HeadingUtil heading="Completed Exams" description="You can check results for the completed exams from here" />
            <div className="max-w-6xl mx-auto">
                <NeedHelpComponent heading="What can you check for ?" about="Detailed analytics for exam" question={question} answer={answer} />
            </div>

            <div className='rounded-xl p-5 bg-blue-100 inset-shadow-md flex-grow flex flex-col overflow-auto'>
                    <div className='flex flex-col lg:flex-row justify-between gap-4 mb-5'>
                        <div className='my-auto'>
                            <h2 className='font-bold text-lg text-blue-900'>Total Results: {results.length}</h2>
                        </div>
                        <div className='flex flex-col md:flex-row gap-4'>
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
                                        Status
                                    </th>
                                    <th scope="col" className="w-1/10 px-6 py-3">
                                        Marks
                                    </th>

                                    <th scope="col" className="w-2/10 px-6 py-3">
                                        Date of Exam
                                    </th>
                                    <th scope="col" className="w-2/10 px-6 py-3">
                                        Detailed Analysis
                                    </th>
                                </tr>
                            </thead>
                            {
                                results.map((result, idx) => (
                                    <tbody key={idx}>
                                        <tr className=" bg-white border-b border-gray-200 hover:bg-gray-50 text-blue-600 text-lg">
                                            <th scope="row" className="px-6 py-4 font-medium text-blue-600 whitespace-nowrap ">
                                                {result.examName}
                                            </th>
                                            <td className="px-4 text-sm py-2 justify-center">
                                                <div className={`px-4 mx-auto py-2 rounded-full ${result.status==="Attempted" ? 'bg-green-100 text-green-800' : result.status==="Unattempted" ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"} w-fit`}>
                                                    {result.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {
                                                    result.status==="attempted"
                                                    ?
                                                    `${result.marks}`
                                                    :
                                                    "-"
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {dateFormatter(result.resultDate).split(' ')[0]}
                                            </td>
                                            <td className="flex justify-center mx-auto w-fit px-6 py-4 gap-8">
                                            <button
                                           onClick={() => navigate(`/student/result/${result.examId}?name=${encodeURIComponent(result.examName)}`)}

                                            className="font-medium text-black hover:underline bg-gray-200 py-1 px-4 rounded-lg hover:cursor-pointer"
                                            >
                                            <Eye />
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
    )
}

export default ResultsPage