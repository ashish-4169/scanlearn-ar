import { useState } from 'react';
import Home from './components/Home.jsx';
import ScanCamera from './components/ScanCamera.jsx';
import LevelSelectionModal from './components/LevelSelectionModal.jsx';
import ARViewer from './components/ARViewer.jsx';
import AITutorChat from './components/AITutorChat.jsx';
import QuizResults from './components/QuizResults.jsx';
import Dashboard from './components/Dashboard.jsx';

// Screen registry for the prototype navigation bar
const SCREENS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'scan', label: 'Scan', icon: 'document_scanner' },
  { id: 'ar-viewer', label: 'AR View', icon: 'view_in_ar' },
  { id: 'ar-viewer-enhanced', label: 'AR+', icon: 'auto_awesome' },
  { id: 'ai-tutor', label: 'AI Tutor', icon: 'smart_toy' },
  { id: 'ai-tutor-enhanced', label: 'AI+', icon: 'psychology' },
  { id: 'quiz-results', label: 'Results', icon: 'assignment_turned_in' },
  { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [aiTutorQuery, setAiTutorQuery] = useState('');
  const [showNavBar, setShowNavBar] = useState(true);

  // Central navigation handler used by all screens
  const navigate = (screenId, options = {}) => {
    if (screenId === 'ar-viewer' || screenId === 'ar-viewer-enhanced') {
      setCurrentScreen(screenId);
    } else {
      setCurrentScreen(screenId);
    }
  };

  // When user clicks "Start Scanning" from Home
  const handleStartScanning = () => {
    setCurrentScreen('scan');
  };

  // When user presses the camera shutter
  const handleScanShutter = () => {
    setShowLevelModal(true);
  };

  // When a learning level is selected in the modal
  const handleLevelSelected = (level) => {
    setShowLevelModal(false);
    setCurrentScreen('ar-viewer');
  };

  // When user clicks "Ask AI Tutor" from any AR screen
  const handleAskAI = (query = '') => {
    setAiTutorQuery(query);
    setCurrentScreen('ai-tutor-enhanced');
  };

  // When user triggers quiz generation
  const handleGenerateQuiz = () => {
    setCurrentScreen('quiz-results');
  };

  // Render the appropriate screen
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <Home onStartScanning={handleStartScanning} onNavigate={navigate} />;

      case 'scan':
        return (
          <>
            <ScanCamera onScanShutterClick={handleScanShutter} onNavigate={navigate} />
            {showLevelModal && (
              <LevelSelectionModal
                onSelectLevel={handleLevelSelected}
                onClose={() => setShowLevelModal(false)}
              />
            )}
          </>
        );

      case 'ar-viewer':
        return (
          <ARViewer
            isEnhanced={false}
            onNavigate={navigate}
            onAskAI={handleAskAI}
            onGenerateQuiz={handleGenerateQuiz}
          />
        );

      case 'ar-viewer-enhanced':
        return (
          <ARViewer
            isEnhanced={true}
            onNavigate={navigate}
            onAskAI={handleAskAI}
            onGenerateQuiz={handleGenerateQuiz}
          />
        );

      case 'ai-tutor':
        return (
          <AITutorChat
            isEnhanced={false}
            defaultQuery={aiTutorQuery}
            onNavigate={navigate}
            onTakeQuiz={handleGenerateQuiz}
          />
        );

      case 'ai-tutor-enhanced':
        return (
          <AITutorChat
            isEnhanced={true}
            defaultQuery={aiTutorQuery}
            onNavigate={navigate}
            onTakeQuiz={handleGenerateQuiz}
          />
        );

      case 'quiz-results':
        return <QuizResults onNavigate={navigate} />;

      case 'dashboard':
        return <Dashboard onNavigate={navigate} />;

      default:
        return <Home onStartScanning={handleStartScanning} onNavigate={navigate} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Active screen */}
      {renderScreen()}

      {/* Prototype Navigation Bar - floating at the bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[200] mb-4">
        <div className={`transition-all duration-300 ${showNavBar ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
          <div className="flex items-center gap-1 bg-inverse-surface/90 backdrop-blur-2xl rounded-2xl px-3 py-2 shadow-2xl shadow-black/30 border border-white/10">
            <span className="text-inverse-on-surface/60 text-[9px] font-bold uppercase tracking-widest mr-2 whitespace-nowrap hidden sm:block">Prototype</span>
            {SCREENS.map((screen) => {
              const isActive = currentScreen === screen.id;
              return (
                <button
                  key={screen.id}
                  onClick={() => {
                    if (screen.id === 'scan') {
                      setCurrentScreen('scan');
                      setShowLevelModal(false);
                    } else {
                      navigate(screen.id);
                    }
                  }}
                  title={screen.label}
                  className={`flex flex-col items-center justify-center rounded-xl px-2 py-1.5 gap-0.5 transition-all duration-200 min-w-[44px] ${
                    isActive
                      ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-md scale-105'
                      : 'text-inverse-on-surface/70 hover:bg-white/10 hover:text-inverse-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[16px] ${isActive ? 'fill-icon' : ''}`}>
                    {screen.icon}
                  </span>
                  <span className="text-[8px] font-bold leading-none">{screen.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setShowNavBar(!showNavBar)}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface/80 text-inverse-on-surface backdrop-blur-xl rounded-full px-3 py-0.5 text-[9px] font-bold uppercase tracking-widest border border-white/10 hover:bg-inverse-surface transition-all shadow-lg flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[10px]">
            {showNavBar ? 'keyboard_arrow_down' : 'keyboard_arrow_up'}
          </span>
          {showNavBar ? 'Hide' : 'Screens'}
        </button>
      </div>
    </div>
  );
}
