
export interface ChatMessage {
    role: 'user' | 'model' | 'system';
    text: string;
}

export interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
}
