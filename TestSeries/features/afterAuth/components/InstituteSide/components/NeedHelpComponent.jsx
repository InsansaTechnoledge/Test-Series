import {React , useState} from 'react'
import GuiderComponent from './GuiderComponent'

const NeedHelpComponent = ({heading , about , question, answer}) => {
    const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
    <div className="flex flex-col md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{heading}</h1>
        <p className="text-gray-500 mt-1">{about}</p>
      </div>
      <button 
        onClick={() => setHelpOpen(!helpOpen)}
        className="mt-4 md:mt-0 text-blue-600 hover:text-blue-800 flex items-center gap-2 text-sm font-medium"
      >
        {helpOpen ? "Hide Help" : "Need Help?"}
      </button>
    </div>

    {/* Help Dialog */}
    {helpOpen && (
      <div className="mt-4 ">
        <div className="flex items-start gap-3">
          <div>
            <GuiderComponent question={question} answer={answer}/>
          </div>
        </div>
      </div>
    )}
  </div>
  )
}

export default NeedHelpComponent
