// import React, { useState, useMemo } from 'react';
// import { FileText, Settings, Download, RefreshCw } from 'lucide-react';

// const AutoGeneratePaper = ({ questions }) => {
//   const [formData, setFormData] = useState({
//     paperTitle: '',
//     totalQuestions: 20,
//     timeLimit: 60,
//     subjects: {},
//     difficulty: 'mixed',
//     includeAllSubjects: false
//   });
  
//   const [generatedPaper, setGeneratedPaper] = useState(null);
//   const [isGenerating, setIsGenerating] = useState(false);

//   // Extract unique subjects and their question counts
//   const subjectStats = useMemo(() => {
//     if (!questions?.data) return {};
    
//     const stats = {};
//     questions.data.forEach(q => {
//       const subject = q.subject?.trim();
//       if (subject) {
//         stats[subject] = (stats[subject] || 0) + 1;
//       }
//     });
//     return stats;
//   }, [questions]);

//   const subjects = Object.keys(subjectStats);

//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubjectChange = (subject, count) => {
//     setFormData(prev => ({
//       ...prev,
//       subjects: { ...prev.subjects, [subject]: parseInt(count) || 0 }
//     }));
//   };

//   const distributeQuestionsEqually = () => {
//     const questionsPerSubject = Math.floor(formData.totalQuestions / subjects.length);
//     const remainder = formData.totalQuestions % subjects.length;
    
//     const distribution = {};
//     subjects.forEach((subject, index) => {
//       const maxAvailable = subjectStats[subject];
//       let allocated = questionsPerSubject;
//       if (index < remainder) allocated += 1;
//       distribution[subject] = Math.min(allocated, maxAvailable);
//     });
    
//     setFormData(prev => ({ ...prev, subjects: distribution }));
//   };

//   const generatePaper = async () => {
//     if (!questions?.data?.length) return;
    
//     setIsGenerating(true);
    
//     try {
//       // Simulate API delay for better UX
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       const selectedQuestions = [];
//       const availableQuestions = [...questions.data];
      
//       // Group questions by subject
//       const questionsBySubject = {};
//       availableQuestions.forEach(q => {
//         const subject = q.subject?.trim();
//         if (subject) {
//           if (!questionsBySubject[subject]) questionsBySubject[subject] = [];
//           questionsBySubject[subject].push(q);
//         }
//       });
      
//       // Select questions based on form criteria
//       Object.entries(formData.subjects).forEach(([subject, count]) => {
//         if (count > 0 && questionsBySubject[subject]) {
//           const subjectQuestions = [...questionsBySubject[subject]];
          
//           // Shuffle questions for randomization
//           for (let i = subjectQuestions.length - 1; i > 0; i--) {
//             const j = Math.floor(Math.random() * (i + 1));
//             [subjectQuestions[i], subjectQuestions[j]] = [subjectQuestions[j], subjectQuestions[i]];
//           }
          
//           selectedQuestions.push(...subjectQuestions.slice(0, count));
//         }
//       });
      
//       // Final shuffle of all selected questions
//       for (let i = selectedQuestions.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [selectedQuestions[i], selectedQuestions[j]] = [selectedQuestions[j], selectedQuestions[i]];
//       }
      
//       const paper = {
//         id: `paper_${Date.now()}`,
//         title: formData.paperTitle || `Auto Generated Paper - ${new Date().toLocaleDateString()}`,
//         timeLimit: formData.timeLimit,
//         totalQuestions: selectedQuestions.length,
//         subjects: formData.subjects,
//         questions: selectedQuestions,
//         generatedAt: new Date().toISOString(),
//         instructions: [
//           `Total Questions: ${selectedQuestions.length}`,
//           `Time Limit: ${formData.timeLimit} minutes`,
//           'Choose the best answer for each question',
//           'All questions carry equal marks'
//         ]
//       };
      
