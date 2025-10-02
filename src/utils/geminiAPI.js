// Utility function for calling the Gemini API
// Use import.meta.env for Vite instead of process.env
const GEMINI_API_KEY = import.meta.env?.VITE_GOOGLE_API_KEY || undefined;

// Log environment variables for debugging
console.log('Environment variables available:', Object.keys(import.meta.env || {}));
console.log('VITE_GOOGLE_API_KEY value:', import.meta.env?.VITE_GOOGLE_API_KEY ? `${import.meta.env.VITE_GOOGLE_API_KEY.substring(0, 10)}...` : 'undefined');

// Check if API key is available
if (!GEMINI_API_KEY) {
  console.warn('Gemini API key not found in environment variables. AI features will use fallback responses.')
}

// Define model fallback chains
const FLASH_MODELS = [
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-1.5-flash'
];

const PRO_MODELS = [
  'gemini-2.0-flash-exp',
  'gemini-2.0-flash-exp-02-05',
  'gemini-1.5-pro'
];

// Function to get the best available model URL
function getModelUrl(modelList) {
  // For now, we'll use the first model in the list
  // In a more advanced implementation, we could test each model
  const model = modelList[0];
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}

// Use gemini-2.0-flash model for fast question generation
const GEMINI_FLASH_API_URL = getModelUrl(FLASH_MODELS);

// Use gemini-2.0-flash-exp model for deeper analysis and summaries (to avoid quota issues)
const GEMINI_PRO_API_URL = getModelUrl(PRO_MODELS);

// Function to parse retry delay from API response
function parseRetryDelay(errorResponse) {
  try {
    const errorObj = JSON.parse(errorResponse);
    if (errorObj.error && errorObj.error.details) {
      const retryInfo = errorObj.error.details.find(d => d['@type'] && d['@type'].includes('RetryInfo'));
      if (retryInfo && retryInfo.retryDelay) {
        // Convert "27s" to milliseconds
        const delayValue = parseFloat(retryInfo.retryDelay.replace('s', ''));
        return delayValue * 1000;
      }
    }
  } catch (e) {
    console.error('Error parsing retry delay:', e);
  }
  // Default to 2 seconds if we can't parse the delay
  return 2000;
}

// Function to safely extract and parse JSON from API response
function extractAndParseJSON(responseText) {
  try {
    // Remove markdown code block formatting
    let cleanText = responseText.replace(/```json\s*|```/g, '').trim();
    
    // Find the first opening brace and last closing brace
    const firstBrace = cleanText.indexOf('{');
    const lastBrace = cleanText.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanText = cleanText.substring(firstBrace, lastBrace + 1);
    }
    
    // Parse the JSON
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Error parsing JSON:', error);
    console.error('Raw response text:', responseText);
    throw new Error(`Failed to parse JSON: ${error.message}`);
  }
}

