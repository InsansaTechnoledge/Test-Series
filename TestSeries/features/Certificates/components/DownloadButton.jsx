import React from 'react';
import { Download } from 'lucide-react';

const DownloadButton = ({ onDownload }) => {
  return (
    <button
      onClick={onDownload}
      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
    >
      <Download className="w-4 h-4" />
      Download Certificate
    </button>
  );
};

export default DownloadButton;