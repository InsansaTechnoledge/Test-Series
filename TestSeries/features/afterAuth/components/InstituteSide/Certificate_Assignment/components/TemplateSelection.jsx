import { useEffect, useMemo, useState } from 'react';
import CertificateCard from './CertificateCard';
import AssignExamAndContests from './AssignExamAndContests';
import AssignedExamsAndContests from './AssignedExamsAndContests';
import { getAllTemplatesAvailable } from '../../../../../../utils/services/certificateService';
import { useExams } from '../../../../../../hooks/UseExam';
import useCachedContests from '../../../../../../hooks/useCachedContests';
import { addCertificateToExams } from '../../../../../../utils/services/examService';
import AssignedDataInTable from './AssignedDataInTable';

const TemplateSelection = () => {
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedExam, setSelectedExam] = useState('');
  const [assignedItems, setAssignedItems] = useState([]);
  const [certificateTemplates, setCertificateTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const exams = useExams();
  const { contestList } = useCachedContests();
  console.log("vv", exams.data , contestList)

  const Exams = useMemo(() => {
    const ExamsData = Array.isArray(exams?.data)
      ? exams.data.filter((e) => (e?.go_live === false && e?.certificate_template_mongo_id === null)).map((e) => ({...e , type: 'exam'}))
      : [];

    const ContestData = Array.isArray(contestList)
      ? contestList.filter((e) => (e?.go_live === false && e?.certificate_template_mongo_id === null)).map((c) => ({...c , type: 'contest'}))
      : [];

    return [...ExamsData, ...ContestData];
  }, [exams, contestList]);

  const AssignedExamsOrContest = useMemo(() => {
    const ExamsData = Array.isArray(exams?.data) ? exams.data.filter((e) => (e?.certificate_template_mongo_id !== null)).map((e) => ({...e , type: 'exam'})) : [];

    const ContestData = Array.isArray(contestList) ? contestList.filter((e) => (e?.certificate_template_mongo_id !== null)).map((e) => ({...e , type: 'contest'})) : [];

    return [...ExamsData , ...ContestData]
  })

  console.log("hg", AssignedExamsOrContest);
  

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        const res = await getAllTemplatesAvailable();
        setCertificateTemplates(Array.isArray(res?.data?.data) ? res.data.data : []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch certificate templates:', err);
        setCertificateTemplates([]);
        setError('Failed to load templates.');
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  console.log("ff",certificateTemplates);
  

  const handleAssign = () => {
    if (!selectedCard || !selectedExam) return;

    const selectedTemplate = certificateTemplates.find((t) => t._id === selectedCard);
    const selectedExamData = Exams.find((e) => e.id?.toString() === selectedExam);

    if (!selectedTemplate || !selectedExamData) return;

    const alreadyAssigned = assignedItems.some(
      (item) =>
        item.examId === selectedExamData.id &&
        item.templateId === selectedTemplate._id
    );

    if (alreadyAssigned) return;

    const newAssignment = {
      examId: selectedExamData.id,
      type: selectedExamData.type,
      examName: selectedExamData.name,
      templateId: selectedTemplate._id,
      templateName: selectedTemplate.name,
      templateStyle: selectedTemplate.style,
      assignedDate: new Date().toLocaleDateString(),
    };

    setAssignedItems((prev) => [...prev, newAssignment]);
    setSelectedCard('');
    setSelectedExam('');
  };

 
  
  

  const handleAssignCertificateToTemplateOnBackend = async () => {
    const formData = assignedItems.map((a) => ({
        id: a.examId,
        certificate_template_mongo_id: a.templateId,
        type: a.type
    }));

    console.log("data to send to Supabase", formData)

    try{
        const results = await addCertificateToExams(formData)
        console.log('✅ All assignments succeeded:', results);
        alert('success');
    } catch(e) {
        console.error('❌ Error assigning one or more certificates:', e);
        alert('Some certificate assignments failed. Check the console for details.');
    }

  }



  console.log("check" , assignedItems)

  const handleRemoveAssignment = (index) => {
    setAssignedItems((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="px-6 rounded-lg mt-16 text-center mx-auto">
        <h1 className="font-bold text-2xl text-gray-900 mb-1">Choose <span className='text-indigo-600'>Certificate</span> Template</h1>
        <span className="text-sm text-gray-500">
          Select from our collection of professional certificate designs
        </span>

        {loading ? (
          <div className="text-center py-8 text-gray-500 text-lg">
            Loading templates...
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500 text-lg">{error}</div>
        ) : certificateTemplates.length > 0 ? (
           <div className="space-y-12">
              <CertificateCard
                selectedCard={selectedCard}
                setSelectedCard={setSelectedCard}
                certificateTemplates={certificateTemplates}
                slidesToShow={3}
                gap={24}
              />
            </div>
        ) : (
          <div className="flex items-center justify-center text-gray-800 text-xl font-semibold py-8">
            No Templates Available
          </div>
        )}
      </div>

      <AssignExamAndContests
        selectedCard={selectedCard}
        selectedExam={selectedExam}
        setSelectedExam={setSelectedExam}
        onAssign={handleAssign}
        Exams={Exams}
        assignedItems={assignedItems}
      />

      <AssignedExamsAndContests
        assignedItems={assignedItems}
        onRemove={handleRemoveAssignment}
        handleAssignCertificateToTemplateOnBackend={handleAssignCertificateToTemplateOnBackend}
      />

      <AssignedDataInTable AssignedExamsOrContest={AssignedExamsOrContest} certificateTemplates={certificateTemplates}/>
    </>
  );
};

export default TemplateSelection;