//       setGeneratedPaper(paper);
//     } catch (error) {
//       console.error('Error generating paper:', error);
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   const exportPaper = () => {
//     if (!generatedPaper) return;
    
//     const paperData = {
//       ...generatedPaper,
//       exportedAt: new Date().toISOString()
//     };
    
//     const blob = new Blob([JSON.stringify(paperData, null, 2)], { type: 'application/json' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = `${generatedPaper.title.replace(/[^a-z0-9]/gi, '_')}.json`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   const totalSelectedQuestions = Object.values(formData.subjects).reduce((sum, count) => sum + (count || 0), 0);

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white">
//       <div className="mb-8">
//         <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
//           Auto Generate Exam Paper
//         </h1>
//         <p className="text-gray-600">Create customized exam papers by selecting subjects and question counts</p>
//         <div className="mt-2 text-sm text-blue-600 font-medium">
//           Available Questions: {questions?.data?.length || 0} | Subjects: {subjects.length}
//         </div>
//       </div>

//       <div className="grid lg:grid-cols-2 gap-8">
//         {/* Configuration Form */}
//         <div className="space-y-6">
//           <div className="bg-gray-50 p-6 rounded-lg">
//             <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
//               <Settings className="text-gray-600" />
//               Paper Configuration
//             </h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Paper Title
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter paper title (optional)"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={formData.paperTitle}
//                   onChange={(e) => handleInputChange('paperTitle', e.target.value)}
//                 />
//               </div>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Total Questions
//                   </label>
//                   <input
//                     type="number"
//                     min="1"
//                     max={questions?.data?.length || 100}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.totalQuestions}
//                     onChange={(e) => handleInputChange('totalQuestions', parseInt(e.target.value) || 0)}
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Time Limit (minutes)
//                   </label>
//                   <input
//                     type="number"
//                     min="1"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     value={formData.timeLimit}
//                     onChange={(e) => handleInputChange('timeLimit', parseInt(e.target.value) || 0)}
//                   />
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Subject Distribution */}
//           <div className="bg-gray-50 p-6 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800">Subject Distribution</h3>
//               <button
//                 onClick={distributeQuestionsEqually}
//                 className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
//               >
//                 Auto Distribute
//               </button>
//             </div>
            
//             <div className="space-y-3 max-h-64 overflow-y-auto">
//               {subjects.map(subject => (
//                 <div key={subject} className="flex items-center justify-between bg-white p-3 rounded border">
//                   <div className="flex-1">
//                     <div className="font-medium text-gray-800 text-sm">{subject}</div>
//                     <div className="text-xs text-gray-500">Available: {subjectStats[subject]}</div>
//                   </div>
//                   <input
//                     type="number"
//                     min="0"
//                     max={subjectStats[subject]}
//                     className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                     value={formData.subjects[subject] || 0}
//                     onChange={(e) => handleSubjectChange(subject, e.target.value)}
//                   />
//                 </div>
//               ))}
//             </div>
            
//             <div className="mt-4 p-3 bg-blue-50 rounded">
//               <div className="text-sm">
//                 <span className="font-medium">Selected: {totalSelectedQuestions}</span>
//                 <span className="text-gray-600 ml-2">/ Target: {formData.totalQuestions}</span>
//               </div>
//               {totalSelectedQuestions !== formData.totalQuestions && (
//                 <div className="text-xs text-orange-600 mt-1">
//                   Adjust subject counts to match target questions
//                 </div>
//               )}
//             </div>
//           </div>

//           <button
//             onClick={generatePaper}
//             disabled={isGenerating || totalSelectedQuestions === 0}
//             className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
//           >
//             {isGenerating ? (
//               <>
//                 <RefreshCw className="w-4 h-4 animate-spin" />
//                 Generating Paper...
//               </>
//             ) : (
//               <>
//                 <FileText className="w-4 h-4" />
//                 Generate Paper
//               </>
//             )}
//           </button>
//         </div>

