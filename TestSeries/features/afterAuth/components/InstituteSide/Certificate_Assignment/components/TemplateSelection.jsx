import { CheckCircle, BookOpen, Award, X } from 'lucide-react';
import React, { useState } from 'react';
import CertificateCard from './CertificateCard';
import AssignExamAndContests from './AssignExamAndContests';
import AssignedExamsAndContests from './AssignedExamsAndContests';
import { useCachedExam } from '../../../../../../hooks/useCachedExam';

const certificateTemplates = [
  {
    id: "template-1",
    name: "Classical Elegance",
    description: "Traditional academic certificate with ornate borders and formal styling",
    image: 'https://via.placeholder.com/300x200?text=Classical+Elegance',
    style: "Academic"
  },
  {
    id: "template-2",
    name: "Modern Professional",
    description: "Clean, minimalist design perfect for corporate certifications",
    image: 'https://via.placeholder.com/300x200?text=Modern+Professional',
    style: "Business"
  },
  {
    id: "template-3",
    name: "Luxury Premium",
    description: "Rich burgundy design with gold accents for prestigious awards",
    image: 'https://via.placeholder.com/300x200?text=Luxury+Premium',
    style: "Premium"
  },
  {
    id: "template-4",
    name: "Creative Dynamic",
    description: "Vibrant and modern certificate for creative competitions",
    image: 'https://via.placeholder.com/300x200?text=Creative+Dynamic',
    style: "Creative"
  }
];

const Exams = [
    {
        id: 123,
        name: "first exam"
    },
    {
        id: 124,
        name: "second exam"
    },
    {
        id: 125,
        name: "third exam"
    }
];





const TemplateSelection = () => {
    const [selectedCard, setSelectedCard] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [assignedItems, setAssignedItems] = useState([]);

    // const [Exams , setExams] = useState([]);

    const handleAssign = () => {
        if (selectedCard && selectedExam) {
            const selectedTemplate = certificateTemplates.find(t => t.id === selectedCard);
            const selectedExamData = Exams.find(e => e.id.toString() === selectedExam);
            
            const newAssignment = {
                examId: selectedExamData.id,
                examName: selectedExamData.name,
                templateId: selectedTemplate.id,
                templateName: selectedTemplate.name,
                templateStyle: selectedTemplate.style,
                assignedDate: new Date().toLocaleDateString()
            };
            
            setAssignedItems(prev => [...prev, newAssignment]);
            
            setSelectedCard('');
            setSelectedExam('');
        }
    };

    const handleRemoveAssignment = (index) => {
        setAssignedItems(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <>
            <div className='px-6 border border-gray-200 rounded-lg mt-12 mx-auto'>
                <h1 className='font-bold text-3xl text-gray-900 mb-1'>Choose Certificate Template</h1>
                <span className='text-sm text-gray-500'>Select from our collection of professional certificate designs</span>
                <CertificateCard selectedCard={selectedCard} certificateTemplates={certificateTemplates} setSelectedCard={setSelectedCard} />
            </div>
            
            <AssignExamAndContests 
                selectedCard={selectedCard}
                selectedExam={selectedExam}
                setSelectedExam={setSelectedExam}
                onAssign={handleAssign}
                Exams={Exams}
            />
            
            <AssignedExamsAndContests 
                assignedItems={assignedItems}
                onRemove={handleRemoveAssignment}
            />
        </>
    );
};

export default TemplateSelection;