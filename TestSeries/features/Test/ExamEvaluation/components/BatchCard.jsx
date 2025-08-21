import { ChevronRight, Users } from "lucide-react";

const BatchCard = ({ batch, onSelect, isSelected }) => (
  <div 
    className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}
    onClick={() => onSelect(batch)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{batch.name}</h3>
        <p className="text-sm text-gray-600">{batch.year}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <Users className="w-4 h-4 mr-1" />
          {/* {batch.studentCount} students */}
        </div>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400" />
    </div>
  </div>
);
export default BatchCard;