import { useTheme } from "../../../../hooks/useTheme";

const ProblemDescription = ({ problem }) => {
  if (!problem) return <div>No problem loaded.</div>;

  console.log("Problem data:", problem);

  const sampleTestCases = problem.sample_test_case || [];
  const exampleTestCases = problem.example_test_cases || [];
  const functionMeta = problem.meta_data || null;
  const { theme } = useTheme();

  return (
    <div className="p-4 overflow-y-auto" style={{ maxHeight: "calc(80vh - 100px)" }}>
      {/* Title, Difficulty, Marks */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className={`text-xl font-bold mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            }`}>
            {problem.title || 'Untitled Problem'}
          </h2>
          {problem.difficulty && (
            <span
              className={`px-2 py-1 rounded text-xs ${problem.difficulty === 'Easy'
                  ? theme === 'light'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-800 text-green-200'
                  : problem.difficulty === 'Medium'
                    ? theme === 'light'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-yellow-800 text-yellow-200'
                    : theme === 'light'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-red-800 text-red-200'
                }`}
            >
              {problem.difficulty}
            </span>
          )}
        </div>
        {problem.marks && (
          <div className={`text-sm font-medium ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'
            }`}>
            Marks: {problem.marks}
          </div>
        )}
      </div>

      {/* Description */}
      <div className="mb-6">
        <div
          className={`prose prose-sm max-w-none mb-8 ${theme === 'light'
              ? 'text-gray-600 prose-gray'
              : 'text-gray-300 prose-invert'
            }`}
          dangerouslySetInnerHTML={{ __html: problem.content }}
        />
      </div>

      {/* Examples */}
      {exampleTestCases && (
        <>
          <h3 className={`font-semibold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            }`}>
            Example Test Cases:
          </h3>
          <div
            className={`prose prose-sm max-w-none mb-8 ${theme === 'light'
                ? 'text-gray-600 prose-gray'
                : 'text-gray-300 prose-invert'
              }`}
            dangerouslySetInnerHTML={{
              __html: problem.example_test_cases.replace(/\n/g, '<br />')
            }}
          />
        </>
      )}

      {/* Sample Test Case */}
      {sampleTestCases && (
        <>
          <h3 className={`font-semibold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            }`}>
            Sample Test Cases:
          </h3>
          <div
            className={`prose prose-sm max-w-none mb-8 ${theme === 'light'
                ? 'text-gray-600 prose-gray'
                : 'text-gray-300 prose-invert'
              }`}
            dangerouslySetInnerHTML={{
              __html: problem.sample_test_case.replace(/\n/g, '<br />')
            }}
          />
        </>
      )}

      {/* Constraints */}
      {functionMeta && (
        <div className="mb-6">
          <h3 className={`font-semibold mb-3 ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'
            }`}>
            Function Signature:
          </h3>
          <div className={`p-3 rounded text-sm ${theme === 'light'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-gray-800 text-gray-200'
            }`}>
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