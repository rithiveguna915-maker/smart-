import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Info, Sparkles } from 'lucide-react';
import { AssistantMessage, CropInfo, Language, MarketDatasetResponse, WeatherResponse } from '../types/farm';
import { AppStrings } from '../i18n/translations';

interface VoiceAssistantViewProps {
  language: Language;
  strings: AppStrings;
  crops: CropInfo[];
  selectedCropId: string | null;
  marketData: MarketDatasetResponse;
  latestWeather: WeatherResponse | null;
  profitSummary: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({
  language,
  strings,
  crops,
  selectedCropId,
  marketData,
  latestWeather,
  profitSummary,
}) => {
  const [messages, setMessages] = useState<AssistantMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: strings.voice.welcomeMessage,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [speakReplies, setSpeakReplies] = useState(true);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [micStatusError, setMicStatusError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    setSpeechSupported(Boolean(win.SpeechRecognition || win.webkitSpeechRecognition));
  }, []);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{ ...prev[0], text: strings.voice.welcomeMessage }];
      }
      return prev;
    });
  }, [strings.voice.welcomeMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const stopSpeechOutput = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speakText = (text: string) => {
    if (!speakReplies || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.96;
    window.speechSynthesis.speak(utterance);
  };

  const sendQuery = async (queryText: string) => {
    const cleaned = queryText.trim();
    if (!cleaned || isThinking) return;

    const userMsg: AssistantMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: cleaned,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    const activeCrop = selectedCropId ? crops.find((c) => c.id === selectedCropId) : null;
    const marketSummary = crops
      .slice(0, 7)
      .map((crop) => {
        const quotes = marketData.quotes.filter((q) => q.cropId === crop.id);
        if (quotes.length === 0) return `${crop.name.en}: ₹${crop.basePricePerKg}/kg`;
        const maxQ = quotes.reduce((a, b) => (b.modalPricePerKg > a.modalPricePerKg ? b : a));
        const minQ = quotes.reduce((a, b) => (b.modalPricePerKg < a.modalPricePerKg ? b : a));
        return `${crop.name.en}: ₹${minQ.modalPricePerKg} (${minQ.city}) to ₹${maxQ.modalPricePerKg}/kg (${maxQ.city})`;
      })
      .join(' | ');

    const weatherSummary = latestWeather
      ? `${latestWeather.locationName}: ${latestWeather.current.temperature}°C, Rain Prob ${latestWeather.current.rainProbability}%, Humidity ${latestWeather.current.humidity}%, Wind ${latestWeather.current.windSpeed} km/h`
      : 'No live weather loaded yet in this session.';

    try {
      const resp = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: cleaned,
          language,
          context: {
            dataSourceLabel: marketData.sourceLabel,
            selectedCropName: activeCrop?.name.en ?? '',
            marketSummary,
            weatherSummary,
            profitSummary,
          },
        }),
      });

      const data = await resp.json();
      if (!resp.ok) {
        setMessages((prev) => [
          ...prev,
          {
            id: `a-${Date.now()}`,
            role: 'assistant',
            text: data.message || 'Unable to process your question right now.',
            timestamp: new Date().toISOString(),
            isError: true,
          },
        ]);
      } else {
        const replyMsg: AssistantMessage = {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: data.reply,
          timestamp: data.timestamp || new Date().toISOString(),
        };
        setMessages((prev) => [...prev, replyMsg]);
        speakText(data.reply);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          text: 'Network error reaching the Smart Farmer AI assistant. Please try again.',
          timestamp: new Date().toISOString(),
          isError: true,
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRec = win.SpeechRecognition || win.webkitSpeechRecognition;
    if (!SpeechRec) {
      setMicStatusError(strings.voice.micUnsupported);
      return;
    }

    setMicStatusError(null);
    stopSpeechOutput();

    try {
      const recognition = new SpeechRec();
      recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results?.[0]?.[0]?.transcript ?? '';
        setIsListening(false);
        if (transcript.trim()) {
          sendQuery(transcript);
        }
      };

      recognition.onerror = (event) => {
        setIsListening(false);
        setMicStatusError(`Microphone / speech recognition error: ${event.error}`);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
    } catch {
      setIsListening(false);
      setMicStatusError(strings.voice.micUnsupported);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Voice Controls */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-[#111C16]">
              {strings.voice.title}
            </h1>
            <p className="mt-1 text-sm text-[#556B5F]">{strings.voice.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (speakReplies) stopSpeechOutput();
                setSpeakReplies((s) => !s);
              }}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                speakReplies
                  ? 'border-[#15803D] bg-[#F0FDF4] text-[#15803D]'
                  : 'border-[#DCE4DF] bg-white text-[#465B4F]'
              }`}
            >
              {speakReplies ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              <span>{strings.voice.speakToggle}</span>
            </button>

            <button
              type="button"
              onClick={toggleListening}
              disabled={!speechSupported || isThinking}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                isListening
                  ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                  : 'bg-[#15803D] text-white hover:bg-[#166534] disabled:opacity-50'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span>{isListening ? strings.voice.micStop : strings.voice.micStart}</span>
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2.5 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-4 py-2.5 text-xs text-[#31443A]">
          <Info className="h-4 w-4 shrink-0 text-[#15803D] mt-0.5" />
          <p>{strings.voice.honestyNote}</p>
        </div>

        {isListening && (
          <div className="rounded-lg border border-[#15803D]/40 bg-[#F0FDF4] px-4 py-2.5 text-sm font-semibold text-[#14532D]">
            {strings.voice.micListening}
          </div>
        )}

        {(!speechSupported || micStatusError) && (
          <div className="rounded-lg border border-[#D97706]/40 bg-[#FFFBEB] px-4 py-2.5 text-xs text-[#92400E]">
            {micStatusError || strings.voice.micUnsupported}
          </div>
        )}
      </section>

      {/* Conversation Window */}
      <section className="rounded-xl border border-[#DCE4DF] bg-white flex flex-col">
        <div className="p-5 space-y-4 max-h-[420px] overflow-y-auto">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-[#15803D] text-white'
                    : msg.isError
                    ? 'border border-[#DC2626]/30 bg-[#FEF2F2] text-[#991B1B]'
                    : 'border border-[#DCE4DF] bg-[#F7F9F8] text-[#111C16]'
                }`}
              >
                {msg.role === 'assistant' && !msg.isError && (
                  <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{strings.brandName}</span>
                  </div>
                )}
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex justify-start">
              <div className="rounded-xl border border-[#DCE4DF] bg-[#F7F9F8] px-4 py-3 text-sm text-[#556B5F]">
                {strings.common.loading}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Sample Prompt Shortcuts */}
        <div className="px-5 py-3 border-t border-[#E9EFEA] bg-[#FAFDFB]">
          <p className="text-xs font-semibold text-[#556B5F] mb-2">
            {strings.voice.sampleQuestionsTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {strings.voice.sampleQuestions.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => sendQuery(q)}
                disabled={isThinking}
                className="rounded-lg border border-[#DCE4DF] bg-white px-3 py-1.5 text-xs font-medium text-[#1D2D24] hover:border-[#15803D]/50 hover:bg-[#ECF5EF] text-left transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuery(inputText);
          }}
          className="p-4 border-t border-[#DCE4DF] flex items-center gap-3"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={strings.voice.inputPlaceholder}
            aria-label={strings.voice.inputPlaceholder}
            className="h-11 flex-1 rounded-lg border border-[#DCE4DF] bg-[#F7F9F8] px-4 text-sm text-[#111C16] placeholder-[#6B7F74] focus:border-[#15803D] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#15803D]/20"
          />
          <button
            type="submit"
            disabled={isThinking || !inputText.trim()}
            className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#15803D] px-5 text-sm font-semibold text-white hover:bg-[#166534] disabled:opacity-50 transition-colors whitespace-nowrap"
          >
            <Send className="h-4 w-4" />
            <span>{strings.voice.sendBtn}</span>
          </button>
        </form>
      </section>
    </div>
  );
};
