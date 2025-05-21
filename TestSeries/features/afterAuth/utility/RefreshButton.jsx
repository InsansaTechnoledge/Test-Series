import { RefreshCcw } from 'lucide-react'
import React from 'react'

const RefreshButton = ({refreshFunction}) => {
  return (
    <button 
    onClick={refreshFunction}
    className='hover:bg-gray-300 hover:cursor-pointer flex bg-gray-100 px-4 py-2 rounded-md gap-2'> 
        <span>
            Refresh
        </span>
        <div>
            <RefreshCcw />
        </div>
    </button>
  )
}

export default RefreshButton