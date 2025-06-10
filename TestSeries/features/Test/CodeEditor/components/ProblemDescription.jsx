import React from 'react';

const ProblemDescription = ({ problem }) => {
  if (!problem) return <div>No problem loaded.</div>;

  // Defensive defaults
  const examples = problem.examples || [];
  const constraints = problem.constraints || [];

  return (
    <div className="p-4 overflow-y-auto">
      {/* Title & Difficulty */}
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{problem.title || 'Untitled Problem'}</h2>
        {problem.difficulty && (
          <span
            className={`px-2 py-1 rounded text-xs ${
              problem.difficulty === 'Easy'
                ? 'bg-green-100 text-green-700'
                : problem.difficulty === 'Medium'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {problem.difficulty}
          </span>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed">{problem.description || 'No description available.'}</p>
      </div>

      {/* Examples */}
      {examples.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Examples:</h3>
          {examples.map((example, i) => (
            <div key={i} className="bg-gray-50 p-3 rounded mb-3">
              {example.input && (
                <div className="mb-2">
                  <strong>Input:</strong>{' '}
                  <code className="bg-gray-200 px-1 rounded">{example.input}</code>
                </div>
              )}
              {example.output && (
                <div className="mb-2">
                  <strong>Output:</strong>{' '}
                  <code className="bg-gray-200 px-1 rounded">{example.output}</code>
                </div>
              )}
              {example.explanation && (
                <div>
                  <strong>Explanation:</strong> {example.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input/Output Format */}
      {(problem.input_format || problem.output_format) && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Input/Output Format:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problem.input_format && (
              <div>
                <h4 className="font-medium mb-2">Input:</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="text-sm whitespace-pre-line">{problem.input_format}</pre>
                </div>
              </div>
            )}
            {problem.output_format && (
              <div>
                <h4 className="font-medium mb-2">Output:</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <pre className="text-sm whitespace-pre-line">{problem.output_format}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sample Input/Output */}
      {(problem.sample_input || problem.sample_output) && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Sample:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {problem.sample_input && (
              <div>
                <h4 className="font-medium mb-2">Sample Input:</h4>
                <div className="bg-gray-100 p-3 rounded border">
                  <pre className="text-sm whitespace-pre-line">{problem.sample_input}</pre>
                </div>
              </div>
            )}
            {problem.sample_output && (
              <div>
                <h4 className="font-medium mb-2">Sample Output:</h4>
                <div className="bg-gray-100 p-3 rounded border">
                  <pre className="text-sm">{problem.sample_output}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Constraints */}
      {constraints.length > 0 && (
        <div>
          <h3 className="font-semibold mb-3">Constraints:</h3>
          <ul className="list-disc list-inside text-gray-700">
            {constraints.map((constraint, i) => (
              <li key={i}>{constraint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemDescription;
