function formatParamForJava(value, type) {
  if (type === 'integer') {
    return value.toString();
  }

  if (type === 'float') {
    return `${value}f`;
  }

  if (type === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (type === 'string') {
    if (value.startsWith('"') && value.endsWith('"')) {
    return value;
  } else {
    return `"${value}"`;
  }
  }

  if (type === 'integer[]') {
    return `new int[]{${value.join(', ')}}`;
  }

  if (type === 'integer[][]') {
    return `new int[][]{${value.map(inner => `new int[]{${inner.join(', ')}}`).join(', ')}}`;
  }

  if (type === 'float[]') {
    return `new float[]{${value.map(v => `${v}f`).join(', ')}}`;
  }

  if (type === 'string[]') {
    return `new String[]{${value.map(v => `"${v}"`).join(', ')}}`;
  }

  // Default fallback
  if (Array.isArray(value)) { 
    console.log((typeof value));
    return `{ ${value.join(", ")}}`;
  }

  return JSON.stringify(value);
}


function formatJavaInputArray(inputArray, metadataParams) {
  const paramCount = metadataParams.length;
  const formattedCases = inputArray.map(testCase => {
    if (!Array.isArray(testCase) || testCase.length !== paramCount) {
      throw new Error(`Expected ${paramCount} parameters, got ${testCase.length}`);
    }

    const formattedParams = testCase.map((value, i) => {
      const type = metadataParams[i].type;
      console.log(type);
      console.log(value);
      return formatParamForJava(value, type);
    });

    return `{ ${formattedParams.join(', ')} }`;
  });

  if (paramCount === 0) {

    return `new Object[][]{}`;
  }

  else if (paramCount === 1) {
    return `{ ${formattedCases.join(', ')} }`;
  }
  else
 if (
  paramCount > 1 &&
  new Set(metadataParams.map(p => p.type)).size === metadataParams.length
) {
  return `new Object[][] { ${formattedCases.join(', ')} }`;
}
  else {
    return `{ ${formattedCases.join(', ')} }`;
  }
}


function formatParamForCpp(value, type) {
  if (type === 'integer' || type === 'float') {
    return value.toString();
  } else if (type === 'boolean') {
    return value ? 'true' : 'false';
  } else if (type === 'string') {
    if (value.startsWith('"') && value.endsWith('"')) {
    return value;
  } else {
    return `"${value}"`;
  }
  } else if (type === 'integer[]' || type === 'float[]') {
    return `{${value.join(',')}}`;
  } else if (type === 'integer[][]' || type === 'float[][]') {
    return `{${value.map(inner => `{${inner.join(',')}}`).join(',')}}`;
  } else if (type === 'string[]') {
    return `{${value.map(v => `"${v}"`).join(',')}}`;
  } else {
    if (Array.isArray(value)) {
      return `{${value.join(',')}}`;
    }
    return JSON.stringify(value);
  }
}

function formatCppInputArray(inputArray, metadataParams) {
  const paramCount = metadataParams.length;

  const formattedCases = inputArray.map((testCase, caseIndex) => {
    if (!Array.isArray(testCase) || testCase.length !== paramCount) {
      throw new Error(`Test case at index ${caseIndex} expected ${paramCount} params, got ${testCase.length}`);
    }

    const formattedParams = testCase.map((value, i) => {
      const type = metadataParams[i].type;
      return formatParamForCpp(value, type);
    });

    return `{${formattedParams.join(',')}}`;
  });

  return `{${formattedCases.join(',')}}`;
}


function generateCInputs(inputArray, metadataParams) {
  if (!Array.isArray(inputArray)) {
    throw new Error("inputArray must be an array");
  }

  const varDeclarations = [];
  const pointerArrays = [];
  const sizeArrays = [];

  metadataParams.forEach((param, pIndex) => {
    const type = param.type;
    let isArray = type.endsWith('[]');
    const baseType = type.replace(/\[\]$/, '');
    let cType = mapTypeToC(baseType);
    if (cType === 'int[]') {
      cType = 'int';
      isArray = true;
    }
    const varNameBase = param.name;

    const ptrArrayName = `ptr_${varNameBase}`;
    const sizeArrayName = `size_${varNameBase}`;

    const ptrItems = [];
    const sizeItems = [];

    inputArray.forEach((testCase, testIndex) => {
      const varName = `input${testIndex + 1}_${varNameBase}`;
      const value = testCase[pIndex];

      if (isArray) {
        // Array declaration
        if (!Array.isArray(value)) {
          throw new Error(`Expected array for param ${varNameBase} in test case ${testIndex + 1}`);
        }
        varDeclarations.push(`${cType} ${varName}[] = {${value.join(", ")}};`);
        ptrItems.push(varName);
        sizeItems.push(value.length);
      } else {
        // Scalar declaration
        const formatted = formatValueForC(value, baseType);
        varDeclarations.push(`${cType} ${varName} = ${formatted};`);
        ptrItems.push(`&${varName}`);
        sizeItems.push(1);
      }
    });

    pointerArrays.push(`${cType}* ${ptrArrayName}[] = {${ptrItems.join(", ")}};`);
    sizeArrays.push(`int ${sizeArrayName}[] = {${sizeItems.join(", ")}};`);
  });

  return [
    "// Variable Declarations",
    ...varDeclarations,
    "\n// Pointer Arrays for all params",
    ...pointerArrays,
    "\n// Size Arrays for all params",
    ...sizeArrays
  ].join("\n");
}


function mapTypeToC(type) {
  const map = {
    'integer': 'int',
    'float': 'float',
    'double': 'double',
    'boolean': 'bool',
    'char': 'char',
    'string': 'char*',
    '': 'void',
  };
  return map[type] || `int[]`;
}

function formatValueForC(value, type) {
  if (type === 'string') { if (value.startsWith('"') && value.endsWith('"')) {
    return value;
  } else {
    return `"${value}"`;
  };
}
  if (type === 'char') return `'${value}'`;
  if (type === 'boolean') return value ? 'true' : 'false';
  if (type === 'float') return `${value}f`;
  return value.toString();
}





function generateCodeTemplate(langSlug, userCode, inputArray, template, meta_data) {
  if (!langSlug || !userCode) {
    throw new Error('Language slug and user code are required');
  }


  if (!template) {
    throw new Error(`No template found for language: ${langSlug}`);
  }
  let formattedInput;

  if (langSlug === 'javascript' || langSlug === 'python' || langSlug === 'python3') {
    formattedInput = JSON.stringify(inputArray);

  }
  else if (langSlug === 'java') {
    formattedInput = formatJavaInputArray(inputArray, meta_data.params);
  }
  else if (langSlug === 'cpp') {
    formattedInput = formatCppInputArray(inputArray, meta_data.params);
  }
  else if (langSlug === 'c') {
    formattedInput = generateCInputs(inputArray, meta_data.params);
  }

  else {
    throw new Error(`Unsupported language slug: ${langSlug}`);
  }


  return template
    .replace("__USER_CODE__", userCode)
    .replace("__INPUT__", formattedInput);
};

const typeParsers = {
  'integer': (v) => Number(v),
  'float': (v) => parseFloat(v),
  'boolean': (v) => v === 'true',
  'string': (v) => v,
  'integer[]': (v) => JSON.parse(v),
  'integer[][]': (v) => JSON.parse(v),
  'object': (v) => JSON.parse(v),
};

function parseExampleInputs(exampleTestCases, metadata) {
  const paramCount = metadata?.params.length;
  const lines = exampleTestCases.trim().split('\n');
  const inputs = [];

  for (let i = 0; i < lines.length; i += paramCount) {
    const testCase = [];

    for (let j = 0; j < paramCount; j++) {
      const paramMeta = metadata.params[j];
      const parser = typeParsers[paramMeta.type] || ((v) => JSON.parse(v));
      testCase.push(parser(lines[i + j]));
    }

    inputs.push(testCase);
  }


  return inputs;
}

function parseStructuredTestCase(testCase, metadata) {
  const testInput = [];
  const paramDefs = metadata.params;

  for (const paramDef of paramDefs) {
    const rawValue = testCase.input[paramDef.name];
    testInput.push(rawValue); // already parsed JSON
  }

  const output = testCase.output;
  return { input: testInput, output };
}



export const getFinalCodeForTestRun = async (langSlug, userCode, problem) => {
  if (!langSlug || !userCode || !problem) {
    throw new Error('Language slug, user code, and problem are required');
  }
  const template = problem.code_snippets?.find(snippet => snippet.langSlug === langSlug)?.driver_code || '';

  const inputArray = [];

  if (problem.example_test_cases) {
    inputArray.push(...parseExampleInputs(problem.example_test_cases, problem.meta_data));
  }


  if (problem.sample_test_case) {
    const sampleInputs = parseExampleInputs(problem.sample_test_case, problem.meta_data);
    if (sampleInputs.length > 0) {
      inputArray.push(sampleInputs[0]);
    }
  }

  const finalCode = await generateCodeTemplate(langSlug, userCode, inputArray, template, problem.meta_data);

  return {
    finalCode: finalCode,
    testInput: inputArray
  };

}

export const getFinalCodeForSubmission = async (langSlug, userCode, problem) => {
  if (!langSlug || !userCode || !problem) {
    throw new Error('Language slug, user code, and problem are required');
  }
  const template = problem.code_snippets?.find(snippet => snippet.langSlug === langSlug)?.driver_code;

  const inputArray = [];
  const outputArray = [];

  if (problem.example_test_cases) {
    inputArray.push(...parseExampleInputs(problem.example_test_cases, problem.meta_data));
  }

  if (problem.sample_test_case) {
    const sampleInputs = parseExampleInputs(problem.sample_test_case, problem.meta_data);
    if (sampleInputs.length > 0) {
      inputArray.push(sampleInputs[0]);
    }
  }

  problem.test_cases?.forEach(testCase => {
    const { input, output } = parseStructuredTestCase(testCase, problem.meta_data);
    inputArray.push(input);
    outputArray.push(output);
  });

  const finalCode = await generateCodeTemplate(langSlug, userCode, inputArray, template, problem.meta_data);

  return {
    finalCode: finalCode,
    output: outputArray,
    testInput: inputArray
  }
};

