  import React, { useRef } from 'react';
  import ControlPanel from './components/ControlPanel';
  import CertificatePreview from './components/CertificatePreview';
  import { downloadCertificate } from './utils/downloadUtils';
  import { useCertificate } from './hooks/useCertificate';
  import { useDragDrop } from './hooks/useDragDrop';

  const CertificateCreation = () => {
    const { certificateData, setters } = useCertificate();
    const { handleDragStart, handleDragOver, handleDrop } = useDragDrop(
      certificateData.elements, 
      setters.setElements
    );
    
    const certificateRef = useRef(null);

    const handleDownload = () => {
      downloadCertificate(certificateData);
    };

    const handleDropWithRef = (e) => {
      handleDrop(e, certificateRef);
    };

    const handlers = {
      ...setters,
      handleDragStart,
      handleDragOver,
      handleDrop: handleDropWithRef,
      handleDownload
    };

    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Certificate Creator</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <ControlPanel data={certificateData} handlers={handlers} />
            </div>
            
            <div className="lg:col-span-3">
              <CertificatePreview 
                ref={certificateRef}
                data={certificateData}
                handlers={handlers}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default CertificateCreation;