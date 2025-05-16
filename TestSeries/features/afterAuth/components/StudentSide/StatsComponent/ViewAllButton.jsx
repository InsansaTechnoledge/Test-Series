import { MoveRightIcon } from 'lucide-react';
import React from 'react';

const ViewAllButton = () => {
  return (
    <div className="flex justify-center items-center py-12">
      <button className=" group hover:cursor-pointer bg-blue-800 text-gray-100 py-2 px-4 rounded-2xl flex items-center gap-2 hover:bg-blue-900 transition">
        View Detailed Dashboard
        <MoveRightIcon className="group-hover:translate-x-1 w-5 h-5 duration-300" />
      </button>
    </div>
  );
};

export default ViewAllButton;
