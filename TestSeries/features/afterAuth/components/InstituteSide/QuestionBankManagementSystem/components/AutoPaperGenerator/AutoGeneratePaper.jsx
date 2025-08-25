import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  FileText, 
  Download, 
  RefreshCw, 
  Eye,
  Wand2,
  BookOpen,
  Clock,
  Award,
  Lightbulb,
  Send,
  Zap
} from 'lucide-react';
import axios from 'axios';

const AIPromptExamGenerator = ({ questions }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handlePromptGeneration = async () => {
    if (!prompt.trim() || !questions?.data?.length) return;
    
    setIsGenerating(true);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.post('http://3.236.209.208:8000/generate_exam', {
        'prompt' : 'generate me exam for 40 marks',
        'organization_id' : '686e4d384529d5bc5f8a93e1'
      })

      console.log('as', response);
      
      
      // For now, we'll just set a placeholder
      const paper = {
        title: "AI Generated Exam Paper",
        totalQuestions: 0,
        totalMarks: 0,
        sections: [],
        generatedAt: new Date().toISOString()
      };
      
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
    // pdfGenerator.generateAndDownload(generatedPaper);
    console.log('Downloading PDF...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/70 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Exam Generator
              </h1>
              <p className="text-sm text-gray-600">Create perfect exam papers with natural language</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Questions</p>
                <p className="text-xl font-bold text-gray-900">{questions?.data?.length || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Papers Generated</p>
                <p className="text-xl font-bold text-gray-900">{generatedPaper ? 1 : 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">AI Powered</p>
                <p className="text-xl font-bold text-gray-900">Ready</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Prompt Input Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-lg">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <Wand2 className="w-6 h-6 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">Describe Your Exam</h2>
                </div>
                <p className="text-gray-600">Tell the AI what kind of exam paper you need in natural language</p>
              </div>

              <div className="relative mb-6">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Example: Create a 100-mark physics exam on mechanics with 30% easy, 50% medium, and 20% hard questions covering kinematics, dynamics, and energy..."
                  className="w-full h-32 p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white/50 backdrop-blur-sm"
                  disabled={isGenerating}
                />
                <div className="absolute bottom-3 right-3 text-xs text-gray-400">
                  {prompt.length}/1000
                </div>
              </div>

              <button
                onClick={handlePromptGeneration}
                disabled={isGenerating || !prompt.trim() || !questions?.data?.length}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-3 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    AI is creating your exam...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Exam Paper
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              {!questions?.data?.length && (
                <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Lightbulb className="w-5 h-5" />
                    <span className="font-medium">No questions available</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Please upload or load question bank data to generate exam papers.
                  </p>
                </div>
              )}
            </div>

            {/* AI Tips */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-6 border border-blue-200/50">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                Pro Tips for Better Results
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Specify total marks, difficulty distribution, and time duration</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Mention specific topics or chapters to include</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include question types (MCQ, short answer, essay)</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Generated Paper Section */}
          <div className="lg:col-span-2 space-y-6">
            {generatedPaper ? (
              <>
                <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      Generated Paper
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowPreview(!showPreview)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={downloadPDF}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="p-3 bg-green-50 rounded-2xl">
                      <p className="text-green-800 font-medium">✨ Paper generated successfully!</p>
                      <p className="text-green-700 text-xs mt-1">Ready for review and download</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-gray-600 text-xs">Total Questions</p>
                        <p className="font-bold text-gray-900">{generatedPaper.totalQuestions || 0}</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-xl">
                        <p className="text-gray-600 text-xs">Total Marks</p>
                        <p className="font-bold text-gray-900">{generatedPaper.totalMarks || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {showPreview && (
                  <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-lg">
                    <h4 className="font-semibold text-gray-900 mb-4">Preview</h4>
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>Paper preview would be displayed here...</p>
                      {/* Paper preview content would go here */}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Paper Generated Yet</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Describe your exam requirements and let AI create the perfect paper for you
                </p>
                <div className="inline-flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-full">
                  <Brain className="w-4 h-4" />
                  AI Ready
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPromptExamGenerator;