import { CheckCircle, BookOpen, Award, X } from 'lucide-react';
import React, { useState } from 'react';

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

const CertificateCard = ({selectedCard , setSelectedCard}) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 py-4'>
      {certificateTemplates.map(c => (
        <button
            onClick={() => setSelectedCard(c.id)}
            key={c.id}
            className={`relative bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                selectedCard === c.id ? 'border-4 border-indigo-600' : ''
            }`}
            >
           
            {selectedCard === c.id && (
                <div className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                <CheckCircle size={16}/>
                </div>
            )}
            
            <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">{c.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{c.description}</p>
                <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                {c.style}
                </span>
            </div>
        </button>
      ))}
    </div>
  );
};

const AssignExamAndConstes = ({ selectedCard, selectedExam, setSelectedExam, onAssign }) => {
    const handleExamAssign = () => {
        if (selectedCard && selectedExam) {
            onAssign();
        }
    };

    const isAssignDisabled = !selectedCard || !selectedExam;

    return (
        <div className='px-6 border border-gray-200 rounded-lg py-4 mt-12 mx-auto'>
            <h1 className='font-bold text-3xl text-gray-900 mb-1'>Assign Exam or Contest</h1>
            <span className='text-sm text-gray-500'>
              Select an exam or contest to assign the chosen certificate template
            </span>
          
            <div className="flex gap-4 mt-4">
                <select
                    id="examSelect"
                    name="examSelect"
                    value={selectedExam}
                    onChange={(e) => setSelectedExam(e.target.value)}
                    className="block w-full mt-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                    <option value="">Choose Exams or Contests</option>
                    {Exams.map(e => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))}
                </select>

                <button  
                    onClick={handleExamAssign}
                    disabled={isAssignDisabled}
                    className={`py-2 px-6 rounded-lg font-medium transition-colors duration-200 ${
                        isAssignDisabled 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                    }`}
                >
                    Assign
                </button>
            </div>
        </div>
    );
};

const AssignedExamsAndContests = ({ assignedItems, onRemove }) => {
    if (assignedItems.length === 0) {
        return (
            <div className='px-6 border border-gray-200 rounded-lg py-8 mt-12 mx-auto'>
                <h2 className='font-bold text-2xl text-gray-900 mb-2'>Assigned Exams & Contests</h2>
                <p className='text-gray-500 text-center py-8'>No assignments yet. Select a certificate template and exam to get started.</p>
            </div>
        );
    }

    return (
        <div className='px-6 border border-gray-200 rounded-lg  py-6 mt-12 mx-auto'>
            <h2 className='font-bold text-2xl text-gray-900 mb-4'>Assigned Exams & Contests</h2>
            <span className='text-sm text-gray-500 mb-6 block'>
                Manage your certificate assignments for exams and contests
            </span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assignedItems.map((item, index) => (
                    <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <BookOpen size={20} className="text-indigo-600" />
                                <h3 className="font-semibold text-gray-800">{item.examName}</h3>
                            </div>
                            <button
                                onClick={() => onRemove(index)}
                                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                                title="Remove assignment"
                            >
                                <X size={18} />
                            </button>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                            <Award size={16} className="text-amber-500" />
                            <span className="text-sm font-medium text-gray-700">{item.templateName}</span>
                        </div>
                        
                        <span className="inline-block text-xs font-medium text-indigo-600 bg-indigo-100 px-2 py-1 rounded">
                            {item.templateStyle}
                        </span>
                        
                        <div className="mt-3 text-xs text-gray-400">
                            Assigned on {item.assignedDate}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TemplateSelection = () => {
    const [selectedCard, setSelectedCard] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [assignedItems, setAssignedItems] = useState([]);

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
                <CertificateCard selectedCard={selectedCard} setSelectedCard={setSelectedCard} />
            </div>
            
            <AssignExamAndConstes 
                selectedCard={selectedCard}
                selectedExam={selectedExam}
                setSelectedExam={setSelectedExam}
                onAssign={handleAssign}
            />
            
            <AssignedExamsAndContests 
                assignedItems={assignedItems}
                onRemove={handleRemoveAssignment}
            />
        </>
    );
};

export default TemplateSelection;