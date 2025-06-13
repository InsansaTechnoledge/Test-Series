import React from 'react';
import { Type } from 'lucide-react';

const ContentSettings = ({ 
  recipientName, 
  courseName, 
  date, 
  setRecipientName, 
  setCourseName, 
  setDate 
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Type className="w-4 h-4" />
        Content
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Recipient Name</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Course/Event Name</label>
          <input
            type="text"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentSettings;