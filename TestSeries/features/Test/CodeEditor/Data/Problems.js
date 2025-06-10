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
    }
  ];