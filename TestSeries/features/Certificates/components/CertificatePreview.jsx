import React, { forwardRef } from 'react';
import CertificateCanvas from './CertificateCanvas';

const CertificatePreview = forwardRef(({ data, handlers }, ref) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="font-semibold mb-4">Certificate Preview</h3>
      <p className="text-sm text-gray-600 mb-4">Drag elements to reposition them on the certificate</p>
      
      <div className="flex justify-center">
        <CertificateCanvas 
          ref={ref}
          data={data}
          handlers={handlers}
        />
      </div>
    </div>
  );
});

CertificatePreview.displayName = 'CertificatePreview';

export default CertificatePreview;