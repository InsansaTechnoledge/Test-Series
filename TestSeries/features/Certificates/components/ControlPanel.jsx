import React from 'react'
import CertificateTypeSelector from './CertificateTypeSelector'
import ColorSettings from './ColorSettings'
import ContentSettings from './ContentSettings'
import DownloadButton from './DownloadButton'
import LogoUpload from './LogoUpload'
import { TextSizeSliders } from './TextSizeControl'

const ControlPanel = ({data , handlers}) => {
  return (
        <div className='space-y-6'>
            <CertificateTypeSelector 
                certificateType={data.certificateType}
                setCertificateType={handlers.setCertificateType}
            />

            <ContentSettings 
                recipientName={data.recipientName}
                courseName={data.courseName}
                date={data.date}
                setRecipientName={handlers.setRecipientName}
                setCourseName={handlers.setCourseName}
                setDate={handlers.setDate}
            />

            <TextSizeSliders 
                titleSize={data.titleSize}
                recipientSize={data.recipientSize}
                courseSize={data.courseSize}
                dateSize={data.dateSize}
                onTitleSizeChange={handlers.setTitleSize}
                onRecipientSizeChange={handlers.setRecipientSize}
                onCourseSizeChange={handlers.setCourseSize}
                onDateSizeChange={handlers.setDateSize}
            />

            <ColorSettings 
                backgroundColor={data.backgroundColor}
                borderColor={data.borderColor}
                textColor={data.textColor}
                accentColor={data.accentColor}
                setBackgroundColor={handlers.setBackgroundColor}
                setBorderColor={handlers.setBorderColor}
                setTextColor={handlers.setTextColor}
                setAccentColor={handlers.setAccentColor}
            />

            <LogoUpload 
                setOrgLogo={handlers.setOrgLogo}
                setOurLogo={handlers.setOurLogo}
            />

            <DownloadButton onDownload={handlers.handleDownload}/>
        </div>
  )
}

export default ControlPanel
