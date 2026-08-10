import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { RainbowButton } from './components/ui/RainbowButton';
import { NumberCard } from './components/ui/NumberCard';
import { ToggleSwitch } from './components/ui/ToggleSwitch';
const ThemeToggleButton = ({ theme, toggleTheme }: { theme: 'light' | 'dark', toggleTheme: () => void }) => (
  <button 
    onClick={toggleTheme}
    className="absolute top-4 right-4 md:top-8 md:right-8 p-3 rounded-full glass-card hover:scale-105 transition-transform flex items-center justify-center text-text-main"
    aria-label="Toggle Theme"
    title="Mudar Tema"
  >
    {theme === 'dark' ? (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
    ) : (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
    )}
  </button>
);

function App() {
  const [amount, setAmount] = useState<number>(1);
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [countdown, setCountdown] = useState<boolean>(true);
  const [noRepeat, setNoRepeat] = useState<boolean>(false);
  
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [results, setResults] = useState<number[] | null>(null);
  const [displayedNumbers, setDisplayedNumbers] = useState<number[]>([]);
  const [isFlashed, setIsFlashed] = useState<boolean>(false);
  const [showMoreActions, setShowMoreActions] = useState<boolean>(false);

  // Theme Management
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('sorteiotc_theme');
    if (savedTheme) return savedTheme as 'light' | 'dark';
    return 'dark'; // Padrão absoluto escuro
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sorteiotc_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Histórico local
  const [history, setHistory] = useState<number[][]>(() => {
    const saved = localStorage.getItem('sorteiotc_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const fireConfetti = () => {
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#2e69ff', '#009b92', '#46fe91', '#ffffff']
    });
  };

  const handleDraw = () => {
    if (min > max) {
      alert("O valor mínimo não pode ser maior que o máximo!");
      return;
    }
    const range = max - min + 1;
    if (noRepeat && amount > range) {
      alert(`Impossível sortear ${amount} números sem repetição num intervalo de ${range} números.`);
      return;
    }
    
    setIsDrawing(true);
    setIsFlashed(false);
    setResults(null);
    setDisplayedNumbers([]);
    
    // Generate final numbers
    const finalNumbers: number[] = [];
    if (noRepeat) {
      const candidates = Array.from({ length: range }, (_, i) => min + i);
      for (let i = 0; i < amount; i++) {
        const randomIndex = Math.floor(Math.random() * candidates.length);
        finalNumbers.push(candidates[randomIndex]);
        candidates.splice(randomIndex, 1);
      }
    } else {
      for (let i = 0; i < amount; i++) {
        finalNumbers.push(Math.floor(Math.random() * range) + min);
      }
    }

    const finishDraw = (nums: number[]) => {
      setDisplayedNumbers(nums);
      setResults(nums);
      setIsDrawing(false);
      setIsFlashed(true);
      fireConfetti();
      
      // Update history
      setHistory(prev => {
        const newHist = [nums, ...prev].slice(0, 5);
        localStorage.setItem('sorteiotc_history', JSON.stringify(newHist));
        return newHist;
      });

      setTimeout(() => setIsFlashed(false), 500);
    }

    if (!countdown) {
      finishDraw(finalNumbers);
      return;
    }

    // Casino spin animation effect
    const duration = 2500; // ms (longer spin for casino effect)
    
    // Pass final numbers to trigger the number cards (they will render in slot mode because isDrawing is true)
    setDisplayedNumbers(finalNumbers);
    
    setTimeout(() => {
      finishDraw(finalNumbers);
    }, duration);
  };

  const resetForm = () => {
    setResults(null);
    setIsFlashed(false);
  }

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('sorteiotc_history');
  }

  // Tela de Resultado
  if (results !== null && !isDrawing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
         <div className="w-full max-w-2xl flex flex-col items-center relative z-10">
            
            <img src="/adcinvetor.png" alt="Adcin Tema Local" className="w-24 md:w-32 mb-8 logo-theme transition-all duration-300" />
            
            <h2 className="text-xl font-helvetica font-bold text-primary mb-6 tracking-wide uppercase">Resultado do Sorteio</h2>
            
            <div className={`flex flex-wrap justify-center gap-4 md:gap-8 mb-12`}>
               {results.map((num, idx) => (
                  <NumberCard key={idx} number={num} isFlashed={isFlashed} />
               ))}
            </div>

            <button 
              onClick={resetForm}
              className="btn-primary"
            >
              Novo Sorteio
            </button>
         </div>
      </div>
    );
  }

  // Tela durante o Sorteio
  if (isDrawing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 w-full max-w-5xl">
            {displayedNumbers.map((num, idx) => (
               <NumberCard 
                 key={idx} 
                 number={num} 
                 isDrawing={true} 
                 className="shadow-[inset_0_0_40px_rgba(0,0,0,0.3)] dark:shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] border-border-card/50 opacity-90 scale-95" 
               />
            ))}
          </div>
      </div>
    )
  }

  // Tela Inicial - Configurações
  return (
    <div className="min-h-screen flex flex-col items-center py-10 p-4 md:p-8 relative">
      <ThemeToggleButton theme={theme} toggleTheme={toggleTheme} />
      <div className="w-full max-w-3xl flex-grow">
        
        {/* Header ADCIN */}
        <div className="flex items-center mb-8 gap-4 px-2">
          <img src="/adcinvetor.png" alt="ADCIN Templo Central" className="w-16 h-16 md:w-20 md:h-20 object-contain logo-theme transition-all duration-300" />
          <h1 className="text-2xl md:text-3xl font-helvetica font-bold">
            Sorteador de Números
          </h1>
        </div>

        {/* Main Box - Adapta para mobile para mostrar todos os campos */}
        <div className="glass-card mb-10 relative overflow-hidden group">
          {/* subtle background glow */}
          <div className="absolute -inset-x-20 -top-20 bottom-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10 opacity-40 dark:opacity-50 blur-3xl group-hover:opacity-80 dark:group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="relative flex flex-col md:flex-row flex-wrap items-center justify-center w-full gap-4 md:gap-6 text-lg md:text-2xl font-medium tracking-tight text-text-main py-2 text-center">
            
            <div className="flex items-center gap-3">
              <span className="text-text-muted">Sortear</span>
              <div className="relative">
                <input 
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-bg-input/60 backdrop-blur-sm border border-border-card text-text-input focus:text-primary font-bold w-[70px] md:w-[90px] h-14 md:h-16 rounded-2xl text-center outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all no-spinners shadow-inner"
                />
              </div>
              <span className="text-text-muted">número{amount > 1 ? 's' : ''}</span>
            </div>
            
            <div className="hidden md:block w-px h-10 bg-border-card mx-2"></div>
            
            <div className="flex items-center gap-3">
              <span className="text-text-muted">entre</span>
              <input 
                type="number"
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                className="bg-bg-input/60 backdrop-blur-sm border border-border-card text-text-input focus:text-primary font-bold w-[70px] md:w-[90px] h-14 md:h-16 rounded-2xl text-center outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all no-spinners shadow-inner"
              />
              <span className="text-text-muted font-bold px-1">e</span>
              <input 
                type="number"
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                className="bg-bg-input/60 backdrop-blur-sm border border-border-card text-text-input focus:text-primary font-bold w-[80px] md:w-[100px] h-14 md:h-16 rounded-2xl text-center outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all no-spinners shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Toggles - Estilizados com ident. visual ADCIN */}
        <div className="flex flex-col gap-5 md:gap-6 mb-10 px-2">
          
          {/* Animação */}
          <div className="flex items-center flex-wrap gap-4">
            <ToggleSwitch 
              checked={countdown}
              onChange={setCountdown}
              label="Animação contagem regressiva"
            />
          </div>

          {/* Não Repetir */}
          <div className="flex items-center gap-4">
            <ToggleSwitch 
              checked={noRepeat}
              onChange={setNoRepeat}
              label="Não repetir número"
            />
          </div>
          
          {/* Mais ações */}
          <button 
             onClick={() => setShowMoreActions(!showMoreActions)}
             className="text-primary font-bold text-left w-max flex items-center mt-2 hover:text-accent transition-colors"
          >
            <svg className={`w-4 h-4 mr-2 transition-transform duration-300 ${showMoreActions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            Mais ações
          </button>
          
          <div className={`transition-all duration-300 overflow-hidden ${showMoreActions ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
             <div className="text-sm text-text-muted pl-6 mt-2 font-inter max-w-lg mb-2">
               Mecanismo base de sorteio para cultos da ADCIN. <br/>
               Certifique-se de conectar a saída de vídeo apropriada no telão para obter o melhor contraste.
             </div>
          </div>

        </div>

         <div className="mt-10 flex justify-center w-full">
            <RainbowButton
              onClick={handleDraw} 
              disabled={isDrawing || min > max}
              className="w-full max-w-lg h-20 text-2xl uppercase tracking-widest shadow-2xl hover:shadow-[0_0_40px_rgba(70,254,145,0.4)]"
            >
                Sortear
                <svg className="w-8 h-8 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
            </RainbowButton>
         </div>

      </div>

      {/* Histórico */}
      {history.length > 0 && (
        <div className="w-full max-w-3xl mt-12 px-2 animate-fade-in mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-text-muted">Últimos Sorteios</h3>
            <button onClick={clearHistory} className="text-xs text-text-muted hover:text-red-500 uppercase font-semibold tracking-widest transition-colors">Limpar</button>
          </div>
          <div className="flex flex-col gap-3">
            {history.map((hGroup, index) => (
              <div key={index} className="glass-card flex items-center justify-between py-4 px-6 border-l-4 border-l-primary/60 transition-colors">
                <span className="text-text-muted text-sm font-semibold tracking-wider">#{history.length - index}</span>
                <div className="flex flex-wrap items-center justify-end gap-2">
                   {hGroup.map((val, hIdx) => (
                     <span key={hIdx} className="bg-primary/10 text-text-input font-bold py-1 px-3 rounded text-lg">
                       {val}
                     </span>
                   ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
