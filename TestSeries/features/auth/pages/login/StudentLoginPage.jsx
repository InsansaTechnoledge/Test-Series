import { ArrowRight, CheckCircle, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'

const StudentLoginPage = (props) => {
    const navigate = useNavigate();
    return (
        <div>
            <div className='bg-gradient-to-b from-blue-50 to-white grid lg:grid-cols-12 gap-20 px-20 pt-20 min-h-screen'>
                <div className='lg:col-span-5'>
                    <div className='bg-blue-600 p-3 w-fit h-fit rounded-full'>
                        <UserRound className='w-7 h-7 text-white' />
                    </div>
                    <h1 className='mt-5 text-indigo-950 font-bold text-5xl'>
                        Student Login
                    </h1>
                    <div className=''>
                        <div className='px-8 py-4 rounded-lg bg-blue-500/30 w-fit my-10'>
                            <div className='space-y-2'>
                                <div className='flex space-x-2'>
                                    <CheckCircle />
                                    <span>
                                        Lorem ipsum dolor sit amet.
                                    </span>
                                </div>
                                <div className='flex space-x-2'>
                                    <CheckCircle />
                                    <span>
                                        Lorem ipsum dolor sit amet.
                                    </span>
                                </div>
                                <div className='flex space-x-2'>
                                    <CheckCircle />
                                    <span>
                                        Lorem ipsum dolor sit amet.
                                    </span>
                                </div>
                            </div>
                        </div>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi dolorem earum officia excepturi et omnis corrupti sapiente. Voluptatum, quaerat animi.
                    </div>

                    <div className='flex space-x-2 mt-10 w-fit'>
                        <h2 className='my-auto text-indigo-950 font-semibold text-lg'>Are you an Institute?</h2>
                        <button
                            onClick={() => { navigate('/login?role=Institute') }}
                            className='hover:cursor-pointer my-auto group py-2 px-6 bg-indigo-950 text-white rounded-lg'>
                            <div className='flex space-x-2'>
                                <span>
                                    Institute Login
                                </span>
                                <ArrowRight className='group-hover:translate-x-2 transition-all duration-200' />
                            </div>
                        </button>
                    </div>
                </div>
                <div className='lg:col-span-7'>
                    <LoginForm/>
                </div>
            </div>
        </div>
    )
}

export default StudentLoginPage