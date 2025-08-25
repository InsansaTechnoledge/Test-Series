import React, { useState } from 'react';
import { Sparkles, RefreshCw, FileText, Download, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const AIPromptExamGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const API_URL = 'http://3.236.209.208:8000/generate_exam';

  const handlePromptGeneration = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setGeneratedPaper(null);

    try {
      const response = await axios.post(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          organization_id: '686e4d384529d5bc5f8a93e1'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      const paper = {
        title: data?.title || 'AI Generated Exam Paper',
        totalQuestions: data?.totalQuestions ?? 0,
        totalMarks: data?.totalMarks ?? 0,
        sections: Array.isArray(data?.sections) ? data.sections : [],
        generatedAt: new Date().toISOString(),
        raw: data
      };

      setGeneratedPaper(paper);
    } catch (e) {
      console.error('Error generating paper:', e);
      setError('Failed to generate the exam. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPaper = () => {
    if (!generatedPaper) return;
    
    const lines = [];
    lines.push(`${generatedPaper.title}`);
    lines.push(`Generated: ${new Date(generatedPaper.generatedAt).toLocaleString()}`);
    lines.push(`Questions: ${generatedPaper.totalQuestions} | Marks: ${generatedPaper.totalMarks}`);
    lines.push('');
    lines.push('='.repeat(50));
    lines.push('');

    generatedPaper.sections.forEach((section, i) => {
      lines.push(`SECTION ${i + 1}: ${section?.title || 'Untitled'}`);
      lines.push('-'.repeat(30));
      
      if (Array.isArray(section?.questions)) {
        section.questions.forEach((q, qi) => {
          lines.push(`${qi + 1}. ${q?.text || 'Question'} ${q?.marks ? `[${q.marks} marks]` : ''}`);
          
          if (Array.isArray(q?.options) && q.options.length) {
            q.options.forEach((opt, oi) => {
              lines.push(`   ${String.fromCharCode(97 + oi)}) ${opt}`);
            });
          }
          lines.push('');
        });
      }
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedPaper.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handlePromptGeneration();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Prompt Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto p-6">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Describe your exam requirements... (e.g., 'Create a 50-mark Data Structures exam with 60% MCQs and 40% short answers, covering arrays, linked lists, and trees. Mix of easy (40%), medium (40%), and hard (20%) questions for 90 minutes.')"
              className="w-full h-24 px-4 py-3 pr-20 text-gray-900 placeholder-gray-500 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              disabled={isGenerating}
            />
            <button
              onClick={handlePromptGeneration}
              disabled={isGenerating || !prompt.trim()}
              className="absolute right-3 top-3 h-10 px-6 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate
                </>
              )}
            </button>
          </div>
          <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
            <span>{prompt.length}/2000 characters</span>
            <span>Ctrl + Enter to generate</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-4xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">Generation Failed</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {isGenerating && (
          <div className="bg-white rounded-xl border p-8 text-center">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your Exam</h3>
            <p className="text-gray-600">Please wait while we create your personalized exam paper...</p>
          </div>
        )}

        {!generatedPaper && !isGenerating && !error && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate</h3>
            <p className="text-gray-600">Enter your exam requirements above and click generate to create your paper.</p>
          </div>
        )}

        {generatedPaper && (
          <div className="bg-white rounded-xl border shadow-sm">
            {/* Header */}
            <div className="px-6 py-4 border-b bg-indigo-50 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{generatedPaper.title}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Generated on {new Date(generatedPaper.generatedAt).toLocaleDateString()} at{' '}
                    {new Date(generatedPaper.generatedAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={downloadPaper}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="px-6 py-4 border-b bg-gray-50">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{generatedPaper.totalQuestions}</div>
                  <div className="text-sm text-gray-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{generatedPaper.totalMarks}</div>
                  <div className="text-sm text-gray-600">Total Marks</div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {Array.isArray(generatedPaper.sections) && generatedPaper.sections.length > 0 ? (
                <div className="space-y-8">
                  {generatedPaper.sections.map((section, sIndex) => (
                    <div key={sIndex}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">
                        Section {sIndex + 1}: {section?.title || 'Untitled Section'}
                      </h3>
                      
                      {Array.isArray(section?.questions) && section.questions.length > 0 ? (
                        <div className="space-y-4">
                          {section.questions.map((question, qIndex) => (
                            <div key={qIndex} className="p-4 bg-gray-50 rounded-lg">
                              <div className="flex justify-between items-start mb-2">
                                <p className="font-medium text-gray-900 flex-1">
                                  <span className="text-indigo-600 font-semibold">{qIndex + 1}.</span>{' '}
                                  {question?.text || 'Question text'}
                                </p>
                                {question?.marks && (
                                  <span className="ml-4 px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded">
                                    {question.marks} marks
                                  </span>
                                )}
                              </div>
                              
                              {Array.isArray(question?.options) && question.options.length > 0 && (
                                <div className="mt-3 space-y-1">
                                  {question.options.map((option, oIndex) => (
                                    <div key={oIndex} className="text-gray-700 text-sm">
                                      <span className="font-medium text-indigo-600">
                                        {String.fromCharCode(97 + oIndex)})
                                      </span>{' '}
                                      {option}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No questions available in this section.</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No sections generated. Try a different prompt.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPromptExamGenerator;