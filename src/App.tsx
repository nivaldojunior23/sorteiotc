import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

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

    // Animation effect
    let count = 0;
    const duration = 1500; // ms
    const intervalTime = 60; 
    const totalFrames = duration / intervalTime;
    
    const interval = setInterval(() => {
      const randomTemp = Array.from({ length: amount }, () => Math.floor(Math.random() * range) + min);
      setDisplayedNumbers(randomTemp);
      count++;
      
      if (count >= totalFrames) {
        clearInterval(interval);
        finishDraw(finalNumbers);
      }
    }, intervalTime);
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
            
            <div className={`flex flex-wrap justify-center gap-4 md:gap-8 mb-12 transition-colors duration-300 ${isFlashed ? 'text-secondary dark:text-accent' : 'text-text-main'}`}>
               {results.map((num, idx) => (
                  <div key={idx} className={`flex items-center justify-center min-w-[100px] md:min-w-[160px] px-6 py-4 md:px-8 md:py-6 bg-bg-card border rounded-2xl md:rounded-3xl text-7xl md:text-9xl font-helvetica font-bold transition-all duration-300 ease-out ${isFlashed ? 'scale-110 border-accent/50 dark:border-accent shadow-[0_0_30px_rgba(70,254,145,0.3)] bg-accent/5 border-2' : 'scale-100 border-border-card shadow-lg'}`} style={{ fontVariantNumeric: 'tabular-nums' }}>
                    {num}
                  </div>
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
         <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-primary w-full max-w-5xl">
            {displayedNumbers.map((num, idx) => (
               <div key={idx} className="flex items-center justify-center min-w-[100px] md:min-w-[160px] px-6 py-4 md:px-8 md:py-6 bg-bg-card/40 border border-border-card/50 rounded-2xl md:rounded-3xl text-7xl md:text-9xl font-helvetica font-bold opacity-60 transition-all duration-75" style={{ fontVariantNumeric: 'tabular-nums' }}>
                 {num}
               </div>
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

        {/* Main Box - Uma única linha sem quebra */}
        <div className="glass-card mb-8">
          <div className="flex flex-nowrap items-center whitespace-nowrap overflow-x-auto scrollbar-hide w-full gap-2 md:gap-4 text-lg md:text-2xl font-medium tracking-tight text-text-main py-1">
            <span>Sortear</span>
            
            <input 
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-bg-input text-text-input focus:text-primary font-bold w-[60px] md:w-[80px] h-12 md:h-14 rounded-full text-center outline-none focus:ring-2 focus:ring-primary/50 transition-all no-spinners flex-shrink-0"
            />
            
            <span>número{amount > 1 ? 's' : ''} entre</span>
            
            <input 
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="bg-bg-input text-text-input focus:text-primary font-bold w-[60px] md:w-[80px] h-12 md:h-14 rounded-full text-center outline-none focus:ring-2 focus:ring-primary/50 transition-all no-spinners flex-shrink-0"
            />
            
            <span>e</span>
            
            <input 
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="bg-bg-input text-text-input focus:text-primary font-bold w-[70px] md:w-[90px] h-12 md:h-14 rounded-full text-center outline-none focus:ring-2 focus:ring-primary/50 transition-all no-spinners flex-shrink-0"
            />
          </div>
        </div>

        {/* Toggles - Estilizados com ident. visual ADCIN */}
        <div className="flex flex-col gap-5 md:gap-6 mb-10 px-2">
          
          {/* Animação */}
          <div className="flex items-center flex-wrap gap-4">
            <label className="flex items-center cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={countdown} 
                  onChange={() => setCountdown(!countdown)} 
                />
                <div className={`block w-12 h-6 rounded-full transition-colors border border-border-switch ${countdown ? 'bg-primary' : 'bg-bg-switch'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform shadow-md bg-bg-switch-handle ${countdown ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-4 text-base md:text-lg text-text-muted hover:text-text-main transition-colors">Animação contagem regressiva</span>
            </label>
          </div>

          {/* Não Repetir */}
          <div className="flex items-center gap-4">
            <label className="flex items-center cursor-pointer select-none">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={noRepeat} 
                  onChange={() => setNoRepeat(!noRepeat)} 
                />
                <div className={`block w-12 h-6 rounded-full transition-colors border border-border-switch ${noRepeat ? 'bg-primary' : 'bg-bg-switch'}`}></div>
                <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-transform shadow-md bg-bg-switch-handle ${noRepeat ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <span className="ml-4 text-base md:text-lg text-text-muted hover:text-text-main transition-colors">Não repetir número</span>
            </label>
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

        {/* Action Button Container ADCIN Style */}
        <div className="glass-card shadow-2xl mt-4 border-t-2 border-t-primary/30">
           <button 
             onClick={handleDraw} 
             disabled={isDrawing || min > max}
             className="w-full btn-primary text-xl py-5 rounded-xl disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed group relative overflow-hidden flex items-center justify-center font-bold"
           >
             <span className="relative z-10 flex items-center">
               Sortear 
               <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path></svg>
             </span>
           </button>
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
