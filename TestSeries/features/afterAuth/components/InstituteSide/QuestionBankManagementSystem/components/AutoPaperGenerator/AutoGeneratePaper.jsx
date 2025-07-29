import React, { useState, useMemo } from 'react';
import { FileText, Settings, Download, RefreshCw, Eye, Filter, BarChart3, PieChart, Brain, MessageSquare, Lightbulb } from 'lucide-react';
import { analysisUtils } from './utils/analysisUtils';
import { pdfGenerator } from './utils/pdfGenerator';
import { promptParser } from './utils/promptParser';
import {examGenerationAlgorithm} from './Algorithms/examGenerationAlgorithm'
import GenerationModeSelector from './components/GenerationModeSelector';
import PromptBasedGeneration from './components/PromptBasedGeneration';
import BloomBasedConfiguration from './components/BloomBasedConfiguration';
import PaperConfiguration from './components/PaperConfiguration';
import FilterSection from './components/FilterSection';
import SubjectDistribution from './components/SubjectDistribution';
import PaperSummary from './components/PaperSummary';
import PaperPreview from './components/PaperPreview';



const AutoGeneratePaper = ({ questions }) => {
    const [generationMode, setGenerationMode] = useState('traditional');
    const [formData, setFormData] = useState({
      paperTitle: '',
      totalMarks: 100,
      timeLimit: 60,
      subjects: {},
      difficultyDistribution: {
        easy: 30,
        medium: 50,
        hard: 20
      },
      marksPerQuestion: {
        easy: 2,
        medium: 4,
        hard: 6
      },
      bloomDistribution: {
        remember: 10,
        understand: 20,
        apply: 25,
        analyze: 20,
        evaluate: 15,
        create: 10
      },
      filters: {
        difficulty: 'all',
        subjectFilter: 'all',
        bloomFilter: 'all',
        chapterFilter: 'all'
      }
    });
    
    const [generatedPaper, setGeneratedPaper] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
  
    const analysisData = useMemo(() => {
      return analysisUtils.analyzeQuestions(questions?.data || []);
    }, [questions]);
  
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
        const filters = formData.filters || {};
        const difficultyMatch = !filters.difficulty || filters.difficulty === 'all' || 
          q.difficulty?.toLowerCase() === filters.difficulty;
        const subjectMatch = !filters.subjectFilter || filters.subjectFilter === 'all' || 
          q.subject === filters.subjectFilter;
        const bloomMatch = !filters.bloomFilter || filters.bloomFilter === 'all' || 
          q.bloom_level?.toLowerCase() === filters.bloomFilter;
        const chapterMatch = !filters.chapterFilter || filters.chapterFilter === 'all' || 
          q.chapter === filters.chapterFilter;
        
        return difficultyMatch && subjectMatch && bloomMatch && chapterMatch;
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
      if (availableSubjects.length === 0) return;
      
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
  
    const handlePromptGeneration = (prompt) => {
      const filteredQuestions = getFilteredQuestions();
      if (!filteredQuestions.length) return;
      
      // Parse the prompt to get configuration
      const promptConfig = promptParser.parsePrompt(prompt, filteredQuestions);
      
      // Update form data with parsed configuration
      setFormData(prev => ({
        ...prev,
        ...promptConfig
      }));
      
      // Generate paper with the parsed configuration
      generatePaper(promptConfig, 'prompt');
    };
  
    const generatePaper = async (customConfig = null, mode = generationMode) => {
      const filteredQuestions = getFilteredQuestions();
      if (!filteredQuestions.length) return;
      
      setIsGenerating(true);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const config = customConfig || formData;
        const paper = examGenerationAlgorithm.generateExam({
          questions: filteredQuestions,
          config,
          mode
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
  
    const renderConfigurationPanel = () => {
      switch (generationMode) {
        case 'bloom':
          return (
            <BloomBasedConfiguration 
              formData={formData}
              handleInputChange={handleInputChange}
              handleNestedChange={handleNestedChange}
              analysisData={analysisData}
            />
          );
        case 'prompt':
          return (
            <PromptBasedGeneration 
              onGenerate={handlePromptGeneration}
              analysisData={analysisData}
            />
          );
        default:
          return (
            <PaperConfiguration 
              formData={formData}
              handleInputChange={handleInputChange}
              handleNestedChange={handleNestedChange}
              filteredQuestions={filteredQuestions}
            />
          );
      }
    };
  
    return (
      <div className={`mt-8 px-4 mx-6 rounded-2xl border  py-6 shadow-sm`}>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-2">
            Auto Generate Exam Paper
          </h1>
          <p className="text-gray-600">Create customized exam papers with advanced filtering and distribution options</p>
          <div className="mt-2 text-sm text-blue-600 font-medium">
            Total Questions: {questions?.data?.length || 0} | After Filters: {filteredQuestions.length} | Subjects: {Object.keys(analysisData.subjects).length}
          </div>
        </div>
  
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-1 space-y-4">
            <GenerationModeSelector 
              mode={generationMode}
              setMode={setGenerationMode}
            />
  
            {renderConfigurationPanel()}
  
            {generationMode !== 'prompt' && (
              <>
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
                  onClick={() => generatePaper()}
                  disabled={isGenerating || (generationMode !== 'bloom' && totalSelectedMarks === 0) || Object.keys(filteredSubjectCounts).length === 0}
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
              </>
            )}
  
            {/* Quick Stats */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Quick Stats</h4>
              <div className="text-xs text-gray-700 space-y-1">
                <div>Available Questions: {filteredQuestions.length}</div>
                <div>Selected Subjects: {Object.keys(formData.subjects).filter(s => formData.subjects[s] > 0).length}</div>
                <div>Total Marks Allocated: {totalSelectedMarks}</div>
                <div>Generation Mode: <span className="capitalize font-medium">{generationMode}</span></div>
                {totalSelectedMarks > 0 && generationMode !== 'bloom' && (
                  <div>Est. Questions: ~{Math.ceil(totalSelectedMarks / ((formData.marksPerQuestion.easy + formData.marksPerQuestion.medium + formData.marksPerQuestion.hard) / 3))}</div>
                )}
              </div>
            </div>
          </div>
  
          {/* Generated Paper Preview/Summary */}
          <div className="lg:col-span-2 space-y-4">
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
                <p className="text-gray-500 mb-4">Configure your paper settings and filters, then click "Generate Paper"</p>
                
                {Object.keys(filteredSubjectCounts).length === 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded p-3 text-sm text-yellow-800">
                    <strong>No questions available with current filters.</strong><br />
                    Try adjusting your difficulty or subject filters to see available questions.
                  </div>
                )}
                
                {Object.keys(filteredSubjectCounts).length > 0 && totalSelectedMarks === 0 && generationMode !== 'bloom' && generationMode !== 'prompt' && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm text-blue-800">
                    <strong>Configure subject marks distribution.</strong><br />
                    Use "Auto Distribute" or manually set marks for each subject.
                  </div>
                )}
  
                {generationMode === 'prompt' && (
                  <div className="bg-green-50 border border-green-200 rounded p-3 text-sm text-green-800">
                    <strong>Use AI Prompt Generation.</strong><br />
                    Describe your exam requirements in natural language to generate a paper automatically.
                  </div>
                )}
  
                {generationMode === 'bloom' && (
                  <div className="bg-purple-50 border border-purple-200 rounded p-3 text-sm text-purple-800">
                    <strong>Configure Bloom's Taxonomy Distribution.</strong><br />
                    Set the percentage distribution for different cognitive levels and generate your paper.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

export default AutoGeneratePaper