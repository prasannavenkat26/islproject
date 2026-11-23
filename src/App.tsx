import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SettingsProvider } from '@/context/SettingsContext';
import { ToastProvider } from '@/context/ToastContext';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ToastContainer } from '@/components/ToastContainer';
import { HomePage } from '@/pages/HomePage';
import { TranslatorPage } from '@/pages/TranslatorPage';
import { SpeakToTextPage } from '@/pages/SpeakToTextPage';
import { DictionaryPage } from '@/pages/DictionaryPage';
import { LearnPage } from '@/pages/LearnPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { AboutPage } from '@/pages/AboutPage';

function App() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <BrowserRouter>
          <AnimatedBackground />
          <Navbar />
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/translator" element={<TranslatorPage />} />
                  <Route path="/speak" element={<SpeakToTextPage />} />
                  <Route path="/dictionary" element={<DictionaryPage />} />
                  <Route path="/learn" element={<LearnPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="*" element={<HomePage />} />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </div>
          <ToastContainer />
        </BrowserRouter>
      </ToastProvider>
    </SettingsProvider>
  );
}

export default App;
