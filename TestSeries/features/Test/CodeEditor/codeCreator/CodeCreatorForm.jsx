import { Code, Plus } from "lucide-react";

const CodeCreatorForm = ({formData,setFormData}) => {

 
    
      const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
      };
    
      const handleTestCaseChange = (index, field, value) => {
        setFormData(prev => ({
          ...prev,
          test_cases: prev.test_cases.map((tc, i) => 
            i === index ? { ...tc, [field]: value } : tc
          )
        }));
      };
    
      const addTestCase = () => {
        setFormData(prev => ({
          ...prev,
          test_cases: [...prev.test_cases, { input: '', expected_output: '', explanation: '' }]
        }));
      };
    
      const removeTestCase = (index) => {
        if (formData.test_cases.length > 1) {
          setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.filter((_, i) => i !== index)
          }));
        }
      };
    
      const handleExampleChange = (index, field, value) => {
        setFormData(prev => ({
          ...prev,
          examples: prev.examples.map((ex, i) => 
            i === index ? { ...ex, [field]: value } : ex
          )
        }));
      };
    
      const addExample = () => {
        setFormData(prev => ({
          ...prev,
          examples: [...prev.examples, { input: '', output: '', explanation: '' }]
        }));
      };
    
      const removeExample = (index) => {
        if (formData.examples.length > 1) {
          setFormData(prev => ({
            ...prev,
            examples: prev.examples.filter((_, i) => i !== index)
          }));
        }
      };
    
      const handleConstraintChange = (index, value) => {
        setFormData(prev => ({
          ...prev,
          constraints: prev.constraints.map((c, i) => i === index ? value : c)
        }));
      };
    
      const addConstraint = () => {
        setFormData(prev => ({
          ...prev,
          constraints: [...prev.constraints, '']
        }));
      };
    
      const removeConstraint = (index) => {
        if (formData.constraints.length > 1) {
          setFormData(prev => ({
            ...prev,
            constraints: prev.constraints.filter((_, i) => i !== index)
          }));
        }
      };
    
      const handleStarterCodeChange = (language, value) => {
        setFormData(prev => ({
          ...prev,
          starter_code: { ...prev.starter_code, [language]: value }
        }));
      };
    


      return (
  <>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-t-2xl p-8 text-white">
          <div className="flex items-center gap-3 mb-4">
            <Code className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Create New Coding Question</h1>
          </div>
          <p className="text-blue-100">Design and structure your coding challenges with comprehensive test cases</p>
        </div>

        {/* Form */}
        <form className="bg-white rounded-b-2xl shadow-xl p-8 space-y-8">
          
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Two Sum"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">Problem Prompt</label>
            <textarea
              value={formData.prompt}
              onChange={(e) => handleInputChange('prompt', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Detailed problem description..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Short description for UI display..."
            />
          </div>

          {/* Input/Output Format */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">Input Format</label>
              <textarea
                value={formData.input_format}
                onChange={(e) => handleInputChange('input_format', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Describe the input format..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">Output Format</label>
              <textarea
                value={formData.output_format}
                onChange={(e) => handleInputChange('output_format', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Describe the output format..."
                required
              />
            </div>
          </div>

          {/* Sample Input/Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">Sample Input</label>
              <textarea
                value={formData.sample_input}
                onChange={(e) => handleInputChange('sample_input', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Sample input..."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-blue-800 mb-2">Sample Output</label>
              <textarea
                value={formData.sample_output}
                onChange={(e) => handleInputChange('sample_output', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Expected output..."
                required
              />
            </div>
          </div>

          {/* Test Cases */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-blue-800">Test Cases</label>
              <button
                type="button"
                onClick={addTestCase}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Test Case
              </button>
            </div>
            
            {formData.test_cases.map((testCase, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-800">Test Case {index + 1}</h4>
                  {formData.test_cases.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTestCase(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Input</label>
                    <textarea
                      value={testCase.input}
                      onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Test input..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Expected Output</label>
                    <textarea
                      value={testCase.expected_output}
                      onChange={(e) => handleTestCaseChange(index, 'expected_output', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Expected output..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Explanation</label>
                    <textarea
                      value={testCase.explanation}
                      onChange={(e) => handleTestCaseChange(index, 'explanation', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Explanation..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Passed percentage</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={testCase.passed_percentage || ''}
                      onChange={(e) => handleTestCaseChange(index, 'passed_percentage', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Passed percentage (0-100) of this test case"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Examples */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-blue-800">Examples (Legacy UI)</label>
              <button
                type="button"
                onClick={addExample}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Example
              </button>
            </div>
            
            {formData.examples.map((example, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-blue-800">Example {index + 1}</h4>
                  {formData.examples.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExample(index)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Input</label>
                    <input
                      type="text"
                      value={example.input}
                      onChange={(e) => handleExampleChange(index, 'input', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Example input..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Output</label>
                    <input
                      type="text"
                      value={example.output}
                      onChange={(e) => handleExampleChange(index, 'output', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Example output..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700 mb-1">Explanation</label>
                    <input
                      type="text"
                      value={example.explanation}
                      onChange={(e) => handleExampleChange(index, 'explanation', e.target.value)}
                      className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Explanation..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Constraints */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-blue-800">Constraints</label>
              <button
                type="button"
                onClick={addConstraint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Constraint
              </button>
            </div>
            
            {formData.constraints.map((constraint, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={constraint}
                  onChange={(e) => handleConstraintChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter constraint..."
                />
                {formData.constraints.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeConstraint(index)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Starter Code */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-4">Starter Code</label>
            
            <div className="space-y-4">
              {Object.entries(formData.starter_code).map(([language, code]) => (
                <div key={language}>
                  <label className="block text-xs font-medium text-blue-700 mb-2 capitalize">
                    {language === 'cpp' ? 'C++' : language.charAt(0).toUpperCase() + language.slice(1)}
                  </label>
                  <textarea
                    value={code}
                    onChange={(e) => handleStarterCodeChange(language, e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                    placeholder={`Enter ${language} starter code...`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          
        </form>
        </>
      
  );
    
};

export default CodeCreatorForm;