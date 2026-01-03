
import React, { useState } from 'react';
import { Rarity, MeatCard, GameState } from './types';
import { CARD_DATA, MAX_DRAWS, getRandomRarity } from './constants';
import MeatCardUI from './components/MeatCardUI';
import { generateFinalEvaluation } from './services/geminiService';
import { Sparkles, Trophy, Heart, Utensils, ArrowRight, RotateCcw, Weight, Eye } from 'lucide-react';
import hostImage from './assets/host.jpg';

const App: React.FC = () => {
  const [state, setState] = useState<GameState>({
    stage: 'INTRO',
    results: [],
    currentDrawIndex: -1,
    isAnimating: false
  });
  const [isRevealed, setIsRevealed] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [loadingEvaluation, setLoadingEvaluation] = useState(false);

  const hostImageUrl = hostImage;

  const startGacha = () => {
    setState(prev => ({ ...prev, stage: 'DRAWING', results: [], currentDrawIndex: -1 }));
    setIsRevealed(false);
  };

  const drawNext = () => {
    if (state.results.length >= MAX_DRAWS) return;
    
    const rarity = getRandomRarity();
    const newCard: MeatCard = {
      ...CARD_DATA[rarity],
      id: Math.random().toString(36).substr(2, 9)
    };

    setState(prev => ({
      ...prev,
      results: [...prev.results, newCard],
      currentDrawIndex: prev.results.length,
      isAnimating: true
    }));
    setIsRevealed(false);

    setTimeout(() => {
      setState(prev => ({ ...prev, isAnimating: false }));
    }, 600);
  };

  const drawAllRemaining = () => {
    if (state.results.length >= MAX_DRAWS) return;

    const remainingCount = MAX_DRAWS - state.results.length;
    const newCards: MeatCard[] = Array.from({ length: remainingCount }, () => {
      const rarity = getRandomRarity();
      return {
        ...CARD_DATA[rarity],
        id: Math.random().toString(36).substr(2, 9)
      };
    });

    setState(prev => ({
      ...prev,
      results: [...prev.results, ...newCards],
      currentDrawIndex: prev.results.length + newCards.length - 1,
      isAnimating: false
    }));
    setIsRevealed(true);
  };

  const handleReveal = () => {
    if (!isRevealed && !state.isAnimating) {
      setIsRevealed(true);
    }
  };

  const finishGame = async () => {
    setState(prev => ({ ...prev, stage: 'SUMMARY' }));
    setLoadingEvaluation(true);
    const evalText = await generateFinalEvaluation(state.results);
    setEvaluation(evalText);
    setLoadingEvaluation(false);
  };

  const resetGame = () => {
    setState({
      stage: 'INTRO',
      results: [],
      currentDrawIndex: -1,
      isAnimating: false
    });
    setEvaluation(null);
    setIsRevealed(false);
  };

  const currentCard = state.currentDrawIndex >= 0 ? state.results[state.currentDrawIndex] : null;
  const totalValue = state.results.reduce((sum, card) => sum + card.price, 0);

  return (
    <div className="min-h-[100dvh] md:min-h-screen bg-[#fdf6f0] text-[#4a3a3a] flex flex-col items-center justify-start p-3 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="w-full max-w-4xl flex items-center justify-between mb-3 md:mb-8">
        <div className="flex items-center gap-2">
          <Weight className="text-orange-400" />
          <h1 className="text-base md:text-xl font-bold text-orange-900 tracking-tight">揭曉妳的肉有多昂貴</h1>
        </div>
        <div className="bg-white/50 px-2 md:px-4 py-0.5 md:py-1 rounded-full text-[10px] md:text-sm font-medium border border-orange-100 flex items-center gap-1 md:gap-2">
          <Trophy size={12} className="text-yellow-500 md:w-4 md:h-4" />
          <span>2025 減重成就衡量</span>
        </div>
      </div>

      {/* Main Container */}
      <main className="w-full max-w-4xl flex-1 min-h-0 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-orange-50">
        
        {/* Sidebar / Host UI */}
        <div className="w-full md:w-1/3 bg-[#f8f9fa] p-4 md:p-8 flex flex-col items-center border-b md:border-b-0 md:border-r border-gray-100">
          <div className="w-24 h-24 md:w-40 md:h-40 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl mb-4 md:mb-6 relative border-4 border-white transform hover:scale-105 transition-transform">
             <img src={hostImageUrl} alt="Host" className="w-full h-full object-cover" />
             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <div className="text-white text-[10px] text-center font-medium tracking-widest uppercase">Special Host</div>
             </div>
          </div>
          
          <div className="text-center space-y-3 md:space-y-4">
            <h2 className="text-base md:text-lg font-bold text-gray-800 tracking-wider">成就見證官</h2>
            <div className="bg-white p-3 md:p-5 rounded-2xl text-xs md:text-sm leading-snug md:leading-relaxed shadow-sm relative border border-gray-100 italic text-gray-600">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100"></div>
              {state.stage === 'INTRO' && "「妳的自律，值得最昂貴的讚美。讓我陪妳一起見證這 15 公斤背後的價值。」"}
              {state.stage === 'DRAWING' && (
                !isRevealed ? "「準備好看看這一公斤轉化成的驚喜了嗎？點擊卡片揭曉吧。」" : (currentCard?.congrats)
              )}
              {state.stage === 'SUMMARY' && "「每一克汗水都有了重量。恭喜妳，這是屬於妳的 2025 巔峰時刻。」"}
            </div>
          </div>

          <div className="mt-4 pt-4 w-full hidden sm:block md:mt-auto md:pt-8">
             <div className="bg-gray-100/80 p-4 rounded-xl">
                <div className="text-[10px] text-gray-400 uppercase font-black mb-2 tracking-tighter">Achievement Progress</div>
                <div className="flex gap-1">
                  {Array.from({ length: MAX_DRAWS }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 flex-grow rounded-full transition-all duration-700 ${i < state.results.length ? (i === state.results.length - 1 && !isRevealed ? 'bg-orange-300 animate-pulse scale-y-125' : 'bg-orange-400') : 'bg-gray-200'}`}
                    />
                  ))}
                </div>
                <div className="text-right text-[10px] mt-1 text-gray-400 font-bold uppercase">
                  {state.results.length} / {MAX_DRAWS} KG Evaluated
                </div>
             </div>
          </div>
        </div>

        {/* Game Content */}
        <div className="flex-grow p-4 md:p-8 flex flex-col items-center justify-center min-h-[360px] md:min-h-[500px] relative bg-gradient-to-b from-white to-[#fffcf9]">
          {state.stage === 'INTRO' && (
            <div className="text-center animate-in fade-in zoom-in duration-700">
              <div className="mb-4 md:mb-6 inline-block p-4 md:p-5 bg-orange-50 rounded-full shadow-inner">
                <Sparkles className="text-orange-400 w-10 h-10 md:w-12 md:h-12 animate-pulse" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-800 mb-3 md:mb-4 tracking-tight uppercase">妳的肉有多昂貴<br/><span className="text-orange-500 font-bold text-lg md:text-xl tracking-widest">— 2025 減脂價值報告 —</span></h1>
              <p className="text-gray-400 mb-6 md:mb-8 max-w-xs mx-auto leading-loose text-xs md:text-sm">
                妳成功告別了 15 公斤脂肪。<br/>這不是體重的減少，而是品質的躍升。<br/>現在，讓我們衡量妳這份意志力的總價值。
              </p>
              <button 
                onClick={startGacha}
                className="group relative px-8 md:px-10 py-4 md:py-5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3 mx-auto tracking-widest text-xs md:text-sm uppercase"
              >
                Enter Evaluation
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {state.stage === 'DRAWING' && (
            <div className="w-full h-full flex flex-col items-center">
              <div className="flex-grow flex items-center justify-center w-full">
                {currentCard ? (
                  <div key={currentCard.id} className="animate-in zoom-in spin-in-2 duration-700 scale-90 sm:scale-100">
                    <MeatCardUI card={currentCard} revealed={isRevealed} onReveal={handleReveal} />
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="text-5xl md:text-7xl animate-bounce">🧧</div>
                    <div className="text-gray-400 font-bold tracking-widest uppercase text-xs">First Kilogram Discovery</div>
                    <div className="flex flex-col items-center gap-3">
                      <button 
                        onClick={drawNext}
                        className="px-8 md:px-12 py-4 md:py-5 bg-gray-900 text-white font-black rounded-2xl shadow-xl transition-all hover:bg-black hover:scale-105 text-sm"
                      >
                        揭曉第一公斤
                      </button>
                      <button
                        onClick={drawAllRemaining}
                        className="px-8 md:px-12 py-3 md:py-4 border-2 border-gray-200 text-gray-500 hover:text-black hover:border-black font-black rounded-2xl transition-all flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase"
                      >
                        一鍵全開
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-5 md:mt-8 flex flex-col items-center gap-4 h-16 md:h-20">
                {isRevealed && (
                  <div className="animate-in slide-in-from-bottom-4 duration-500 flex flex-col items-center gap-4">
                    {state.results.length < MAX_DRAWS ? (
                      <button 
                        onClick={drawNext}
                        disabled={state.isAnimating}
                        className="px-8 md:px-12 py-3 md:py-4 bg-gray-900 hover:bg-black disabled:bg-gray-300 text-white font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-xs md:text-sm tracking-widest uppercase"
                      >
                        <Sparkles size={16} />
                        Next Kilogram ({state.results.length}/{MAX_DRAWS})
                      </button>
                    ) : (
                      <button 
                        onClick={finishGame}
                        className="px-8 md:px-12 py-3 md:py-4 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2 text-xs md:text-sm tracking-widest uppercase"
                      >
                        Final Valuation
                        <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                )}
                {!isRevealed && currentCard && (
                   <div className="text-gray-400 flex items-center gap-2 animate-pulse text-xs font-bold tracking-widest uppercase">
                     <Eye size={14} /> Tap to Reveal Value
                   </div>
                )}
              </div>
            </div>
          )}

          {state.stage === 'SUMMARY' && (
            <div className="w-full h-full flex flex-col animate-in fade-in duration-1000">
               <div className="text-center mb-4 md:mb-6">
                 <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-2 tracking-tighter uppercase">Achievement Breakdown</h2>
                 <p className="text-gray-400 text-[10px] md:text-xs tracking-widest font-bold">15KG FAT REDUCTION · 2025 EDITION</p>
               </div>

               <div className="grid grid-cols-5 gap-1.5 md:gap-2 mb-4 md:mb-6">
                 {state.results.map((card, i) => (
                   <div key={card.id} className={`aspect-[3/4] rounded-xl ${card.bgColor} border border-gray-100 flex flex-col items-center justify-center overflow-hidden shadow-sm hover:scale-110 hover:z-10 transition-all cursor-default group`}>
                     <img src={card.imageUrl} className="w-full h-1/2 object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                     <div className="p-1.5 flex flex-col items-center bg-white/70 w-full flex-grow">
                        <span className={`text-[8px] font-black tracking-tighter ${card.color}`}>{card.rarity}</span>
                        <span className="text-[7px] text-gray-400 text-center truncate w-full px-0.5 leading-tight font-bold uppercase">{card.name.replace('級成就', '')}</span>
                        <span className="text-[9px] font-black mt-1 text-gray-800">$ {card.price.toLocaleString()}</span>
                     </div>
                   </div>
                 ))}
               </div>

               <div className="bg-[#fcfcfc] p-4 md:p-7 rounded-3xl border border-gray-100 mb-4 md:mb-8 shadow-inner">
                  <div className="flex items-center gap-2 text-gray-800 font-black mb-3 tracking-widest uppercase text-xs">
                    <Trophy size={16} className="text-orange-400" />
                    <span>Host Evaluation</span>
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 leading-relaxed italic font-medium">
                    {loadingEvaluation ? (
                      <div className="flex items-center gap-2">
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                         <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                         <span className="text-xs uppercase font-bold tracking-widest text-gray-400">Processing Success Data...</span>
                      </div>
                    ) : (
                      evaluation
                    )}
                  </div>
               </div>

               <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mt-auto">
                  <div className="text-center md:text-left">
                    <div className="text-[10px] text-gray-400 uppercase font-black tracking-[0.2em]">妳的肉有多昂貴</div>
                    <div className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">$ {totalValue.toLocaleString()} <span className="text-xs md:text-sm font-bold text-gray-300 ml-1 uppercase">TWD</span></div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button 
                      onClick={resetGame}
                      className="px-6 md:px-8 py-3 md:py-4 bg-gray-900 hover:bg-black text-white font-black rounded-2xl shadow-xl transition-all flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase"
                    >
                      <RotateCcw size={16} />
                      再玩一次
                    </button>
                    <button 
                      onClick={() => { window.location.href = '/retry.html'; }}
                      className="px-6 md:px-8 py-3 md:py-4 border-2 border-gray-200 text-gray-400 hover:text-black hover:border-black font-black rounded-2xl transition-all flex items-center gap-2 text-[10px] md:text-xs tracking-widest uppercase"
                    >
                      <RotateCcw size={16} />
                      最後一夜的再次評估
                    </button>
                  </div>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-4 md:mt-8 hidden md:block text-center text-gray-400 text-[10px] font-bold tracking-[0.3em] uppercase opacity-50">
        © 2025 減脂價值衡量器 · Your willpower is precious
      </footer>
    </div>
  );
};

export default App;
