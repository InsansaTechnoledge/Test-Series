import { ChevronDown } from 'lucide-react'
import React from 'react'

const RenderSoftwareCapability = ({ capability, idx }) => {
    return (
        <div key={idx}>
            <div className='flex space-x-2'>
                <div className='bg-indigo-900/10 border-indigo-900 border-2 rounded-md py-3 px-4'>
                    <capability.icon
                        className=''
                    />
                </div>

                <div className="group">
                    <div className="w-full flex relative justify-center text-indigo-900
                  border-indigo-900 border-2 rounded-md p-3 bg-indigo-900/10">
                        <span className="text-xl font-semibold my-auto">
                            {capability.title}
                        </span>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2" />
                    </div>

                    <div className="max-h-0 group-hover:max-h-[1000px] transition-[max-height] duration-500 ease-in-out
                                        overflow-hidden w-full relative">
                        <div className="p-3 bg-indigo-900/10 mt-2  border-indigo-900 border-2 rounded-md text-indigo-900 text-xl font-semibold">
                            {capability.description}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

export default RenderSoftwareCapability