export const callGeminiAPI = async (prompt, useProModel = false, maxRetries = 3) => {
  // If no API key, return a mock response
  if (!GEMINI_API_KEY) {
    // Return a mock response for development/testing
    return "This is a mock AI response. Please set VITE_GOOGLE_API_KEY in your .env file to enable real AI functionality."
  }

  // Select the appropriate model list
  const modelList = useProModel ? PRO_MODELS : FLASH_MODELS;
  let currentModelIndex = 0;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Calling Gemini API (attempt ${attempt}/${maxRetries}) with key:`, GEMINI_API_KEY ? `${GEMINI_API_KEY.substring(0, 5)}...` : 'undefined');
      
      // Use the appropriate model based on the current model index
      const modelName = modelList[currentModelIndex];
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`;
      
      console.log(`Using model: ${modelName}`);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      })

      console.log('API Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        
        // If it's a 404 error (model not found), try the next model in the list
        if (response.status === 404 && currentModelIndex < modelList.length - 1) {
          console.log(`Model ${modelName} not found, trying next model in fallback chain...`);
          currentModelIndex++;
          continue;
        }
        
        // If it's a 429 (rate limit) or 503 error, parse retry delay and wait
        if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
          const retryDelay = parseRetryDelay(errorText);
          console.log(`Received rate limit or service unavailable error, waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          continue;
        }
        
        throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
      }

      const data = await response.json()
      console.log('API Response data:', JSON.stringify(data, null, 2));
      return data.candidates[0].content.parts[0].text
    } catch (error) {
      console.error(`Error calling Gemini API (attempt ${attempt}/${maxRetries}):`, error);
      
      // If this was the last attempt, throw the error
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const waitTime = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${waitTime}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
}

// Generate MCQ interview questions using Gemini based on candidate's resume
export const generateMCQInterviewQuestions = async (candidateInfo) => {
  console.log('Checking for API key:', GEMINI_API_KEY ? 'Found' : 'Not found');
  
  // Check if we have cached questions for this candidate
  const cacheKey = `interview_questions_${candidateInfo?.name || 'unknown'}_${candidateInfo?.email || 'unknown'}`;
  const cachedQuestions = localStorage.getItem(cacheKey);
  if (cachedQuestions) {
    console.log('Using cached questions for candidate');
    try {
      return JSON.parse(cachedQuestions);
    } catch (e) {
      console.error('Error parsing cached questions:', e);
    }
  }
  
  // If no API key, return fallback questions
  if (!GEMINI_API_KEY) {
    console.warn('Using fallback MCQ questions due to missing API key')
    // More varied set of fallback questions
    const fallbackQuestions = [
      {
        id: 1,
        type: "mcq",
        question: "Which hook is used to manage state in React?",
        options: ["useEffect", "useContext", "useState", "useMemo"],
        answer: "C",
        explanation: "useState is the React hook used to manage state in functional components.",
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        id: 2,
        type: "mcq",
        question: "Which HTTP method is typically used to update a resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        answer: "C",
        explanation: "PUT is used to update an existing resource, while POST is used to create a new one.",
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        id: 3,
        type: "mcq",
        question: "What is the virtual DOM in React?",
        options: [
          "A lightweight version of the actual DOM",
          "A security feature in browsers",
          "A way to store data in React components",
          "A method for styling React components"
        ],
        answer: "A",
        explanation: "The virtual DOM is a lightweight copy of the actual DOM that React uses to optimize updates.",
        difficulty: 'easy',
        timeLimit: 20
      },
      {
        id: 4,
        type: "mcq",
        question: "Which HTTP status code indicates a successful request?",
        options: ["404", "500", "200", "301"],
        answer: "C",
        explanation: "HTTP status code 200 indicates a successful request.",
        difficulty: 'easy',
        timeLimit: 20
      }
    ];
    
    const mediumQuestions = [
      {
        id: 5,
        type: "mcq",
        question: "Which of the following best optimizes a Node.js app for concurrency?",
        options: [
          "Using synchronous file operations",
          "Implementing clustering with the cluster module",
          "Increasing the timeout values",
          "Reducing the number of dependencies"
        ],
        answer: "B",
        explanation: "The cluster module allows Node.js to create child processes that share the same server port, enabling better concurrency.",
        difficulty: 'medium',
        timeLimit: 60
      },
      {
        id: 6,
        type: "mcq",
        question: "Which database query is most efficient for fetching all users by age?",
        options: [
          "SELECT * FROM users ORDER BY age",
          "SELECT * FROM users WHERE age > 0",
          "CREATE INDEX ON users(age); SELECT * FROM users WHERE age > 0",
          "SELECT name, age FROM users GROUP BY age"
        ],
        answer: "C",
        explanation: "Creating an index on the age column and then querying with a WHERE clause is the most efficient approach.",
        difficulty: 'medium',
        timeLimit: 60
      },
      {
        id: 7,
        type: "mcq",
        question: "What is the purpose of React's useEffect hook?",
        options: [
          "To manage component state",
          "To handle side effects in functional components",
          "To create context providers",
          "To optimize component rendering"
        ],
        answer: "B",
        explanation: "useEffect is used to handle side effects like data fetching, subscriptions, or manually changing the DOM in functional components.",
        difficulty: 'medium',
        timeLimit: 60
      },
      {
        id: 8,
        type: "mcq",
        question: "Which caching strategy is most appropriate for frequently accessed, rarely changing data?",
        options: [
          "Cache-aside",
          "Write-through",
          "Write-behind",
          "Refresh-ahead"
        ],
        answer: "A",
        explanation: "Cache-aside is best for data that is frequently read but rarely updated, as it loads data into cache on miss.",
        difficulty: 'medium',
        timeLimit: 60
      }
    ];
    
    // More varied set of hard questions
    const hardQuestions = [
      {
        id: 9,
        type: "mcq-pseudocode",
        question: "Which pseudocode correctly reverses a linked list?",
        options: [
          "prev = null\nwhile (head != null)\n  next = head.next\n  head.next = prev\n  prev = head\n  head = next",
          "while (head != null)\n  head = head.next\n  head.next = prev",
          "for each node in list\n  swap(node, node.next)",
          "reverse(list)\n  return list.next"
        ],
        answer: "A",
        explanation: "The correct approach uses three pointers (prev, current, next) to reverse the direction of links in the list.",
        difficulty: 'hard',
        timeLimit: 120
      },
      {
        id: 10,
        type: "mcq-pseudocode",
        question: "Which pseudocode correctly checks for balanced parentheses?",
        options: [
          "stack = []\nfor char in string\n  if char in '({['\n    stack.push(char)\n  elif char in ')}]'\n    if stack.empty() or not matching(stack.pop(), char)\n      return false\nreturn stack.empty()",
          "count = 0\nfor char in string\n  if char == '('\n    count++\n  elif char == ')'\n    count--\nreturn count == 0",
          "return string == reverse(string)",
          "for i = 0 to length/2\n  if string[i] != string[length-i-1]\n    return false"
        ],
        answer: "A",
        explanation: "The stack-based approach correctly handles all types of brackets and ensures proper nesting.",
        difficulty: 'hard',
        timeLimit: 120
      },
      {
        id: 11,
        type: "mcq-pseudocode",
        question: "Which algorithm is most efficient for finding the shortest path in a weighted graph?",
        options: [
          "Depth-First Search",
          "Dijkstra's Algorithm",
          "Bubble Sort",
          "Binary Search"
        ],
        answer: "B",
        explanation: "Dijkstra's Algorithm is specifically designed for finding the shortest paths between nodes in a weighted graph.",
        difficulty: 'hard',
        timeLimit: 120
      },
      {
        id: 12,
        type: "mcq-pseudocode",
        question: "Which approach correctly implements a binary search tree insertion?",
        options: [
          "if root is null, create new node\nelse if value < root.value, insert left\nelse insert right",
          "insert at the end of the array",
          "sort the entire tree after each insertion",
          "always insert at the root"
        ],
        answer: "A",
        explanation: "Binary search tree insertion follows the property that smaller values go to the left and larger values to the right.",
        difficulty: 'hard',
        timeLimit: 120
      }
    ];
    
    // Select 2 easy, 2 medium, and 2 hard questions
    const selectedQuestions = [
      fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)],
      fallbackQuestions[Math.floor(Math.random() * fallbackQuestions.length)],
      mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)],
      mediumQuestions[Math.floor(Math.random() * mediumQuestions.length)],
      hardQuestions[Math.floor(Math.random() * hardQuestions.length)],
      hardQuestions[Math.floor(Math.random() * hardQuestions.length)]
    ];
    
    // Assign sequential IDs
    return selectedQuestions.map((q, index) => ({
      ...q,
      id: index + 1
    }));
  }

  // Improved prompt structure for question generation
  const questionPrompt = (difficulty) => `
You are an AI assistant generating interview questions for a Full Stack Developer (React + Node.js) role.
Difficulty: ${difficulty} (easy, medium, or hard)

Format the output as VALID JSON:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct option letter (A/B/C/D)",
  "explanation": "Brief explanation of why the answer is correct"
}

Guidelines:
- Make questions clear and concise.
- For hard difficulty, include pseudocode-style options.
- Ensure each question is unique and non-repetitive.
- Focus on practical, real-world scenarios.
- For easy questions: Test fundamental concepts
- For medium questions: Scenario-based problem solving
- For hard questions: Algorithmic thinking with pseudocode

Candidate Information:
Name: ${candidateInfo?.name || 'Candidate'}
Resume Content: ${candidateInfo?.text || 'No resume content provided'}
`;

  // Generate questions sequentially to reduce API quota usage
  try {
    console.log('Generating questions for candidate:', candidateInfo?.name || 'Unknown');
    
    const questions = [];
    
    // Generate 2 easy questions sequentially
    for (let i = 0; i < 2; i++) {
      const prompt = questionPrompt('easy');
      const response = await callGeminiAPI(prompt, false);
      
      try {
        // Extract and parse JSON from the response
        const question = extractAndParseJSON(response);
        
        questions.push({
          ...question,
          id: questions.length + 1,
          difficulty: 'easy',
          timeLimit: 20,
          type: 'mcq'
        });
      } catch (parseError) {
        console.error('Error parsing question JSON:', parseError);
        console.error('Raw response:', response);
        throw new Error(`Failed to parse question ${questions.length + 1}: ${parseError.message}`);
      }
      
      // Small delay between requests to avoid hitting rate limits
      if (i < 1) { // Don't wait after the last request
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Generate 2 medium questions sequentially
    for (let i = 0; i < 2; i++) {
      const prompt = questionPrompt('medium');
      const response = await callGeminiAPI(prompt, false);
      
      try {
        // Extract and parse JSON from the response
        const question = extractAndParseJSON(response);
        
        questions.push({
          ...question,
          id: questions.length + 1,
          difficulty: 'medium',
          timeLimit: 60,
          type: 'mcq'
        });
      } catch (parseError) {
        console.error('Error parsing question JSON:', parseError);
        console.error('Raw response:', response);
        throw new Error(`Failed to parse question ${questions.length + 1}: ${parseError.message}`);
      }
      
      // Small delay between requests to avoid hitting rate limits
      if (i < 1) { // Don't wait after the last request
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Generate 2 hard questions sequentially
    for (let i = 0; i < 2; i++) {
      const prompt = questionPrompt('hard');
      const response = await callGeminiAPI(prompt, false);
      
      try {
        // Extract and parse JSON from the response
        const question = extractAndParseJSON(response);
        
        questions.push({
          ...question,
          id: questions.length + 1,
          difficulty: 'hard',
          timeLimit: 120,
          type: 'mcq-pseudocode'
        });
      } catch (parseError) {
        console.error('Error parsing question JSON:', parseError);
        console.error('Raw response:', response);
        throw new Error(`Failed to parse question ${questions.length + 1}: ${parseError.message}`);
      }
      
      // Small delay between requests to avoid hitting rate limits
      if (i < 1) { // Don't wait after the last request
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Cache the questions
    localStorage.setItem(cacheKey, JSON.stringify(questions));
    
    // Process and validate each question
    return questions.map((question, index) => {
      // Validate required fields
      if (!question.question || !Array.isArray(question.options) || question.options.length !== 4) {
        throw new Error(`Invalid question format at index ${index}`);
      }
      
      // Create a copy of options and shuffle them
      const shuffledOptions = [...question.options];
      for (let i = shuffledOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
      }
      
      // Find the original correct answer (A, B, C, or D)
      const originalAnswer = question.answer;
      
      // Find the index of the correct answer in the original options
      let correctIndex = -1;
      for (let i = 0; i < question.options.length; i++) {
        if (String.fromCharCode(65 + i) === originalAnswer) {
          correctIndex = i;
          break;
        }
      }
      
      // Find where the correct answer moved after shuffling
      let newCorrectIndex = -1;
      for (let i = 0; i < shuffledOptions.length; i++) {
        if (shuffledOptions[i] === question.options[correctIndex]) {
          newCorrectIndex = i;
          break;
        }
      }
      
      // Update the answer to reflect the new position
      const newAnswer = String.fromCharCode(65 + newCorrectIndex);
      
      return {
        ...question,
        id: index + 1,
        options: shuffledOptions,
        answer: newAnswer
      }
    })
  } catch (error) {
    console.error('Error generating questions with Gemini:', error);
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    // Even if there's an error, we should still try to return something
    // But let's re-throw the error so the calling function can handle it properly
    throw new Error(`Failed to generate questions: ${error.message}`);
  }
}

// Score candidate's answer using Gemini
export const scoreCandidateAnswer = async (question, answer) => {
  console.log('Checking for API key for scoring:', GEMINI_API_KEY ? 'Found' : 'Not found');
  
  // Check if we have a cached score for this question and answer
  const cacheKey = `answer_score_${question.id}_${answer}`;
  const cachedScore = localStorage.getItem(cacheKey);
  if (cachedScore) {
    console.log('Using cached score for answer');
    try {
      return JSON.parse(cachedScore);
    } catch (e) {
      console.error('Error parsing cached score:', e);
    }
  }
  
  // If no API key, return a mock score
  if (!GEMINI_API_KEY) {
    console.warn('Using mock scoring due to missing API key')
    // More realistic scoring based on question difficulty
    const baseScore = Math.floor(Math.random() * 21) + 70; // Base score between 70-90
    const score = Math.min(100, Math.max(0, baseScore)); // Ensure score is between 0-100
    
    const feedbacks = [
      "Good understanding of the concept with clear explanation.",
      "Correct approach with minor details that could be improved.",
      "Solid answer demonstrating knowledge of the topic.",
      "Well-structured response with appropriate technical details.",
      "Accurate answer with good depth of explanation.",
      "Complete and correct response to the question.",
      "Strong technical answer with clear reasoning."
    ];
    
    const feedback = feedbacks[Math.floor(Math.random() * feedbacks.length)];
    
    const result = {
      score,
      feedback
    };
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  }

  // Improved prompt structure for answer scoring
  const scoringPrompt = `
You are an AI interviewer evaluating a candidate's answer.

Question: ${question.question}
Candidate Answer: ${answer}
Correct Answer: ${question.options[question.answer.charCodeAt(0) - 65]}
Difficulty Level: ${question.difficulty}

Score the answer from 0 to 100 based on:
1. Technical Accuracy (40%): Is the answer technically correct?
2. Completeness (30%): Does it cover all aspects of the question?
3. Clarity (20%): Is the explanation clear and well-structured?
4. Depth (10%): Does it show deep understanding of the concept?

Return VALID JSON like:
{
  "score": 75,
  "feedback": "Brief feedback for the candidate explaining what was good and what could be improved"
}

IMPORTANT:
- Provide specific, actionable feedback
- Consider the difficulty level when scoring
- Be objective and fair in your evaluation
- Do not include any markdown formatting or backticks
`;

  try {
    // Use the more powerful model for answer scoring
    const response = await callGeminiAPI(scoringPrompt, true)
    
    // Extract and parse JSON from the response
    const result = extractAndParseJSON(response);
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  } catch (error) {
    console.error('Error scoring answer with Gemini:', error)
    // Re-throw the error so the calling function can handle it properly
    throw error
  }
}

// Generate candidate summary using Gemini
export const generateMCQCandidateSummary = async (questions, answers) => {
  console.log('Checking for API key for summary:', GEMINI_API_KEY ? 'Found' : 'Not found');
  
  // Create a cache key based on the questions and answers
  const cacheKey = `candidate_summary_${JSON.stringify(questions.map(q => q.id)).substring(0, 100)}_${JSON.stringify(answers.map(a => a.questionId)).substring(0, 100)}`;
  const cachedSummary = localStorage.getItem(cacheKey);
  if (cachedSummary) {
    console.log('Using cached summary for candidate');
    try {
      return JSON.parse(cachedSummary);
    } catch (e) {
      console.error('Error parsing cached summary:', e);
    }
  }
  
  // If no API key, return a more realistic mock summary based on common patterns
  if (!GEMINI_API_KEY) {
    console.warn('Using mock summary due to missing API key')
    // Generate more varied and realistic summaries
    const summaries = [
      "Candidate demonstrated solid understanding of core concepts and showed good problem-solving skills. Performance was consistent across all question types.",
      "Candidate exhibited strong technical knowledge with clear explanations. Showed ability to think through complex problems methodically.",
      "Candidate displayed adequate knowledge of fundamental concepts. Some areas showed room for improvement, particularly in advanced topics.",
      "Candidate showed excellent grasp of technical concepts and applied them effectively. Communication of ideas was clear and concise.",
      "Candidate demonstrated good foundational knowledge. Would benefit from additional practice in certain areas to strengthen overall performance."
    ];
    
    const strengths = [
      "Strong analytical thinking",
      "Clear communication skills",
      "Solid technical foundation",
      "Good problem-solving approach",
      "Methodical thinking process"
    ];
    
    const improvements = [
      "Further practice with advanced concepts",
      "More experience with real-world applications",
      "Deeper understanding of edge cases",
      "Improved time management",
      "Enhanced technical communication"
    ];
    
    const recommendations = [
      "Well-suited for technical roles",
      "Recommended for intermediate positions",
      "Consider additional training",
      "Good fit for entry-level positions",
      "Strong potential with continued development"
    ];
    
    // Randomly select from the arrays
    const randomSummary = summaries[Math.floor(Math.random() * summaries.length)];
    const randomStrength = strengths[Math.floor(Math.random() * strengths.length)];
    const randomImprovement = improvements[Math.floor(Math.random() * improvements.length)];
    const randomRecommendation = recommendations[Math.floor(Math.random() * recommendations.length)];
    
    const result = {
      score: Math.floor(Math.random() * 31) + 70, // Random score between 70-100 for more realistic scores
      summary: randomSummary,
      strengths: randomStrength,
      improvements: randomImprovement,
      recommendation: randomRecommendation
    };
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  }

  // Prepare data for summary generation
  const candidateData = questions.map((q, i) => {
    const answer = answers.find(a => a.questionId === q.id);
    return {
      question: q.question,
      candidateAnswer: answer?.selectedOption || 'No answer provided',
      score: answer?.score || 0,
      feedback: answer?.feedback || 'No feedback provided',
      difficulty: q.difficulty
    };
  });

  // Improved prompt structure for final summary
  const summaryPrompt = `
You are an AI interviewer summarizing a candidate's performance.

Candidate Performance Data:
${JSON.stringify(candidateData, null, 2)}

Generate a professional 3–4 sentence summary, including:
1. Overall strengths
2. Areas to improve
3. General recommendation for hiring

Return VALID JSON like:
{
  "score": 85,
  "summary": "Candidate shows strong React skills but needs improvement in backend optimization...",
  "strengths": "List 2-3 key strengths",
  "improvements": "List 2-3 areas for improvement",
  "recommendation": "Hiring recommendation with role level"
}

IMPORTANT:
- Base the overall score on individual question scores
- Provide specific, actionable insights
- Tailor recommendation to candidate's performance level
- Do not include any markdown formatting or backticks
`;

  try {
    // Use the more powerful model for summary generation
    const response = await callGeminiAPI(summaryPrompt, true)
    
    // Extract and parse JSON from the response
    const result = extractAndParseJSON(response);
    
    // Cache the result
    localStorage.setItem(cacheKey, JSON.stringify(result));
    
    return result;
  } catch (error) {
    console.error('Error generating summary with Gemini:', error)
    // Re-throw the error so the calling function can handle it properly
    throw error
  }
}