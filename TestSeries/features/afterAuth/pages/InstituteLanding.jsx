import { Book, BookOpen, Info, LogOut, Menu, User } from 'lucide-react'
import React, { useState } from 'react'
import Heading from '../components/InstituteSide/Heading';
import BatchList from '../components/InstituteSide/BatchList';
import AdminList from '../components/InstituteSide/UserList';
import UserList from '../components/InstituteSide/UserList';

const InstituteLanding = () => {
  

  return (
    <div className='h-screen relative'>
      

      {/* main Content */}
      <div className='p-5 ml-20'>
        {(() => {
          switch (currentControl) {
            case "All Batches":
              return <BatchList />;

            case "User Details":
              return <UserList />;

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
