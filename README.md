# Interview Practice Partner AI

An intelligent conversational AI agent designed to help users prepare for job interviews. Built for the Eightfold.ai AI Agent Building Assignment.

## Features

- **Role-Specific Interviews**: Conducts mock interviews tailored to specific roles (e.g., "Senior Software Engineer", "Product Manager").
- **Voice Interaction**: Speak naturally to the AI and hear its responses (uses Web Speech API).
- **Intelligent Follow-ups**: The AI listens to your answers and asks relevant follow-up questions.
- **Post-Interview Feedback**: Generates a detailed report on your communication skills, technical knowledge, and areas for improvement.
- **Real-time Transcript**: See what the AI hears to ensure accuracy.

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **AI Model**: Google Gemini 2.0 Flash (via `@google/generative-ai`)
- **Voice**: Web Speech API (SpeechRecognition & SpeechSynthesis)
- **Icons**: Lucide React

## Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd interview-partner
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   - Create a `.env` file in the root directory.
   - Add your Gemini API key:
     ```
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
   *(Note: For this submission, the key is included in the provided code for ease of testing, but in production, it should be secured.)*

4. **Run the application**:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   - Navigate to `http://localhost:5173` (or the URL shown in the terminal).

## Architecture & Design Decisions

### 1. Client-Side Architecture
- **Decision**: Built as a Single Page Application (SPA) using React.
- **Reasoning**: Ensures a responsive, app-like experience which is crucial for a conversational interface. It also simplifies the deployment and submission process for this assignment.

### 2. Direct API Integration
- **Decision**: The Gemini API is called directly from the client.
- **Reasoning**: While a backend proxy is better for security, a client-side implementation reduces latency for the chat interaction and simplifies the architecture for a standalone demo.

### 3. Web Speech API
- **Decision**: Used the browser's native Web Speech API for STT and TTS.
- **Reasoning**: 
    - **Low Latency**: No network round-trip for speech recognition.
    - **Cost**: Free to use.
    - **Simplicity**: No need for third-party voice API keys.
    - *Trade-off*: Voice quality depends on the user's browser/OS.

### 4. Context-Based State Management
- **Decision**: Used React Context (`InterviewContext`) for global state.
- **Reasoning**: The interview state (messages, status, recording state) needs to be accessed by multiple components (Session, Controls, Header). Context avoids prop drilling.

### 5. Prompt Engineering
- **Decision**: Used a "System Prompt" to enforce the "Interviewer" persona.
- **Reasoning**: Ensures the AI stays in character, asks one question at a time, and maintains a professional tone.

## Usage Guide

1. **Start**: Enter the job role you want to practice for (e.g., "Sales Associate").
2. **Interview**: 
   - The AI will introduce itself and ask the first question.
   - Click the **Microphone** button to speak your answer. Click it again to stop.
   - Or type your answer if you prefer.
3. **Feedback**: Click "End Session" to generate a comprehensive feedback report based on your performance.


