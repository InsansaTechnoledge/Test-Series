import { Check, ChevronRight } from 'lucide-react';

const TestSubjectSelectionBar = ({ setSubjectSelectionVisible, eventDetails, selectedSubject, setSelectedSubject }) => {
  return (
    <div className="w-full sm:w-[300px] z-20 bg-gray-50 flex flex-col justify-between rounded-lg shadow-md border border-gray-200 overflow-hidden">
      
      {/* Title */}
      <div className="border-b px-4 py-3 bg-white sticky top-0 z-10">
        <h1 className="font-bold text-lg sm:text-xl text-gray-800">Select Subject</h1>
      </div>

      {/* Subject List */}
      <div className="flex-1 overflow-y-auto max-h-[400px] sm:max-h-[500px]">
        {eventDetails.subjects.map((sub, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedSubject(sub)}
            className={`w-full flex justify-between items-center px-4 py-3 text-left text-sm sm:text-base font-medium border-b hover:bg-blue-50 transition ${
              selectedSubject === sub ? 'bg-blue-100 text-blue-800 font-semibold' : 'text-gray-800'
            }`}
          >
            <span>{sub}</span>
            <span>
              {selectedSubject === sub ? <Check className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </span>
          </button>
        ))}
      </div>

      {/* Hide Button */}
      <div className="p-4 border-t bg-white">
        <button
          onClick={() => setSubjectSelectionVisible(false)}
          className="w-full py-2 text-white bg-blue-900 hover:bg-blue-800 rounded-md font-semibold transition"
        >
          Hide Subject Selection
        </button>
      </div>
    </div>
  );
};

export default TestSubjectSelectionBar;
