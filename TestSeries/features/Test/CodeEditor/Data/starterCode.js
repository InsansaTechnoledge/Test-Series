export const generateCodeTemplate = async ({ userCode, langSlug, problem }) => {
  const methodName = problem.meta_data?.name || 'solve';
  const metaParams = problem.meta_data?.params || [];
  const sampleInput = problem.sample_test_case;

  const paramsObj = {};
  for (const param of metaParams) {
    paramsObj[param.name] = JSON.parse(sampleInput|| 'null');
  }

  switch (langSlug) {
    case 'python':
    case 'python3':
      return generatePython(userCode, methodName, paramsObj);
    case 'cpp':
      return generateCpp(userCode, methodName, paramsObj);
    case 'java':
      return generateJava(userCode, methodName, paramsObj);
    case 'javascript':
      return generateJavaScript(userCode, methodName, paramsObj);
    case 'c':
      return generateC(userCode, methodName, paramsObj);
    case 'csharp':
      return generateCSharp(userCode, methodName, paramsObj);
    case 'php':
      return generatePHP(userCode, methodName, paramsObj);
    case 'typescript':
      return generateTypeScript(userCode, methodName, paramsObj);
    case 'swift':
      return generateSwift(userCode, methodName, paramsObj);
    case 'kotlin':
      return generateKotlin(userCode, methodName, paramsObj);
    case 'dart':
      return generateDart(userCode, methodName, paramsObj);
    case 'golang':
      return generateGo(userCode, methodName, paramsObj);
    case 'ruby':
      return generateRuby(userCode, methodName, paramsObj);
    case 'scala':
      return generateScala(userCode, methodName, paramsObj);
    case 'rust':
      return generateRust(userCode, methodName, paramsObj);
    case 'racket':
    case 'elixir':
    case 'erlang':
      return `${userCode}\n\n// Please handle input parsing and printing manually.`;
    default:
      return userCode;
  }
};

function generatePython(code, methodName, params) {
  const args = Object.entries(params)
    .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
    .join('\n');
  const paramNames = Object.keys(params).join(', ');
  return `${code}\n\nif __name__ == "__main__":\n    ${args}\n    result = Solution().${methodName}(${paramNames})\n    print(result)`;
}

function generateCpp(code, methodName, params) {
  const argDeclarations = Object.entries(params).map(([k, v]) => {
    if (Array.isArray(v)) {
      return `vector<int> ${k} = ${JSON.stringify(v).replace(/\[/g, '{').replace(/\]/g, '}')};`;
    }
    if (typeof v === 'number') {
      return `int ${k} = ${v};`;
    }
    return `/* TODO: Convert ${k} */`;
  }).join('\n');
  const paramList = Object.keys(params).join(', ');
  return `#include <iostream>\n#include <vector>\nusing namespace std;\n\n${code}\n\nint main() {\n    ${argDeclarations}\n    Solution obj;\n    auto res = obj.${methodName}(${paramList});\n    cout << res << endl;\n    return 0;\n}`;
}

function generateJava(code, methodName, params) {
  const args = Object.entries(params)
    .map(([k, v]) => `// TODO: define input ${k} = ${JSON.stringify(v)}`)
    .join('\n    ');
  const paramList = Object.keys(params).join(', ');
  return `${code}\n\npublic class Main {\n  public static void main(String[] args) {\n    ${args}\n    Solution sol = new Solution();\n    Object result = sol.${methodName}(${paramList});\n    System.out.println(result);\n  }\n}`;
}

function generateJavaScript(code, methodName, params) {
  const args = Object.entries(params)
    .map(([k, v]) => `const ${k} = ${JSON.stringify(v)};`)
    .join('\n');
  const paramList = Object.keys(params).join(', ');
  return `${code}\n\n${args}\nconst result = ${methodName}(${paramList});\nconsole.log(result);`;
}

function generateC(code, methodName, params) {
  return `${code}\n\nint main() {\n    // TODO: Add input initialization\n    printf("%d\\n", ${methodName}());\n    return 0;\n}`;
}

function generateCSharp(code, methodName, params) {
  return `${code}\n\npublic class Program {\n  public static void Main() {\n    // TODO: define input\n    var result = new Solution().${methodName}();\n    Console.WriteLine(result);\n  }\n}`;
}

function generatePHP(code, methodName, params) {
  return `${code}\n\n$sol = new Solution();\necho $sol->${methodName}();`;
}

function generateTypeScript(code, methodName, params) {
  const args = Object.entries(params)
    .map(([k, v]) => `const ${k}: any = ${JSON.stringify(v)};`)
    .join('\n');
  const paramList = Object.keys(params).join(', ');
  return `${code}\n\n${args}\nconst result = ${methodName}(${paramList});\nconsole.log(result);`;
}

function generateSwift(code, methodName, params) {
  return `${code}\n\nlet sol = Solution()\n// TODO: define inputs\nprint(sol.${methodName}())`;
}

function generateKotlin(code, methodName, params) {
  return `${code}\n\nfun main() {\n    // TODO: define inputs\n    val result = Solution().${methodName}()\n    println(result)\n}`;
}

function generateDart(code, methodName, params) {
  return `${code}\n\nvoid main() {\n  // TODO: define inputs\n  var result = Solution().${methodName}();\n  print(result);\n}`;
}

function generateGo(code, methodName, params) {
  return `${code}\n\nfunc main() {\n    // TODO: define inputs\n    result := ${methodName}()\n    fmt.Println(result)\n}`;
}

function generateRuby(code, methodName, params) {
  return `${code}\n\n# TODO: define inputs\nputs ${methodName}()`;
}

function generateScala(code, methodName, params) {
  return `${code}\n\nobject Main extends App {\n  // TODO: define inputs\n  println(${methodName}())\n}`;
}

function generateRust(code, methodName, params) {
  return `${code}\n\nfn main() {\n    // TODO: define inputs\n    println!("{}", ${methodName}());\n}`;
}
