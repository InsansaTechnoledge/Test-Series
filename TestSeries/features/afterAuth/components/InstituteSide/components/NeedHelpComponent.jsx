import {React , useState} from 'react'
import GuiderComponent from './GuiderComponent'
import { useTheme } from '../../../../../hooks/useTheme'

const NeedHelpComponent = ({heading , about , question, answer}) => {
    const [helpOpen, setHelpOpen] = useState(false)
    const {theme} = useTheme();

  return (
    <div className={` ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} rounded-xl shadow-md p-6 mb-6`}>
    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'light' ? 'text-gray-800' : 'text-indigo-100'}  `}>{heading}</h1>
        <p className={`${theme === 'light' ? 'text-gray-500' : 'text-gray-100'} mt-1`}>{about}</p>
      </div>
      <button 
        onClick={() => setHelpOpen(!helpOpen)}
        className={`mt-4 ${theme === 'light' ? ' text-blue-600 hover:text-blue-800' : 'text-indigo-200'} md:mt-0 flex items-center gap-2 text-sm font-medium`}
      >
        {helpOpen ? "Hide Help" : "Need Help?"}
      </button>
    </div>

    {/* Help Dialog */}
    {helpOpen && (
      <div className="mt-4 ">
        <div className="flex items-start gap-3">
          <div>
            <GuiderComponent question={question} answer={answer} theme={theme}/>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default NeedHelpComponent
