import React from 'react';
import { Award } from 'lucide-react';

const CertificateTypeSelector = ({ certificateType, setCertificateType }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Award className="w-4 h-4" />
        Certificate Type
      </h3>
      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="merit"
            checked={certificateType === 'merit'}
            onChange={(e) => setCertificateType(e.target.value)}
            className="text-blue-600"
          />
          <span>Merit</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="participation"
            checked={certificateType === 'participation'}
            onChange={(e) => setCertificateType(e.target.value)}
            className="text-blue-600"
          />
          <span>Participation</span>
        </label>
      </div>
    </div>
  );
};

export default CertificateTypeSelector;