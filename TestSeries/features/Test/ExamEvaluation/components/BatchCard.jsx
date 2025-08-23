import { ChevronRight, Users } from "lucide-react";

const BatchCard = ({ batch, onSelect, isSelected, theme = "light" }) => (
  <div 
    className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
      isSelected 
        ? 'border-blue-500 bg-blue-50' 
        : theme === 'dark'
          ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
          : 'border-gray-200 bg-white hover:border-gray-300'
    }`}
    onClick={() => onSelect(batch)}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className={`text-lg font-semibold ${
          isSelected 
            ? 'text-blue-900' 
            : theme === 'dark' 
              ? 'text-white' 
              : 'text-gray-900'
        }`}>
          {batch.name}
        </h3>
        <p className={`text-sm ${
          isSelected 
            ? 'text-blue-700' 
            : theme === 'dark' 
              ? 'text-gray-300' 
              : 'text-gray-600'
        }`}>
          {batch.year}
        </p>
        <div className={`flex items-center mt-2 text-sm ${
          isSelected 
            ? 'text-blue-600' 
            : theme === 'dark' 
              ? 'text-gray-400' 
              : 'text-gray-500'
        }`}>
          <Users className="w-4 h-4 mr-1" />
          {/* {batch.studentCount} students */}
        </div>
      </div>
      <ChevronRight className={`w-5 h-5 ${
        isSelected 
          ? 'text-blue-500' 
          : theme === 'dark' 
            ? 'text-gray-500' 
            : 'text-gray-400'
      }`} />
    </div>
  </div>
);

export default BatchCard;