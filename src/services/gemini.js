import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: In a production app, this should be proxied via a backend.
// For this assignment, we are using the key directly on the client.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI = null;
let model = null;
let chatSession = null;

export const initializeGemini = (apiKey) => {
    if (!apiKey) {
        console.error("API Key is missing");
        return;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
};

const SYSTEM_PROMPT = `
You are an expert interviewer conducting a job interview. 
Your goal is to assess the candidate's suitability for the role of: {ROLE}.
You should:
1. Ask relevant, challenging, but fair questions.
2. Ask one question at a time.
3. Listen to the user's response and ask follow-up questions if the answer is vague or interesting.
4. Maintain a professional but encouraging tone.
5. If the user asks for feedback during the interview, politely say you will provide it at the end.
6. Keep your responses concise (under 50 words) to facilitate a natural voice conversation, unless you are explaining a complex concept.
7. You must ask exactly {LIMIT} questions in total.
8. Keep track of the question count.
9. After the user answers the {LIMIT}th question, thank them and say "Thank you for your time. The interview is now concluded."
10. Do not ask any more questions after the limit is reached.

Start by introducing yourself and asking the first question.
`;

export const startInterviewSession = async (role, limit = 5) => {
    if (!genAI) throw new Error("Gemini not initialized");

    const prompt = SYSTEM_PROMPT.replace("{ROLE}", role).replace(/{LIMIT}/g, limit);

    // Create a new model instance for this session with the specific system instruction
    model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: prompt
    });

    chatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: `I am ready for my interview for the ${role} position. Please start.` }],
            },
            {
                role: "model",
                parts: [{ text: `Hello! I'm your interviewer today. I'll be asking you a series of questions to assess your fit for the ${role} role. Let's get started. Tell me a little bit about yourself and why you're interested in this position.` }],
            },
        ],
        generationConfig: {
            maxOutputTokens: 150,
        },
    });

    return {
        text: `Hello! I'm your interviewer today. I'll be asking you a series of questions to assess your fit for the ${role} role. Let's get started. Tell me a little bit about yourself and why you're interested in this position.`,
        role: "model"
    };
};

export const sendMessage = async (message) => {
    if (!chatSession) throw new Error("Session not started");

    try {
        const result = await chatSession.sendMessage(message);
        const response = await result.response;
        return {
            text: response.text(),
            role: "model"
        };
    } catch (error) {
        console.error("Gemini Error:", error);
        return {
            text: `Error: ${error.message || "Unknown error"}`,
            role: "model",
            error: true
        };
    }
};

export const generateFeedback = async (history) => {
    if (!model) throw new Error("Gemini not initialized");

    const prompt = `
  Analyze the following interview transcript and provide detailed feedback.
  
  Return the response in strict JSON format with the following schema:
  {
    "overallScore": number (0-100),
    "summary": "string (brief summary of performance)",
    "skills": [
      { "name": "Communication", "score": number (0-100) },
      { "name": "Technical Knowledge", "score": number (0-100) },
      { "name": "Problem Solving", "score": number (0-100) },
      { "name": "Professionalism", "score": number (0-100) }
    ],
    "keyHighlights": ["string", "string", "string"],
    "detailedFeedback": [
      { "category": "Strengths", "points": ["string", "string"] },
      { "category": "Areas for Improvement", "points": ["string", "string"] }
    ]
  }

  Do not include any markdown formatting (like \`\`\`json). Just return the raw JSON string.
  
  Transcript:
  ${JSON.stringify(history)}
  `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
        // Clean up potential markdown code blocks if the model ignores instructions
        const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanText);
    } catch (e) {
        console.error("Failed to parse JSON feedback:", e);
        // Fallback structure if parsing fails
        return {
            overallScore: 0,
            summary: "Failed to generate structured feedback. Please try again.",
            skills: [],
            keyHighlights: [],
            detailedFeedback: []
        };
    }
};
