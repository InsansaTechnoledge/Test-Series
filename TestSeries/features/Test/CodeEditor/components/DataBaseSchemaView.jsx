import React from 'react';

const DatabaseSchemaView = ({ problem }) => {
  if (!problem) {
    return (
      <div className="p-4 bg-gray-50 border rounded mb-4">
        <h3 className="font-semibold mb-3 text-lg">Database Schema Mapping</h3>
        <div className="text-gray-500 italic">No problem data loaded.</div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 border rounded mb-4">
      <h3 className="font-semibold mb-3 text-lg">Database Schema Mapping</h3>
      <div className="grid grid-cols-1 gap-3 text-sm">
        <div>
          <span className="font-medium text-blue-600">ID:</span>
          <span className="ml-2 font-mono bg-white px-2 py-1 rounded">
            {problem.id || 'N/A'}
          </span>
        </div>
        <div>
          <span className="font-medium text-blue-600">Prompt:</span>
          <div className="ml-2 mt-1 bg-white p-2 rounded border">
            {problem.prompt || 'N/A'}
          </div>
        </div>
        <div>
          <span className="font-medium text-blue-600">Input Format:</span>
          <div className="ml-2 mt-1 bg-white p-2 rounded border font-mono text-xs whitespace-pre-line">
            {problem.input_format || 'N/A'}
          </div>
        </div>
        <div>
          <span className="font-medium text-blue-600">Output Format:</span>
          <div className="ml-2 mt-1 bg-white p-2 rounded border font-mono text-xs">
            {problem.output_format || 'N/A'}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium text-blue-600">Sample Input:</span>
            <div className="ml-2 mt-1 bg-white p-2 rounded border font-mono text-xs whitespace-pre-line">
              {problem.sample_input || 'N/A'}
            </div>
          </div>
          <div>
            <span className="font-medium text-blue-600">Sample Output:</span>
            <div className="ml-2 mt-1 bg-white p-2 rounded border font-mono text-xs">
              {problem.sample_output || 'N/A'}
            </div>
          </div>
        </div>
        <div>
          <span className="font-medium text-blue-600">Test Cases (JSONB):</span>
          <div className="ml-2 mt-1 bg-white p-2 rounded border">
            <pre className="text-xs overflow-x-auto">
              {JSON.stringify(problem.test_cases || [], null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DatabaseSchemaView;
