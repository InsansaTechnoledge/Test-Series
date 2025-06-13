import { useState } from "react";
import {initialElements , defaultColors} from '../constants/certificateConstants'

export const useCertificate = () => {
  const [certificateType, setCertificateType] = useState('Achievement');
  const [recipientName, setRecipientName] = useState('John Doe');
  const [courseName, setCourseName] = useState('Web Development Course');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [backgroundColor, setBackgroundColor] = useState(defaultColors.BACKGROUND);
  const [borderColor, setBorderColor] = useState(defaultColors.BORDER);
  const [textColor, setTextColor] = useState(defaultColors.TEXT);
  const [accentColor, setAccentColor] = useState(defaultColors.ACCENT);
  const [orgLogo, setOrgLogo] = useState(null);
  const [ourLogo, setOurLogo] = useState(null);

  const [titleSize, setTitleSize] = useState(32);
  const [recipientSize, setRecipientSize] = useState(24);
  const [courseSize, setCourseSize] = useState(18);
  const [dateSize, setDateSize] = useState(16);

  const [elements, setElements] = useState(initialElements({ titleSize, recipientSize, courseSize, dateSize }));

  const updateElements = () => {
    setElements(initialElements({ titleSize, recipientSize, courseSize, dateSize }));
  };

  const setters = {
    setCertificateType,
    setRecipientName,
    setCourseName,
    setDate,
    setBackgroundColor,
    setBorderColor,
    setTextColor,
    setAccentColor,
    setOrgLogo,
    setOurLogo,
    setElements,
    setTitleSize: (newSize) => {
      setTitleSize(newSize);
      updateElements();
    },
    setRecipientSize: (newSize) => {
      setRecipientSize(newSize);
      updateElements();
    },
    setCourseSize: (newSize) => {
      setCourseSize(newSize);
      updateElements();
    },
    setDateSize: (newSize) => {
      setDateSize(newSize);
      updateElements();
    },
  };

  const certificateData = {
    certificateType,
    recipientName,
    courseName,
    date,
    backgroundColor,
    borderColor,
    textColor,
    accentColor,
    orgLogo,
    ourLogo,
    elements,
    titleSize,
    recipientSize,
    courseSize,
    dateSize
  };

  return { certificateData, setters };
};
