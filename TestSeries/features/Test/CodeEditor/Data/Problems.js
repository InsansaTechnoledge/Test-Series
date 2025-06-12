export const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      // Database mapping fields
      prompt: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
      input_format: "First line contains space-separated integers representing the array nums.\nSecond line contains the target integer.",
      output_format: "Return a JSON array containing the indices of the two numbers that add up to target.",
      sample_input: "2 7 11 15\n9",
      sample_output: "[0, 1]",
      test_cases: [
        { 
          input: "2 7 11 15\n9", 
          expected_output: "[0, 1]",
          explanation: "nums[0] + nums[1] = 2 + 7 = 9"
        },
        { 
          input: "3 2 4\n6", 
          expected_output: "[1, 2]",
          explanation: "nums[1] + nums[2] = 2 + 4 = 6"
        },
        { 
          input: "3 3\n6", 
          expected_output: "[0, 1]",
          explanation: "nums[0] + nums[1] = 3 + 3 = 6"
        }
      ],
      // Legacy fields for UI display
      description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
      examples: [
        {
          input: "nums = [2,7,11,15], target = 9",
          output: "[0,1]",
          explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
        }
      ],
      constraints: [
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "Only one valid answer exists."
      ],
      starterCode: {
        javascript: `function twoSum(nums, target) {
      // Read input
      const lines = require('fs').readFileSync('/dev/stdin', 'utf8').trim().split('\\n');
      const nums = lines[0].split(' ').map(Number);
      const target = parseInt(lines[1]);
      
      // Your solution here
      
      // Output result as JSON
      console.log(JSON.stringify(result));
  }
  
  // Call the function
  twoSum();`,
        python: `def twoSum():
      import sys
      lines = sys.stdin.read().strip().split('\\n')
      nums = list(map(int, lines[0].split()))
      target = int(lines[1])
      
      # Your solution here
      
      # Output result as JSON
      import json
      print(json.dumps(result))
  
  # Call the function
  twoSum()`,
        java: `import java.util.*;
  import java.io.*;
  
  class Solution {
      public static void main(String[] args) throws IOException {
          BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
          String[] numsStr = br.readLine().split(" ");
          int[] nums = new int[numsStr.length];
          for (int i = 0; i < numsStr.length; i++) {
              nums[i] = Integer.parseInt(numsStr[i]);
          }
          int target = Integer.parseInt(br.readLine());
          
          // Your solution here
          int[] result = twoSum(nums, target);
          
          // Output result as JSON
          System.out.println("[" + result[0] + ", " + result[1] + "]");
      }
      
      public static int[] twoSum(int[] nums, int target) {
          // Your code here
          return new int[]{0, 0};
      }
  }`,
        cpp: `#include <iostream>
  #include <vector>
  #include <sstream>
  using namespace std;
  
  class Solution {
  public:
      vector<int> twoSum(vector<int>& nums, int target) {
          // Your code here
          return {0, 0};
      }
  };
  
  int main() {
      string line;
      getline(cin, line);
      istringstream iss(line);
      vector<int> nums;
      int num;
      while (iss >> num) {
          nums.push_back(num);
      }
      
      int target;
      cin >> target;
      
      Solution sol;
      vector<int> result = sol.twoSum(nums, target);
      
      // Output result as JSON
      cout << "[" << result[0] << ", " << result[1] << "]" << endl;
      
      return 0;
  }`
      }
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      // Database mapping fields
      prompt: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order. Every close bracket has a corresponding open bracket of the same type.",
      input_format: "A single line containing the string s",
      output_format: "Return 'true' if the string is valid, 'false' otherwise",
      sample_input: "()",
      sample_output: "true",
      test_cases: [
        { 
          input: "()", 
          expected_output: "true",
          explanation: "Valid parentheses pair"
        },
        { 
          input: "()[]{}", 
          expected_output: "true",
          explanation: "All brackets are properly matched"
        },
        { 
          input: "(]", 
          expected_output: "false",
          explanation: "Mismatched bracket types"
        },
        { 
          input: "([)]", 
          expected_output: "false",
          explanation: "Incorrect closing order"
        }
      ],
      // Legacy fields for UI display
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: [
        {
          input: 's = "()"',
          output: "true"
        },
        {
          input: 's = "()[]{}"',
          output: "true"
        },
        {
          input: 's = "(]"',
          output: "false"
        }
      ],
      constraints: [
        "1 <= s.length <= 10^4",
        "s consists of parentheses only '()[]{}'."
      ],
      starterCode: {
        javascript: `function isValid() {
      const s = require('fs').readFileSync('/dev/stdin', 'utf8').trim();
      
      // Your solution here
      
      // Output result
      console.log(result ? 'true' : 'false');
  }
  
  // Call the function
  isValid();`,
        python: `def isValid():
      import sys
      s = sys.stdin.read().strip()
      
      # Your solution here
      
      # Output result
      print('true' if result else 'false')
  
  # Call the function
  isValid()`,
        java: `import java.util.*;
  import java.io.*;
  
  class Solution {
      public static void main(String[] args) throws IOException {
          BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
          String s = br.readLine();
          
          Solution sol = new Solution();
          boolean result = sol.isValid(s);
          
          System.out.println(result ? "true" : "false");
      }
      
      public boolean isValid(String s) {
          // Your code here
          return false;
      }
  }`,
        cpp: `#include <iostream>
  #include <string>
  using namespace std;
  
  class Solution {
  public:
      bool isValid(string s) {
          // Your code here
          return false;
      }
  };
  
  int main() {
      string s;
      getline(cin, s);
      
      Solution sol;
      bool result = sol.isValid(s);
      
      cout << (result ? "true" : "false") << endl;
      
      return 0;
  }`
      }
    },
    {
        id: 3,
        title: "Merge Sorted Arrays",
        difficulty: "Easy",
        prompt: "Given two sorted integer arrays nums1 and nums2, merge them into a single sorted array. Return the merged array.",
        input_format: "Two lines:\nFirst line contains space-separated integers for nums1.\nSecond line contains space-separated integers for nums2.",
        output_format: "Return a JSON array of the merged sorted integers.",
        sample_input: "1 2 3\n2 5 6",
        sample_output: "[1, 2, 2, 3, 5, 6]",
        test_cases: [
          { input: "1 2 3\n2 5 6", expected_output: "[1, 2, 2, 3, 5, 6]", explanation: "Merged and sorted." },
          { input: "0\n0", expected_output: "[0, 0]", explanation: "Both arrays contain a single element 0." },
          { input: "4 5 6\n", expected_output: "[4, 5, 6]", explanation: "Second array is empty." }
        ],
        description: "Merge two sorted arrays into a single sorted array.",
        examples: [
          {
            input: "nums1 = [1,2,3], nums2 = [2,5,6]",
            output: "[1,2,2,3,5,6]"
          }
        ],
        constraints: [
          "0 <= nums1.length, nums2.length <= 10^4",
          "-10^9 <= nums1[i], nums2[i] <= 10^9"
        ],
        starterCode: {
          javascript: `function mergeArrays() {
        const fs = require('fs');
        const lines = fs.readFileSync('/dev/stdin', 'utf-8').trim().split('\\n');
        const nums1 = lines[0].split(' ').map(Number);
        const nums2 = lines[1].split(' ').map(Number);
      
        // Your solution here
      
        console.log(JSON.stringify(result));
      }
      mergeArrays();`,
          python: `def mergeArrays():
        import sys
        lines = sys.stdin.read().splitlines()
        nums1 = list(map(int, lines[0].split()))
        nums2 = list(map(int, lines[1].split()))
      
        # Your solution here
      
        import json
        print(json.dumps(result))
      
      mergeArrays()`,
          java: `// Similar structure as previous starterCode`,
          cpp: `// Similar structure as previous starterCode`
        }
      },
      {
        id: 4,
        title: "Palindrome Number",
        difficulty: "Easy",
        prompt: "Given an integer x, return true if x is a palindrome, and false otherwise.",
        input_format: "Single integer x.",
        output_format: "Return 'true' if x is a palindrome, 'false' otherwise.",
        sample_input: "121",
        sample_output: "true",
        test_cases: [
          { input: "121", expected_output: "true", explanation: "121 reversed is still 121." },
          { input: "-121", expected_output: "false", explanation: "Negative numbers are not palindromes." },
          { input: "10", expected_output: "false", explanation: "10 reversed is 01." }
        ],
        description: "Check whether a number is a palindrome.",
        examples: [
          { input: "x = 121", output: "true" },
          { input: "x = -121", output: "false" }
        ],
        constraints: ["-2^31 <= x <= 2^31 - 1"],
        starterCode: {
          javascript: `function isPalindrome() {
        const x = parseInt(require('fs').readFileSync('/dev/stdin').toString().trim());
      
        // Your solution here
      
        console.log(result ? 'true' : 'false');
      }
      isPalindrome();`,
          python: `def isPalindrome():
        import sys
        x = int(sys.stdin.read())
      
        # Your solution here
      
        print('true' if result else 'false')
      isPalindrome()`
        }
      },
      {
        id: 5,
        title: "FizzBuzz",
        difficulty: "Easy",
        prompt: "Given an integer n, return a string array answer (1-indexed) where:\n- answer[i] == \"FizzBuzz\" if i is divisible by 3 and 5.\n- answer[i] == \"Fizz\" if i is divisible by 3.\n- answer[i] == \"Buzz\" if i is divisible by 5.\n- answer[i] == i (as a string) otherwise.",
        input_format: "Single integer n.",
        output_format: "JSON array of strings.",
        sample_input: "5",
        sample_output: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]",
        test_cases: [
          { input: "5", expected_output: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]", explanation: "Correct FizzBuzz sequence" },
          { input: "15", expected_output: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]", explanation: "FizzBuzz at 15" }
        ],
        description: "Return FizzBuzz sequence up to n.",
        examples: [{ input: "n = 5", output: "[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]" }],
        constraints: ["1 <= n <= 10^4"],
        starterCode: {
          javascript: `function fizzBuzz() {
        const n = parseInt(require('fs').readFileSync('/dev/stdin').toString().trim());
      
        // Your solution here
      
        console.log(JSON.stringify(result));
      }
      fizzBuzz();`,
          python: `def fizzBuzz():
        import sys
        n = int(sys.stdin.read())
      
        # Your solution here
      
        import json
        print(json.dumps(result))
      fizzBuzz()`
        }
      },
      {
        id: 6,
        title: "Reverse String",
        difficulty: "Easy",
        prompt: "Write a function that reverses a string. The input string is given as a single line.",
        input_format: "Single string s",
        output_format: "Reversed string",
        sample_input: "hello",
        sample_output: "olleh",
        test_cases: [
          { input: "hello", expected_output: "olleh", explanation: "Reversed form" },
          { input: "racecar", expected_output: "racecar", explanation: "Palindrome" },
          { input: " ", expected_output: " ", explanation: "Single space" }
        ],
        description: "Reverse the input string and return it.",
        examples: [{ input: "s = 'hello'", output: "olleh" }],
        constraints: ["1 <= s.length <= 10^4"],
        starterCode: {
          javascript: `function reverseString() {
        const s = require('fs').readFileSync('/dev/stdin').toString().trim();
      
        // Your solution here
      
        console.log(result);
      }
      reverseString();`,
          python: `def reverseString():
        import sys
        s = sys.stdin.read().strip()
      
        # Your solution here
      
        print(result)
      reverseString()`
        }
      },
      {
        id: 7,
        title: "Count Vowels",
        difficulty: "Easy",
        prompt: "Given a string s, count the number of vowels (a, e, i, o, u) in it. The input string can include lowercase and uppercase letters.",
        input_format: "Single line containing the string s",
        output_format: "Integer count of vowels",
        sample_input: "Hello World",
        sample_output: "3",
        test_cases: [
          { input: "Hello World", expected_output: "3", explanation: "e, o, o are vowels" },
          { input: "bcdfg", expected_output: "0", explanation: "No vowels present" },
          { input: "AEIOU", expected_output: "5", explanation: "All uppercase vowels" }
        ],
        description: "Count how many vowels are present in a string.",
        examples: [{ input: "s = 'Hello'", output: "2" }],
        constraints: ["1 <= s.length <= 10^4"],
        starterCode: {
          javascript: `function countVowels() {
        const s = require('fs').readFileSync('/dev/stdin').toString().trim();
      
        // Your solution here
      
        console.log(result);
      }
      countVowels();`,
          python: `def countVowels():
        import sys
        s = sys.stdin.read().strip()
      
        # Your solution here
      
        print(result)
      countVowels()`
        }
      }
      
  ];