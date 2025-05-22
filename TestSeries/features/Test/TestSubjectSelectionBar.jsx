import React from 'react'
import {ArrowLeft, ArrowRight, Check, ChevronRight} from 'lucide-react'

const TestSubjectSelectionBar = ({setSubjectSelectionVisible, eventDetails, selectedSubject, setSelectedSubject}) => {

    return (
        <div className='flex flex-col justify-between w-fit bg-gray-50 '>
            <div>
            <h1 className='font-bold text-nowrap text-xl border-b-2 p-5'>
                Subject Selection
            </h1>
            <div className='flex flex-col overflow-auto'>
                {
                    eventDetails.subjects.map((sub,idx) => (
                        <button 
                        key={idx}
                        onClick={()=>setSelectedSubject(sub)}
                        className='flex justify-between py-2 border-b text-lg font-semibold px-2'>
                            <span>
                                {sub}
                            </span>
                            <span>
                                {
                                    selectedSubject==sub
                                    ?
                                    <Check />
                                    :
                                    <ChevronRight />

                                }
                            </span>
                        </button>
                    ))
                }
            </div>
                </div>
            <button 
            onClick={()=>setSubjectSelectionVisible(false)}
            className='mb-5 mx-auto border h-min w-fit px-4 py-2 bg-purple-600 text-white rounded-md'>Hide Subject selection</button>
        </div>
    )
}

export default TestSubjectSelectionBar