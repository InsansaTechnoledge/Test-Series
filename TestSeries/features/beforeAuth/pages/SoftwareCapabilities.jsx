import React from 'react'
import { ChevronDown, UserRoundCog } from 'lucide-react'
import RenderSoftwareCapability from '../components/RenderSoftwareCapability';
import line from '../../../assests/Landing/SoftwareCapabilities/line.svg'

const leftCapabilities = [
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet"
    },
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad."
    },
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad."
    },
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad."
    }
];
const rightCapabilities = [
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad.Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad. "
    },
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad."
    },
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad."
    },
    {
        icon: UserRoundCog,
        title: "Unauthorized Person Detection",
        description: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Est, ad."
    }
];
const benefits = [
    {
        icon: UserRoundCog,
        title: "Improved Security Exam",
        description: "Committed to safe work and quality outcomes, proven with international accreditation."
    },
    {
        icon: UserRoundCog,
        title: "Enhanced Flexibility",
        description: "Committed to safe work and quality outcomes, proven with international accreditation."
    },
    {
        icon: UserRoundCog,
        title: "Monitor in Real-Time",
        description: "Committed to safe work and quality outcomes, proven with international accreditation."
    },
    {
        icon: UserRoundCog,
        title: "Reduced C   osts",
        description: "Committed to safe work and quality outcomes, proven with international accreditation."
    }

]

const SoftwareCapabilities = () => {
    return (
        <div className='relative overflow-hidden'>
            {/* Line */}
            {/* <img src={line} alt='line here'
            className='absolute bottom-0 left-0 -z-10 top-3/10 w-4xl '/> */}

            {/* Part: 1 */}
            <div className='rounded-lg bg-[#E4E5FF] py-26 px-16 mx-50 mb-20'>
                <h1 className='font-bold text-indigo-900 text-5xl text-center leading-snug w-5/7 mx-auto'>
                    What are the smart capabilities of
                    the software?
                </h1>
                <div className='grid grid-cols-2 mx-24 mt-14 gap-20'>
                    <div className='space-y-4'>
                        {
                            leftCapabilities.map((capability, idx) => (
                                <RenderSoftwareCapability capability={capability} idx={idx} key={idx + "left"} />
                            ))
                        }
                    </div>
                    <div className='space-y-4'>
                        {
                            rightCapabilities.map((capability, idx) => (
                                <RenderSoftwareCapability capability={capability} idx={idx} key={idx + "right"} />
                            ))
                        }
                    </div>
                </div>
            </div>

            {/* Part: 2 */}
            <div className='mx-50'>
                <h1 className='font-bold text-indigo-900 text-5xl text-center leading-snug w-5/7 mx-auto'>
                    With ExamOnline you can enjoy a range of
                    benefits
                </h1>
                <div className='grid grid-cols-4 py-20 gap-8'>
                    {
                        benefits.map((benefit, idx) => (
                            <div key={idx}
                            className='h-full'
                            >
                                <div
                                    className='border-2 border-indigo-900 rounded-t-2xl p-4 bg-[#E4E5FF]'
                                >
                                    <div className='flex space-x-4'>
                                        <div className='w-fit bg-indigo-900/10 border-indigo-900 border-2 rounded-md py-3 px-4'>
                                            <benefit.icon
                                                className='w-7 h-7'
                                            />
                                        </div>
                                        <div className='text-lg text-indigo-900 font-bold'>
                                            {benefit.title}
                                        </div>
                                    </div>
                                    <div>
                                    </div>
                                </div>
                                <div
                                className='border-2 border-t-0 border-indigo-900 rounded-b-2xl p-4 bg-[#E4E5FF]'
                                >
                                    {benefit.description}
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default SoftwareCapabilities