//         {/* Generated Paper Preview */}
//         <div className="space-y-6">
//           {generatedPaper ? (
//             <div className="bg-gray-50 p-6 rounded-lg">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-800">{generatedPaper.title}</h2>
//                   <p className="text-sm text-gray-600 mt-1">
//                     Generated on {new Date(generatedPaper.generatedAt).toLocaleString()}
//                   </p>
//                 </div>
//                 <button
//                   onClick={exportPaper}
//                   className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors flex items-center gap-2"
//                 >
//                   <Download className="w-4 h-4" />
//                   Export
//                 </button>
//               </div>
              
//               <div className="grid grid-cols-2 gap-4 mb-4">
//                 <div className="bg-white p-3 rounded border">
//                   <div className="text-sm font-medium text-gray-700">Total Questions</div>
//                   <div className="text-lg font-bold text-blue-600">{generatedPaper.totalQuestions}</div>
//                 </div>
//                 <div className="bg-white p-3 rounded border">
//                   <div className="text-sm font-medium text-gray-700">Time Limit</div>
//                   <div className="text-lg font-bold text-blue-600">{generatedPaper.timeLimit} min</div>
//                 </div>
//               </div>

//               <div className="bg-white p-4 rounded border">
//                 <h4 className="font-semibold text-gray-800 mb-2">Subject Breakdown</h4>
//                 <div className="space-y-2">
//                   {Object.entries(generatedPaper.subjects).map(([subject, count]) => (
//                     count > 0 && (
//                       <div key={subject} className="flex justify-between text-sm">
//                         <span className="text-gray-700">{subject}</span>
//                         <span className="font-medium">{count} questions</span>
//                       </div>
//                     )
//                   ))}
//                 </div>
//               </div>

//               <div className="bg-white p-4 rounded border mt-4">
//                 <h4 className="font-semibold text-gray-800 mb-2">Instructions</h4>
//                 <ul className="text-sm text-gray-600 space-y-1">
//                   {generatedPaper.instructions.map((instruction, index) => (
//                     <li key={index}>• {instruction}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-gray-50 p-12 rounded-lg text-center">
//               <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-600 mb-2">No Paper Generated</h3>
//               <p className="text-gray-500">Configure your paper settings and click "Generate Paper" to create an exam paper</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AutoGeneratePaper;

import React, { useState, useMemo } from 'react';
import { FileText, Settings, Download, RefreshCw, Eye, Filter } from 'lucide-react';
import { examGenerationAlgorithm } from './algorithms/examGenerationAlgorithm';
import { analysisUtils } from './utils/analysisUtils';
import { pdfGenerator } from './utils/pdfGenerator';
import PaperConfiguration from './components/PaperConfiguration';
import FilterSection from './components/FilterSection';
import SubjectDistribution from './components/SubjectDistribution';
import PaperPreview from './components/PaperPreview';
import PaperSummary from './components/PaperSummary';

