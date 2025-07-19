
# Inclusive AI Learning Hub

Welcome to the Inclusive AI Learning Hub, an intelligent and accessible web application designed to provide equal educational opportunities for all students. The platform focuses on interactivity, personalization, and engagement, with robust support for visual, auditory, and cognitive accessibility needs.

This application is built with a modern frontend stack and leverages powerful AI services to create a rich learning environment.

## ✨ Features

*   **Multi-Page Interface**: A clean, navigable interface with dedicated pages for each major feature.
*   **PDF Summarizer**: Upload a PDF, and the app will extract its text and provide a concise summary using the Gemini API.
*   **Text-to-Speech**: High-quality, natural-sounding audio playback for summaries and chat messages using the **ElevenLabs API**.
*   **AI Chatbot Assistant**: A friendly AI chatbot powered by **Google Gemini** that can answer questions, provide recommendations, and hold a conversation.
*   **Interactive Quiz Game**: A fun, gamified quiz to test knowledge on various subjects, with scoring and instant feedback.
*   **Full Bilingual Support (English & Arabic)**:
    *   Seamless language switching.
    *   Right-to-Left (RTL) layout support for Arabic.
    *   Localized content and AI responses.
*   **Advanced Accessibility**:
    *   **High Contrast Mode**: For users with visual impairments.
    *   **Adjustable Font Size**: To improve readability.
    *   **Speech-to-Text**: Voice input for interacting with the chatbot.
    *   Keyboard navigation and ARIA attributes for screen reader compatibility.

## 🛠️ Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **AI & Cloud Services**:
    *   **Google Gemini API**: For text summarization and chatbot intelligence.
    *   **ElevenLabs API**: For high-quality text-to-speech synthesis.
*   **Libraries**:
    *   **PDF.js**: For extracting text from PDF documents directly in the browser.

---

## 🚀 Running the Application Locally

Follow these steps to set up and run the project on your local machine.

### Prerequisites

*   A modern web browser (e.g., Chrome, Firefox, Edge).
*   [Node.js](https://nodejs.org/) and `npm` installed on your machine (used to run a simple local server).
*   A **Google Gemini API Key**. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
*   An **ElevenLabs API Key**. You can get one from the [ElevenLabs website](https://elevenlabs.io/). The free tier is sufficient to run this project.

### Step 1: Download the Project Files

Create a new folder for the project on your computer and save all the application files (`index.html`, `App.tsx`, `components/`, etc.) inside it, preserving the directory structure.

### Step 2: Configure API Keys

This is the most important step. The application needs API keys to communicate with Google and ElevenLabs. For local testing, you will insert your keys directly into the code.

#### **A. Google Gemini API Key**

You need to add your Gemini key in **two** files:

1.  **File 1: `services/geminiService.ts`**
    *   Open this file and find the line: `ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
    *   Replace `process.env.API_KEY` with your actual API key string.
    *   **Change it to look like this:**
        ```typescript
        ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY_HERE" });
        ```

2.  **File 2: `components/chatbot/ChatWindow.tsx`**
    *   Open this file and find the line: `const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });`
    *   Make the same replacement with your API key string.
    *   **Change it to look like this:**
         ```typescript
        const ai = new GoogleGenAI({ apiKey: "YOUR_GEMINI_API_KEY_HERE" });
        ```

#### **B. ElevenLabs API Key**

1.  **File: `hooks/useTextToSpeech.ts`**
    *   Open this file and find the line: `const ELEVENLABS_API_KEY = "sk_245e80971403c1e03b66fb839b7a56ac576920c60e5f2351";`
    *   The existing key may have expired or run out of quota. **Replace the key** with your own ElevenLabs API key.
    *   **Change it to look like this:**
        ```typescript
        const ELEVENLABS_API_KEY = "YOUR_ELEVENLABS_API_KEY_HERE";
        ```

### Step 3: Run a Local Web Server

Since the project uses ES modules (`import`/`export`), you cannot open `index.html` directly from your file system. You must serve it using a local web server.

1.  Open your terminal or command prompt.
2.  Navigate to the root directory of the project (the folder where you saved `index.html`).
3.  **Install `http-server`**, a simple server package, by running this command:
    ```bash
    npm install -g http-server
    ```
4.  **Start the server** by running:
    ```bash
    http-server .
    ```

5.  The terminal will display a message with one or more URLs, such as:
    ```
    Available on:
      http://127.0.0.1:8080
      http://192.168.1.100:8080
    Hit CTRL-C to stop the server
    ```

### Step 4: Open the Application

1.  Open your web browser.
2.  Navigate to one of the URLs provided by `http-server` (e.g., **`http://localhost:8080`**).
3.  The Inclusive AI Learning Hub should now be running!

Enjoy exploring the features!
