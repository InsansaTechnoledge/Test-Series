const ProblemDescription = ({ problem }) => {
  if (!problem) return <div>No problem loaded.</div>;
  console.log("Problem data:", problem);
  const sampleTestCases = problem.sample_test_case || [];
  const exampleTestCases = problem.example_test_cases || [];
  const functionMeta = problem.meta_data || null;

  return (
    <div className="p-4 overflow-y-auto">
      {/* Title, Difficulty, Marks */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold mb-2">{problem.title || 'Untitled Problem'}</h2>
          {problem.difficulty && (
            <span
              className={`px-2 py-1 rounded text-xs ${problem.difficulty === 'Easy'
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
        {problem.marks && (
          <div className="text-sm font-medium text-gray-600">Marks: {problem.marks}</div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <div
          className={`prose prose-sm max-w-none text-gray-600 mb-8`}
          dangerouslySetInnerHTML={{ __html: problem.content }}
        />
      </div>

      {/* Examples */}
      {exampleTestCases && (
        <>
          <h3 className="font-semibold mb-3">Example Test Cases:</h3>
          <div
            className="prose prose-sm max-w-none text-gray-600 mb-8"
            dangerouslySetInnerHTML={{
              __html: problem.example_test_cases.replace(/\n/g, '<br />')
            }}
          />

        </>
      )
      }

      {/* Sample Test Case */}
      {
        sampleTestCases && (
          <>
            <h3 className="font-semibold mb-3">Sample Test Cases:</h3>
            <div
              className="prose prose-sm max-w-none text-gray-600 mb-8"
              dangerouslySetInnerHTML={{
                __html: problem.sample_test_case.replace(/\n/g, '<br />')
              }}
            />

          </>
        )
      }

      {/* Constraints */}
      {functionMeta && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Function Signature:</h3>
          <div className="bg-gray-100 p-3 rounded text-sm">
            <code>
              {functionMeta.name}(
              {functionMeta.params?.map((p, i) => `${p.name}: ${p.type}`).join(', ')}
              ) → {functionMeta.return?.type}
            </code>
          </div>
        </div>
      )}

    </div>
  );
};

export default ProblemDescription;

