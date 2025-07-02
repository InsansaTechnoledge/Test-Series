export const generateCodeTemplate = async (langSlug, userCode, inputArray, template) => {
  if (!langSlug || !userCode) {
    throw new Error('Language slug and user code are required');
  }


  if (!template) {
    throw new Error(`No template found for language: ${langSlug}`);
  }
  let formattedInput;

  if (langSlug === 'javascript' || langSlug === 'python') {
    formattedInput = JSON.stringify(inputArray);

  }
  else if (langSlug === 'java') {
    formattedInput = "new int[][]{" + inputArray.map(arr => "{" + arr.join(',') + "}").join(',') + "}";
  }
  else if (langSlug === 'cpp') {
    formattedInput = "{" + inputArray.map(arr => "{" + arr.join(',') + "}").join(',') + "}";
  }
  else if (langSlug === 'c') {
    const inputDefs = inputArray.map((arr, index) => `int input${index + 1}[] = {${arr.join(",")}};`).join("\n");

    const pointerArray = `int* inputs[]={${inputArray.map((_, index) => `input${index + 1}`).join(",")}};`;
    const sizes = `int sizes[]={${inputArray.map(arr => arr.length).join(",")}};`;
    formattedInput = inputDefs + "\n" + pointerArray + "\n" + sizes;

  }

  else {
    throw new Error(`Unsupported language slug: ${langSlug}`);
  }
  return template
    .replace("__USER_CODE__", userCode)
    .replace("__INPUT__", formattedInput);
};

export const getFinalCodeForTestRun = async (langSlug, userCode, problem) => {
  if (!langSlug || !userCode || !problem) {
    throw new Error('Language slug, user code, and problem are required');
  }
  const template = problem.code_snippets?.find(snippet => snippet.langSlug === langSlug)?.driver_code;


  let inputArray = [];

  const linesInExampleTestCases = problem.example_test_cases?.split('\n') || [];

  linesInExampleTestCases.forEach(line => {
    const problem = JSON.parse(line);
    inputArray.push(problem);
  });

  inputArray.push(JSON.parse(problem.sample_test_case));
  console.log("Input Array:", inputArray);

  const finalCode = await generateCodeTemplate(langSlug, userCode, inputArray, template);


  return finalCode;

}

export const getFinalCodeForSubmission = async (langSlug, userCode, problem) => {
  if (!langSlug || !userCode || !problem) {
    throw new Error('Language slug, user code, and problem are required');
  }
  const template = problem.code_snippets?.find(snippet => snippet.langSlug === langSlug)?.driver_code;

  let inputArray = [];

  const linesInExampleTestCases = problem.example_test_cases?.split('\n') || [];

  linesInExampleTestCases.forEach(line => {
    const problem = JSON.parse(line);
    inputArray.push(problem);
  });

  inputArray.push(JSON.parse(problem.sample_test_case));
  let outputArray = [];
  let output = null;

  problem.test_cases?.forEach(testCase => {
    if (testCase.input) {
      let parsedInput = null;

      for (const key in testCase.input) {
        parsedInput = (testCase.input[key]);
      }
      if (parsedInput) {
        inputArray.push(parsedInput);
      }
    }
    if (testCase.output) {
      output = testCase.output;
      outputArray.push(output);
    }
  });

  const finalCode = await generateCodeTemplate(langSlug, userCode, inputArray, template);

  return {
    finalCode: finalCode,
    output: outputArray
  }
};