const AutoGeneratePaper = ({ questions }) => {
  const [formData, setFormData] = useState({
    paperTitle: '',
    totalMarks: 100,
    timeLimit: 60,
    subjects: {},
    difficulty: 'all',
    bloomText: 'all',
    // Enhanced difficulty distribution (percentages)
    difficultyDistribution: {
      easy: 30,
      medium: 50,
      hard: 20
    },
    // Enhanced bloom taxonomy distribution (percentages)
    bloomDistribution: {
      remember: 20,
      understand: 25,
      apply: 25,
      analyze: 15,
      evaluate: 10,
      create: 5
    },
    // Marks per question type
    marksPerQuestion: {
      easy: 2,
      medium: 4,
      hard: 6
    },
    includeAllSubjects: false
  });
  
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Extract unique subjects, difficulties, and bloom_text values
  const analysisData = useMemo(() => {
    return analysisUtils.analyzeQuestions(questions?.data || []);
  }, [questions]);

  const subjectsList = Object.keys(analysisData.subjects);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], [field]: value }
    }));
  };

  const handleSubjectChange = (subject, marks) => {
    setFormData(prev => ({
      ...prev,
      subjects: { ...prev.subjects, [subject]: parseInt(marks) || 0 }
    }));
  };

  const getFilteredQuestions = () => {
    if (!questions?.data) return [];
    
    return questions.data.filter(q => {
      const difficultyMatch = formData.difficulty === 'all' || q.difficulty === formData.difficulty;
      const bloomMatch = formData.bloomText === 'all' || q.bloom_level === formData.bloomText;
      return difficultyMatch && bloomMatch;
    });
  };

  const distributeMarksEqually = () => {
    const filteredQuestions = getFilteredQuestions();
    const subjectCounts = {};
    
    filteredQuestions.forEach(q => {
      const subject = q.subject?.trim();
      if (subject) {
        subjectCounts[subject] = (subjectCounts[subject] || 0) + 1;
      }
    });
    
    const availableSubjects = Object.keys(subjectCounts);
    const marksPerSubject = Math.floor(formData.totalMarks / availableSubjects.length);
    const remainder = formData.totalMarks % availableSubjects.length;
    
    const distribution = {};
    availableSubjects.forEach((subject, index) => {
      let allocated = marksPerSubject;
      if (index < remainder) allocated += 1;
      distribution[subject] = allocated;
    });
    
    setFormData(prev => ({ ...prev, subjects: distribution }));
  };

  const generatePaper = async () => {
    const filteredQuestions = getFilteredQuestions();
    if (!filteredQuestions.length) return;
    
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const paper = examGenerationAlgorithm.generateExam({
        questions: filteredQuestions,
        config: formData
      });
      
      setGeneratedPaper(paper);
      setShowPreview(false);
    } catch (error) {
      console.error('Error generating paper:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => {
    if (!generatedPaper) return;
    pdfGenerator.generateAndDownload(generatedPaper);
  };

  const filteredQuestions = getFilteredQuestions();
  const filteredSubjectCounts = {};
  filteredQuestions.forEach(q => {
    const subject = q.subject?.trim();
    if (subject) {
      filteredSubjectCounts[subject] = (filteredSubjectCounts[subject] || 0) + 1;
    }
  });

  const totalSelectedMarks = Object.values(formData.subjects).reduce((sum, marks) => sum + (marks || 0), 0);

  return (
    <div className="mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          Auto Generate Exam Paper
        </h1>
        <p className="text-gray-600">Create customized exam papers with advanced filtering and distribution options</p>
        <div className="mt-2 text-sm text-blue-600 font-medium">
          Total Questions: {questions?.data?.length || 0} | After Filters: {filteredQuestions.length} | Subjects: {subjectsList.length}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Configuration Form */}
        <div className="lg:col-span-1 space-y-6">
          <PaperConfiguration 
            formData={formData}
            handleInputChange={handleInputChange}
            handleNestedChange={handleNestedChange}
            filteredQuestions={filteredQuestions}
          />

          <FilterSection 
            formData={formData}
            handleInputChange={handleInputChange}
            analysisData={analysisData}
          />

          <SubjectDistribution 
            formData={formData}
            handleSubjectChange={handleSubjectChange}
            distributeMarksEqually={distributeMarksEqually}
            filteredSubjectCounts={filteredSubjectCounts}
            totalSelectedMarks={totalSelectedMarks}
          />

          <button
            onClick={generatePaper}
            disabled={isGenerating || totalSelectedMarks === 0}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generating Paper...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Paper
              </>
            )}
          </button>
        </div>

        {/* Generated Paper Preview/Summary */}
        <div className="lg:col-span-2 space-y-6">
          {generatedPaper ? (
            <>
              <PaperSummary 
                generatedPaper={generatedPaper}
                showPreview={showPreview}
                setShowPreview={setShowPreview}
                downloadPDF={downloadPDF}
              />

              {showPreview && (
                <PaperPreview generatedPaper={generatedPaper} />
              )}
            </>
          ) : (
            <div className="bg-gray-50 p-12 rounded-lg text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Paper Generated</h3>
              <p className="text-gray-500">Configure your paper settings and filters, then click "Generate Paper"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutoGeneratePaper;