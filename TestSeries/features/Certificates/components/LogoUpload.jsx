import React, { useRef } from 'react';
import { Image } from 'lucide-react';
import { handleFileUpload } from '../utils/fileUpload';

const LogoUpload = ({ setOrgLogo, setOurLogo }) => {
  const orgLogoRef = useRef(null);
  const ourLogoRef = useRef(null);

  const onFileUpload = (event, logoType) => {
    handleFileUpload(event, logoType, setOrgLogo, setOurLogo);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <Image className="w-4 h-4" />
        Logos
      </h3>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">Organization Logo</label>
          <input
            ref={orgLogoRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload(e, 'org')}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Our Logo</label>
          <input
            ref={ourLogoRef}
            type="file"
            accept="image/*"
            onChange={(e) => onFileUpload(e, 'our')}
            className="w-full p-2 border rounded-md text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export default LogoUpload;