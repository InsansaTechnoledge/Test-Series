import { Book, BookOpen, Info, LogOut, Menu, User } from 'lucide-react'
import React, { useState } from 'react'
import Heading from '../components/InstituteSide/Heading';
import BatchList from '../components/InstituteSide/BatchList';

const InstituteLanding = () => {
  const [currentControl, setCurrentControl] = useState("All Batches");

  const controls = [
    {
      name: "All Batches",
      icon: User
    },
    {
      name: "Admin List",
      icon: User
    },
    {
      name: "Add User",
      icon: User
    }
  ]

  return (
    <div className='h-screen relative'>
      {/* Sidebar */}
      <div className="z-50 fixed bg-indigo-950 pb-2 pr-2 flex flex-col group hover:w-[14.2857%] h-full w-fit border transition-all duration-300">
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
                onClick={() => setCurrentControl(control.name)}
                className="flex text-white w-full items-center p-2 text-xl" key={idx}>
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

      {/* main Content */}
      <div className='p-5 ml-20'>
        {(() => {
          switch (currentControl) {
            case "All Batches":
              return <BatchList />;

            case "Students":
              return <div>Students Content</div>;

            case "Reports":
              return <div>Reports Content</div>;

            default:
              return <div>Select a control</div>;
          }
        })()}

      </div>


    </div>
  )
}

export default InstituteLanding
