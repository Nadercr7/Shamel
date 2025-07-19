
import React, { useState, useCallback, useContext } from 'react';
import { summarizeText } from '../services/geminiService';
import { TextToSpeechContext } from '../context/TextToSpeechContext';
import FeatureCard from './FeatureCard';
import { AccessibilityContext } from '../context/AccessibilityContext';
import { LanguageContext } from '../context/LanguageContext';
import { BookOpenIcon, LoaderIcon, SoundOnIcon, SoundOffIcon, UploadIcon } from '../assets/Icons';

declare const pdfjsLib: any;

const PdfSummarizer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [summary, setSummary] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const { speak, cancel, isSpeaking } = useContext(TextToSpeechContext);
    const { isHighContrast } = useContext(AccessibilityContext);
    const { language, t } = useContext(LanguageContext);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setSummary('');
            setError('');
        }
    };

    const extractTextFromPdf = async (pdfFile: File): Promise<string> => {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            fullText += textContent.items.map((item: any) => 'str' in item ? item.str : '').join(' ') + '\n';
        }
        return fullText;
    };

    const handleSummarize = useCallback(async () => {
        if (!file) {
            setError(t('uploadError'));
            return;
        }
        setIsLoading(true);
        setError('');
        setSummary('');
        try {
            const extractedText = await extractTextFromPdf(file);
            if (!extractedText.trim()) {
                throw new Error("Could not extract text from the PDF. It might be an image-based PDF.");
            }
            const summarizedResult = await summarizeText(extractedText, language);
            setSummary(summarizedResult);
        } catch (err: any) {
            setError(t('summarizeError', { message: err.message }));
        } finally {
            setIsLoading(false);
        }
    }, [file, language, t]);

    const handleToggleSpeech = () => {
        const langCode = language === 'ar' ? 'ar-SA' : 'en-US';
        if (isSpeaking) {
            cancel();
        } else if (summary) {
            speak(summary, langCode);
        }
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            if (e.dataTransfer.files[0].type === "application/pdf") {
                setFile(e.dataTransfer.files[0]);
                setSummary('');
                setError('');
            } else {
                setError("Please drop a PDF file.");
            }
        }
    };

    const buttonClass = isHighContrast
        ? 'px-4 py-2 rounded-md font-semibold border-2 border-high-contrast-primary text-high-contrast-primary hover:bg-high-contrast-primary hover:text-high-contrast-bg disabled:opacity-50 disabled:cursor-not-allowed'
        : 'px-4 py-2 rounded-md font-semibold bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400 disabled:cursor-not-allowed';

    return (
        <FeatureCard title={t('pdfSummarizerTitle')} icon={<BookOpenIcon className="w-8 h-8" />}>
            <div className="flex flex-col space-y-4 h-full">
                <div
                    onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                    onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={handleDrop}
                    className={`p-6 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
                        isDragging ? 'border-primary bg-primary/10 scale-105' : 
                        isHighContrast ? 'border-high-contrast-text' : 'border-base-300 hover:border-primary'
                    }`}
                >
                    <input type='file' accept=".pdf" className="hidden" id="pdf-upload" onChange={handleFileChange} />
                    <label htmlFor="pdf-upload" className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 cursor-pointer">
                        <UploadIcon className={`w-10 h-10 ${isHighContrast ? 'text-high-contrast-text' : 'text-primary'}`} />
                        <div>
                           <p className="font-semibold">{t('selectPdf')}</p>
                           <p className="text-sm">{file ? file.name : (language === 'ar' ? 'أو اسحبه وأفلته هنا' : 'or drag and drop here')}</p>
                        </div>
                    </label>
                </div>

                <button onClick={handleSummarize} disabled={!file || isLoading} className={`${buttonClass} w-full`}>
                    {isLoading ? t('summarizing') : t('summarize')}
                </button>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <div className="flex-grow mt-4 relative">
                    {isLoading && (
                        <div className="absolute inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center rounded-md z-10">
                            <LoaderIcon className="w-12 h-12 animate-spin text-primary" />
                        </div>
                    )}
                    <div className={`prose max-w-none w-full min-h-[16rem] h-full p-4 rounded-md overflow-y-auto transition-colors ${isHighContrast ? 'bg-high-contrast-bg border border-high-contrast-text' : 'bg-base-200 border border-base-300'}`}>
                        {summary ? <p className="whitespace-pre-wrap">{summary}</p> : <p className="text-gray-400 not-prose">{t('summaryPlaceholder')}</p>}
                    </div>
                </div>

                {summary && (
                    <button onClick={handleToggleSpeech} className={`${buttonClass} flex items-center justify-center gap-2 w-full`}>
                        {isSpeaking ? <SoundOffIcon className="w-5 h-5" /> : <SoundOnIcon className="w-5 h-5" />}
                        {isSpeaking ? t('stopReading') : t('readAloud')}
                    </button>
                )}
            </div>
        </FeatureCard>
    );
};

export default PdfSummarizer;
