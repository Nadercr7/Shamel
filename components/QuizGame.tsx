
import React, { useState, useMemo, useContext } from 'react';
import type { QuizQuestion } from '../types';
import FeatureCard from './FeatureCard';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { LanguageContext } from '../context/LanguageContext';
import { PuzzleIcon } from '../assets/Icons';

const quizDataEn: QuizQuestion[] = [
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars",
        explanation: "Mars is often called the 'Red Planet' because of its reddish appearance, which comes from iron oxide (rust) on its surface."
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Great White Shark"],
        correctAnswer: "Blue Whale",
        explanation: "The Blue Whale is the largest animal on Earth, weighing as much as 200 tons (approximately 33 elephants)."
    },
    {
        question: "In which year did the first person walk on the moon?",
        options: ["1965", "1969", "1972", "1958"],
        correctAnswer: "1969",
        explanation: "Neil Armstrong and Buzz Aldrin landed on the moon on July 20, 1969, during the Apollo 11 mission."
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["O2", "CO2", "H2O", "NaCl"],
        correctAnswer: "H2O",
        explanation: "Water is composed of two hydrogen (H) atoms and one oxygen (O) atom, hence its chemical formula H2O."
    }
];

const quizDataAr: QuizQuestion[] = [
    {
        question: "أي كوكب يُعرف بالكوكب الأحمر؟",
        options: ["الأرض", "المريخ", "المشتري", "زحل"],
        correctAnswer: "المريخ",
        explanation: "غالباً ما يُطلق على المريخ اسم 'الكوكب الأحمر' بسبب مظهره المحمر، الذي يأتي من أكسيد الحديد (الصدأ) على سطحه."
    },
    {
        question: "ما هو أكبر حيوان ثديي في العالم؟",
        options: ["الفيل", "الحوت الأزرق", "الزرافة", "القرش الأبيض الكبير"],
        correctAnswer: "الحوت الأزرق",
        explanation: "الحوت الأزرق هو أكبر حيوان على وجه الأرض، ويزن ما يصل إلى 200 طن (حوالي 33 فيلاً)."
    },
    {
        question: "في أي عام مشى أول شخص على سطح القمر؟",
        options: ["1965", "1969", "1972", "1958"],
        correctAnswer: "1969",
        explanation: "هبط نيل أرمسترونج وباز ألدرين على سطح القمر في 20 يوليو 1969، خلال مهمة أبولو 11."
    },
    {
        question: "ما هو الرمز الكيميائي للماء؟",
        options: ["O2", "CO2", "H2O", "NaCl"],
        correctAnswer: "H2O",
        explanation: "يتكون الماء من ذرتي هيدروجين (H) وذرة أكسجين واحدة (O)، ومن هنا جاءت صيغته الكيميائية H2O."
    }
];


const QuizGame: React.FC = () => {
    const { isHighContrast } = useContext(AccessibilityContext);
    const { language, t } = useContext(LanguageContext);
    
    const quizData = useMemo(() => language === 'ar' ? quizDataAr : quizDataEn, [language]);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [score, setScore] = useState(0);
    const [gameEnded, setGameEnded] = useState(false);
    
    const currentQuestion = useMemo(() => quizData[currentQuestionIndex], [currentQuestionIndex, quizData]);

    const handleAnswerSelect = (answer: string) => {
        if (showFeedback) return;
        setSelectedAnswer(answer);
        setShowFeedback(true);
        if (answer === currentQuestion.correctAnswer) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < quizData.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedAnswer(null);
            setShowFeedback(false);
        } else {
            setGameEnded(true);
        }
    };

    const handleRestart = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setScore(0);
        setGameEnded(false);
    };

    const getButtonClass = (option: string) => {
        if (!showFeedback) {
            return isHighContrast
                ? 'border-high-contrast-text hover:bg-high-contrast-text hover:text-high-contrast-bg'
                : 'border-base-300 bg-white hover:bg-primary hover:border-primary hover:text-white';
        }
        if (option === currentQuestion.correctAnswer) {
            return 'bg-green-500 text-white border-green-500 transform scale-105';
        }
        if (option === selectedAnswer) {
            return 'bg-red-500 text-white border-red-500';
        }
        return isHighContrast ? 'border-high-contrast-text opacity-50' : 'border-base-300 bg-white opacity-50';
    };

    const buttonClass = isHighContrast
        ? 'px-6 py-3 rounded-lg font-semibold border-2 border-high-contrast-primary text-high-contrast-primary hover:bg-high-contrast-primary hover:text-high-contrast-bg disabled:opacity-50'
        : 'px-6 py-3 rounded-lg font-semibold bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400 transition-transform transform hover:scale-105';

    if (gameEnded) {
        return (
            <FeatureCard title={t('quizTitle')} icon={<PuzzleIcon className="w-8 h-8" />}>
                <div className="text-center flex flex-col items-center justify-center h-full p-8">
                    <h3 className="text-3xl font-bold text-primary mb-2">{t('quizComplete')}</h3>
                    <p className="text-lg mb-4">{t('finalScore', { score: '', total: ''})}</p>
                    <p className={`font-black my-4 ${isHighContrast ? 'text-high-contrast-primary' : 'text-primary-dark'}`} style={{ fontSize: '5rem', lineHeight: '1' }}>
                        {score} <span className="text-4xl text-base-content">/ {quizData.length}</span>
                    </p>
                    <button onClick={handleRestart} className={buttonClass}>
                        {t('playAgain')}
                    </button>
                </div>
            </FeatureCard>
        );
    }

    return (
        <FeatureCard title={t('quizTitle')} icon={<PuzzleIcon className="w-8 h-8" />}>
            <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-2">
                      <p className="text-sm font-semibold">{t('questionOf', { current: currentQuestionIndex + 1, total: quizData.length })}</p>
                      <p className="text-sm font-semibold">{t('score', { score })}</p>
                  </div>
                  <div className={`w-full rounded-full h-2.5 ${isHighContrast ? 'bg-high-contrast-text/30' : 'bg-base-200'}`}>
                    <div className="bg-secondary h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${((currentQuestionIndex) / quizData.length) * 100}%` }}></div>
                  </div>
                </div>
                <h3 className="text-xl font-semibold my-6 flex-grow">{currentQuestion.question}</h3>
                <div className="space-y-3">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleAnswerSelect(option)}
                            disabled={showFeedback}
                            className={`w-full p-4 text-start rounded-lg border-2 transition-all duration-200 text-base font-medium ${getButtonClass(option)}`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
                {showFeedback && (
                    <div className={`mt-4 p-4 rounded-lg animate-fade-in-up ${isHighContrast ? 'bg-high-contrast-bg border border-high-contrast-text' : 'bg-base-200'}`}>
                        <p className="font-bold text-lg">{selectedAnswer === currentQuestion.correctAnswer ? t('correct') : t('incorrect')}</p>
                        <p className="mt-2">{currentQuestion.explanation}</p>
                    </div>
                )}
                {showFeedback && (
                     <button onClick={handleNext} className={`mt-6 w-full ${buttonClass}`}>
                        {currentQuestionIndex < quizData.length - 1 ? t('nextQuestion') : t('finishQuiz')}
                    </button>
                )}
            </div>
        </FeatureCard>
    );
};

export default QuizGame;
