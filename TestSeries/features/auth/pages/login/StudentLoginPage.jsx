import { ArrowRight, CheckCircle, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import LoginForm from './LoginForm'
import  logo from "../../../../assests/Landing/Navbar/evalvo logo blue 2.svg"
const StudentLoginPage = (props) => {
    const navigate = useNavigate();
    return (
        <div>
            <div className='bg-gradient-to-b from-blue-50 to-white grid lg:grid-cols-12 gap-20 px-20 pt-20 min-h-screen'>
                <div className='lg:col-span-5 max-w-lg text-center lg:text-left w-ful'>
                <img src={logo} width={200} className='mx-auto lg:mx-0 mb-8'></img>
                    <h1 className='mt-5 text-indigo-600 font-bold text-5xl'>
                        Student Login
                    </h1>
           

                    <div className='flex space-x-2 mt-10 w-fit'>
                        <h2 className='my-auto text-indigo-950 font-semibold text-lg'>Are you an Institute?</h2>
                        <button
                            onClick={() => { navigate('/login?role=Institute') }}
                            className='hover:cursor-pointer my-auto group py-2 px-6 bg-indigo-800 text-white rounded-lg'>
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