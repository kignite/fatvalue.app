
import React from 'react';
import { MeatCard, Rarity } from '../types';

interface MeatCardUIProps {
  card: MeatCard;
  revealed: boolean;
  onReveal?: () => void;
}

const MeatCardUI: React.FC<MeatCardUIProps> = ({ card, revealed, onReveal }) => {
  const getGlow = (rarity: Rarity) => {
    switch (rarity) {
      case Rarity.SSR: return 'shadow-[0_0_20px_rgba(234,179,8,0.6)] border-yellow-400';
      case Rarity.UR: return 'shadow-[0_0_15px_rgba(168,85,247,0.4)] border-purple-400';
      case Rarity.SR: return 'shadow-[0_0_10px_rgba(59,130,246,0.3)] border-blue-400';
      default: return 'border-emerald-200';
    }
  };

  return (
    <div 
      className={`relative w-48 h-64 perspective-1000 cursor-pointer transition-transform duration-500 hover:scale-105`}
      onClick={onReveal}
    >
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${revealed ? 'rotate-y-180' : ''}`}>
        {/* Back of Card */}
        <div className="absolute inset-0 backface-hidden bg-gradient-to-br from-rose-100 to-orange-100 border-4 border-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-xl">
          <div className="w-16 h-16 bg-white/50 rounded-full flex items-center justify-center mb-2">
            <span className="text-3xl text-orange-400 font-bold">1kg</span>
          </div>
          <div className="text-rose-500 font-bold tracking-widest text-lg">REWARD</div>
          <div className="text-rose-300 text-xs mt-1">TAP TO REVEAL</div>
        </div>

        {/* Front of Card */}
        <div className={`absolute inset-0 backface-hidden rotate-y-180 ${card.bgColor} border-4 rounded-2xl flex flex-col shadow-xl ${getGlow(card.rarity)} overflow-hidden`}>
          {/* Image Header */}
          <div className="h-24 w-full relative">
            <img 
              src={card.imageUrl} 
              alt={card.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 left-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold bg-white/90 ${card.color}`}>
                {card.rarity}
              </span>
            </div>
          </div>
          
          <div className="flex-grow flex flex-col justify-center px-4 py-2">
            <h3 className={`text-center font-bold text-sm mb-1 ${card.color}`}>
              {card.name}
            </h3>
            <p className="text-center text-[9px] text-gray-500 leading-tight">
              {card.description}
            </p>
          </div>

          <div className="pb-4 pt-2 border-t border-gray-200/50 flex flex-col items-center bg-white/30">
            <div className={`font-mono text-sm font-bold ${card.color}`}>
              $ {card.price.toLocaleString()} TWD
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-tighter">Achievement Reward</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeatCardUI;
