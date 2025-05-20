import { BookOpen, Info, LogOut, User } from 'lucide-react'
import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

const OrganizationLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    console.log(location);
    const controls = [
        {
            name: "All Batches",
            path: 'batch-list',
            icon: User
        },
        {
            name: "User Details",
            path: "user-list",
            icon: User
        },
        {
            name: "Add User",
            path: "create-user",
            icon: User
        },
        {
            name: "Create Batch",
            path: "create-batch",
            icon: User
        },
        {
            name: "Add Student",
            path: "add-student",
            icon: User
        }
    ]

    return (
        <div className='relative flex w-screen h-screen'>
            {/* Sidebar */}
            <div className="h-screen z-50 bg-indigo-950 pb-2 flex flex-col group hover:w-[20%] w-fit transition-all duration-300">
                <div className='mb-5 space-x-2 flex w-full items-center p-2 text-xl'>
                    <div className="">
                        <BookOpen className='text-white w-7 h-7 group-hover:mr-5' />
                    </div>
                    <div className="font-bold text-white transform transition-all duration-300 translate-x-[-10px] hidden group-hover:translate-x-0 group-hover:block">
                        Test-Series
                    </div>
                </div>
                <div className='flex flex-col justify-between h-full'>
                    <div>
                        {controls.map((control, idx) => (
                            <button
                                onClick={() => navigate(control.path)}
                                className={`flex ${location.pathname.includes(control.path) ? 'bg-white text-indigo-900' : 'text-white'}  w-full items-center p-2 text-xl`} key={idx}>
                                <div className="">
                                    <control.icon className='group-hover:mr-2 w-7 h-7' />
                                </div>
                                <div className="transform transition-all duration-300 translate-x-[-10px] hidden group-hover:translate-x-0 group-hover:block">
                                    {control.name}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div>
                        <button className="flex text-white w-full items-center p-2 text-xl">
                            <div className="">
                                <Info className='group-hover:mr-2 w-7 h-7' />
                            </div>
                            <div className="transform transition-all duration-300 translate-x-[-10px] hidden group-hover:translate-x-0 group-hover:block">
                                About Organization
                            </div>
                        </button>
                        <button className="flex text-white w-full items-center p-2 text-xl">
                            <div className="">
                                <LogOut className='group-hover:mr-2 w-7 h-7' />
                            </div>
                            <div className="transform transition-all duration-300 translate-x-[-10px] hidden group-hover:translate-x-0 group-hover:block">
                                Logout
                            </div>
                        </button>
                    </div>
                </div>

            </div>
            <div className='w-full h-screen px-28 py-10'>
                <Outlet />
            </div>
        </div>
    )
}

export default OrganizationLayout